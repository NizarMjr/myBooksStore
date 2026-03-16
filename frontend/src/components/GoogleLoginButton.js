import { useEffect, useRef } from 'react';

const GoogleLoginButton = ({ onSuccess }) => {
    const buttonRef = useRef(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        script.onload = () => {
            if (window.google) {
                window.google.accounts.id.initialize({
                    client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
                    callback: onSuccess,
                    auto_select: false,
                    ux_mode: 'popup',
                    context: 'signin'
                });

                window.google.accounts.id.renderButton(
                    buttonRef.current,
                    {
                        theme: 'outline', // يمكنك تجربة 'filled_blue' لشكل أقوى
                        size: 'large',
                        type: 'standard',
                        shape: 'pill', // شكل دائري الحواف يتماشى مع التصاميم الحديثة
                        logo_alignment: 'left',
                        width: '320', // زيادة العرض ليعطي فخامة أكثر
                        text: 'signin_with',
                        locale: 'ar'
                    }
                );
            }
        };

        return () => {
            if (script.parentNode) {
                document.body.removeChild(script);
            }
        };
    }, [onSuccess]);

    return (
        /* حاوية التصميم الخارجي */
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-xl border border-gray-100 max-w-sm mx-auto transform transition-all hover:scale-[1.02]">

            {/* أيقونة تجميلية أو شعار بسيط فوق الزر */}
            <div className="mb-6 bg-blue-50 p-4 rounded-full">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">مرحباً بك مجدداً</h2>
            <p className="text-sm text-gray-500 mb-8 text-center px-4">
                سجل دخولك للوصول إلى كتبك المفضلة ومتابعة قراءاتك
            </p>

            {/* زر جوجل الفعلي */}
            <div className="relative group">
                {/* طبقة إضافية خفيفة خلف الزر لإضافة توهج خفيف (Glow) */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-300"></div>

                <div ref={buttonRef} className="relative transition-all duration-300"></div>
            </div>

            <div className="mt-6 flex items-center gap-2">
                <div className="h-px w-8 bg-gray-200"></div>
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">أمان عالي بواسطة Google</span>
                <div className="h-px w-8 bg-gray-200"></div>
            </div>
        </div>
    );
};

export default GoogleLoginButton;