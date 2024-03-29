# Migration `20190720220551-drop-versions`

This migration has been generated by Matt Terski at 7/20/2019, 10:05:52 PM.
You can check out the [state of the datamodel](./datamodel.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "lift"."Subscription"("id" TEXT NOT NULL  ,"createdAt" DATE NOT NULL  ,"planId" TEXT NOT NULL DEFAULT '' ,"initialPayment" DATE NOT NULL DEFAULT '1970-01-01 00:00:00' ,"trialEnd" DATE NOT NULL DEFAULT '1970-01-01 00:00:00' ,"cancelled" DATE NOT NULL DEFAULT '1970-01-01 00:00:00' ,"expiration" DATE NOT NULL DEFAULT '1970-01-01 00:00:00' ,"aggregate" TEXT NOT NULL  REFERENCES Aggregate(id),PRIMARY KEY ("id"));

PRAGMA foreign_keys=OFF;

CREATE TABLE "lift"."new_Event"("id" TEXT NOT NULL  ,"createdAt" DATE NOT NULL  ,"type" TEXT NOT NULL DEFAULT '' ,"data" TEXT NOT NULL DEFAULT '' ,"aggregate" TEXT NOT NULL  REFERENCES Aggregate(id),PRIMARY KEY ("id"));

INSERT INTO "new_Event" ("id","createdAt","data","aggregate") SELECT "id","createdAt","data","aggregate" from "Event"

DROP TABLE "lift"."Event";

ALTER TABLE "lift"."new_Event" RENAME TO "Event";

PRAGMA "lift".foreign_key_check;

PRAGMA foreign_keys=ON;

PRAGMA foreign_keys=OFF;

CREATE TABLE "lift"."new_Aggregate"("id" TEXT NOT NULL  ,"createdAt" DATE NOT NULL  ,"type" TEXT NOT NULL DEFAULT '' ,PRIMARY KEY ("id"));

INSERT INTO "new_Aggregate" ("id","createdAt","type") SELECT "id","createdAt","type" from "Aggregate"

DROP TABLE "lift"."Aggregate";

ALTER TABLE "lift"."new_Aggregate" RENAME TO "Aggregate";

PRAGMA "lift".foreign_key_check;

PRAGMA foreign_keys=ON;

CREATE UNIQUE INDEX "lift"."Subscription.id._UNIQUE" ON "Subscription"("id")
```

## Changes

```diff
diff --git datamodel.mdl datamodel.mdl
migration 20190720151519-ondelete-round2..20190720220551-drop-versions
--- datamodel.dml
+++ datamodel.dml
@@ -26,16 +26,26 @@
 model Event {
   id        String   @default(cuid()) @id @unique
   createdAt DateTime @default(now())
-  version   Int
+  type      String
   data      String
   aggregate Aggregate
 }
 model Aggregate {
   id        String   @default(cuid()) @id @unique
   createdAt DateTime @default(now())
   type      String
-  version   Int
   events    Event[]  @relation(onDelete: CASCADE)
 }
+
+model Subscription {
+  id        String   @default(cuid()) @id @unique
+  createdAt DateTime @default(now())
+  aggregate Aggregate
+  planId    String
+  initialPayment  DateTime
+  trialEnd    DateTime
+  cancelled   DateTime
+  expiration  DateTime
+}
```

## Photon Usage

You can use a specific Photon built for this migration (20190720220551-drop-versions)
in your `before` or `after` migration script like this:

```ts
import Photon from '@generated/photon/20190720220551-drop-versions'

const photon = new Photon()

async function main() {
  const result = await photon.users()
  console.dir(result, { depth: null })
}

main()

```
