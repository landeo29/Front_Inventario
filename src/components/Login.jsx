import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AiOutlineUser, AiOutlineLock } from "react-icons/ai";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://localhost:5016/api/auth/login", {
                username,
                password,
            });
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);
            navigate("/home");
        } catch {
            setError("Credenciales inválidas. ¡Intenta de nuevo!");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md transform transition duration-500 hover:scale-105">
                <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">Iniciar Sesión</h2>

                {error && (
                    <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center animate-bounce">
                        {error}
                    </div>
                )}

                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Usuario</label>
                    <div className="flex items-center border border-indigo-300 rounded px-3 py-2 focus-within:ring-2 ring-indigo-500 transition">
                        <AiOutlineUser className="text-indigo-500 mr-2" />
                        <input
                            type="text"
                            className="w-full focus:outline-none"
                            placeholder="Ingrese su usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Contraseña</label>
                    <div className="flex items-center border border-indigo-300 rounded px-3 py-2 focus-within:ring-2 ring-indigo-500 transition">
                        <AiOutlineLock className="text-indigo-500 mr-2" />
                        <input
                            type="password"
                            className="w-full focus:outline-none"
                            placeholder="Ingrese su contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <button
                    onClick={handleLogin}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md transform hover:scale-105"
                >
                    Iniciar Sesión
                </button>
            </div>
        </div>
    );
};

export default Login;
