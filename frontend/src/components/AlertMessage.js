import { useEffect } from "react";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";

const AlertMessage = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const isSuccess = type === "success";

    return (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[999] w-[90%] max-w-md">
            <div className={`
        flex items-center gap-4 p-4 rounded-3xl shadow-2xl border backdrop-blur-md
        animate-in fade-in zoom-in slide-in-from-top-8 duration-300
        ${isSuccess
                    ? "bg-emerald-50/90 border-emerald-200 text-emerald-800"
                    : "bg-rose-50/90 border-rose-200 text-rose-800"}
      `}>
                <div className={`p-2 rounded-2xl ${isSuccess ? "bg-emerald-200/50" : "bg-rose-200/50"}`}>
                    {isSuccess ? <HiCheckCircle size={28} /> : <HiXCircle size={28} />}
                </div>

                <div className="flex-1">
                    <p className="font-black text-sm tracking-tight">{isSuccess ? "عملية ناجحة" : "خطأ في التنفيذ"}</p>
                    <p className="text-xs font-bold opacity-80">{message}</p>
                </div>

                <button onClick={onClose} className="p-1 hover:opacity-50 transition-opacity">
                    <HiXCircle size={20} className="opacity-40" />
                </button>

                <div className={`absolute bottom-0 left-4 right-4 h-1 rounded-full overflow-hidden bg-black/5`}>
                    <div className={`h-full animate-progress ${isSuccess ? "bg-emerald-500" : "bg-rose-500"}`} />
                </div>
            </div>
        </div>
    );
};

export default AlertMessage;