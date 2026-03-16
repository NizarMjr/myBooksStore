import { useState } from "react";
import ProgressBarLoader from './ProgressBarLoader';
import GoogleLoginButton from "./GoogleLoginButton";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

// In your Login component
const Login = () => {
    const { login, authFetch } = useAuth()
    const [isConnecting, setIsConnecting] = useState(false);
    const navigate = useNavigate();
    const handleGoogleSuccess = async (response) => {
        setIsConnecting(true);
        try {

            const res = await authFetch(`${process.env.REACT_APP_SERVER_URL}/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: response.credential })
            });

            if (!res.ok) {
                throw new Error('Server error');
            }

            const data = await res.json();

            if (data.accessToken) {
                login(data.accessToken, data.user);
                navigate('/');
            }
        } catch (error) {
            console.error('Login Error:', error);
            alert("حدث خطأ في تسجيل الدخول");
        } finally {
            setIsConnecting(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[200px]">
            {isConnecting ? (
                <ProgressBarLoader />
            ) : (
                <>
                    <GoogleLoginButton onSuccess={handleGoogleSuccess} />
                    <p className="text-sm text-gray-500 mt-4">
                        تسجيل الدخول باستخدام حساب جوجل
                    </p>
                </>
            )}
        </div>
    );
};

export default Login;