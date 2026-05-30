import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

import { loginUser, registerUser } from "../api/authApi"; 
import axios from "axios"; 

import bgImage from "../assets/images/pizza1.jpg";

const AuthPage = () => {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("login");
    const [loading, setLoading] = useState(false);

    // Form States
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });
    const [registerData, setRegisterData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    // --- FORGOT PASSWORD STATES ---
    const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
    const [forgotData, setForgotData] = useState({
        email: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    // LOGIN HANDLER
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const data = await loginUser(loginData);

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            toast.success("Login Successful 🍕");

            if (data.user.role === "admin") {
                navigate("/admin-dashboard");
            } else {
                navigate("/home");
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Login Failed"
            );
        } finally {
            setLoading(false);
        }
    };

    // REGISTER HANDLER
    const handleRegister = async (e) => {
        e.preventDefault();

        if (registerData.password !== registerData.confirmPassword) {
            return toast.error("Passwords do not match");
        }

        try {
            setLoading(true);
            const payload = {
                name: registerData.name,
                email: registerData.email,
                password: registerData.password,
            };

            const data = await registerUser(payload);

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            toast.success("Account Created Successfully 🍕");
            navigate("/home");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Registration Failed"
            );
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex flex-col bg-[#fdf6f3] overflow-x-hidden relative">
            {/* NAVBAR */}
            <Navbar />

            {/* MAIN SECTION */}
            <div
                className="flex-1 bg-cover bg-center flex items-center justify-center py-5"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.82), rgba(255,255,255,0.82)), url(${bgImage})`,
                }}
            >
                <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                    {/* TABS */}
                    <div className="flex text-sm font-medium border-b">
                        <button
                            onClick={() => setActiveTab("login")}
                            className={`w-1/2 py-4 transition-all duration-300 ${activeTab === "login"
                                ? "text-red-700 border-b-2 border-red-700"
                                : "text-gray-500"
                                }`}
                        >
                            Login
                        </button>

                        <button
                            onClick={() => setActiveTab("register")}
                            className={`w-1/2 py-4 transition-all duration-300 ${activeTab === "register"
                                ? "text-red-700 border-b-2 border-red-700"
                                : "text-gray-500"
                                }`}
                        >
                            Create Account
                        </button>
                    </div>

                    {/* LOGIN FORM */}
                    {activeTab === "login" && (
                        <div className="p-8">
                            <h2 className="text-3xl font-bold text-center text-[#3c1d12] mb-2">
                                Welcome Back
                            </h2>

                            <p className="text-center text-gray-500 mb-8 text-sm">
                                The oven is hot. Sign in to start your order.
                            </p>

                            <form onSubmit={handleLogin} className="space-y-5">
                                <div>
                                    <label className="block text-xs uppercase tracking-wide mb-2 text-gray-700 font-semibold">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="chef@pizzapalace.com"
                                        required
                                        value={loginData.email}
                                        onChange={(e) =>
                                            setLoginData({ ...loginData, email: e.target.value })
                                        }
                                        className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-700"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-wide mb-2 text-gray-700 font-semibold">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        value={loginData.password}
                                        onChange={(e) =>
                                            setLoginData({ ...loginData, password: e.target.value })
                                        }
                                        className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-700"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#a61b12] hover:bg-[#8f140c] transition-all duration-300 text-white font-semibold py-3 rounded-md text-lg shadow-md disabled:bg-gray-400"
                                >
                                    {loading ? "Signing In..." : "Sign In"}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* REGISTER FORM */}
                    {activeTab === "register" && (
                        <div className="p-8">
                            <h2 className="text-3xl font-bold text-center text-[#3c1d12] mb-2">
                                Join the Palace
                            </h2>

                            <p className="text-center text-gray-500 mb-8 text-sm">
                                Become a member for exclusive artisan recipes.
                            </p>

                            <form onSubmit={handleRegister} className="space-y-5">
                                <div>
                                    <label className="block text-xs uppercase tracking-wide mb-2 text-gray-700 font-semibold">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Gino D'Acampo"
                                        required
                                        value={registerData.name}
                                        onChange={(e) =>
                                            setRegisterData({ ...registerData, name: e.target.value })
                                        }
                                        className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-700"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-wide mb-2 text-gray-700 font-semibold">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="gino@pizzapalace.com"
                                        required
                                        value={registerData.email}
                                        onChange={(e) =>
                                            setRegisterData({ ...registerData, email: e.target.value })
                                        }
                                        className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-700"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-wide mb-2 text-gray-700 font-semibold">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Create a strong password"
                                        required
                                        value={registerData.password}
                                        onChange={(e) =>
                                            setRegisterData({ ...registerData, password: e.target.value })
                                        }
                                        className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-700"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-wide mb-2 text-gray-700 font-semibold">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Repeat your password"
                                        required
                                        value={registerData.confirmPassword}
                                        onChange={(e) =>
                                            setRegisterData({ ...registerData, confirmPassword: e.target.value })
                                        }
                                        className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-700"
                                    />
                                </div>

                                <p className="text-xs text-gray-500 text-center">
                                    By creating an account, you agree to our
                                    <span className="text-red-700 font-semibold cursor-pointer ml-1">
                                        Terms of Service.
                                    </span>
                                </p>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#a61b12] hover:bg-[#8f140c] transition-all duration-300 text-white font-semibold py-3 rounded-md text-lg shadow-md disabled:bg-gray-400"
                                >
                                    {loading ? "Creating Account..." : "Create Account"}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            {/* --- FORGOT PASSWORD MODAL POPUP --- */}
            {isForgotModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#fdf6f3]">
                            <h3 className="text-xl font-bold text-[#3c1d12]">Reset Account Password</h3>
                            <button 
                                type="button"
                                onClick={() => setIsForgotModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 text-2xl font-semibold focus:outline-none"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Modal Form Content */}
                        <form onSubmit={handleResetPassword} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs uppercase tracking-wide mb-1 text-gray-700 font-semibold">
                                    Registered Email Address
                                </label>
                                <input
                                    type="email"
                                    placeholder="Enter your registered email"
                                    required
                                    value={forgotData.email}
                                    onChange={(e) => setForgotData({ ...forgotData, email: e.target.value })}
                                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-700 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wide mb-1 text-gray-700 font-semibold">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="Enter new password"
                                    required
                                    value={forgotData.newPassword}
                                    onChange={(e) => setForgotData({ ...forgotData, newPassword: e.target.value })}
                                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-700 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wide mb-1 text-gray-700 font-semibold">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="Repeat new password"
                                    required
                                    value={forgotData.confirmNewPassword}
                                    onChange={(e) => setForgotData({ ...forgotData, confirmNewPassword: e.target.value })}
                                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-700 text-sm"
                                />
                            </div>

                            {/* Action Control Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsForgotModalOpen(false)}
                                    className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-md text-sm transition-all duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-1/2 bg-[#a61b12] hover:bg-[#8f140c] text-white font-semibold py-2.5 rounded-md text-sm transition-all duration-200 shadow-sm disabled:bg-gray-400"
                                >
                                    {loading ? "Updating..." : "Update Password"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* FOOTER */}
            {/* <Footer /> */}
        </div>
    );
};

export default AuthPage;