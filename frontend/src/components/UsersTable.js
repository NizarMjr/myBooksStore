import { Link } from "react-router-dom";

const UsersTable = ({ users }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-right">
                <thead className="bg-slate-50 text-slate-400 text-xs uppercase">
                    <tr>
                        <th className="px-8 py-4">المستخدم</th>
                        <th className="px-8 py-4">الدور</th>
                        <th className="px-8 py-4">الإجراءات</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {users.map((user) => (
                        <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-6">
                                <Link to={`/user/${user._id}`}>
                                    <p className="font-bold text-slate-800">{user.name.toUpperCase()}</p>
                                </Link>
                                <p className="text-xs text-slate-400">{user.email}</p>
                            </td>
                            <td className="px-8 py-6">
                                <span className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-black transition-all shadow-sm ${user.role === 'owner'
                                    ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-amber-200'
                                    : user.role === 'admin'
                                        ? 'bg-rose-50 text-rose-600 border border-rose-100'
                                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                                    }`}>
                                    {user.role === 'owner' && (
                                        <span className="text-lg">👑</span>
                                    )}
                                    <span>
                                        {user.role === 'owner' ? 'صاحب الموقع' : user.role === 'admin' ? 'مدير' : 'مستخدم'}
                                    </span>
                                </span>
                            </td>
                            
                            {user.role === 'owner' && <td className="px-8 py-6 text-gray-400 italic text-sm">(Owner)</td>}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
};

export default UsersTable;