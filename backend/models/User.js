const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "يرجى إدخال الاسم"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "يرجى إدخال البريد الإلكتروني"],
            unique: true, // Prevents duplicate accounts
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "يرجى إدخال بريد إلكتروني صحيح"],
        },
        googleId: { type: String, required: true, unique: true },
        avatar: { type: String },
        role: {
            type: String,
            enum: ["user", "admin", "owner"],
            default: "user",
        },

        favoriteBooks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Book",
            },
        ],
        profilePic: {
            type: String,
            default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        },
        lastActive: {
            type: Date,
            default: Date.now()
        },
        isActive: {
            type: Boolean,
            default: false,
        },
        notification: {
            type: String,
            default: "",
        },
        uploadCount: {
            type: Number,
            default: 0
        },
        downloadCount: {
            type: Number,
            default: 0,
        }
    },

    {
        timestamps: true, // Automatically manages createdAt and updatedAt
    }
);

module.exports = mongoose.model("User", userSchema);