import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
                <h1 className="text-3xl font-bold mb-6 text-blue-600">¡Bienvenido a APIInventario! 🛒</h1>
                <p className="text-gray-700 mb-6">Selecciona una opción para continuar:</p>
                <div className="space-y-4">
                    <button
                        className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-300"
                        onClick={() => navigate("/usuarios")}
                    >
                        Gestionar Usuarios 👥
                    </button>
                    <button
                        className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg transition duration-300"
                        onClick={() => navigate("/productos")}
                    >
                        Gestionar Productos 📦
                    </button>
                    <button
                        className="w-full py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition duration-300"
                        onClick={() => navigate("/categorias")}
                    >
                        Gestionar Categorías 🗂️
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
