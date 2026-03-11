import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaBookOpen, FaDownload, FaHome, FaHeart, FaRegHeart } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import AddComments from "./AddComments";
import BookComments from "./BookComments";
import AlsoSee from "./AlsoSee";

const BookDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [favoriteBooks, setFavoriteBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const { user, authFetch, setFavorites } = useAuth();

    useEffect(() => {
        const getBook = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/books/${id}`);
                const data = await res.json();
                setBook(data);
                console.log(data);

            } catch (err) {
                console.log("Error fetching book", err);
            } finally {
                setLoading(false);
            }
        };

        const fetchFavoriteBooks = async () => {
            try {
                const res = await authFetch(`${process.env.REACT_APP_SERVER_URL}/user/favorites`);
                const data = await res.json();
                if (res.ok) {
                    setFavoriteBooks(data.favorites);
                }
            } catch (err) {
                console.error("Error fetching favorites:", err);
            }
        };

        getBook();
        fetchFavoriteBooks();
    }, [id]);

    useEffect(() => {
        if (favoriteBooks.length > 0 && id) {
            const found = favoriteBooks.some(fav => (fav._id === id || fav === id));
            setIsFavorite(found);
        }
    }, [favoriteBooks, id]);

    const handleFavorite = async () => {
        if (!user) {
            alert("يرجى تسجيل الدخول");
            return;
        }

        const wasFavorite = isFavorite;

        setIsFavorite(!wasFavorite);

        if (wasFavorite) {
            setFavorites(prev => prev.filter(fav => (fav._id !== id && fav !== id)));
        } else {
            setFavorites(prev => [...prev, { _id: id }]);
        }

        try {
            const res = await authFetch(`${process.env.REACT_APP_SERVER_URL}/books/${id}/favorite`, {
                method: 'POST'
            });

            if (!res.ok) {
                throw new Error("Failed");
            }

        } catch (err) {
            setIsFavorite(wasFavorite);
            const refetch = await authFetch(`${process.env.REACT_APP_SERVER_URL}/user/favorites`);
            const data = await refetch.json();
            setFavorites(data.favorites);
            alert("حدث خطأ، تم التراجع عن التغيير");
        }
    };


    const handleRead = (fileUrl) => {
        if (!fileUrl || fileUrl.includes('[object')) {
            alert("هذا الرابط معطوب، يرجى إعادة رفع الكتاب");
            return;
        }
        window.open(fileUrl, '_blank');
    };
    const handleDownload = async (fileUrl, bookTitle) => {
        if (!fileUrl) return alert("الرابط غير متوفر");

        try {
            const response = await fetch(fileUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${bookTitle || 'book'}.pdf`);

            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            window.open(fileUrl, '_blank');
        }
    };

    if (loading) return <div className="text-center mt-20 text-xl">جارٍ التحميل...</div>;
    if (!book) return <div className="text-center mt-20 text-xl text-red-500">الكتاب غير موجود</div>;

    return (
        <div className="container mx-auto mt-10 p-4 mb-20 text-right" dir="rtl">
            <div className="grid md:grid-cols-2 gap-10 bg-white shadow-lg rounded-xl p-6">

                {/* Book Cover & Favorite Toggle */}
                <div className="relative group">
                    <img
                        src={book.cover}
                        alt={book.title}
                        className="h-64 object-cover rounded-lg"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                    />
                    <button
                        onClick={handleFavorite}
                        className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-md transition hover:scale-110 active:scale-90"
                    >
                        {isFavorite ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-400" />}
                    </button>
                </div>

                {/* Book Info */}
                <div className="flex flex-col">
                    <h1 className="text-4xl font-extrabold mb-2 text-slate-900">{book.title}</h1>
                    <p className="text-xl text-blue-600 font-medium mb-4">{book.author}</p>

                    <div className="bg-slate-50 p-4 rounded-lg mb-6">
                        <h3 className="font-bold mb-2 text-slate-700">عن الكتاب:</h3>
                        <p className="text-gray-700 leading-relaxed">{book.description}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4 mt-auto">

                        <button
                            onClick={() => handleRead(book.file)}
                            className="w-full md:w-auto flex items-center justify-center gap-3 bg-blue-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-blue-200 active:scale-95"
                        >
                            <FaBookOpen className="text-xl" /> قراءة الكتاب
                        </button>

                        <button
                            onClick={() => handleDownload(book.file)}
                            className="w-full md:w-auto flex items-center justify-center gap-3 bg-emerald-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-emerald-700 transition-all duration-300 shadow-md hover:shadow-emerald-200 active:scale-95"
                        >
                            <FaDownload className="text-xl" /> تحميل PDF
                        </button>

                        <button
                            onClick={() => navigate("/")}
                            className="w-full md:w-auto flex items-center justify-center gap-3 bg-slate-800 text-white py-3 px-6 rounded-lg font-bold hover:bg-black transition-all duration-300 shadow-md hover:shadow-slate-400 active:scale-95"
                        >
                            <FaHome className="text-xl" /> العودة للرئيسية
                        </button>
                    </div>
                </div >
            </div >

            {/* Comments Section */}
            <AddComments bookId={book._id} />
            <BookComments bookId={book._id} />
            <AlsoSee catId={book.category} currentBookId={book._id} />
        </div >
    );
};

export default BookDetail;