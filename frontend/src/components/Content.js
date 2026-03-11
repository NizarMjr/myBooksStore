import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Intro from "./Intro";
import Recommendations from "./Recommendation";
import BookFilter from "./BookFilter";
import { HiOutlineBookOpen, HiSearchCircle } from "react-icons/hi";
import SkeletonCard from "./SkeltonCard";
import { FaStar } from "react-icons/fa";

const Content = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalBooks, setTotalBooks] = useState(0);
    const [filters, setFilters] = useState({ search: "", category: "All" });

    const limit = 8;

    const getBooks = useCallback(async (currentPage, currentFilters) => {
        try {
            setLoading(true);
            let url = `${process.env.REACT_APP_SERVER_URL}/?page=${currentPage}&limit=${limit}`;
            if (currentFilters.search) url += `&search=${encodeURIComponent(currentFilters.search)}`;
            if (currentFilters.category !== "All") url += `&category=${encodeURIComponent(currentFilters.category)}`;

            const res = await fetch(url);
            const data = await res.json();

            if (data.books) {
                setBooks(prev => currentPage === 1 ? data.books : [...prev, ...data.books]);
                setHasMore(currentPage < data.totalPages);
                setTotalBooks(data.totalBooks || 0);

            } else {
                if (currentPage === 1) setBooks([]);
                setHasMore(false);
            }

        } catch (err) {
            console.error('Error fetching books', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getBooks(page, filters);
    }, [page, getBooks]);

    useEffect(() => {
        setPage(1);
        getBooks(1, filters);
    }, [filters, getBooks]);

    const handleFilterUpdate = (type, value) => {
        setFilters(prev => ({ ...prev, [type]: value }));
    };

    return (
        <div className="bg-white min-h-screen pb-20">
            <Intro />
            <Recommendations />

            <div className="container mx-auto px-4 mt-20" dir="rtl">
                <div className="bg-slate-50 p-6 md:p-8 rounded-[2.5rem] mb-12 border border-slate-100 shadow-sm">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
                        <div className="text-right flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <HiOutlineBookOpen className="text-blue-600 text-3xl" />
                                <h2 className="text-3xl font-black text-slate-900 italic">مكتبتنا الشاملة</h2>
                            </div>
                            <p className="text-slate-500 font-medium">
                                تم العثور على <span className="text-blue-600 font-bold">{totalBooks}</span> كتاب مطابق
                            </p>
                        </div>

                        <div className="w-full lg:w-2/3">
                            <BookFilter
                                onFilterChange={handleFilterUpdate}
                            />
                        </div>
                    </div>
                </div>

                <div id="books-section" className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-x-6 gap-y-12">
                    {loading && page === 1 ? (
                        Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
                    ) : (
                        books.map(book => (
                            <Link to={`/books/${book._id}`} key={book._id} className="group h-full">
                                <div className="relative bg-white rounded-3xl p-5 transition-all duration-500 border border-slate-100 group-hover:border-blue-200 group-hover:shadow-[0_20px_50px_rgba(8,112,184,0.1)] h-full flex flex-col">

                                    {/* Book Cover Container */}
                                    <div className="relative mb-6 flex justify-center">
                                        <div className="absolute inset-0 bg-blue-600/5 blur-3xl rounded-full scale-75 group-hover:scale-110 transition-transform duration-500"></div>
                                        <img
                                            src={book.cover}
                                            alt={book.title}
                                            className="h-64 w-44 object-cover rounded-xl shadow-[10px_15px_30px_rgba(0,0,0,0.2)] group-hover:-translate-y-3 group-hover:rotate-2 transition-all duration-500 z-10"
                                        />
                                        {/* Badge */}
                                        <div className="absolute top-0 right-2 z-20 bg-amber-400 text-white p-2 rounded-lg shadow-lg rotate-12 group-hover:rotate-0 transition-transform">
                                            <FaStar size={14} />
                                        </div>
                                    </div>

                                    {/* Book Info */}
                                    <div className="text-right mt-auto">
                                        <p className="text-blue-600 text-[10px] font-bold mb-1 uppercase tracking-tight">
                                            {book.category?.name || "بدون تصنيف"}
                                        </p>
                                        <h3 className="font-black text-slate-800 text-lg line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors">
                                            {book.title}
                                        </h3>
                                        <p className="text-slate-400 text-sm mb-4 font-medium">
                                            {book.author}
                                        </p>

                                        <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                                            <button className="bg-slate-900 text-white text-[10px] px-3 py-1.5 rounded-full transition-opacity">
                                                التفاصيل
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>

                {/* Empty State */}
                {books.length === 0 && !loading && (
                    <div className="py-32 text-center flex flex-col items-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                            <HiSearchCircle className="text-slate-300 text-6xl" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 mb-2">لا توجد نتائج!</h3>
                        <p className="text-slate-400">حاول تجربة كلمات بحث أخرى أو تصنيف مختلف.</p>
                    </div>
                )}

                {/* Pagination Controls */}
                <div className="mt-24 flex flex-col items-center">
                    {hasMore && (
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={loading}
                            className={`group relative px-12 py-4 bg-white border-2 border-slate-900 rounded-full overflow-hidden transition-all duration-300 ${loading ? 'opacity-50' : 'hover:bg-slate-900'}`}
                        >
                            <span className={`relative z-10 font-black text-slate-900 transition-colors duration-300 group-hover:text-white ${loading ? 'animate-pulse' : ''}`}>
                                {loading ? "جاري التحميل..." : "استكشف المزيد"}
                            </span>
                        </button>
                    )}

                    {!hasMore && books.length > 0 && (
                        <div className="flex items-center gap-4 w-full">
                            <div className="h-[1px] bg-slate-100 flex-1"></div>
                            <span className="text-slate-300 text-xs font-bold tracking-widest uppercase">لقد وصلت للنهاية</span>
                            <div className="h-[1px] bg-slate-100 flex-1"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Content;