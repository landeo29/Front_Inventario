import React, { useState, useEffect } from "react";
import axios from "axios";
import UserProfile from "../components/UserProfile";
import { FaBox, FaTags, FaUsers, FaExclamationTriangle } from "react-icons/fa";

const Home = () => {
    const [stats, setStats] = useState({
        productos: 0,
        categorias: 0,
        usuarios: 0,
        stockBajo: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [productosRes, categoriasRes, usuariosRes] = await Promise.all([
                axios.get("http://localhost:5016/api/productos/listar", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                }),
                axios.get("http://localhost:5016/api/categorias/listar", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                }),
                axios.get("http://localhost:5016/api/usuarios/listar", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                })
            ]);

            const productos = productosRes.data.length;
            const categorias = categoriasRes.data.length;
            const usuarios = usuariosRes.data.length;
            const stockBajo = productosRes.data.filter((p) => p.cantidad < 5).length;

            setStats({ productos, categorias, usuarios, stockBajo });
        } catch (error) {
            console.error("Error al obtener estadísticas", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <UserProfile />
            <div className="mt-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">📊 Dashboard Principal</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {/* Productos */}
                    <div className="bg-blue-500 text-white shadow-lg rounded-xl p-6 flex items-center justify-between transition transform hover:scale-105">
                        <div>
                            <h2 className="text-lg font-semibold">Productos Totales</h2>
                            <p className="text-3xl font-bold">{stats.productos}</p>
                        </div>
                        <FaBox className="text-4xl" />
                    </div>

                    {/* Categorías */}
                    <div className="bg-green-500 text-white shadow-lg rounded-xl p-6 flex items-center justify-between transition transform hover:scale-105">
                        <div>
                            <h2 className="text-lg font-semibold">Categorías</h2>
                            <p className="text-3xl font-bold">{stats.categorias}</p>
                        </div>
                        <FaTags className="text-4xl" />
                    </div>

                    {/* Usuarios */}
                    <div className="bg-purple-500 text-white shadow-lg rounded-xl p-6 flex items-center justify-between transition transform hover:scale-105">
                        <div>
                            <h2 className="text-lg font-semibold">Usuarios</h2>
                            <p className="text-3xl font-bold">{stats.usuarios}</p>
                        </div>
                        <FaUsers className="text-4xl" />
                    </div>

                    {/* Stock Bajo */}
                    <div className="bg-red-500 text-white shadow-lg rounded-xl p-6 flex items-center justify-between transition transform hover:scale-105">
                        <div>
                            <h2 className="text-lg font-semibold">Stock Bajo</h2>
                            <p className="text-3xl font-bold">{stats.stockBajo}</p>
                        </div>
                        <FaExclamationTriangle className="text-4xl" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
