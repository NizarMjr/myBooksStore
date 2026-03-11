const books = [
    // روايات (Arabic Novels)
    {
        title: "الخيميائي",
        author: "باولو كويلو",
        description: "رواية فلسفية تحكي عن رحلة البحث عن الحلم والمعنى الحقيقي للحياة.",
        category: "روايات",
        publishedYear: 1988,
        coverImage: "https://covers.openlibrary.org/b/isbn/9780061122415-L.jpg",
    },
    {
        title: "عزازيل",
        author: "يوسف زيدان",
        description: "رواية تاريخية تدور حول الصراعات الدينية والفكرية في القرن الخامس الميلادي.",
        category: "روايات",
        publishedYear: 2008,
        coverImage: "https://covers.openlibrary.org/b/isbn/9789770923054-L.jpg",
    },
    {
        title: "ذاكرة الجسد",
        author: "أحلام مستغانمي",
        description: "رواية رومانسية تمزج بين الحب والتاريخ والسياسة بأسلوب أدبي راقٍ.",
        category: "روايات",
        publishedYear: 1993,
        coverImage: "https://covers.openlibrary.org/b/isbn/9789953890710-L.jpg",
    },

    // تطوير الذات (Self-Development)
    {
        title: "قوة العادات",
        author: "تشارلز دوهيج",
        description: "كتاب يشرح كيف تتشكل العادات وكيف يمكن تغييرها لتحقيق النجاح الشخصي والمؤسسي.",
        category: "تطوير الذات",
        publishedYear: 2012,
        coverImage: "https://covers.openlibrary.org/b/isbn/9780812981605-L.jpg",
    },
    {
        title: "فن اللامبالاة",
        author: "مارك مانسون",
        description: "دليل عملي للتركيز على ما يهم فعلاً وتجاهل ما لا يستحق القلق في الحياة الحديثة.",
        category: "تطوير الذات",
        publishedYear: 2016,
        coverImage: "https://covers.openlibrary.org/b/isbn/9780062457714-L.jpg",
    },
    {
        title: "العادات السبع للناس الأكثر فعالية",
        author: "ستيفن كوفي",
        description: "إطار عملي لتطوير الشخصية وتحقيق التوازن والنجاح في الحياة المهنية والخاصة.",
        category: "تطوير الذات",
        publishedYear: 1989,
        coverImage: "https://covers.openlibrary.org/b/isbn/9780743269513-L.jpg",
    },

    // Programming / Tech
    {
        title: "Clean Code",
        author: "Robert C. Martin",
        description: "A handbook of agile software craftsmanship that teaches you how to write code that is easy to read and maintain.",
        category: "Programming",
        publishedYear: 2008,
        coverImage: "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg",
    },
    {
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt & David Thomas",
        description: "A classic guide for software developers to improve their craft and career through practical advice.",
        category: "Programming",
        publishedYear: 1999,
        coverImage: "https://covers.openlibrary.org/b/isbn/9780201616224-L.jpg",
    },
    {
        title: "You Don’t Know JS",
        author: "Kyle Simpson",
        description: "An in-depth guide to the core mechanisms of the JavaScript language, perfect for full-stack developers.",
        category: "Programming",
        publishedYear: 2015,
        coverImage: "https://covers.openlibrary.org/b/isbn/9781491904244-L.jpg",
    },

    // Productivity
    {
        title: "Atomic Habits",
        author: "James Clear",
        description: "A tiny changes, remarkable results approach to building good habits and breaking bad ones.",
        category: "Productivity",
        publishedYear: 2018,
        coverImage: "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg",
    },
    {
        title: "Deep Work",
        author: "Cal Newport",
        description: "Rules for focused success in a distracted world, teaching you how to master complicated information quickly.",
        category: "Productivity",
        publishedYear: 2016,
        coverImage: "https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg",
    },

    // Business / Finance
    {
        title: "Rich Dad Poor Dad",
        author: "Robert Kiyosaki",
        description: "Explodes the myth that you need to earn a high income to be rich and explains the difference between assets and liabilities.",
        category: "Business",
        publishedYear: 1997,
        coverImage: "https://covers.openlibrary.org/b/isbn/9781612680194-L.jpg",
    },
    {
        title: "The Lean Startup",
        author: "Eric Ries",
        description: "How today's entrepreneurs use continuous innovation to create radically successful businesses.",
        category: "Business",
        publishedYear: 2011,
        coverImage: "https://covers.openlibrary.org/b/isbn/9780307887894-L.jpg",
    },
    {
        title: "Zero to One",
        author: "Peter Thiel",
        description: "Notes on startups, or how to build the future by creating things that have never existed before.",
        category: "Business",
        publishedYear: 2014,
        coverImage: "https://covers.openlibrary.org/b/isbn/9780804139298-L.jpg",
    },

    // History / Philosophy
    {
        title: "Sapiens",
        author: "Yuval Noah Harari",
        description: "A brief history of humankind, exploring how biology and history have defined us and enhanced our understanding of what it means to be human.",
        category: "History",
        publishedYear: 2011,
        coverImage: "https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg",
    },
    {
        title: "The Republic",
        author: "Plato",
        description: "A Socratic dialogue concerning justice and the order and character of the just city-state and the just man.",
        category: "Philosophy",
        publishedYear: -380,
        coverImage: "https://covers.openlibrary.org/b/isbn/9780140455113-L.jpg",
    },

    // Arabic Classics
    {
        title: "مقدمة ابن خلدون",
        author: "ابن خلدون",
        description: "كتاب مؤسس لعلم الاجتماع، يتناول طبائع العمران البشري وتطور الدول والحضارات.",
        category: "فكر",
        publishedYear: 1377,
        coverImage: "https://covers.openlibrary.org/b/isbn/9789953680007-L.jpg",
    },
    {
        title: "حي بن يقظان",
        author: "ابن طفيل",
        description: "قصة فلسفية رمزية تتناول تطور العقل البشري وبحثه عن الحقيقة في عزلة تامة.",
        category: "رواية فلسفية",
        publishedYear: 1185,
        coverImage: "https://covers.openlibrary.org/b/isbn/9789770916738-L.jpg",
    },
    {
        title: "رجال في الشمس",
        author: "غسان كنفاني",
        description: "رواية رمزية تعبر عن معاناة الشعب الفلسطيني والبحث عن الوطن والأمان.",
        category: "رواية",
        publishedYear: 1963,
        coverImage: "https://covers.openlibrary.org/b/isbn/9781855162781-L.jpg",
    }
];

module.exports = books;