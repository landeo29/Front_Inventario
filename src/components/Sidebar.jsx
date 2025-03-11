import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineHome, AiOutlineUser, AiOutlineAppstore, AiOutlineShoppingCart } from "react-icons/ai";

const Sidebar = () => {
    return (
        <div className="bg-gray-800 text-white w-64 min-h-screen p-5">
            <h2 className="text-2xl font-bold mb-8">Dashboard</h2>
            <nav className="flex flex-col gap-4">
                <Link to="/home" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
                    <AiOutlineHome /> Home
                </Link>
                <Link to="/usuarios" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
                    <AiOutlineUser /> Usuarios
                </Link>
                <Link to="/productos" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
                    <AiOutlineShoppingCart /> Productos
                </Link>
                <Link to="/categorias" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
                    <AiOutlineAppstore /> Categorías
                </Link>
            </nav>
        </div>
    );
};

export default Sidebar;
