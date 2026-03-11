import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiHeart, HiOutlineBookOpen } from "react-icons/hi";
import { useAuth } from "../hooks/useAuth";
import { FaStar } from "react-icons/fa";

const Favorites = () => {
    const [localLoading, setLocalLoading] = useState(true);
    const { favorites } = useAuth();

    useEffect(() => {
        if (favorites) {
            setLocalLoading(false);
        }
    }, [favorites]);

    if (localLoading) return (
        <div className="flex justify-center items-center h-96 text-slate-400 animate-pulse font-bold text-xl">
            جاري تحضير قائمتك المفضلة...
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex items-center gap-4 mb-12">
                <div className="bg-rose-50 p-4 rounded-3xl text-rose-500 shadow-sm">
                    <HiHeart size={32} />
                </div>
                <div>
                    <h1 className="text-4xl font-black text-slate-800">قائمة مفضلاتي</h1>
                    <p className="text-slate-400 font-bold mt-1">
                        لديك {Array.isArray(favorites) ? favorites.length : 0} كتب في القائمة
                    </p>
                </div>
            </div>

            {Array.isArray(favorites) && favorites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {favorites.map((book) => (book && (
                        <Link to={`/books/${book._id}`} key={book._id} className="group h-full">
                            <div className="relative mb-6 flex justify-center">
                                <div className="absolute inset-0 bg-blue-600/5 blur-3xl rounded-full scale-75 group-hover:scale-110 transition-transform duration-500"></div>
                                <img
                                    src={book.cover}
                                    className="h-64 w-44 object-cover rounded-xl shadow-[10px_15px_30px_rgba(0,0,0,0.2)] group-hover:-translate-y-3 group-hover:rotate-2 transition-all duration-500 z-10"
                                />
                                <div className="absolute top-0 right-2 z-20 bg-amber-400 text-white p-2 rounded-lg shadow-lg rotate-12 group-hover:rotate-0 transition-transform">
                                    <FaStar size={14} />
                                </div>
                            </div>
                        </Link>
                    )
                    ))}
                </div>
            ) : (
                /* Empty State */
                <div className="py-32 text-center flex flex-col items-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                        <HiOutlineBookOpen className="text-slate-200 text-5xl" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 mb-2">قائمة المفضلات فارغة!</h3>
                    <p className="text-slate-400 mb-8 max-w-sm">لم تقم بإضافة أي كتاب لمفضلاتك بعد. استكشف المكتبة وابدأ بإضافة ما يعجبك.</p>
                    <Link to="/" className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
                        تصفح المكتبة الآن
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Favorites;