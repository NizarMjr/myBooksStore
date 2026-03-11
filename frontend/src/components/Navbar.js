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
            <div className="container mx-auto px-4 flex justify-between items-center gap-4">

                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-2 group shrink-0">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/29/29302.png"
                        alt="Logo"
                        className="w-8 h-8 sm:w-10 sm:h-10 group-hover:rotate-12 transition-transform"
                    />
                    <span className="text-lg sm:text-xl font-black text-slate-800 tracking-tight hidden xs:block">بوك ستور</span>
                </Link>

                {/* Actions Section - يظهر دائماً */}
                <div className="flex items-center gap-3 sm:gap-6">

                    {/* لوحة التحكم */}
                    {(userRole === 'admin' || userRole === 'owner') && (
                        <Link to="/admin/dashboard" className="flex flex-col items-center text-blue-600 hover:text-blue-800 transition-colors">
                            <MdDashboard className="text-xl sm:text-2xl" />
                            <span className="text-[10px] font-bold hidden xs:block">الداشبورد</span>
                        </Link>
                    )}

                    {/* المفضلة */}
                    <Link to="/favorites" className="relative group flex flex-col items-center justify-center transition-all">
                        <div className="relative p-1 sm:p-2 rounded-xl group-hover:bg-rose-50 transition-colors">
                            <MdFavorite className={`text-xl sm:text-2xl ${favorites.length > 0 ? 'text-rose-500' : 'text-slate-400'}`} />
                            {favorites.length > 0 && (
                                <span className="absolute -top-0 -right-0 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-rose-600 text-[9px] sm:text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                                    {favorites.length}
                                </span>
                            )}
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 hidden xs:block">المفضلة</span>
                    </Link>

                    {/* التنبيهات */}
                    {isLoggedIn && <Notifications />}

                    {/* المستخدم / تسجيل الخروج */}
                    {isLoggedIn ? (
                        <div className="flex items-center gap-2 sm:gap-3 border-r pr-2 sm:pr-6 border-slate-200">
                            <div className="lg:flex flex-col items-start">
                                <span className="block text-[10px] text-slate-400 leading-none">{userRole}</span>
                                <span className="text-sm font-bold text-slate-800 truncate max-w-[80px]">Welcome {user.name}</span>
                            </div>
                            <button
                                onClick={() => logout()}
                                className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all"
                                title="خروج"
                            >
                                <IoLogOut className="text-xl" />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="flex items-center gap-2 bg-slate-900 text-white px-4 sm:px-6 py-2 rounded-full hover:bg-black transition-transform active:scale-95 shadow-lg shrink-0">
                            <FaUser className="text-xs" />
                            <span className="text-xs sm:text-sm font-bold">دخول</span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;