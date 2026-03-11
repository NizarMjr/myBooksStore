import React from 'react';
import { HiOutlineBookOpen, HiOutlineCollection, HiOutlineDownload, HiOutlineTrendingUp } from "react-icons/hi";
import { Link } from 'react-router-dom';

const Intro = () => {
    return (
        <section className="relative bg-white py-16 lg:py-24 overflow-hidden" dir="rtl">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    <div className="w-full lg:w-1/2 text-right order-2 lg:order-1">
                        <div className="inline-block bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-bold mb-6 border border-blue-100">
                            ✨ وجهتك الأولى للثقافة والمعرفة
                        </div>

                        <p className="text-slate-600 text-lg mb-10 leading-relaxed max-w-xl">
                            انضم إلى مجتمعنا القرائي وتصفح مكتبة ضخمة تضم آلاف العناوين في مختلف المجالات. قراءة، تحميل، ومشاركة شغف المعرفة أصبح الآن أسهل من أي وقت مضى.
                        </p>

                        <div className="grid grid-cols-2 gap-6 mb-12">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 shadow-sm">
                                    <HiOutlineBookOpen size={24} />
                                </div>
                                <span className="font-bold text-slate-700">قراءة مباشرة</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 shadow-sm">
                                    <HiOutlineDownload size={24} />
                                </div>
                                <span className="font-bold text-slate-700">تحميل مجاني</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 shadow-sm">
                                    <HiOutlineCollection size={24} />
                                </div>
                                <span className="font-bold text-slate-700">آلاف التصنيفات</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 shadow-sm">
                                    <HiOutlineTrendingUp size={24} />
                                </div>
                                <span className="font-bold text-slate-700">كتب حصرية</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <a href='#books-section' className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:shadow-none transition-all duration-300">
                                تصفح الكتب
                            </a >
                            <Link to={"/signup"} className="px-10 py-4 bg-slate-50 text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-white hover:border-blue-300 transition-all duration-300">
                                سجل معنا
                            </Link >
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2 order-1 lg:order-2">
                        <div className="relative">
                            <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-100/50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-100/50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

                            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl transform transition-transform hover:scale-[1.02] duration-500">
                                <img
                                    src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1000&q=80"
                                    alt="Library and books"
                                    className="w-full h-[500px] object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"></div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Intro;