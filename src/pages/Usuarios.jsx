import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaPlus, FaTrash, FaEdit, FaSearch, FaUserShield, FaTimes, FaFilter } from "react-icons/fa";

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [filtroNombre, setFiltroNombre] = useState("");
    const [filtroRol, setFiltroRol] = useState("");
    const [modalAgregarOpen, setModalAgregarOpen] = useState(false);
    const [modalEditarOpen, setModalEditarOpen] = useState(false);
    const [nuevoUsuario, setNuevoUsuario] = useState({ username: "", password: "", role: "empleado" });
    const [usuarioEdit, setUsuarioEdit] = useState({ id: "", username: "", role: "" });
    const [loading, setLoading] = useState(false);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const esAdmin = localStorage.getItem("role") === "admin";

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:5016/api/usuarios/listar", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setUsuarios(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudieron cargar los usuarios",
                icon: "error",
                confirmButtonColor: "#6366F1"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!nuevoUsuario.username || !nuevoUsuario.password) {
            Swal.fire({
                title: "Datos incompletos",
                text: "Por favor complete todos los campos requeridos",
                icon: "warning",
                confirmButtonColor: "#6366F1"
            });
            return;
        }

        setLoading(true);
        try {
            await axios.post("http://localhost:5016/api/usuarios/crear", nuevoUsuario, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            fetchUsuarios();
            setModalAgregarOpen(false);
            resetFormFields();
            Swal.fire({
                title: "Éxito",
                text: "Usuario creado correctamente",
                icon: "success",
                confirmButtonColor: "#10B981"
            });
        } catch (error) {
            console.error("Error creating user:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudo crear el usuario",
                icon: "error",
                confirmButtonColor: "#6366F1"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = await Swal.fire({
            title: "¿Eliminar usuario?",
            text: "No podrás revertir esta acción.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#EF4444",
            cancelButtonColor: "#6B7280",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (!confirmDelete.isConfirmed) return;

        setLoading(true);
        try {
            await axios.delete(`http://localhost:5016/api/usuarios/eliminar/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            fetchUsuarios();
            Swal.fire({
                title: "Eliminado",
                text: "El usuario ha sido eliminado",
                icon: "success",
                confirmButtonColor: "#10B981"
            });
        } catch (error) {
            console.error("Error deleting user:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudo eliminar el usuario",
                icon: "error",
                confirmButtonColor: "#6366F1"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (usuario) => {
        setUsuarioEdit({
            id: usuario.id,
            username: usuario.username,
            role: usuario.role,
            password: ""
        });
        setModalEditarOpen(true);
    };

    const handleUpdate = async () => {
        if (!usuarioEdit.username) {
            Swal.fire({
                title: "Datos incompletos",
                text: "El nombre de usuario no puede estar vacío",
                icon: "warning",
                confirmButtonColor: "#6366F1"
            });
            return;
        }

        setLoading(true);
        try {
            const response = await axios.put(
                `http://localhost:5016/api/usuarios/actualizar/${usuarioEdit.id}`,
                usuarioEdit,
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            console.log("Respuesta del backend:", response.data);
            fetchUsuarios();
            setModalEditarOpen(false);
            Swal.fire({
                title: "Éxito",
                text: "Usuario actualizado correctamente",
                icon: "success",
                confirmButtonColor: "#10B981"
            });
        } catch (error) {
            console.error("Error en la actualización:", error.response?.data || error.message);
            Swal.fire({
                title: "Error",
                text: "No se pudo actualizar el usuario",
                icon: "error",
                confirmButtonColor: "#6366F1"
            });
        } finally {
            setLoading(false);
        }
    };

    const resetFormFields = () => {
        setNuevoUsuario({ username: "", password: "", role: "empleado" });
        setUsuarioEdit({ id: "", username: "", role: "" });
    };

    const filteredUsers = usuarios
        .filter((u) => u.username.toLowerCase().includes(filtroNombre.toLowerCase()))
        .filter((u) => (filtroRol ? u.role === filtroRol : true));

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-4 md:p-6 mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center">
                        <FaUserShield className="mr-3 text-indigo-200" /> Gestión de Usuarios
                    </h2>
                    <p className="text-indigo-100 mt-2 max-w-xl">
                        Administra los usuarios del sistema, sus roles y permisos.
                    </p>
                </div>

                <div className="md:hidden mb-4">
                    <button
                        onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                        className="w-full bg-white text-indigo-600 rounded-lg shadow px-4 py-3 flex items-center justify-between"
                    >
                        <span className="font-medium flex items-center">
                            <FaFilter className="mr-2" /> Filtros
                        </span>
                        <span>{mobileFiltersOpen ? '−' : '+'}</span>
                    </button>
                </div>

                {/* Filtros */}
                <div className={`bg-white rounded-xl shadow-md p-4 md:p-6 mb-6 ${mobileFiltersOpen ? 'block' : 'hidden md:block'}`}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-700 mb-3 md:mb-0">Filtros de búsqueda</h3>
                        {esAdmin && (
                            <button
                                onClick={() => setModalAgregarOpen(true)}
                                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition duration-300 shadow flex items-center gap-2 w-full md:w-auto justify-center md:justify-start"
                            >
                                <FaPlus className="text-green-100" /> Agregar Usuario
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar por nombre..."
                                value={filtroNombre}
                                onChange={(e) => setFiltroNombre(e.target.value)}
                                className="pl-10 border p-3 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                            />
                        </div>
                        <select
                            value={filtroRol}
                            onChange={(e) => setFiltroRol(e.target.value)}
                            className="border p-3 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                        >
                            <option value="">Todos los roles</option>
                            <option value="admin">Administrador</option>
                            <option value="empleado">Empleado</option>
                        </select>
                    </div>
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center p-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-gray-500 text-lg">No se encontraron usuarios con esos criterios</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                                    <th className="px-4 py-3 md:px-6 md:py-4 text-left font-semibold">ID</th>
                                    <th className="px-4 py-3 md:px-6 md:py-4 text-left font-semibold">Username</th>
                                    <th className="px-4 py-3 md:px-6 md:py-4 text-left font-semibold">Rol</th>
                                    {esAdmin && <th className="px-4 py-3 md:px-6 md:py-4 text-center font-semibold">Acciones</th>}
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {filteredUsers.map((usuario) => (
                                    <tr key={usuario.id} className="hover:bg-indigo-50 transition duration-150">
                                        <td className="px-4 py-3 md:px-6 md:py-4 text-gray-800">{usuario.id}</td>
                                        <td className="px-4 py-3 md:px-6 md:py-4 font-medium text-gray-800">{usuario.username}</td>
                                        <td className="px-4 py-3 md:px-6 md:py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                usuario.role === 'admin'
                                                    ? 'bg-purple-100 text-purple-800'
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {usuario.role === 'admin' ? 'Administrador' : 'Empleado'}
                                            </span>
                                        </td>
                                        {esAdmin && (
                                            <td className="px-4 py-3 md:px-6 md:py-4 text-center">
                                                <div className="flex justify-center space-x-3">
                                                    <button
                                                        onClick={() => handleEditClick(usuario)}
                                                        className="text-blue-500 hover:text-blue-700 transition duration-150"
                                                        aria-label="Editar usuario"
                                                    >
                                                        <FaEdit className="text-lg" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(usuario.id)}
                                                        className="text-red-500 hover:text-red-700 transition duration-150"
                                                        aria-label="Eliminar usuario"
                                                    >
                                                        <FaTrash className="text-lg" />
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



                {/* modal */}
                {modalAgregarOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-500 to-green-600">
                                <h2 className="text-xl font-bold text-white flex items-center">
                                    <FaPlus className="mr-2" /> Agregar Usuario
                                </h2>
                                <button
                                    onClick={() => setModalAgregarOpen(false)}
                                    className="text-white hover:text-green-200 transition-colors"
                                >
                                    <FaTimes className="text-xl" />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Username:</label>
                                    <input
                                        type="text"
                                        value={nuevoUsuario.username}
                                        onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, username: e.target.value })}
                                        className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400"
                                        placeholder="Ingrese nombre de usuario"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Contraseña:</label>
                                    <input
                                        type="password"
                                        value={nuevoUsuario.password}
                                        onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })}
                                        className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400"
                                        placeholder="Ingrese contraseña"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Rol:</label>
                                    <select
                                        value={nuevoUsuario.role}
                                        onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, role: e.target.value })}
                                        className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400"
                                    >
                                        <option value="admin">Administrador</option>
                                        <option value="empleado">Empleado</option>
                                    </select>
                                </div>
                            </div>

                            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-4">
                                <button
                                    onClick={() => setModalAgregarOpen(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200 font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleCreate}
                                    disabled={loading}
                                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition duration-200 font-medium flex items-center"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Guardando...
                                        </>
                                    ) : (
                                        'Guardar Usuario'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/*  Modal editar usuario*/}
                {modalEditarOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500 to-blue-600">
                                <h2 className="text-xl font-bold text-white flex items-center">
                                    <FaEdit className="mr-2" /> Editar Usuario
                                </h2>
                                <button
                                    onClick={() => setModalEditarOpen(false)}
                                    className="text-white hover:text-blue-200 transition-colors"
                                >
                                    <FaTimes className="text-xl" />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Username:</label>
                                    <input
                                        type="text"
                                        value={usuarioEdit.username}
                                        onChange={(e) => setUsuarioEdit({ ...usuarioEdit, username: e.target.value })}
                                        className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                                        placeholder="Nombre de usuario"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Contraseña:</label>
                                    <input
                                        type="password"
                                        value={usuarioEdit.password || ""}
                                        onChange={(e) => setUsuarioEdit({ ...usuarioEdit, password: e.target.value })}
                                        className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                                        placeholder="Dejar vacío para mantener la contraseña actual"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">Dejar en blanco para mantener la contraseña actual</p>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Rol:</label>
                                    <select
                                        value={usuarioEdit.role}
                                        onChange={(e) => setUsuarioEdit({ ...usuarioEdit, role: e.target.value })}
                                        className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                                    >
                                        <option value="admin">Administrador</option>
                                        <option value="empleado">Empleado</option>
                                    </select>
                                </div>
                            </div>

                            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-4">
                                <button
                                    onClick={() => setModalEditarOpen(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200 font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    disabled={loading}
                                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition duration-200 font-medium flex items-center"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Actualizando...
                                        </>
                                    ) : (
                                        'Actualizar Usuario'
                                    )}
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