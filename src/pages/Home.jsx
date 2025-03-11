import React from "react";
import UserProfile from "../components/UserProfile";

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <UserProfile />
            <div className="mt-6">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard Principal</h1>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
                    <div className="bg-white shadow p-4 rounded">
                        <h2 className="text-gray-600">Productos</h2>
                        <p className="text-2xl font-semibold text-gray-800">100</p>
                    </div>
                    <div className="bg-white shadow p-4 rounded">
                        <h2 className="text-gray-600">Categorías</h2>
                        <p className="text-2xl font-semibold text-gray-800">10</p>
                    </div>
                    <div className="bg-white shadow p-4 rounded">
                        <h2 className="text-gray-600">Usuarios</h2>
                        <p className="text-2xl font-semibold text-gray-800">5</p>
                    </div>
                    <div className="bg-white shadow p-4 rounded">
                        <h2 className="text-gray-600">Stock Bajo</h2>
                        <p className="text-2xl font-semibold text-gray-800">3</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
