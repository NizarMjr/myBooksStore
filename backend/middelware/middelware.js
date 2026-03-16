const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');
const jwt = require("jsonwebtoken");

module.exports.authenticatedToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "يرجى تسجيل الدخول أولاً" });
        }

        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "جلسة منتهية، يرجى تسجيل الدخول" });
            }
            req.user = decoded;
            next();
        });
    } catch (err) {
        res.status(500).json({ message: "خطأ في الخادم", error: err.message });
    }
};
module.exports.acceptWindow = (req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
    next();
}
module.exports.generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
        process.env.JWT_KEY,
        { expiresIn: "5min" }
    );
};

module.exports.generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
        process.env.JWT_KEY,
        { expiresIn: "30d" }
    );
};

module.exports.authenticatedAdmin = (req, res, next) => {
    try {
        const user = req.user;
        if (user && (user.role === 'admin' || user.role === 'owner')) {
            next();
        } else {
            return res.status(403).json({
                message: "وصول مرفوض: هذه المنطقة مخصصة للمديرين فقط"
            });
        }
    } catch (err) {
        res.status(500).json({ message: "خطأ في الخادم", error: err.message });
    }
};

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const isPdf = file.fieldname === 'bookFile';
        return {
            folder: isPdf ? 'books_pdf' : 'books_covers',
            resource_type: isPdf ? 'raw' : 'image',
            public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
        };
    },
});
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype;

    if (file.fieldname === "cover") {
        if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext) || mimeType.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('نوع الغلاف غير مدعوم! يرجى رفع JPG أو PNG'), false);
        }
    } else if (file.fieldname === "bookFile") {
        if (ext === '.pdf' || mimeType === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('نوع الملف غير مدعوم، يرجى رفع PDF للكتب'), false);
        }
    } else {
        cb(null, true);
    }
};

module.exports.upload = multer({
    storage,
    fileFilter: fileFilter,
    limits: 1024 * 1024 * 50
});