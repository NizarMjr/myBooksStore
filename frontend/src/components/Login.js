import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login, setFavorites } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include",
            });
            const data = await res.json();

            if (res.ok) {
                login(data.accessToken, data.user);
                setFavorites(data.user.favorites);
                navigate("/");
            } else {
                setError(data.message || "فشل تسجيل الدخول");
            }
        } catch (err) {
            setError("حدث خطأ في الاتصال بالخادم");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4" dir="rtl">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center text-slate-800">تسجيل الدخول</h2>
                {error && <p className="bg-red-100 text-red-600 p-2 rounded mb-4 text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
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
                        <label className="block mb-1 font-medium">كلمة المرور</label>
                        <input
                            type="password"
                            required
                            className="w-full p-2 border rounded-lg outline-none focus:border-blue-500"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <button className="w-full bg-slate-800 text-white py-2 rounded-lg font-bold hover:bg-black transition">
                        دخول
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                    ليس لديك حساب؟ <Link to="/signup" className="text-blue-600 hover:underline">إنشاء حساب جديد</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;