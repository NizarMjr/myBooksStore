import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const UsersTable = ({ users, setUsers }) => {
    const { user: userAuth, authFetch } = useAuth();
    const handleDeleteUser = async (id) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا المستخدم نهائياً؟ لا يمكن التراجع عن هذا الإجراء.')) {
            return;
        }

        try {
            const res = await authFetch(`${process.env.REACT_APP_SERVER_URL}/user/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setUsers(prevUsers => prevUsers.filter(user => user._id !== id));
                alert('تم حذف المستخدم بنجاح');
            } else {
                const errorData = await res.json();
                alert(errorData.message || 'فشل حذف المستخدم');
            }
        } catch (err) {
            console.error('Delete Error:', err);
            alert('حدث خطأ أثناء الاتصال بالسيرفر');
        }
    };
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-right">
                <thead className="bg-slate-50 text-slate-400 text-xs uppercase">
                    <tr>
                        <th className="px-8 py-4">المستخدم</th>
                        <th className="px-8 py-4">الدور</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {users.map((user) => (
                        <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                    {/* عرض الصورة الشخصية */}
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-10 h-10 rounded-full object-cover border border-slate-200"

                                    />
                                    <div>
                                        <Link to={`/user/${user._id}`}>
                                            <p className="font-bold text-slate-800 hover:text-blue-600 transition-colors">
                                                {user.name}
                                            </p>
                                        </Link>
                                        <p className="text-xs text-slate-400">{user.email}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-6 flex items-center justify-between">
                                <span className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-black transition-all shadow-sm ${user.role === 'owner'
                                    ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-amber-200'
                                    : user.role === 'admin'
                                        ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                                    }`}>
                                    {user.role === 'owner' && (
                                        <span className="text-lg">👑</span>
                                    )}
                                    <span>
                                        {user.role === 'owner' ? 'صاحب الموقع' : user.role === 'admin' ? 'مدير' : 'مستخدم'}
                                    </span>
                                </span>
                                {
                                    userAuth.role === 'owner' && user.role !== 'owner' && (
                                        <button
                                            onClick={() => handleDeleteUser(user._id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 font-semibold rounded-lg hover:bg-rose-600 hover:text-white transition-all duration-300 shadow-sm active:scale-95 group"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 transform group-hover:rotate-12 transition-transform"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            <span>حذف</span>
                                        </button>
                                    )
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
};

export default UsersTable;