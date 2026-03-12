const Book = require("../models/Book");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../middelware/middelware");
const RefreshToken = require("../models/RefreshToken");
const Category = require("../models/Category");
const cloudinary = require('cloudinary').v2;

//SIGNUP 
module.exports.signup = async (req, res) => {
    try {
        console.log("Signup request body:", req.body);
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "يرجى ملء جميع الحقول" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "البريد الإلكتروني مستخدم بالفعل" });
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const newUser = new User({ name, email, password: passwordHash });

        if (email === "nizar.mjr94@gmail.com")
            newUser.role = "owner";

        await newUser.save();
        res.status(201).json({ message: "تم إنشاء الحساب بنجاح" });
    } catch (err) {
        res.status(500).json({ message: "خطأ في الخادم", error: err.message });
    }
}
// LOGIN
module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "يرجى إدخال البريد الإلكتروني وكلمة المرور" });
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(400).json({ message: "بيانات تسجيل الدخول غير صحيحة" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "بيانات تسجيل الدخول غير صحيحة" });
        }

        const refreshToken = generateRefreshToken(user);
        if (!refreshToken) {
            return res.status(500).json({ message: "خطأ في إنشاء الجلسة" });
        }

        const newRefreshToken = new RefreshToken({
            token: refreshToken,
            userId: user._id,
        });

        await newRefreshToken.save();
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        const accessToken = generateAccessToken(user);

        if (!accessToken) {
            return res.status(500).json({ message: "خطأ في إنشاء الجلسة" });
        }
        user.lastActive = Date.now();
        user.isActive = true;
        await user.save();
        await user.populate({
            path: 'favoriteBooks',
            select: 'title author coverImage description category'
        });

        res.status(200).json({
            message: "تم تسجيل الدخول بنجاح",
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                favorites: user.favoriteBooks,
                notification: user.notification,
            }
        });

    } catch (err) {
        res.status(500).json({ message: "خطأ في الخادم", error: err.message });
    }
}
module.exports.logout = async (req, res) => {

    try {
        const refreshToken = req.cookies.refreshToken;
        const storedToken = await RefreshToken.findOne({ token: refreshToken });
        if (storedToken)
            await User.findByIdAndUpdate(storedToken.userId, { isActive: false });

        await RefreshToken.findOneAndDelete({ token: refreshToken });
        res.clearCookie("refreshToken", { httpOnly: true, secure: false, sameSite: "Strict" });

        res.status(200).json({ message: "تم تسجيل الخروج بنجاح" });
    } catch (err) {
        res.status(500).json({ message: "خطأ في الخادم", error: err.message });
    }
}
// REFRESH TOKEN
module.exports.refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: "يرجى تسجيل الدخول أولاً" });
        }
        const storedToken = await RefreshToken.findOne({ token: refreshToken });
        if (!storedToken) {
            return res.status(401).json({ message: "يرجى تسجيل الدخول أولاً" });
        }
        jwt.verify(refreshToken, process.env.JWT_KEY, async (err, decoded) => {
            if (err) return res.status(403).json({ message: "جلسة منتهية" });

            try {
                const foundUser = await User.findById(decoded._id || decoded.id)
                    .populate('favoriteBooks')

                if (!foundUser) return res.status(404).json({ message: "المستخدم غير موجود" });
                const accessToken = generateAccessToken({
                    _id: foundUser.id,
                    name: foundUser.name,
                    email: foundUser.email,
                    role: foundUser.role
                });
                const user = {
                    id: foundUser.id,
                    name: foundUser.name,
                    email: foundUser.email,
                    role: foundUser.role,
                    favorites: foundUser.favoriteBooks,
                    notification: foundUser.notification,
                }
                res.status(200).json({ accessToken, user });

            } catch (error) {
                res.status(500).json({ message: "خطأ في السيرفر" });
            }
        });
    }
    catch (err) {
        res.status(500).json({ message: "خطأ في الخادم", error: err.message });
    }
}
// GET FILTERED BOOKS
module.exports.getBooks = async (req, res) => {
    try {
        let { page = 1, limit = 8, category, search } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        let query = {};

        if (search) {
            query.$and = [
                { isActive: true },
                {
                    $or: [
                        { title: { $regex: search, $options: "i" } },
                        { author: { $regex: search, $options: "i" } }
                    ]
                }
            ];
        }

        if (category && category !== "All") {
            query.category = category;
        }

        const skip = (page - 1) * limit;

        const books = await Book.find(query).
            populate('category', 'name').
            skip(skip).
            limit(limit);

        const totalBooks = await Book.countDocuments(query);

        const totalPages = Math.ceil(totalBooks / limit);

        if (books.length === 0) {
            return res.status(404).json({ message: "No books found", books: [] });
        }

        res.status(200).json({
            totalPages,
            page,
            limit,
            books,
            totalBooks,
        });
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}
// GET ALL BOOKS
module.exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json({ books });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

// GET BOOK INFO
module.exports.getBookDetail = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid book ID" });
        }
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        return res.status(200).json(book);
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}
// ADD COMMENT
module.exports.addComment = async (req, res) => {
    try {
        const { bookId } = req.params;
        const { comment } = req.body;
        const userId = req.user.id; // Extracted from the authenticated token

        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).json({ message: "Invalid book ID" });
        }
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        const newComment = {
            user: userId,
            text: comment,
            date: new Date(),
        };
        book.comments.push(newComment);
        await book.save();
        res.status(201).json({ message: "Comment added successfully", comment: newComment });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}
// GET COMMENTS FOR A BOOK
module.exports.getBookComment = async (req, res) => {
    try {
        const { bookId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).json({ message: "Invalid book ID" });
        }
        const book = await Book.findById(bookId).populate("comments.user", "_id name profilePic role");
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json({ comments: book.comments });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}
// GET CATEGORIES
module.exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ categories });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}
// GET ALL USERS
module.exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json({ users });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}
// UPDATE BOOK
module.exports.updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, description, category, publishedYear, isActive } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID كتاب غير صالح" });
        }

        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: "الكتاب غير موجود" });
        }

        let coverUrl = book.cover;
        if (req.files && req.files['cover'] && req.files['cover'][0]) {
            coverUrl = req.files['cover'][0].path;
        }

        let pdfUrl = book.file;
        if (req.files && req.files['bookFile'] && req.files['bookFile'][0]) {
            pdfUrl = req.files['bookFile'][0].path;
        }

        book.title = title || book.title;
        book.author = author || book.author;
        book.description = description || book.description;
        book.category = category || book.category;
        book.publishedYear = publishedYear || book.publishedYear;
        book.isActive = isActive !== undefined ? isActive : book.isActive;

        book.cover = coverUrl;
        book.file = pdfUrl;

        await book.save();

        res.status(200).json({
            message: "تم تحديث الكتاب بنجاح",
            book
        });

    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ message: "خطأ في السيرفر", error: err.message });
    }
};
//GET USER
module.exports.getUser = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({ message: "Invalid user ID" });
        const user = await User.findById(id).select("-password");
        if (!user)
            return res.status(404).json({ message: "User not found" });

        const numberOfComments = await Book.countDocuments({
            'comments.user': id
        })

        const updatedUser = { ...user.toObject(), numberOfComments };
        res.status(200).json({ user: updatedUser });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}
//CHANGE ROLE
module.exports.updateRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    try {
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({ message: "Invalid user ID" });

        const user = await User.findById(id).select('-password');
        if (!user)
            return res.status(404).json({ message: "User not found" });

        user.role = role;
        user.notification = role === 'admin'
            ? 'تهانينا! تمت ترقية حسابك إلى رتبة (مشرف). يمكنك الآن إدارة الكتب والتعليقات.'
            : 'تم تعديل صلاحيات حسابك إلى (مستخدم عادي). شكراً لمساهمتك في مجتمعنا.';
        await user.save();

        res.status(200).json({
            message: `تم تحديث رتبة ${user.name} إلى ${role} بنجاح`,
            user
        });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}
//UPDATE FAVORITE
module.exports.updateFavorite = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({ message: "Invalid user ID" });

        const user = await User.findById(userId).select('-password');
        if (!user)
            return res.status(404).json({ message: "User not found" });

        const isFound = user.favoriteBooks.includes(id);

        if (!isFound)
            await User.findByIdAndUpdate(userId, { $addToSet: { favoriteBooks: id } })
        else
            await User.findByIdAndUpdate(userId, { $pull: { favoriteBooks: id } })

        res.status(200);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}
//GET FAVORITES BOOKS
module.exports.getFavoritesBooks = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId)
            .populate({
                path: 'favoriteBooks',
                select: 'title author coverImage description category publishedYear'
            });

        if (!user) {
            return res.status(404).json({ message: "المستخدم غير موجود" });
        }
        res.status(200).json({
            favorites: user.favoriteBooks
        });

    } catch (err) {
        console.error("Error in getFavoritesBooks:", err.message);
        res.status(500).json({
            message: "خطأ في السيرفر أثناء جلب المفضلات",
            error: err.message
        });
    }
};
module.exports.resetNotification = async (req, res) => {
    try {
        const userId = req.user.id;

        await User.findByIdAndUpdate(userId, {
            notification: ""
        });

        res.status(200).json({ message: "تم مسح التنبيه بنجاح" });
    } catch (error) {
        res.status(500).json({ message: "خطأ في السيرفر" });
    }
};
// UPLOAD BOOK
module.exports.uploadBook = async (req, res) => {
    try {
        if (!req.files || !req.files['bookFile']) {
            return res.status(400).json({ message: "ملف الكتاب مطلوب" });
        }

        // فحص أولي: هل الملفات موجودة أصلاً؟
        console.log("Check File Object:", JSON.stringify(req.files, null, 2));

        // استخراج الروابط مع التأكد من الوصول للـ path
        const coverUrl = (req.files && req.files['cover'] && req.files['cover'][0])
            ? String(req.files['cover'][0].path)
            : null;

        const pdfUrl = (req.files && req.files['bookFile'] && req.files['bookFile'][0])
            ? String(req.files['bookFile'][0].path)
            : null;

        const newBook = new Book({
            title: req.body.title,
            author: req.body.author,
            category: req.body.category,
            description: req.body.description,
            cover: coverUrl,
            file: pdfUrl
        });
        const userId = req.user.id;

        await User.findByIdAndUpdate(userId, { $inc: { uploadCount: 1 } });


        await newBook.save();
        res.status(201).json({ message: "تم الحفظ بنجاح" });

    } catch (err) {
        console.error("خطأ داخل Controller الرفع:", err.message);
        res.status(500).json({ message: "خطأ داخلي في السيرفر", error: err.message });
    }
};

//DELETE BOOK

module.exports.deleteBook = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "معرف الكتاب غير صالح" });
        }

        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: "الكتاب غير موجود" });
        }

        const deleteFromCloudinary = async (url, resourceType = 'image') => {
            if (!url) return;
            try {
                const publicId = url.split('/').slice(-2).join('/').split('.')[0];
                await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
            } catch (err) {
                console.error("خطأ أثناء حذف ملف من كلاوديناري:", err);
            }
        };

        await deleteFromCloudinary(book.cover, 'image');
        await deleteFromCloudinary(book.file, 'raw');

        await Book.findByIdAndDelete(id);

        return res.status(200).json({ message: "تم حذف الكتاب وملفاته بنجاح" });

    } catch (error) {
        return res.status(500).json({ message: "خطأ في السيرفر", error: error.message });
    }
};
// CHECK SERVER HEALTH
module.exports.health = (req, res) => {
    res.status(200).json({
        status: 'online',
        message: 'Server is awake and healthy'
    });
}