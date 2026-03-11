import { useEffect, useState } from "react";
import {
    HiOutlineViewGrid, HiOutlineBookOpen, HiOutlineUsers,
    HiOutlinePlusCircle, HiOutlineLogout, HiOutlineShieldCheck,
    HiOutlineExclamationCircle, HiOutlineInformationCircle,
    HiOutlineTag, HiMenuAlt1, HiX
} from "react-icons/hi";
import { useAuth } from "../hooks/useAuth";
import AddBookForm from "./AddBookForm";
import BooksTable from "./BooksTable";
import UsersTable from "./UsersTable";
import StatCard from "./StatCard";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState("stats");
    const [loading, setLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { authFetch, logout, categories } = useAuth()
    const navigate = useNavigate();
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const getBooks = async () => {
        try {
            const response = await authFetch(`${process.env.REACT_APP_SERVER_URL}/books`);
            const data = await response.json();
            setBooks(data.books || []);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    const getUsers = async () => {
        try {
            const response = await authFetch(`${process.env.REACT_APP_SERVER_URL}/users`);
            const data = await response.json();
            setUsers(data.users || []);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        setLoading(true);
        Promise.all([getBooks(), getUsers()]).finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex relative" dir="rtl">

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden transition-opacity"
                    onClick={toggleSidebar}
                ></div>
            )}

            <aside className={`
                fixed lg:static inset-y-0 right-0 z-[70] w-72 bg-white border-l border-slate-200 
                flex flex-col h-screen transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? "translate-x-0 shadow-2xl" : "translate-x-full lg:translate-x-0"}
            `}>
                <div className="p-8 flex justify-between items-center">
                    <h2 className="text-2xl font-black text-blue-600 tracking-tighter italic">BOOKSHELF</h2>
                    <button onClick={toggleSidebar} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-full">
                        <HiX size={24} />
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                    {[
                        { id: "stats", label: "الملخص", icon: <HiOutlineViewGrid size={24} /> },
                        { id: "add-book", label: "إضافة كتاب جديد", icon: <HiOutlinePlusCircle size={24} /> },
                        { id: "books", label: "إدارة الكتب", icon: <HiOutlineBookOpen size={24} /> },
                        { id: "users", label: "المستخدمين", icon: <HiOutlineUsers size={24} /> },
                        { id: "rules", label: "قوانين الإدارة", icon: <HiOutlineShieldCheck size={24} />, special: true },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${activeTab === item.id
                                ? (item.special ? "bg-amber-50 text-amber-600 shadow-sm" : "bg-blue-50 text-blue-600 shadow-sm")
                                : "text-slate-500 hover:bg-slate-50"
                                }`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 p-4 w-full text-red-500 hover:bg-red-50 rounded-2xl transition-all font-bold"
                    >
                        <HiOutlineLogout size={24} />
                        <span>تسجيل الخروج</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 p-4 md:p-10 overflow-y-auto w-full">

                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden p-3 bg-white rounded-2xl shadow-sm text-slate-600 border border-slate-100"
                        >
                            <HiMenuAlt1 size={24} />
                        </button>


                        <h1 className="text-2xl md:text-3xl font-black text-slate-800 mr-2">
                            {activeTab === "stats" && "ملخص النظام"}
                            {/* ... */}
                        </h1>
                    </div>

                    <button className="px-4 py-2 bg-blue-600 rounded-xl text-white text-[10px] font-bold tracking-widest uppercase shadow-lg shadow-blue-200"

                        onClick={() => navigate('/')}
                    >
                        <span className="font-bold text-sm">العودة للموقع</span>
                    </button>
                </header>
                {/* Stat Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10">
                    <StatCard label="إجمالي الكتب" value={books.length} icon={<HiOutlineBookOpen />} color="bg-blue-500" />
                    <StatCard label="المستخدمين" value={users.length} icon={<HiOutlineUsers />} color="bg-emerald-500" />
                    <StatCard label="التصنيفات" value={categories.length} icon={<HiOutlineTag />} color="bg-amber-500" />
                    {/* <StatCard label="الأمان" value="نشط" icon={<HiOutlineShieldCheck />} color="bg-rose-500" /> */}
                </div>

                {/* Dynamic Content Area */}
                <div className={`${activeTab === "add-book" || activeTab === "rules" ? "" : "bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden"}`}>

                    {loading ? (
                        <div className="p-20 text-center text-slate-400 font-bold">جاري تحميل البيانات...</div>
                    ) : (
                        <>
                            {activeTab === "stats" && <BooksTable books={books.slice(0, 5)} />}
                            {activeTab === "books" && <BooksTable books={books} />}
                            {activeTab === "users" && <UsersTable users={users} />}
                            {activeTab === "add-book" && (
                                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-6 md:p-8">
                                    <AddBookForm />
                                </div>
                            )}
                            {activeTab === "rules" && (
                                <div className="space-y-6 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100">
                                            <h3 className="text-xl font-bold text-blue-600 mb-6 flex items-center gap-2">
                                                <HiOutlineBookOpen size={28} /> إرشادات الرفع
                                            </h3>
                                            <ul className="space-y-4 text-slate-600 font-medium text-sm">
                                                <li>• يجب أن يكون الغلاف بجودة عالية.</li>
                                                <li>• الوصف يجب أن يكون دقيقاً وشاملاً.</li>
                                            </ul>
                                        </div>
                                        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100">
                                            <h3 className="text-xl font-bold text-red-600 mb-6 flex items-center gap-2">
                                                <HiOutlineExclamationCircle size={28} /> صلاحيات الإدارة
                                            </h3>
                                            <p className="text-sm text-slate-500">تغيير الرتب مسؤولية المالك فقط. يمنع مشاركة حساب المسؤول مع أي طرف آخر.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;