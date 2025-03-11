import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const UserProfile = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="flex items-center gap-4 p-4 bg-white shadow rounded">
            <FaUserCircle className="text-3xl text-gray-600" />
            <div>
                <p className="text-sm font-semibold text-gray-800">{user?.username || "Usuario"}</p>
                <p className="text-xs text-gray-500">{user?.role === "admin" ? "Administrador" : "Empleado"}</p>
            </div>
            <button
                onClick={handleLogout}
                className="ml-4 px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600 transition"
            >
                Cerrar sesión
            </button>
        </div>
    );
};

export default UserProfile;
