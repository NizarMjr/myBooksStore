import { useState } from "react";
import { FaComment } from "react-icons/fa"
import { useAuth } from "../hooks/useAuth";

const AddComments = ({ bookId }) => {
    const [comment, setComment] = useState("");
    const { user } = useAuth();
    const { authFetch } = useAuth();


    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("يرجى تسجيل الدخول لإضافة تعليق")
            return;
        }

        try {
            const res = await authFetch(`${process.env.REACT_APP_SERVER_URL}/books/${bookId}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ comment, bookId, userId: user._id }),
            });
            const data = await res.json();
            if (res.ok) {
                alert("تم إضافة تعليقك بنجاح!");
                setComment("");
            } else {
                alert("فشل إضافة التعليق: " + data.message)
            }
        }
        catch (err) {
            console.log("Error submitting comment", err);
        }
    };

    return (

        < div className="mt-12 bg-white shadow-md rounded-xl p-8 max-w-4xl mx-auto" >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FaComment className="text-slate-600" /> التعليقات والمراجعات
            </h2>

            <form onSubmit={handleCommentSubmit} className="space-y-4">
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="شاركنا رأيك في هذا الكتاب..."
                    className="w-full p-4 border-2 border-slate-100 rounded-lg focus:border-blue-500 outline-none transition resize-none h-32"
                ></textarea>
                <button
                    type="submit"
                    className="bg-slate-800 text-white py-2 px-8 rounded-lg font-bold hover:bg-black transition"
                >
                    إرسال التعليق
                </button>
            </form>
        </div >
    )
}
export default AddComments;