import { createItemDatabase } from "./item-db";
import { createMobDatabase } from "./mob-db";

export default async function createDatabases() {
  await createItemDatabase();
  await createMobDatabase();
}
