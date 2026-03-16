import { useState, useEffect } from "react";
import { HiOutlineUserCircle, HiOutlineMail, HiOutlineShieldCheck, HiOutlineCalendar, HiOutlineArrowCircleDown, HiOutlineArrowCircleUp } from "react-icons/hi";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const UserDetails = () => {
    const [userDetail, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const { user, authFetch } = useAuth();
    const fetchUser = async () => {
        try {
            const res = await authFetch(`${process.env.REACT_APP_SERVER_URL}/user/${id}`);
            const data = await res.json();
            if (res.ok) {
                setUser(data.user);
            }
        } catch (err) {
            console.error("Error fetching user:", err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!user) {
            alert("يرجى تسجيل الدخول");
            onBack();
        }
        fetchUser();

    }, [id]);

    const onBack = () => {
        window.location.href = '/';
    }

    const updateRole = async (id, newRole) => {
        try {
            const res = await authFetch(`${process.env.REACT_APP_SERVER_URL}/admin/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole }),
            });

            const data = await res.json();

            if (res.ok) {
                alert("تم تحديث الرتبة بنجاح");
                if (setUser) {
                    setUser(prev => ({ ...prev, role: newRole }));
                }
            } else {
                alert(`فشل التحديث: ${data.message || "خطأ غير معروف"}`);
            }
        } catch (err) {
            console.error("Error updating role:", err);
            alert("حدث خطأ في الاتصال بالسيرفر");
        }
    };
    if (loading) return (
        <div className="flex justify-center items-center p-20 text-slate-400 animate-pulse font-bold">
            جاري تحميل بيانات المستخدم...
        </div>
    );

    if (!user) return (
        <div className="p-10 text-center bg-red-50 text-red-500 rounded-3xl border border-red-100 font-bold">
            لم يتم العثور على بيانات هذا المستخدم!
        </div>
    );

    return (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Profile Cover Area */}
            <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                <div className="absolute -bottom-12 right-10 bg-white p-2 rounded-[2rem] shadow-md">
                    {userDetail &&
                        <img
                            src={userDetail.avatar || 'https://via.placeholder.com/40'}
                            alt={userDetail.name}
                            className="rounded-full border-2 border-blue-500 object-cover hover:opacity-80 transition-opacity"
                            onError={(e) => e.target.src = 'https://via.placeholder.com/40'}
                        />}
                </div>
            </div>

            <div className="p-12 pt-16">
                <div className="flex justify-between items-start mb-10">
                    <div>
                        <h2 className="text-3xl font-black text-slate-800">{userDetail.name}</h2>
                        <span className={`mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase ${userDetail.role === 'owner' ? 'bg-purple-100 text-purple-700' :
                            userDetail.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                            }`}>
                            <HiOutlineShieldCheck /> {userDetail.role}
                        </span>
                    </div>
                    {onBack && (
                        <button onClick={onBack} className="px-6 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition">
                            عودة للقائمة
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* معلومات الاتصال */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="bg-white p-3 rounded-xl shadow-sm text-blue-500">
                                <HiOutlineMail size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold">البريد الإلكتروني</p>
                                <p className="font-bold text-slate-700">{userDetail.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="bg-white p-3 rounded-xl shadow-sm text-amber-500">
                                <HiOutlineCalendar size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold">تاريخ الانضمام</p>
                                <p className="font-bold text-slate-700">
                                    {new Date(userDetail.createdAt).toLocaleDateString('EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* إحصائيات سريعة أو حالة النشاط */}
                    <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 shadow-sm">
                        <h4 className="font-black text-blue-800 mb-6 uppercase tracking-wider text-xs flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                            نظرة سريعة على النشاط
                        </h4>

                        <div className="space-y-4">
                            {/* حالة الحساب */}
                            <div className="flex justify-between items-center py-2 border-b border-blue-100/50">
                                <span className="text-blue-600/70 text-sm font-bold">حالة الحساب</span>

                                <span className={`px-3 py-1 rounded-full font-black text-[10px] uppercase flex items-center gap-1.5 ${userDetail.isActive
                                    ? 'bg-emerald-100 text-emerald-600'
                                    : 'bg-slate-100 text-slate-500'
                                    }`}>
                                    {/* نقطة صغيرة ملونة للحالة */}
                                    <span className={`w-1.5 h-1.5 rounded-full ${userDetail.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                                        }`}></span>

                                    {userDetail.isActive ? 'نشط الآن' : 'غير نشط'}
                                </span>
                            </div>

                            {/* آخر ظهور */}
                            <div className="flex justify-between items-center py-2 border-b border-blue-100/50">
                                <span className="text-blue-600/70 text-sm font-bold">آخر تسجيل دخول</span>
                                <span className="text-blue-900 font-bold text-xs italic">
                                    {userDetail.lastActive ? new Date(userDetail.lastActive).toLocaleString('EG', {
                                        dateStyle: 'short',
                                        timeStyle: 'short'
                                    }) : 'غير متوفر'}
                                </span>
                            </div>

                            {/* إحصائيات الأرقام */}
                            <div className="grid grid-cols-2 gap-3 mt-6">
                                {/* التحميلات */}
                                <div className="bg-white p-4 rounded-2xl border border-blue-100 flex flex-col items-center shadow-sm">
                                    <span className="text-2xl font-black text-blue-900">{userDetail.downloadCount || 0}</span>
                                    <span className="text-[10px] font-bold text-blue-400 uppercase">تحميل</span>
                                </div>

                                {/* المرفوعات */}
                                <div className="bg-white p-4 rounded-2xl border border-blue-100 flex flex-col items-center shadow-sm">
                                    <span className="text-2xl font-black text-blue-900">{userDetail.uploadCount || 0}</span>
                                    <span className="text-[10px] font-bold text-blue-400 uppercase">كتاب مرفوع</span>
                                </div>

                                {/* المراجعات/التعليقات */}
                                <div className="bg-white p-4 rounded-2xl border border-blue-100 flex flex-col items-center shadow-sm">
                                    <span className="text-2xl font-black text-blue-900">{userDetail.numberOfComments || 0}</span>
                                    <span className="text-[10px] font-bold text-blue-400 uppercase">تعليق</span>
                                </div>

                                {/* الكتب المفضلة */}
                                <div className="bg-white p-4 rounded-2xl border border-blue-100 flex flex-col items-center shadow-sm">
                                    <span className="text-2xl font-black text-rose-600">{userDetail.favoriteBooks.length || 0}</span>
                                    <span className="text-[10px] font-bold text-rose-300 uppercase">في المفضلة</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {userDetail.role !== 'owner' && user.role === 'owner' && (
                        <div className="px-8 py-6 flex items-center gap-4">
                            <button
                                onClick={() => updateRole(userDetail._id, userDetail.role === 'admin' ? 'user' : 'admin')}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 shadow-sm ${userDetail.role === 'admin'
                                    ? "bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200"
                                    : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200"
                                    }`}
                            >
                                {userDetail.role === 'admin' ? (
                                    <HiOutlineArrowCircleDown size={18} />
                                ) : (
                                    <HiOutlineArrowCircleUp size={18} />
                                )}

                                <span>
                                    {userDetail.role === 'admin' ? 'تنزيل لرتبة مستخدم' : 'ترقية لرتبة مدير'}
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDetails;