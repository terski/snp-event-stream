import Photon from '@generated/photon';
import { cancel, create, snapshot } from './subscriptions';

const photon = new Photon();

const main = async function() {
    // Create a subscription
    const now = new Date();
    const expiration = new Date();
    expiration.setDate(expiration.getDate() + 30);

    const aggregateId = await create({
        planId: `monthly`,
        startedAt: now,
        expiresAt: expiration,
    });

    // Snapshot it
    const firstSnapshot = await snapshot(aggregateId);

    // Cancel the subscription
    const cancelDate = new Date();
    cancelDate.setDate(cancelDate.getDate() + 10);
    await cancel(aggregateId, { cancelledAt: cancelDate });

    // Snapshot it again
    const subscription = await snapshot(aggregateId);

    // Inspect the aggregates
    const allAggregates = await photon.aggregates.findMany({
        include: { events: true },
    });
    console.log(`*** Aggregates\n` + JSON.stringify(allAggregates, null, 2));

    // Inspect the latest snapshot
    const latest = await photon.subscriptions.findMany({
        where: { aggregateId },
        orderBy: { createdAt: 'desc' },
        first: 1
    });
    console.log(`*** Latest snapshot`);
    console.log(latest[0]);

    await photon.aggregateEvents.deleteMany({});
    await photon.aggregates.deleteMany({});
    await photon.subscriptions.deleteMany({});

    console.log('done');
};

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await photon.disconnect();
        process.exit();
    });
