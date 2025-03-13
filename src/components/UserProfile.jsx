import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const UserProfile = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [userData, setUserData] = useState({ username: "Cargando...", role: "Cargando..." });

    useEffect(() => {
        obtenerDatosUsuario();
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

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="flex items-center justify-between bg-white shadow-lg rounded-xl p-6">
            <div className="flex items-center gap-4">
                <FaUserCircle className="text-5xl text-gray-600" />
                <div>
                    <p className="text-lg font-semibold text-gray-800">{userData.username}</p>
                    <p className={`text-sm font-medium px-3 py-1 rounded-full 
                        ${userData.role === "admin" ? "bg-blue-200 text-blue-800" : "bg-green-200 text-green-800"}`}>
                        {userData.role === "admin" ? "Administrador" : "Empleado"}
                    </p>
                </div>
            </div>
            <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-300"
            >
                <FaSignOutAlt />
                Cerrar sesión
            </button>
        </div>
    );
};

export default UserProfile;
