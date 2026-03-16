import { useState, useRef } from "react";
import { HiOutlineBookOpen, HiOutlineCloudUpload, HiOutlineDocumentText, HiOutlineTag, HiOutlineUser, HiX } from "react-icons/hi";
import { useAuth } from "../hooks/useAuth";

const AddBookForm = () => {
    const { authFetch, categories, token } = useAuth();
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        category: "",
        description: "",
    });

    const [bookFile, setBookFile] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        if (coverImage && coverImage.size >= 10 * 1024 * 1024) {
            alert("عذراً، حجم صورة الغلاف يجب أن يكون أقل من 10 ميجابايت");
            return;
        }
        if (bookFile && bookFile.size >= 10 * 1024 * 1024) {
            alert("عذراً، حجم ملف الكتاب (PDF) كبير جداً، الحد الأقصى هو 10 ميجابايت");
            return;
        }
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("author", formData.author);
            data.append("category", formData.category);
            data.append("description", formData.description);
            if (coverImage) data.append("cover", coverImage);
            if (bookFile) data.append("bookFile", bookFile);

            const response = await authFetch(`${process.env.REACT_APP_SERVER_URL}/books/upload`, {
                method: "POST",
                body: data,
            });
            const result = await response.json();
            const { message } = result;
            if (response.ok) {
                alert("تم إضافة الكتاب بنجاح!");
                setPreview(null);
            }
            else {
                alert(message)
            }
        } catch (error) {
            console.error("Error uploading book:", error);
            alert("حدث خطأ أثناء الرفع");

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 md:p-12 bg-white" dir="rtl">
            <div className="max-w-4xl mx-auto">
                <div className="mb-10">
                    <h2 className="text-2xl font-black text-slate-800">إضافة كتاب جديد للمكتبة</h2>
                    <p className="text-slate-500 mt-2">يرجى ملء كافة البيانات المطلوبة.</p>
                </div>

                <form className="space-y-8" onSubmit={handleSubmit}>
                    {/* قسم رفع الغلاف */}
                    <div
                        onClick={() => fileInputRef.current.click()}
                        className="relative flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2rem] p-8 hover:border-blue-400 transition-colors bg-slate-50/50 group cursor-pointer overflow-hidden"
                    >
                        {preview ? (
                            <div className="relative w-full h-48">
                                <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-xl" />
                                <button
                                    onClick={(e) => { e.stopPropagation(); setPreview(null); }}
                                    className="absolute top-0 right-0 p-2 bg-red-500 text-white rounded-full shadow-lg"
                                >
                                    <HiX />
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                    <HiOutlineCloudUpload size={40} className="text-blue-500" />
                                </div>
                                <p className="text-slate-600 font-bold">انقر لاختيار صورة الغلاف</p>
                                <p className="text-slate-400 text-xs mt-2">يدعم JPG, PNG (بحد أقصى 2MB)</p>
                            </>
                        )}
                        <input
                            type="file"
                            className="hidden"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* عنوان الكتاب */}
                        <div className="space-y-2">
                            <label className="text-slate-700 font-bold flex items-center gap-2 px-1">
                                <HiOutlineBookOpen className="text-blue-500" /> عنوان الكتاب
                            </label>
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                type="text"
                                required
                                placeholder="مثال: مقدمة ابن خلدون"
                                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                            />
                        </div>

                        {/* اسم المؤلف */}
                        <div className="space-y-2">
                            <label className="text-slate-700 font-bold flex items-center gap-2 px-1">
                                <HiOutlineUser className="text-blue-500" /> اسم المؤلف
                            </label>
                            <input
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                type="text"
                                required
                                placeholder="اسم الكاتب الكامل"
                                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                            />
                        </div>

                        {/* التصنيف */}
                        <div className="space-y-2">
                            <label className="text-slate-700 font-bold flex items-center gap-2 px-1">
                                <HiOutlineTag className="text-blue-500" /> تصنيف الكتاب
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none cursor-pointer font-medium appearance-none"
                            >
                                <option value="" disabled>اختر تصنيف الكتاب...</option>

                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* رفع ملف الـ PDF */}
                        <div className="space-y-2">
                            <label className="text-slate-700 font-bold flex items-center gap-2 px-1">
                                <HiOutlineCloudUpload className="text-blue-500" /> ملف الكتاب (PDF)
                            </label>
                            <input
                                type="file"
                                accept=".pdf"
                                required
                                onChange={(e) => setBookFile(e.target.files[0])}
                                className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                            />
                        </div>
                    </div>

                    {/* وصف الكتاب */}
                    <div className="space-y-2">
                        <label className="text-slate-700 font-bold flex items-center gap-2 px-1">
                            <HiOutlineDocumentText className="text-blue-500" /> نبذة عن الكتاب
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            required
                            placeholder="اكتب ملخصاً قصيراً يشجع القراء..."
                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium resize-none"
                        ></textarea>
                    </div>

                    {/* أزرار التحكم */}
                    <div className="flex flex-col md:flex-row gap-4 pt-6">
                        <button
                            disabled={loading}
                            type="submit"
                            className="flex-1 bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transform active:scale-95 transition-all disabled:bg-slate-400 disabled:scale-100"
                        >
                            {loading ? "جاري الرفع..." : "حفظ ونشر الكتاب"}
                        </button>
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="flex-1 bg-slate-100 text-slate-500 font-bold py-4 rounded-2xl hover:bg-slate-200 transition-all"
                        >
                            إلغاء
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBookForm;