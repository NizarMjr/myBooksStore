import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { FaStar } from "react-icons/fa";

const Recommendations = () => {
    const [recommended, setRecommended] = useState([]);

    useEffect(() => {
        const fetchRecommended = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/?limit=6`);
                const data = await res.json();
                setRecommended(data.books || []);
            } catch (err) {
                console.error("Error fetching recommendations", err);
            }
        };
        fetchRecommended();
    }, []);

    if (recommended.length === 0) return null;

    return (
        <div className="bg-gradient-to-b from-white to-slate-50 py-16 overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Header Section */}
                <div className="flex justify-between items-end mb-10" dir="rtl">
                    <div>
                        <span className="text-blue-600 font-bold text-sm tracking-widest uppercase mb-2 block">
                            اختياراتنا لك
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900">
                            كتب ننصح بها
                        </h2>
                    </div>
                    <Link to="/all-books" className="hidden md:block text-slate-500 hover:text-blue-600 font-bold transition-colors">
                        عرض الكل ←
                    </Link>
                </div>

                {/* Swiper Container */}
                <Swiper
                    dir="rtl"
                    slidesPerView={1}
                    spaceBetween={30}
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true
                    }}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true
                    }}
                    navigation={true}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                        1280: { slidesPerView: 4.5 },
                    }}
                    modules={[Pagination, Navigation, Autoplay]}
                    className="recommend-swiper !pb-14 !px-2"
                >
                    {recommended.filter(book => book.isActive).map((book) => (
                        <SwiperSlide key={book._id}>
                            <Link to={`/books/${book._id}`} className="group">
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

                                    </div>
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default Recommendations;