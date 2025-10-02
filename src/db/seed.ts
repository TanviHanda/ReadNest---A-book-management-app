import { localFont } from 'next/font/local';
import dummyBooks from "../../dummyBooks.json";
import { books } from "./schema";
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';


const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });
const seed = async () => {
  console.log("seeding data ...");

  try {
    await db.delete(books).execute();

    for (const book of dummyBooks) {
      await db.insert(books).values({
        ...book,
      });
    }
    console.log("seeding completed");


  } catch (error) {
    console.error("error seeding data", error);
  }
};
seed()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
