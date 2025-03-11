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
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Iniciar Sesión</h2>

                {error && (
                    <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Usuario</label>
                    <div className="flex items-center border rounded px-3 py-2">
                        <AiOutlineUser className="text-gray-500 mr-2" />
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
                    <div className="flex items-center border rounded px-3 py-2">
                        <AiOutlineLock className="text-gray-500 mr-2" />
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
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Iniciar Sesión
                </button>
            </div>
        </div>
    );
};

export default Login;
