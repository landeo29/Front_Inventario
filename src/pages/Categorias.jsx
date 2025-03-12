import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaPlus, FaTrash, FaSearch } from "react-icons/fa";

const Categorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [filtroNombre, setFiltroNombre] = useState("");
    const [modalAgregarOpen, setModalAgregarOpen] = useState(false);
    const [nuevaCategoria, setNuevaCategoria] = useState({ nombre: "" });

    const esAdmin = localStorage.getItem("role") === "admin";

    useEffect(() => {
        fetchCategorias();
    }, []);

    const fetchCategorias = async () => {
        try {
            const response = await axios.get("http://localhost:5016/api/categorias/listar", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setCategorias(response.data);
        } catch {
            Swal.fire("Error", "No se pudieron cargar las categorías", "error");
        }
    };

    const handleCreate = async () => {
        try {
            await axios.post("http://localhost:5016/api/categorias/crear", nuevaCategoria, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            fetchCategorias();
            setModalAgregarOpen(false);
            Swal.fire("Éxito", "Categoría creada correctamente", "success");
        } catch {
            Swal.fire("Error", "No se pudo crear la categoría", "error");
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = await Swal.fire({
            title: "¿Eliminar categoría?",
            text: "No podrás revertir esta acción.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (!confirmDelete.isConfirmed) return;

        try {
            await axios.delete(`http://localhost:5016/api/categorias/eliminar/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            fetchCategorias();
            Swal.fire("Eliminado", "La categoría ha sido eliminada", "success");
        } catch {
            Swal.fire("Error", "No se pudo eliminar la categoría", "error");
        }
    };
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* Título */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-3xl font-bold text-white flex items-center">
                        📂 Gestión de Categorías
                    </h2>
                </div>

                {/* Filtros y botón agregar */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4 md:mb-0">Filtros</h3>
                        {esAdmin && (
                            <button
                                onClick={() => setModalAgregarOpen(true)}
                                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition duration-300 shadow-md flex items-center gap-2"
                            >
                                <FaPlus /> Agregar Categoría
                            </button>
                        )}
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar por nombre..."
                            value={filtroNombre}
                            onChange={(e) => setFiltroNombre(e.target.value)}
                            className="pl-10 border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 w-full transition duration-200"
                        />
                    </div>
                </div>

                {/* Tabla de categorías */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                            <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                                <th className="px-6 py-4 text-left font-semibold">ID</th>
                                <th className="px-6 py-4 text-left font-semibold">Nombre</th>
                                {esAdmin && <th className="px-6 py-4 text-center font-semibold">Acciones</th>}
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {categorias
                                .filter((c) => c.nombre.toLowerCase().includes(filtroNombre.toLowerCase()))
                                .map((categoria) => (
                                    <tr key={categoria.id} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4 text-gray-900">{categoria.id}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{categoria.nombre}</td>
                                        {esAdmin && (
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => handleDelete(categoria.id)}
                                                    className="bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-200 transition-colors duration-200"
                                                    title="Eliminar categoría"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal para agregar categoría */}
                {modalAgregarOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                            <h2 className="text-2xl font-bold mb-6 text-blue-700 flex items-center">
                                <FaPlus className="mr-2" /> Agregar Categoría
                            </h2>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Nombre:</label>
                                <input
                                    type="text"
                                    value={nuevaCategoria.nombre}
                                    onChange={(e) => setNuevaCategoria({ ...nuevaCategoria, nombre: e.target.value })}
                                    className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                                />
                            </div>

                            <div className="flex justify-end space-x-4 mt-6">
                                <button
                                    onClick={() => setModalAgregarOpen(false)}
                                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition duration-300 font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleCreate}
                                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition duration-300 shadow-md font-medium"
                                >
                                    Guardar Categoría
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Categorias;
