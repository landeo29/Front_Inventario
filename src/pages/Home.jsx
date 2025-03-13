import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBox, FaTags, FaUsers, FaExclamationTriangle, FaSync, FaChartLine } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";

const Home = () => {
    const [stats, setStats] = useState({
        productos: 0,
        categorias: 0,
        usuarios: 0,
        stockBajo: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No se encontró token de autenticación");
            }

            const authHeader = { Authorization: `Bearer ${token}` };

            const [productosRes, categoriasRes, usuariosRes] = await Promise.all([
                axios.get("http://localhost:5016/api/productos/listar", { headers: authHeader }),
                axios.get("http://localhost:5016/api/categorias/listar", { headers: authHeader }),
                axios.get("http://localhost:5016/api/usuarios/listar", { headers: authHeader })
            ]);

            const productos = productosRes.data.length;
            const categorias = categoriasRes.data.length;
            const usuarios = usuariosRes.data.length;
            const stockBajo = productosRes.data.filter((p) => p.cantidad < 5).length;

            setStats({ productos, categorias, usuarios, stockBajo });
            setLastUpdated(new Date());
        } catch (error) {
            console.error("Error al obtener estadísticas", error);
            setError(error.message || "Error al cargar datos");
        } finally {
            setLoading(false);
        }
    };

    const formattedLastUpdated = lastUpdated
        ? lastUpdated.toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
        : '';

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-purple-700 flex items-center text-center">
                            <span className="mr-2">🐷</span> Chanchito Feliz - Dashboard
                        </h1>
                        <p className="text-gray-500 mt-1">Monitorea tu inventario y administración en tiempo real</p>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-800 flex items-center">
                        <FaChartLine className="mr-2 text-purple-600" /> Métricas Principales
                    </h2>
                    <div className="flex items-center mt-2 sm:mt-0">
                        <span className="text-sm text-gray-500 mr-3">
                            {lastUpdated ? `Última actualización: ${formattedLastUpdated}` : 'Cargando datos...'}
                        </span>
                        <button
                            onClick={fetchStats}
                            disabled={loading}
                            className="flex items-center justify-center bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-2 rounded-lg transition-colors"
                        >
                            {loading ? (
                                <FaSync className="animate-spin text-sm" />
                            ) : (
                                <><FiRefreshCw className="mr-1 text-sm" /> Actualizar</>
                            )}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg">
                        <p className="font-medium">Error al cargar datos</p>
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {/* Productos */}
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg rounded-2xl overflow-hidden transition duration-300 hover:shadow-xl">
                        <div className="px-6 py-5">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-blue-100 text-sm font-medium">Productos Totales</p>
                                    <p className="text-3xl font-bold mt-1">{loading ? '...' : stats.productos}</p>
                                </div>
                                <div className="p-3 bg-blue-400 bg-opacity-30 rounded-lg">
                                    <FaBox className="text-2xl" />
                                </div>
                            </div>
                            <div className="mt-4 text-xs text-blue-100">
                                Gestiona tu inventario completo
                            </div>
                        </div>
                        <div className="bg-blue-700 py-2 px-6 text-right">
                            <a href="/productos" className="text-xs font-medium text-blue-100 hover:text-white transition">
                                Ver detalles →
                            </a>
                        </div>
                    </div>

                    {/* Categorías */}
                    <div className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg rounded-2xl overflow-hidden transition duration-300 hover:shadow-xl">
                        <div className="px-6 py-5">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-green-100 text-sm font-medium">Categorías</p>
                                    <p className="text-3xl font-bold mt-1">{loading ? '...' : stats.categorias}</p>
                                </div>
                                <div className="p-3 bg-green-400 bg-opacity-30 rounded-lg">
                                    <FaTags className="text-2xl" />
                                </div>
                            </div>
                            <div className="mt-4 text-xs text-green-100">
                                Organiza tus productos eficientemente
                            </div>
                        </div>
                        <div className="bg-green-700 py-2 px-6 text-right">
                            <a href="/categorias" className="text-xs font-medium text-green-100 hover:text-white transition">
                                Ver detalles →
                            </a>
                        </div>
                    </div>

                    {/* Usuarios */}
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg rounded-2xl overflow-hidden transition duration-300 hover:shadow-xl">
                        <div className="px-6 py-5">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-purple-100 text-sm font-medium">Usuarios</p>
                                    <p className="text-3xl font-bold mt-1">{loading ? '...' : stats.usuarios}</p>
                                </div>
                                <div className="p-3 bg-purple-400 bg-opacity-30 rounded-lg">
                                    <FaUsers className="text-2xl" />
                                </div>
                            </div>
                            <div className="mt-4 text-xs text-purple-100">
                                Administra tus colaboradores
                            </div>
                        </div>
                        <div className="bg-purple-700 py-2 px-6 text-right">
                            <a href="/usuarios" className="text-xs font-medium text-purple-100 hover:text-white transition">
                                Ver detalles →
                            </a>
                        </div>
                    </div>

                    {/* Stock Bajo */}
                    <div className="bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg rounded-2xl overflow-hidden transition duration-300 hover:shadow-xl">
                        <div className="px-6 py-5">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-red-100 text-sm font-medium">Stock Bajo</p>
                                    <p className="text-3xl font-bold mt-1">{loading ? '...' : stats.stockBajo}</p>
                                </div>
                                <div className="p-3 bg-red-400 bg-opacity-30 rounded-lg">
                                    <FaExclamationTriangle className="text-2xl" />
                                </div>
                            </div>
                            <div className="mt-4 text-xs text-red-100">
                                Productos que necesitan reposición
                            </div>
                        </div>
                        <div className="bg-red-700 py-2 px-6 text-right">
                            <a href="/productos" className="text-xs font-medium text-red-100 hover:text-white transition">
                                Ver detalles →
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">

            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-gray-500 text-xs">
                &copy; {new Date().getFullYear()} Chanchito Feliz - Todos los derechos reservados
            </div>
        </div>
    );
};

export default Home;