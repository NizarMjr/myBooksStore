import { useEffect, useState } from 'react';
import { FaUser } from "react-icons/fa";
import { MdFavorite, MdDashboard } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Notifications from './Notifications';

const Navbar = () => {
    const [isSticky, setSticky] = useState(false);
    const { user, logout, favorites } = useAuth();
    const isLoggedIn = !!user;
    const userRole = user?.role;

    useEffect(() => {
        const handleScroll = () => {
            setSticky(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`w-full z-[100] transition-all duration-300 border-b border-slate-100 ${isSticky ? 'fixed top-0 bg-white/90 backdrop-blur-md shadow-md py-2' : 'relative bg-white py-4'
            }`} dir="rtl">
            <div className="container mx-auto px-4 flex justify-between items-center gap-2 sm:gap-4">

                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-2 group shrink-0">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/29/29302.png"
                        alt="Logo"
                        className="w-7 h-7 sm:w-10 sm:h-10 group-hover:rotate-12 transition-transform"
                    />
                    {/* يظهر النص فقط في الشاشات فوق الصغيرة جداً */}
                    <span className="text-base sm:text-xl font-black text-slate-800 tracking-tight hidden xxs:block">بوك ستور</span>
                </Link>

                {/* Actions Section */}
                <div className="flex items-center gap-2 sm:gap-4 md:gap-6">

                    {/* لوحة التحكم - تصميم مضغوط للموبايل وجذاب للديسكتوب */}
                    {(userRole === 'admin' || userRole === 'owner') && (
                        <Link to="/admin/dashboard" title="لوحة التحكم">
                            <div className="relative group flex items-center gap-2 p-2 sm:px-4 sm:py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all border border-slate-700 cursor-pointer">
                                <MdDashboard className="text-blue-400 text-xl sm:text-2xl group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-black text-slate-200 hidden md:block tracking-widest">
                                    الداشبورد
                                </span>
                                {/* نقطة التنبيه النشطة */}
                                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                            </div>
                        </Link>
                    )}

                    {/* المفضلة */}
                    <Link to="/favorites" className="relative group flex flex-col items-center">
                        <div className="p-1.5 sm:p-2 rounded-xl group-hover:bg-rose-50 transition-colors">
                            <MdFavorite className={`text-xl sm:text-2xl ${favorites.length > 0 ? 'text-rose-500' : 'text-slate-400'}`} />
                            {favorites.length > 0 && (
                                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white ring-2 ring-white">
                                    {favorites.length}
                                </span>
                            )}
                        </div>
                        <span className="text-[9px] font-bold text-slate-500 hidden sm:block">المفضلة</span>
                    </Link>
                    {/* عرض الصورة الشخصية */}
                    {user &&
                        <Link to={`/user/${user.id}`}>
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover hover:opacity-80 transition-opacity"
                            />
                        </Link>}
                    {/* التنبيهات */}
                    {isLoggedIn && <Notifications />}

                    {/* المستخدم / تسجيل الخروج */}
                    {isLoggedIn ? (
                        <div className="flex items-center gap-2 sm:gap-3 border-r pr-2 sm:pr-4 border-slate-200">
                            {/* اسم المستخدم يختفي في الموبايل ويبقى الترحيب المختصر */}
                            <div className="hidden sm:flex flex-col items-start leading-tight">
                                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">{userRole}</span>
                                <span className="text-xs font-bold text-slate-800 truncate max-w-[60px] md:max-w-[100px]">
                                    {user.name}
                                </span>
                            </div>

                            <button
                                onClick={() => logout()}
                                className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all"
                                title="خروج"
                            >
                                <IoLogOut className="text-lg sm:text-xl" />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 sm:px-6 sm:py-2 rounded-full hover:bg-black transition-all active:scale-95 shadow-md">
                            <FaUser className="text-[10px]" />
                            <span className="text-xs sm:text-sm font-bold">دخول</span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;