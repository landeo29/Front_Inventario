import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaPlus, FaTrash, FaSearch, FaTable, FaFilter, FaEdit } from "react-icons/fa";

const Categorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [filtroNombre, setFiltroNombre] = useState("");
    const [modalAgregarOpen, setModalAgregarOpen] = useState(false);

    const [modalEditarOpen, setModalEditarOpen] = useState(false);
    const [categoriaEdit, setCategoriaEdit] = useState({ id: null, nombre: "" });

    const [nuevaCategoria, setNuevaCategoria] = useState({ nombre: "" });
    const [loading, setLoading] = useState(true);

    const esAdmin = localStorage.getItem("role") === "admin";

    useEffect(() => {
        fetchCategorias();
    }, []);

    const fetchCategorias = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:5016/api/categorias/listar", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setCategorias(response.data);
        } catch {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudieron cargar las categorías",
                confirmButtonColor: "#3085d6",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!nuevaCategoria.nombre.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Campo requerido",
                text: "El nombre de la categoría no puede estar vacío",
                confirmButtonColor: "#3085d6",
            });
            return;
        }

        try {
            await axios.post("http://localhost:5016/api/categorias/crear", nuevaCategoria, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            fetchCategorias();
            setModalAgregarOpen(false);
            setNuevaCategoria({ nombre: "" });
            Swal.fire({
                icon: "success",
                title: "Éxito",
                text: "Categoría creada correctamente",
                confirmButtonColor: "#3085d6",
            });
        } catch {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo crear la categoría",
                confirmButtonColor: "#3085d6",
            });
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = await Swal.fire({
            title: "¿Eliminar categoría?",
            text: "No podrás revertir esta acción.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (!confirmDelete.isConfirmed) return;

        try {
            await axios.delete(`http://localhost:5016/api/categorias/eliminar/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            fetchCategorias();
            Swal.fire({
                icon: "success",
                title: "Eliminado",
                text: "La categoría ha sido eliminada",
                confirmButtonColor: "#3085d6",
            });
        } catch {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo eliminar la categoría",
                confirmButtonColor: "#3085d6",
            });
        }
    };

    const filteredCategorias = categorias.filter(
        (c) => c.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
    );

    const handleUpdateCategoria = async () => {
        if (!categoriaEdit.nombre.trim()) {
            return Swal.fire("Campo requerido", "nombre categoria on puede estar vaicio", "warning");
        }

        try {
            await axios.put(`http://localhost:5016/api/categorias/actualizar/${categoriaEdit.id}`,
                { nombre: categoriaEdit.nombre },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            fetchCategorias();
            setModalEditarOpen(false);
            setCategoriaEdit({ id: null, nombre: "" });
            Swal.fire("Éxito", "Categoría actualizada correctamente", "success");
        } catch {
            Swal.fire("Error", "No se pudo actualizar la categoría", "error");
        }
    };
    const handleOpenEditModal = (categoria) => {
        setCategoriaEdit(categoria);
        setModalEditarOpen(true);
    };

    return (
        <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">

                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-xl p-4 sm:p-6 mb-6 transform transition-all hover:scale-[1.01] duration-300">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                        <FaTable className="hidden sm:block text-white/80" />
                        📂 Gestión de Categorías
                    </h2>
                    <p className="text-blue-100 mt-2 max-w-3xl">
                        Administre las categorías de su sistema de manera eficiente
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                            <FaFilter className="text-blue-600" />
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Filtros</h3>
                        </div>
                        {esAdmin && (
                            <button
                                onClick={() => setModalAgregarOpen(true)}
                                className="w-full md:w-auto bg-gradient-to-r from-green-500 to-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition duration-300 shadow-md flex items-center justify-center gap-2"
                                aria-label="Agregar nueva categoría"
                            >
                                <FaPlus className="text-white/90" />
                                <span>Agregar Categoría</span>
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
                            aria-label="Filtrar categorías por nombre"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                    {loading ? (
                        <div className="flex justify-center items-center p-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                        </div>
                    ) : filteredCategorias.length === 0 ? (
                        <div className="text-center p-8 text-gray-500">
                            <p>No se encontraron categorías{filtroNombre ? " con ese filtro" : ""}.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                            <table className="w-full border-collapse">
                                <thead>
                                <tr className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left font-semibold text-sm sm:text-base">ID</th>
                                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left font-semibold text-sm sm:text-base">Nombre</th>
                                    {esAdmin && <th className="px-4 sm:px-6 py-3 sm:py-4 text-center font-semibold text-sm sm:text-base">Acciones</th>}
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {filteredCategorias.map((categoria) => (
                                    <tr
                                        key={categoria.id}
                                        className="hover:bg-blue-50 transition-colors duration-150"
                                    >
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-900 text-sm sm:text-base">{categoria.id}</td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-gray-900 text-sm sm:text-base">{categoria.nombre}</td>
                                        {esAdmin && (
                                            <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => handleOpenEditModal(categoria)}
                                                        className="bg-yellow-100 text-yellow-600 p-2 rounded-full hover:bg-yellow-200 hover:text-yellow-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                                        title="Editar categoría"
                                                    >
                                                        <FaEdit className="text-sm"/>
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(categoria.id)}
                                                        className="bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-200 hover:text-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                                                        title="Eliminar categoría"
                                                        aria-label={`Eliminar categoría ${categoria.nombre}`}
                                                    >
                                                        <FaTrash className="text-sm"/>
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {modalEditarOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
                        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg border" onClick={(e) => e.stopPropagation()}>
                            <h2 className="text-xl font-bold mb-4 text-blue-700 flex items-center gap-2">
                                <FaEdit className="text-blue-600" />
                                Editar Categoría
                            </h2>

                            <input
                                type="text"
                                value={categoriaEdit.nombre}
                                onChange={(e) => setCategoriaEdit({ ...categoriaEdit, nombre: e.target.value })}
                                className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400"
                                placeholder="Nombre de la categoría"
                            />

                            <div className="flex justify-end gap-3 mt-6">
                                <button onClick={handleUpdateCategoria} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                    Actualizar
                                </button>
                                <button onClick={() => setModalEditarOpen(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400">
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {modalAgregarOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
                        <div
                            className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg border border-gray-200 transform transition-all duration-300 scale-100"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-blue-700 flex items-center gap-2">
                                <FaPlus className="text-blue-600" />
                                <span>Agregar Categoría</span>
                            </h2>

                            <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-2" htmlFor="categoria-nombre">
                                    Nombre:
                                </label>
                                <input
                                    id="categoria-nombre"
                                    type="text"
                                    value={nuevaCategoria.nombre}
                                    onChange={(e) => setNuevaCategoria({ ...nuevaCategoria, nombre: e.target.value })}
                                    className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200"
                                    placeholder="Nombre de la categoría"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row-reverse justify-end sm:justify-end gap-3 mt-6">
                                <button
                                    onClick={handleCreate}
                                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition duration-300 shadow-md font-medium w-full sm:w-auto"
                                >
                                    Guardar Categoría
                                </button>
                                <button
                                    onClick={() => setModalAgregarOpen(false)}
                                    className="bg-gray-200 text-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-gray-300 transition duration-300 font-medium w-full sm:w-auto"
                                >
                                    Cancelar
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