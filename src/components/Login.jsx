import React, { useState } from "react";
import axios from "axios";
import { AiOutlineUser, AiOutlineLock } from "react-icons/ai";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://localhost:5016/api/auth/login", {
                username,
                password,
            });

            console.log("Login Response:", response.data);

            login(response.data.token, response.data.role, response.data.userId);
        } catch (error) {
            console.log("Login Error:", error);
            setError("Credenciales inválidas. ¡Intenta de nuevo!");
        }
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-96 max-w-full">
                <h2 className="text-3xl font-bold mb-8 text-center text-purple-700">Bienvenido</h2>

                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 border border-red-200 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </div>
                )}

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Usuario</label>
                    <div className="flex items-center border-2 border-gray-200 rounded-lg px-4 py-3 focus-within:border-purple-500 transition-colors">
                        <AiOutlineUser className="text-gray-400 mr-3" />
                        <input
                            type="text"
                            className="w-full focus:outline-none text-gray-700"
                            placeholder="Ingrese su usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mb-8">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Contraseña</label>
                    <div className="flex items-center border-2 border-gray-200 rounded-lg px-4 py-3 focus-within:border-purple-500 transition-colors">
                        <AiOutlineLock className="text-gray-400 mr-3" />
                        <input
                            type="password"
                            className="w-full focus:outline-none text-gray-700"
                            placeholder="Ingrese su contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <button
                    onClick={handleLogin}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-3 px-4 rounded-lg hover:opacity-90 transition-all duration-300 font-medium text-lg shadow-lg"
                >
                    Iniciar Sesión
                </button>


            </div>
        </div>
    );
};

export default Login;