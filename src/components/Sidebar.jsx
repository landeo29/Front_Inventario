import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineHome, AiOutlineUser, AiOutlineAppstore, AiOutlineShoppingCart, AiOutlineLogout, AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Swal from "sweetalert2";

const Sidebar = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [userData, setUserData] = useState({ username: "Cargando...", role: "Cargando..." });

    useEffect(() => {
        obtenerDatosUsuario();

        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth >= 1024) {
                setIsOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const obtenerDatosUsuario = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const decoded = jwtDecode(token);
            const username = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

            const response = await axios.get("http://localhost:5016/api/usuarios/listar", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200) {
                const usuarioEncontrado = response.data.find(user => user.username === username);
                if (usuarioEncontrado) {
                    setUserData({
                        username: usuarioEncontrado.username,
                        role: usuarioEncontrado.role
                    });
                } else {
                    console.error("Usuario no encontrado en la lista.");
                }
            }
        } catch (error) {
            console.error("Error al obtener datos del usuario", error);
        }
    };

    const toggleSidebar = () => setIsOpen(!isOpen);
    const closeSidebar = () => { if (isMobile) setIsOpen(false); };
    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        Swal.fire({
            title: "¿Estás seguro que deseas cerrar sesión?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, salir",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("token");
                window.location.href = "/login";
            }
        });
    };

    return (
        <>
            <button onClick={toggleSidebar}
                    className="lg:hidden fixed top-4 left-4 z-50 bg-purple-700 hover:bg-purple-800 text-white p-2 rounded-lg shadow-lg transition-colors duration-200">
                {isOpen ? <AiOutlineClose size={24}/> : <AiOutlineMenu size={24}/>}
            </button>

            {isOpen && <div
                className="lg:hidden fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 transition-opacity duration-300"
                onClick={toggleSidebar}></div>}

            <div
                className={`bg-gradient-to-b from-purple-700 via-purple-800 to-blue-900 text-white w-72 h-screen flex flex-col shadow-2xl fixed lg:sticky top-0 z-50 transition-all duration-300 ease-in-out transform ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>

                <div className="p-6 border-b border-purple-600 border-opacity-30">
                    <div className="flex items-center gap-3">
                        <div className="bg-white bg-opacity-20 p-2 rounded-full"><span className="text-2xl">🐷</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Chanchito Feliz</h2>
                            <p className="text-purple-200 text-xs">Sistema de Inventario</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">

                    <div className="p-4 border-b border-purple-600 border-opacity-30">
                        <div className="flex items-center bg-white bg-opacity-10 p-3 rounded-lg">
                            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center mr-3">
                                <span
                                    className="font-bold text-lg">{userData.username ? userData.username.charAt(0).toUpperCase() : "U"}</span>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <h3 className="font-medium truncate">{userData.username}</h3>
                                <p className="text-xs text-purple-200 truncate">{userData.role === "admin" ? "Administrador" : "Empleado"}</p>
                            </div>
                        </div>
                    </div>

                    <nav className="px-3 py-4 space-y-1">
                        <p className="text-xs text-purple-300 uppercase font-semibold ml-3 mb-2">General</p>
                        <Link to="/home"
                              className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isActive("/home") ? "bg-white bg-opacity-20 text-white font-medium shadow-sm" : "text-purple-100 hover:bg-white hover:bg-opacity-10"}`}
                              onClick={closeSidebar}>
                            <AiOutlineHome className="text-xl"/>
                            <span>Inicio</span>
                        </Link>

                        <p className="text-xs text-purple-300 uppercase font-semibold ml-3 mt-6 mb-2">Inventario</p>
                        <Link to="/productos"
                              className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isActive("/productos") ? "bg-white bg-opacity-20 text-white font-medium shadow-sm" : "text-purple-100 hover:bg-white hover:bg-opacity-10"}`}
                              onClick={closeSidebar}>
                            <AiOutlineShoppingCart className="text-xl"/>
                            <span>Productos</span>
                        </Link>

                        {userData.role === "admin" && (
                            <>
                                <Link to="/categorias"
                                      className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isActive("/categorias") ? "bg-white bg-opacity-20 text-white font-medium shadow-sm" : "text-purple-100 hover:bg-white hover:bg-opacity-10"}`}
                                      onClick={closeSidebar}>
                                    <AiOutlineAppstore className="text-xl"/>
                                    <span>Categorías</span>
                                </Link>

                                <p className="text-xs text-purple-300 uppercase font-semibold ml-3 mt-6 mb-2">Administración</p>
                                <Link to="/usuarios"
                                      className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isActive("/usuarios") ? "bg-white bg-opacity-20 text-white font-medium shadow-sm" : "text-purple-100 hover:bg-white hover:bg-opacity-10"}`}
                                      onClick={closeSidebar}>
                                    <AiOutlineUser className="text-xl"/>
                                    <span>Usuarios</span>
                                </Link>
                            </>
                        )}
                    </nav>
                </div>

                <div className="p-4 border-t border-purple-600 border-opacity-30">
                    <button onClick={handleLogout}
                            className="flex items-center w-full gap-3 px-4 py-3 rounded-lg text-purple-100 hover:bg-white hover:bg-opacity-10 transition-all duration-200">
                        <AiOutlineLogout className="text-xl"/>
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
