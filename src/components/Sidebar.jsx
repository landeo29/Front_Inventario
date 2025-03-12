import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineHome, AiOutlineUser, AiOutlineAppstore, AiOutlineShoppingCart, AiOutlineLogout, AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <>
            <button
                onClick={toggleSidebar}
                className="lg:hidden fixed top-4 left-4 z-50 bg-purple-700 text-white p-2 rounded-lg shadow-lg"
                aria-label="Toggle menu"
            >
                {isOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
            </button>

            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={toggleSidebar}
                ></div>
            )}

            <div
                className={`bg-gradient-to-b from-purple-700 to-blue-800 text-white w-64 min-h-screen flex flex-col shadow-xl fixed lg:static z-40 transition-all duration-300 ${
                    isOpen ? "left-0" : "-left-64"
                } lg:left-0`}
            >
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-1">Dashboard</h2>
                    <p className="text-purple-200 text-sm mb-8">Panel de administración</p>
                </div>

                <nav className="flex-1 px-4">
                    <div className="space-y-2">
                        <Link
                            to="/home"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                isActive("/home")
                                    ? "bg-white bg-opacity-20 text-white font-medium"
                                    : "text-purple-100 hover:bg-white hover:bg-opacity-10"
                            }`}
                            onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                        >
                            <AiOutlineHome className="text-xl" />
                            <span>Inicio</span>
                        </Link>

                        {user?.role === "admin" && (
                            <>
                                <Link
                                    to="/usuarios"
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                        isActive("/usuarios")
                                            ? "bg-white bg-opacity-20 text-white font-medium"
                                            : "text-purple-100 hover:bg-white hover:bg-opacity-10"
                                    }`}
                                    onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                                >
                                    <AiOutlineUser className="text-xl" />
                                    <span>Usuarios</span>
                                </Link>

                                <Link
                                    to="/categorias"
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                        isActive("/categorias")
                                            ? "bg-white bg-opacity-20 text-white font-medium"
                                            : "text-purple-100 hover:bg-white hover:bg-opacity-10"
                                    }`}
                                    onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                                >
                                    <AiOutlineAppstore className="text-xl" />
                                    <span>Categorías</span>
                                </Link>
                            </>
                        )}

                        <Link
                            to="/productos"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                isActive("/productos")
                                    ? "bg-white bg-opacity-20 text-white font-medium"
                                    : "text-purple-100 hover:bg-white hover:bg-opacity-10"
                            }`}
                            onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                        >
                            <AiOutlineShoppingCart className="text-xl" />
                            <span>Productos</span>
                        </Link>
                    </div>
                </nav>

            </div>
        </>
    );
};

export default Sidebar;