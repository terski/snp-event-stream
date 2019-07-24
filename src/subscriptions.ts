import Photon, { AggregateEvent, Subscription } from '@generated/photon';

const photon = new Photon();

declare type CreateEvent = {
    planId: string;
    startedAt: Date;
    expiresAt: Date;
};

export const create = async (eventData: CreateEvent): Promise<string> => {
    const aggregate = await photon.aggregates.create({
        data: {
            type: 'subscription',
        },
    });
    const event = await photon.aggregateEvents.create({
        data: {
            type: 'create',
            data: JSON.stringify(eventData),
            aggregate: { connect: { id: aggregate.id } },
        },
    });

    return aggregate.id;
};

declare type CancelEvent = {
    cancelledAt: Date;
};

export const cancel = async (aggregateId: string, eventData: CancelEvent): Promise<AggregateEvent> => {
    const event = await photon.aggregateEvents.create({
        data: {
            type: 'cancel',
            data: JSON.stringify(eventData),
            aggregate: { connect: { id: aggregateId } },
        },
    });

    return event;
};

declare type State = {
    createdAt?: Date;
    planId?: string;
    startedAt?: Date;
    cancelledAt?: Date;
    expiresAt?: Date;
};

const reducer = (
    state: State,
    event: AggregateEvent,
    index: number,
    events: AggregateEvent[]
): State => {
    switch (event.type) {
        case 'create':
        case 'cancel':
            return { ...state, ...JSON.parse(event.data) };

        default:
            throw new Error(`Unrecognized subscription event: ${event.type}`);
    }
};

export const snapshot = async (id: string): Promise<Subscription> => {
    // Get all of the events for the aggregate
    const aggregate = await photon.aggregates.findOne({
        where: { id },
        include: { events: true },
    });

    // Reduce a stream of events into the state of a subscription
    const sortedEvents = [...aggregate.events].sort((a, b) => (a.createdAt > b.createdAt) ? 1 : -1);
    const state = sortedEvents.reduce<State>(reducer, {});

    // Create a snapshot of the subscription based on the state
    const subscription = await photon.subscriptions.create({
        data: {
            aggregateId: id,
            planId: state.planId!,
            startedAt: state.startedAt!,
            cancelledAt: state.cancelledAt,
            expiresAt: state.expiresAt!,
        },
    });

    return subscription;
};
