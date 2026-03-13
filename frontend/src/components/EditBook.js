import { useRef, useState } from "react";
import { HiOutlineSave, HiOutlineXCircle, HiOutlineCloudUpload, HiX } from "react-icons/hi";
import { useAuth } from "../hooks/useAuth";
import AlertMessage from "./AlertMessage";

const EditBook = ({ book, onCancel, onUpdate }) => {
    const { authFetch, categories } = useAuth();
    const [formData, setFormData] = useState({
        title: book.title || "",
        author: book.author || "",
        description: book.description || "",
        category: book.category?._id || book.category || '',
        publishedYear: book.publishedYear || "",
        isActive: book.isActive || false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);
    const [coverImage, setCoverImage] = useState(null);
    const [alert, setAlert] = useState({
        show: false,
        message: "",
        type: ""
    });

    const [preview, setPreview] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const data = new FormData();

            data.append("title", formData.title);
            data.append("author", formData.author);
            data.append("description", formData.description);
            data.append("category", formData.category);
            data.append("publishedYear", formData.publishedYear);
            data.append("isActive", formData.isActive);

            if (coverImage) {
                data.append("cover", coverImage);
            }

            const response = await authFetch(`${process.env.REACT_APP_SERVER_URL}/books/${book._id}`, {
                method: "PUT",
                body: data,
            });

            if (response.ok) {
                setAlert({ ...alert, show: true, message: "تم تحديث الكتاب بنجاح!", type: "success" });
                const result = await response.json();
                onUpdate(result.book);

            } else {
                setAlert({ ...alert, show: true, message: "فشل في تحديث الكتاب", type: "error" });
            }
        } catch (error) {
            console.error("Error updating book:", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };
    const handleCloseAlert = () => {
        setAlert({ ...alert, show: false });
    }

    return (
        <>
            {alert.show && <AlertMessage message={alert.message} type={alert.type} onClose={handleCloseAlert} />}

            <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-100 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8 border-b pb-4">
                    <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                        تعديل بيانات الكتاب: <span className="text-blue-600 font-bold">{book.title}</span>
                    </h2>
                    <button onClick={onCancel} className="text-slate-400 hover:text-red-500 transition">
                        <HiOutlineXCircle size={32} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* اسم الكتاب */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 mr-2">عنوان الكتاب</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                                required
                            />
                        </div>

                        {/* المؤلف */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 mr-2">المؤلف</label>
                            <input
                                type="text"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                                required
                            />
                        </div>

                        {/* التصنيف */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 mr-2">التصنيف</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                            >
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* الوصف */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 mr-2">وصف الكتاب</label>
                        <textarea
                            name="description"
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
                        />
                    </div>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* سنة النشر */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 mr-2 italic">سنة النشر</label>
                            <input
                                type="number"
                                name="publishedYear"
                                min="1900"
                                max={new Date().getFullYear()}
                                value={formData.publishedYear}
                                onChange={handleChange}
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                            />
                        </div>

                        {/* حالة التفعيل - Toggle Switch */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 mr-2 block">حالة الكتاب في المتجر</label>
                            <div
                                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                className={`w-full p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${formData.isActive ? "bg-emerald-50 border-emerald-200" : "bg-slate-100 border-slate-300"
                                    }`}
                            >
                                <span className={`font-bold text-sm ${formData.isActive ? "text-emerald-700" : "text-slate-500"}`}>
                                    {formData.isActive ? "نشط - يظهر للعامة" : " مخفي عن العامة"}
                                </span>
                                <div className={`w-12 h-6 rounded-full relative transition-colors ${formData.isActive ? "bg-emerald-500" : "bg-slate-400"}`}>
                                    <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-all ${formData.isActive ? "left-1" : "left-7"}`} />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* رابط الملف */}
                    <div className="space-y-2">
                        <label className="text-slate-700 font-bold flex items-center gap-2 px-1">
                            <HiOutlineCloudUpload className="text-blue-500" /> رابط ملف الـ PDF
                        </label>
                        <input
                            type="url"
                            placeholder="https://example.com/book.pdf"
                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                        />
                    </div>
                    {/* أزرار التحكم */}
                    <div className="flex gap-4 pt-6 border-t">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 flex items-center justify-center gap-2 p-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:bg-slate-300"
                        >
                            <HiOutlineSave size={20} />
                            {isSubmitting ? "جاري الحفظ..." : "حفظ التغييرات"}
                        </button>

                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 p-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                        >
                            إلغاء
                        </button>
                    </div>
                </form >
            </div >
        </>

    );
};

export default EditBook;