import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaPlus, FaTrash, FaEdit, FaSearch, FaUserShield } from "react-icons/fa";

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [filtroNombre, setFiltroNombre] = useState("");
    const [filtroRol, setFiltroRol] = useState("");
    const [modalAgregarOpen, setModalAgregarOpen] = useState(false);
    const [modalEditarOpen, setModalEditarOpen] = useState(false);
    const [nuevoUsuario, setNuevoUsuario] = useState({ username: "", password: "", role: "empleado" });
    const [usuarioEdit, setUsuarioEdit] = useState({ id: "", username: "", role: "" });

    const esAdmin = localStorage.getItem("role") === "admin";

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        try {
            const response = await axios.get("http://localhost:5016/api/usuarios/listar", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setUsuarios(response.data);
        } catch {
            Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
        }
    };

    const handleCreate = async () => {
        try {
            await axios.post("http://localhost:5016/api/usuarios/crear", nuevoUsuario, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            fetchUsuarios();
            setModalAgregarOpen(false);
            Swal.fire("Éxito", "Usuario creado correctamente", "success");
        } catch {
            Swal.fire("Error", "No se pudo crear el usuario", "error");
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = await Swal.fire({
            title: "¿Eliminar usuario?",
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
            await axios.delete(`http://localhost:5016/api/usuarios/eliminar/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            fetchUsuarios();
            Swal.fire("Eliminado", "El usuario ha sido eliminado", "success");
        } catch {
            Swal.fire("Error", "No se pudo eliminar el usuario", "error");
        }
    };

    const handleEditClick = (usuario) => {
        setUsuarioEdit({ id: usuario.id, username: usuario.username, role: usuario.role });
        setModalEditarOpen(true);
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:5016/api/usuarios/actualizar/${usuarioEdit.id}`, usuarioEdit, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            fetchUsuarios();
            setModalEditarOpen(false);
            Swal.fire("Éxito", "Usuario actualizado correctamente", "success");
        } catch {
            Swal.fire("Error", "No se pudo actualizar el usuario", "error");
        }
    };
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* Título */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-3xl font-bold text-white flex items-center">
                        <FaUserShield className="mr-3" /> Gestión de Usuarios
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
                                <FaPlus /> Agregar Usuario
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <FaSearch className="absolute inset-y-0 left-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre..."
                                value={filtroNombre}
                                onChange={(e) => setFiltroNombre(e.target.value)}
                                className="pl-10 border p-3 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-purple-400"
                            />
                        </div>
                        <select
                            value={filtroRol}
                            onChange={(e) => setFiltroRol(e.target.value)}
                            className="border p-3 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-purple-400"
                        >
                            <option value="">Todos los roles</option>
                            <option value="admin">Administrador</option>
                            <option value="empleado">Empleado</option>
                        </select>
                    </div>
                </div>

                {/* Tabla de usuarios */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="w-full border-collapse">
                        <thead>
                        <tr className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                            <th className="px-6 py-4 text-left font-semibold">ID</th>
                            <th className="px-6 py-4 text-left font-semibold">Username</th>
                            <th className="px-6 py-4 text-left font-semibold">Rol</th>
                            {esAdmin && <th className="px-6 py-4 text-center font-semibold">Acciones</th>}
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {usuarios
                            .filter((u) => u.username.toLowerCase().includes(filtroNombre.toLowerCase()))
                            .filter((u) => (filtroRol ? u.role === filtroRol : true))
                            .map((usuario) => (
                                <tr key={usuario.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">{usuario.id}</td>
                                    <td className="px-6 py-4">{usuario.username}</td>
                                    <td className="px-6 py-4">{usuario.role}</td>
                                    {esAdmin && (
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleEditClick(usuario)}
                                                className="text-blue-500 hover:text-blue-700 mx-2"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(usuario.id)}
                                                className="text-red-500 hover:text-red-700 mx-2"
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

                {modalAgregarOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                            <h2 className="text-2xl font-bold mb-4 text-purple-700 flex items-center">
                                <FaPlus className="mr-2" /> Agregar Usuario
                            </h2>
                            <div className="space-y-4">
                                <label className="block text-gray-700 font-medium">Username:</label>
                                <input
                                    type="text"
                                    value={nuevoUsuario.username}
                                    onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, username: e.target.value })}
                                    className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-purple-400"
                                />

                                <label className="block text-gray-700 font-medium">Contraseña:</label>
                                <input
                                    type="password"
                                    value={nuevoUsuario.password}
                                    onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })}
                                    className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-purple-400"
                                />

                                <label className="block text-gray-700 font-medium">Rol:</label>
                                <select
                                    value={nuevoUsuario.role}
                                    onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, role: e.target.value })}
                                    className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-purple-400"
                                >
                                    <option value="admin">Administrador</option>
                                    <option value="empleado">Empleado</option>
                                </select>
                            </div>

                            <div className="flex justify-end space-x-4 mt-6">
                                <button
                                    onClick={() => setModalAgregarOpen(false)}
                                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition duration-300"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleCreate}
                                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition duration-300 shadow-md"
                                >
                                    Guardar Usuario
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {modalEditarOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                            <h2 className="text-2xl font-bold mb-4 text-blue-700 flex items-center">
                                <FaEdit className="mr-2" /> Editar Usuario
                            </h2>
                            <div className="space-y-4">
                                <label className="block text-gray-700 font-medium">Username:</label>
                                <input
                                    type="text"
                                    value={usuarioEdit.username}
                                    onChange={(e) => setUsuarioEdit({ ...usuarioEdit, username: e.target.value })}
                                    className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400"
                                />

                                <label className="block text-gray-700 font-medium">Rol:</label>
                                <select
                                    value={usuarioEdit.role}
                                    onChange={(e) => setUsuarioEdit({ ...usuarioEdit, role: e.target.value })}
                                    className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400"
                                >
                                    <option value="admin">Administrador</option>
                                    <option value="empleado">Empleado</option>
                                </select>
                            </div>

                            <div className="flex justify-end space-x-4 mt-6">
                                <button
                                    onClick={() => setModalEditarOpen(false)}
                                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition duration-300"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition duration-300 shadow-md"
                                >
                                    Actualizar Usuario
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Usuarios;
