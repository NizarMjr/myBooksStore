import { useState } from "react";
import { FaComment } from "react-icons/fa"
import { useAuth } from "../hooks/useAuth";
import AlertMessage from "./AlertMessage";

const AddComments = ({ bookId }) => {
    const [comment, setComment] = useState("");
    const { user } = useAuth();
    const { authFetch } = useAuth();
    const [alert, setAlert] = useState({
        show: false,
        message: "",
        type: ""
    });
    const handleCloseAlert = () => {
        setAlert({ ...alert, show: false });
    }
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setAlert({ ...alert, show: true, message: "يرجى تسجيل الدخول لإضافة تعليق", type: "error" });
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
                setAlert({ ...alert, show: true, message: "تم إضافة تعليقك بنجاح!", type: "success" });
                setComment("");
            } else {
                setAlert({ ...alert, show: true, message: "فشل إضافة التعليق: " + data.message, type: "error" });

            }
        }
        catch (err) {
            console.log("Error submitting comment", err);
        }
    };
    return (
        < div className="mt-12 bg-white shadow-md rounded-xl p-8 max-w-4xl mx-auto" >
            {alert.show && <AlertMessage message={alert.message} type={alert.type} onClose={handleCloseAlert} />}
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