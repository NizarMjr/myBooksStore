const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        author: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        coverImage: {
            type: String,
            default: null,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
        publishedYear: {
            type: Number,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        file: {
            type: String,
        },
        cover: {
            type: String,
        },

        comments: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User", // Links to your User model
                    required: true
                },
                text: {
                    type: String,
                    required: true
                },
                createdAt: { type: Date, default: Date.now }
            }
        ]
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Book", bookSchema);