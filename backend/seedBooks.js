require("dotenv").config();
const mongoose = require("mongoose");
const Book = require("./models/Book");
const books = require("./books");
async function seedBooks() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB Connected");

        // Optional: Clear existing books
        await Book.deleteMany();
        console.log("Existing books removed");



        console.log("Books seeded successfully ✅");
        process.exit();
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
}

seedBooks();
