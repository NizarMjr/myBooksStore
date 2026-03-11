import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-10 mt-20">
            <div className="container mx-auto grid md:grid-cols-3 gap-10 px-4">
                <div>
                    <h2 className="text-xl font-bold mb-4">عن الموقع</h2>
                    <p className="text-gray-400">
                        هذا الموقع عبارة عن مكتبة إلكترونية تعرض أحدث الكتب في جميع المجالات.
                        يمكن للمستخدمين تصفح الكتب وقراءتها أو تحميلها مباشرة.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-bold mb-4">روابط سريعة</h2>
                    <ul className="space-y-2 text-gray-400">
                        <li><a className="hover:text-white transition">الرئيسية</a></li>
                        <li><a className="hover:text-white transition">أقسام الكتب</a></li>
                        <li><a className="hover:text-white transition">البحث عن كتاب</a></li>
                        <li><a className="hover:text-white transition">اتصل بنا</a></li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-xl font-bold mb-4">تواصل معنا</h2>
                    <p className="text-gray-400 mb-4">
                        البريد الإلكتروني: info@bookstore.com <br />
                        الهاتف:  141 438 20
                    </p>
                    <div className="flex space-x-4">
                        <a className="bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition">
                            <FaFacebookF />
                        </a>
                        <a className="bg-blue-400 p-2 rounded-full hover:bg-blue-500 transition">
                            <FaTwitter />
                        </a>
                        <a className="bg-pink-500 p-2 rounded-full hover:bg-pink-600 transition">
                            <FaInstagram />
                        </a>
                    </div>
                </div>
            </div>

            <div className="mt-10 text-center text-gray-500 text-sm">
                جميع الحقوق محفوظة © 2026 مكتبة إلكترونية
            </div>
        </footer>
    );
};

export default Footer;
