import React, { useState } from "react";
import axios from "axios";
import { AiOutlineUser, AiOutlineLock, AiOutlineWarning } from "react-icons/ai";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logocerdin.png";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError("Por favor, complete todos los campos");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await axios.post("http://localhost:5016/api/auth/login", {
                username,
                password,
            });

            login(response.data.token, response.data.role, response.data.userId);
        } catch (error) {
            console.error("Error de inicio de sesión:", error);
            setError(
                error.response?.data?.message ||
                "Credenciales inválidas. ¡Intenta de nuevo!"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4 md:p-8">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-md transition-all duration-300">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                        {logo ? (
                            <img src={logo} alt="Chanchito Feliz" className="w-16 h-16" />
                        ) : (
                            <span className="text-3xl">🐷</span>
                        )}
                    </div>
                    <h1 className="text-2xl font-bold text-purple-700">Chanchito Feliz</h1>
                    <h2 className="text-xl font-medium text-gray-600 mt-1">Iniciar Sesión</h2>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 border border-red-200 flex items-center animate-appear">
                        <AiOutlineWarning className="h-5 w-5 mr-2 flex-shrink-0" />
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="username">
                            Usuario
                        </label>
                        <div className="group flex items-center border-2 border-gray-200 rounded-lg px-4 py-3 focus-within:border-purple-500 transition-colors">
                            <AiOutlineUser className="text-gray-400 mr-3 group-focus-within:text-purple-500" />
                            <input
                                id="username"
                                type="text"
                                className="w-full focus:outline-none text-gray-700"
                                placeholder="Ingrese su usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="block text-gray-700 text-sm font-medium" htmlFor="password">
                                Contraseña
                            </label>

                        </div>
                        <div className="group flex items-center border-2 border-gray-200 rounded-lg px-4 py-3 focus-within:border-purple-500 transition-colors">
                            <AiOutlineLock className="text-gray-400 mr-3 group-focus-within:text-purple-500" />
                            <input
                                id="password"
                                type="password"
                                className="w-full focus:outline-none text-gray-700"
                                placeholder="Ingrese su contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-3 px-4 rounded-lg hover:opacity-90 transition-all duration-300 font-medium text-lg shadow-lg flex items-center justify-center"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Procesando...
                            </>
                        ) : "Iniciar Sesión"}
                    </button>

                </form>

            </div>
        </div>
    );
};

export default Login;