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
    const [activeTab, setActiveTab] = useState("books");
    const [loading, setLoading] = useState(false);
    const { authFetch, categories } = useAuth()
    const navigate = useNavigate();

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

            <aside className="fixed lg:static bottom-0 lg:inset-y-0 right-0 z-[70] w-full lg:w-72 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col h-auto lg:h-screen transition-all duration-300">

                <div className="hidden lg:flex p-8 items-center border-b border-slate-50">
                </div>

                <nav className="flex lg:flex-col flex-1 px-2 lg:px-4 py-2 lg:py-6 space-y-0 lg:space-y-3 overflow-x-auto lg:overflow-y-auto justify-around lg:justify-start items-center lg:items-stretch">
                    {[
                        { id: "books", label: "إدارة الكتب", icon: <HiOutlineBookOpen /> },
                        { id: "add-book", label: "إضافة كتاب", icon: <HiOutlinePlusCircle /> },
                        { id: "users", label: "المستخدمين", icon: <HiOutlineUsers /> },
                        // { id: "stats", label: "الملخص", icon: <HiOutlineViewGrid /> },
                        // { id: "rules", label: "القوانين", icon: <HiOutlineShieldCheck />, special: true },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex flex-col lg:flex-row items-center gap-1 lg:gap-4 p-2 lg:p-4 rounded-xl lg:rounded-2xl transition-all duration-200 shrink-0 lg:w-full ${activeTab === item.id
                                ? (item.special ? "bg-amber-50 text-amber-600 shadow-sm" : "bg-blue-600 text-white shadow-lg shadow-blue-200")
                                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                                }`}
                        >
                            <div className="text-2xl lg:text-2xl">
                                {item.icon}
                            </div>

                            <span className="text-[10px] lg:text-sm font-bold tracking-wide">
                                {item.label}
                            </span>

                            {activeTab === item.id && (
                                <div className="hidden lg:block ml-auto w-1.5 h-1.5 rounded-full bg-current" />
                            )}
                        </button>
                    ))}
                </nav>
            </aside>

            <main className="flex-1 p-4 md:p-10 overflow-y-auto w-full">

                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl md:text-3xl font-black text-slate-800 mr-2">
                            {activeTab === "books" && "إدارة الكتب"}
                            {activeTab === "add-book" && "إضافة كتاب"}
                            {activeTab === "users" && "المستخدمين"}
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
                            {activeTab === "users" && <UsersTable users={users} setUsers={setUsers} />}
                            {activeTab === "add-book" && (
                                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-6 md:p-8">
                                    <AddBookForm />
                                </div>
                            )}
                            {/* {activeTab === "rules" && (
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
                            )} */}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;