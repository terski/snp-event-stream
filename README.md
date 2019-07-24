# SNP Event Stream Example

This example shows a simple POC for implementing subscriptions using event sourcing.

## Highlights
- [The data model](https://github.com/terski/snp-event-stream/blob/master/prisma/schema.prisma#L27-L50)
- [Create a subscription](https://github.com/terski/snp-event-stream/blob/master/src/subscriptions.ts#L11-L27)
- [Cancel a subscription](https://github.com/terski/snp-event-stream/blob/master/src/subscriptions.ts#L32-L42)
- [Save a snapshot for querying](https://github.com/terski/snp-event-stream/blob/master/src/subscriptions.ts#L68-L91)
- [A test script](https://github.com/terski/snp-event-stream/blob/master/src/script.ts)

### Test script output
```
*** Aggregates
[
  {
    "id": "cjyhpzwdr0000nirty2oabq4u",
    "createdAt": "2019-07-24T20:48:27.565Z",
    "type": "subscription",
    "events": [
      {
        "id": "cjyhpzwe00001nirtywhfuup3",
        "createdAt": "2019-07-24T20:48:27.576Z",
        "type": "create",
        "data": "{\"planId\":\"monthly\",\"startedAt\":\"2019-07-24T20:48:27.456Z\",\"expiresAt\":\"2019-08-23T20:48:27.456Z\"}"
      },
      {
        "id": "cjyhpzwei0003nirto8rbs1ik",
        "createdAt": "2019-07-24T20:48:27.594Z",
        "type": "cancel",
        "data": "{\"cancelledAt\":\"2019-08-03T20:48:27.591Z\"}"
      }
    ]
  }
]
*** Latest snapshot
{
  id: 'cjyhpzwer0004nirt9dblp5fo',
  createdAt: '2019-07-24T20:48:27.603Z',
  aggregateId: 'cjyhpzwdr0000nirty2oabq4u',
  startedAt: '2019-07-24T20:48:27.456Z',
  planId: 'monthly',
  cancelledAt: '2019-08-03T20:48:27.591Z',
  expiresAt: '2019-08-23T20:48:27.456Z'
}
```
