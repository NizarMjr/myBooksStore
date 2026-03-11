const mongoose = require('mongoose');
const Category = require('./models/Category');
require('dotenv').config();

const categories = [
    // العلوم الشرعية
    { name: "إسلامي / عقيدة" },
    { name: "إسلامي / فقه" },
    { name: "إسلامي / سيرة نبوية" },

    // الفكر والاجتماع
    { name: "تاريخ / علم اجتماع" },
    { name: "فلسفة وفكر" },
    { name: "سياسة وعلاقات دولية" },

    // تطوير الذات والمال
    { name: "تطوير ذات / علم نفس" },
    { name: "إدارة وقت وإنتاجية" },
    { name: "ثقافة مالية واستثمار" },

    // الأدب والفنون
    { name: "روايات عالمية" },
    { name: "أدب عربي" },
    { name: "شعر وقصائد" },

    // التكنولوجيا والعلوم
    { name: "برمجة وحاسوب" },
    { name: "علوم طبيعية" },
    { name: "ريادة أعمال" }
];
const MONGO_URL = process.env.MONGO_URL;

const seedDB = async () => {
    try {
        await mongoose.connect(MONGO_URL); 
        await Category.deleteMany({}); 
        await Category.insertMany(categories);
        console.log("تم إدخال التصنيفات بنجاح!");
        process.exit();
    } catch (err) {
        console.error("خطأ أثناء الـ Seeding:", err);
        process.exit(1);
    }
};

seedDB();