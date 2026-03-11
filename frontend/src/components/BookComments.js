import { useEffect, useState } from "react";
import { FaUserCircle, FaShieldAlt, FaUserTie } from "react-icons/fa";
import { Link } from "react-router-dom";

const BookComments = ({ bookId }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/books/${bookId}/comments`);
                const data = await res.json();
                setComments(data.comments || []);
            } catch (err) {
                console.log("Error fetching comments", err);
            } finally {
                setLoading(false);
            }
        };

        if (bookId) fetchComments();

    }, [bookId]);

    // دالة لتنسيق شكل الـ Badge حسب الرتبة
    const renderRoleBadge = (role) => {
        if (role === "owner") {
            return (
                <span className="flex items-center gap-1 bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full border border-amber-200 font-bold">
                    <FaShieldAlt className="text-[8px]" /> صاحب الموقع
                </span>
            );
        }
        if (role === "admin") {
            return (
                <span className="flex items-center gap-1 bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full border border-blue-200 font-bold">
                    <FaUserTie className="text-[8px]" /> مشرف
                </span>
            );
        }
        return null;
    };

    if (loading) return <div className="text-center py-10 text-slate-400">جاري تحميل التعليقات...</div>;

    return (
        <div className="mt-12 border-t border-slate-100 pt-8" dir="rtl">
            <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-2">
                <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                آراء القراء ({comments.length})
            </h3>

            {comments.length > 0 ? (
                <div className="space-y-8">
                    {comments.map((comment) => (
                        <div key={comment._id} className="flex gap-4 group">
                            {/* صورة المستخدم */}
                            <div className="flex-shrink-0">
                                {comment.user?.profilePic ? (
                                    <Link to={`/user/${comment.user._id}`}>
                                        <img
                                            src={comment.user.profilePic}
                                            alt={comment.user.name}
                                            className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100 shadow-sm"
                                        />
                                    </Link>
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                                        <FaUserCircle size={30} />
                                    </div>
                                )}
                            </div>

                            {/* محتوى التعليق */}
                            <div className="flex-1">
                                <div className="bg-slate-50 p-5 rounded-2xl rounded-tr-none border border-transparent group-hover:border-blue-100 group-hover:bg-white transition-all duration-300">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <Link to={`/user/${comment.user._id}`}>
                                                    <span className="font-bold text-slate-900 text-sm">
                                                        {comment.user?.name || "قارئ مجهول"}
                                                    </span>
                                                </Link>
                                                {/* عرض الرتبة هنا */}
                                                {renderRoleBadge(comment.user?.role)}
                                            </div>
                                        </div>

                                        {/* التاريخ بالأرقام الإنجليزية */}
                                        <span className="text-[10px] text-slate-400 font-mono bg-white px-2 py-1 rounded-md shadow-sm border border-slate-100">
                                            {new Date(comment.createdAt).toLocaleDateString('en-GB', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        {comment.text}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-slate-50 rounded-2xl py-12 text-center border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 italic font-medium text-sm">
                        لا توجد مراجعات لهذا الكتاب بعد.
                    </p>
                </div>
            )}
        </div>
    );
};

export default BookComments;