import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

const AlsoSee = ({ catId, currentBookId }) => {
    const { token } = useAuth();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookAlso = async () => {
        if (!catId) return;
        try {
            setLoading(true);
            const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/favorites/?category=${catId}&limit=4`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            const data = await res.json();

            if (res.ok && data.books) {
                const filteredBooks = data.books.filter(b => b._id !== currentBookId);
                setBooks(filteredBooks);
            }
        }
        catch (err) {
            console.log("Fetch books error", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchBookAlso();
    }, [catId, currentBookId]);

    if (loading) return <div className="text-center py-10 text-slate-400">جاري جلب كتب مشابهة...</div>;
    if (books.length === 0) return null;

    return (
        <div className="mt-20 border-t border-slate-100 pt-12" dir="rtl">
            <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                كتب من نفس القسم
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {books.map(book => (
                    <Link to={`/books/${book._id}`} key={book._id} className="group">
                        <div className="bg-slate-50 rounded-2xl p-4 transition-all hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 border border-transparent hover:border-blue-100">
                            <img
                                src={book.cover}
                                alt={book.title}
                                className="w-full h-48 object-cover rounded-xl shadow-md mb-4 group-hover:-translate-y-2 transition-transform duration-300"
                            />
                            <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{book.title}</h4>
                            <p className="text-slate-400 text-xs mt-1">{book.author}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default AlsoSee;