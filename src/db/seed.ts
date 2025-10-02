import dummyBooks from "../../dummyBooks.json";
import { books, systemConfig, borrowRecords } from "./schema";
import { db } from '.';


const seed = async () => {
  console.log("seeding data ...");

  try {
    // Clear existing data - must delete in order to respect foreign key constraints
    // Delete child records first (borrowRecords references books)
    console.log("Deleting borrow records...");
    await db.delete(borrowRecords).execute();
    
    console.log("Deleting books...");
    await db.delete(books).execute();
    
    console.log("Deleting system config...");
    await db.delete(systemConfig).execute();

    // Seed books
    console.log("Seeding books...");
    for (const book of dummyBooks) {
      await db.insert(books).values({
        ...book,
      });
    }

    // Seed default system config
    console.log("Seeding system config...");
    await db.insert(systemConfig).values({
      key: "max_books_allowed",
      value: "5",
      description: "Maximum number of books a user can borrow at once",
    });

    console.log("✓ Seeding completed successfully!");
  } catch (error) {
    console.error("✗ Error seeding data:", error);
    throw error;
  }
};

seed()
  .then(() => {
    console.log("Seed process finished.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seed process failed:", err);
    process.exit(1);
  });
