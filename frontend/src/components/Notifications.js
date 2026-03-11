import { IoNotificationsCircle } from "react-icons/io5";
import { useAuth } from "../hooks/useAuth";

const Notifications = () => {
    const { user, setUser, authFetch } = useAuth();

    const hasNotification = user?.notification && user.notification.trim() !== "";

    const resetNotification = async () => {
        const originalNotification = user.notification;

        setUser(prev => ({ ...prev, notification: "" }));

        try {
            const res = await authFetch(`${process.env.REACT_APP_SERVER_URL}/notification/reset`, {
                method: 'POST',
            });

            if (!res.ok) throw new Error();
        } catch (err) {
            setUser(prev => ({ ...prev, notification: originalNotification }));
            console.error("فشل التنبيهات");
        }
    };
    return (
        <div className="relative group flex flex-col items-center justify-center p-2 cursor-pointer transition-all">
            <div className="relative p-2 rounded-xl group-hover:bg-blue-50 transition-colors duration-300">
                <IoNotificationsCircle className={`text-2xl transition-colors ${hasNotification ? 'text-blue-600' : 'text-slate-400'
                    }`} />

                {hasNotification && (
                    <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600 border border-white"></span>
                    </span>
                )}
            </div>

            <span className="text-[11px] font-bold text-slate-500 mt-1 group-hover:text-blue-800 transition-colors">
                التنبيهات
            </span>

            {hasNotification && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-100 shadow-xl rounded-2xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 transform origin-top-left translate-y-2 group-hover:translate-y-0">
                    <p className="text-xs text-slate-800 font-black mb-2 border-b pb-2">الإشعارات الجديدة</p>
                    <div className="py-2 px-3 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-[11px] text-blue-800 leading-relaxed font-medium">
                            {user.notification}
                        </p>
                    </div>
                    <button onClick={resetNotification} className="w-full mt-3 text-[10px] text-slate-400 hover:text-blue-600 transition-colors font-bold uppercase tracking-tighter">
                        تمت القراءة
                    </button>
                </div>
            )}
        </div>
    );
};

export default Notifications;