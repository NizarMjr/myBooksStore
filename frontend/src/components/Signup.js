import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (res.ok) {
                alert("تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول");
                navigate("/login");
            } else {
                setError(data.error || data.message || "فشل إنشاء الحساب");
            }
        } catch (err) {
            setError("حدث خطأ أثناء محاولة التسجيل");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4" dir="rtl">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center text-slate-800">إنشاء حساب</h2>
                {error && <div className="bg-red-50 border-r-4 border-red-500 text-red-700 p-3 mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">الاسم الكامل</label>
                        <input
                            type="text"
                            required
                            className="w-full p-2 border rounded-lg outline-none focus:border-blue-500"
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">البريد الإلكتروني</label>
                        <input
                            type="email"
                            required
                            className="w-full p-2 border rounded-lg outline-none focus:border-blue-500"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">كلمة المرور (6 أحرف على الأقل)</label>
                        <input
                            type="password"
                            required
                            minLength="6"
                            className="w-full p-2 border rounded-lg outline-none focus:border-blue-500"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition">
                        تسجيل
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                    لديك حساب بالفعل؟ <Link to="/login" className="text-blue-600 hover:underline">تسجيل الدخول</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;