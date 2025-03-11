import React, { useState, useEffect } from "react";
import axios from "axios";

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProductos = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("No hay token. Debes iniciar sesión.");
                return;
            }

            try {
                const response = await axios.get("http://localhost:5016/api/productos/listar", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    setProductos(response.data);
                } else {
                    setError("No hay productos disponibles.");
                }
            } catch (error) {
                if (error.response?.status === 404) {
                    setError("No hay productos disponibles.");
                } else {
                    setError("Error al cargar productos.");
                }
                console.error("Error al obtener productos:", error);
            }
        };

        fetchProductos();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Gestión de Productos</h2>

            {error && <p className="text-red-500">{error}</p>}

            {!error && productos.length === 0 && (
                <p className="text-gray-500">No hay productos registrados.</p>
            )}

            {productos.length > 0 && (
                <>
                    <input
                        type="text"
                        placeholder="Buscar producto..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        className="border p-2 mb-4 w-full rounded"
                    />

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 px-4 py-2">ID</th>
                                <th className="border border-gray-300 px-4 py-2">Nombre</th>
                                <th className="border border-gray-300 px-4 py-2">Precio</th>
                                <th className="border border-gray-300 px-4 py-2">Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {productos
                                .filter((p) =>
                                    p.nombre.toLowerCase().includes(filtro.toLowerCase())
                                )
                                .map((producto) => (
                                    <tr key={producto.id} className="hover:bg-gray-100">
                                        <td className="border border-gray-300 px-4 py-2">{producto.id}</td>
                                        <td className="border border-gray-300 px-4 py-2">{producto.nombre}</td>
                                        <td className="border border-gray-300 px-4 py-2">{producto.precio}</td>
                                        <td className="border border-gray-300 px-4 py-2 space-x-2">
                                            <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                                                Editar
                                            </button>
                                            <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default Productos;
