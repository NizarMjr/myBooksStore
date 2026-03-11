import { useEffect, useState } from "react";
import EditBook from "./EditBook";
import { useAuth } from "../hooks/useAuth";

const BooksTable = ({ books, setBooks }) => {
    const [selectedBook, setSelectedBook] = useState(null);
    const { categories, authFetch } = useAuth();

    const getCategorieName = (id) => {
        const category = categories.find(cat => cat._id === id);
        return category ? category.name : "بدون تصنيف";
    }
    const handleUpdate = (updatedBook) => {
        const updatedList = books.map((b) =>
            b._id === updatedBook._id ? updatedBook : b
        );
        if (setBooks) setBooks(updatedList);
        setSelectedBook(null);
    };

    if (selectedBook) {
        return (
            <div className="p-6 animate-in fade-in duration-300">
                <EditBook
                    book={selectedBook}
                    onCancel={() => setSelectedBook(null)}
                    onUpdate={handleUpdate}
                />
            </div>
        );
    }

    const deleteBook = async (id) => {
        if (!window.confirm("هل أنت متأكد من حذف هذا الكتاب نهائياً؟")) return;

        try {
            const res = await authFetch(`${process.env.REACT_APP_SERVER_URL}/books/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                alert('تم حذف الكتاب بنجاح');
                const filtredBooks = books.filter((book) => book._id !== id);
                setBooks(filtredBooks);
            } else {
                const errorData = await res.json();
                alert(`فشل الحذف: ${errorData.message}`);
            }
        } catch (err) {
            console.log("Error delete book", err);
        }
    };

    return (
        <div className="overflow-x-auto animate-in fade-in duration-300">
            <table className="w-full text-right">
                <thead className="bg-slate-50 text-slate-400 text-xs uppercase">
                    <tr>
                        <th className="px-8 py-4">الكتاب</th>
                        <th className="px-8 py-4">التصنيف</th>
                        <th className="px-8 py-4 text-center">الإجراءات</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {books.map((book) => (
                        <tr key={book._id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-6 flex items-center gap-4">
                                <img
                                    src={book.cover}
                                    alt={book.title}
                                    className="w-10 h-14 object-cover rounded shadow-sm bg-slate-100" onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                                />
                                <div>
                                    <p className="font-bold text-slate-800">{book.title}</p>
                                    <p className="text-xs text-slate-400">{book.author}</p>
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase">
                                    {getCategorieName(book.category)}
                                </span>
                            </td>
                            <td className="px-8 py-6 text-center space-x-4 space-x-reverse">
                                <button
                                    onClick={() => setSelectedBook(book)}
                                    className="text-blue-600 hover:text-blue-800 font-bold text-sm transition-all bg-blue-50 px-3 py-1 rounded-md"
                                >
                                    تعديل
                                </button>

                                <button
                                    onClick={() => deleteBook(book._id)}
                                    className="text-red-600 hover:text-red-800 font-bold text-sm transition-all bg-red-50 px-3 py-1 rounded-md"
                                >
                                    حذف
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {books.length === 0 && (
                <div className="p-20 text-center text-slate-400 italic">
                    لا توجد كتب متاحة حالياً..
                </div>
            )}
        </div>
    );
};

export default BooksTable;