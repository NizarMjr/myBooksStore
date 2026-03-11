import { FaSearch, FaChevronDown } from "react-icons/fa";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { useAuth } from "../hooks/useAuth";

const BookFilter = ({ onFilterChange }) => {
    const { categories } = useAuth();

    return (
        <div className="relative z-20" dir="rtl">
            <div className="bg-white p-2 md:p-3 rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-slate-100/50 backdrop-blur-md">
                <div className="flex flex-col md:flex-row items-center gap-2">

                    <div className="relative flex-[2] w-full group">
                        <span className="absolute inset-y-0 right-4 flex items-center pr-1 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                            <FaSearch size={18} />
                        </span>
                        <input
                            type="text"
                            placeholder="ابحث عن عنوان، مؤلف، أو كلمة مفتاحية..."
                            className="w-full pr-12 pl-4 py-4 bg-slate-50/80 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all duration-300 outline-none text-slate-700 font-medium placeholder:text-slate-400"
                            onChange={(e) => onFilterChange("search", e.target.value)}
                        />
                    </div>

                    <div className="hidden md:block w-[1px] h-10 bg-slate-200/60 mx-1"></div>

                    <div className="relative flex-1 w-full group">
                        <span className="absolute inset-y-0 right-4 flex items-center pr-1 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none">
                            <HiOutlineAdjustmentsHorizontal size={22} />
                        </span>
                        <select
                            className="w-full pr-12 pl-10 py-4 bg-slate-50/80 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 appearance-none outline-none text-slate-700 font-bold cursor-pointer transition-all duration-300"
                            onChange={(e) => onFilterChange("category", e.target.value)}
                        >
                            <option value="All">جميع الأقسام</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>

                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-300 group-hover:text-blue-500 transition-colors">
                            <FaChevronDown size={12} />
                        </div>
                    </div>

                </div>
            </div>

            <div className="flex justify-start px-6 mt-3">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                    تحديث فوري للنتائج
                </p>
            </div>
        </div>
    );
};

export default BookFilter;