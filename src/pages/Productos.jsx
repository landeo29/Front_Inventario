import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2"
import { useAuth } from "../context/AuthContext";
import { FaPlus, FaEdit, FaTrash, FaExclamationTriangle, FaSearch, FaFilter, FaDollarSign, FaBox } from "react-icons/fa";

const Productos = () => {
    const { user } = useAuth();
    const esAdmin = user?.role === "admin";
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [filtroNombre, setFiltroNombre] = useState("");
    const [filtroCategoria, setFiltroCategoria] = useState("");
    const [filtroPrecioMin, setFiltroPrecioMin] = useState("");
    const [filtroPrecioMax, setFiltroPrecioMax] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [productoEdit, setProductoEdit] = useState({
        id: "",
        nombre: "",
        descripcion: "",
        precio: "",
        cantidad: "",
        categoriaId: "",
    });
    const [modalAgregarOpen, setModalAgregarOpen] = useState(false);
    const [nuevoProducto, setNuevoProducto] = useState({
        nombre: "",
        descripcion: "",
        precio: "",
        cantidad: "",
        categoriaId: "",
    });

    useEffect(() => {
        fetchProductos();
        fetchCategorias();
    }, []);

    const fetchProductos = async () => {
        try {
            const response = await axios.get("http://localhost:5016/api/productos/listar", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            if (response.status === 200) {
                setProductos(response.data);
            }
        } catch {
            Swal.fire("Error", "No se pudieron cargar los productos", "error");
        }
    };

    const fetchCategorias = async () => {
        try {
            const response = await axios.get("http://localhost:5016/api/categorias/listar", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            if (response.status === 200) {
                setCategorias(response.data);
            }
        } catch {
            if (esAdmin) {
                Swal.fire("Error", "No se pudieron cargar las categorías", "error");
            }
        }
    };


    const handleDelete = async (id) => {
        const confirmDelete = await Swal.fire({
            title: "¿Estás seguro?",
            text: "¡Esta acción no se puede deshacer!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (!confirmDelete.isConfirmed) return;

        try {
            await axios.delete(`http://localhost:5016/api/productos/eliminar/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            fetchProductos();
            Swal.fire("Eliminado", "El producto ha sido eliminado", "success");
        } catch {
            Swal.fire("Error", "No se pudo eliminar el producto", "error");
        }
    };

    const handleEditClick = (producto) => {
        setProductoEdit({
            id: producto.id,
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio: producto.precio,
            cantidad: producto.cantidad,
            categoriaId: categorias.find((c) => c.nombre === producto.categoria)?.id || "",
        });
        setModalOpen(true);
    };

    const handleCreate = async () => {
        try {
            await axios.post("http://localhost:5016/api/productos/crear", nuevoProducto, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            fetchProductos();
            setModalAgregarOpen(false);
            Swal.fire("Creado", "El producto ha sido agregado correctamente", "success");
        } catch {
            Swal.fire("Error", "No se pudo agregar el producto", "error");
        }
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:5016/api/productos/actualizar/${productoEdit.id}`, productoEdit, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            fetchProductos();
            setModalOpen(false);
            Swal.fire("Actualizado", "El producto ha sido actualizado correctamente", "success");
        } catch {
            Swal.fire("Error", "No se pudo actualizar el producto", "error");
        }
    };

    const handleReportarInventario = async (producto) => {
        const confirmReport = await Swal.fire({
            title: "¿Reportar inventario bajo?",
            text: `El producto ${producto.nombre} tiene ${producto.cantidad} unidades.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, reportar",
            cancelButtonText: "Cancelar",
        });

        if (!confirmReport.isConfirmed) return;

        const reporte = {
            numeroDestino: "+51981791838",
            mensaje: `⚠️ Reporte de Inventario Bajo ⚠️\n\n📦 Producto: ${producto.nombre}\n📉 Stock: ${producto.cantidad}\n📅 Agregado el: ${new Date(producto.fechaCreacion).toLocaleDateString("es-ES")}`,
        };

        try {
            const response = await axios.post("http://localhost:5016/api/productos/reportar-inventario", reporte, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            if (response.status === 200) {
                Swal.fire("Enviado", "El reporte de inventario bajo ha sido enviado al administrador.", "success");
            } else {
                Swal.fire("Error", "No se pudo enviar el reporte.", "error");
            }
        } catch (error) {
            Swal.fire("Error", "Hubo un problema al enviar el reporte.", "error");
            console.error("Error al reportar inventario:", error);
        }
    };

    const productosFiltrados = productos.filter((producto) => {
        return (
            producto.nombre.toLowerCase().includes(filtroNombre.toLowerCase()) &&
            (filtroCategoria === "" || producto.categoriaId.toString() === filtroCategoria) &&
            (filtroPrecioMin === "" || producto.precio >= parseFloat(filtroPrecioMin)) &&
            (filtroPrecioMax === "" || producto.precio <= parseFloat(filtroPrecioMax))
        );
    });




    const generarReporte = async () => {
        try {
            const response = await fetch("http://localhost:5016/api/reporte/productos-inventario-bajo", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) {
                throw new Error("Error al generar el reporte");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "reporte_productos_inventario_bajo.pdf";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            Swal.fire({
                title: "📄 Reporte generado con éxito",
                text: "El archivo se ha descargado correctamente.",
                icon: "success",
                confirmButtonText: "OK",
                timer: 3000,
                timerProgressBar: true,
            });
        } catch (error) {
            console.error("Error al descargar el PDF:", error);

            Swal.fire({
                title: "Error al generar el reporte",
                text: "Hubo un problema al descargar el archivo. Intenta de nuevo.",
                icon: "error",
                confirmButtonText: "Cerrar",
            });
        }
    };


    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header  */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg p-4 md:p-6 mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center">
                        <FaBox className="mr-2 md:mr-3"/> Gestión de Productos
                    </h2>
                </div>

                {/*  filtros  */}
                <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4 md:mb-0">Filtros de búsqueda</h3>

                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            {esAdmin && (
                                <button
                                    onClick={generarReporte}
                                    className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-800 transition duration-300 shadow-md flex items-center justify-center gap-2 text-sm md:text-base"
                                >
                                    <span className="hidden sm:inline">📄</span> Generar Reporte PDF
                                </button>
                            )}

                            {esAdmin && (
                                <button
                                    onClick={() => setModalAgregarOpen(true)}
                                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition duration-300 shadow-md flex items-center justify-center gap-2 text-sm md:text-base"
                                >
                                    <FaPlus className="hidden sm:inline"/> Agregar Producto
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filtros rp */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400"/>
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar por nombre..."
                                value={filtroNombre}
                                onChange={(e) => setFiltroNombre(e.target.value)}
                                className="pl-10 text-center border border-gray-300 p-2 md:p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-400 w-full transition duration-200"
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaFilter className="text-gray-400"/>
                            </div>
                            <select
                                value={filtroCategoria}
                                onChange={(e) => setFiltroCategoria(e.target.value)}
                                className="pl-10 text-center border border-gray-300 p-2 md:p-3 rounded-lg shadow-sm w-full focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                            >
                                <option value="">Todas las Categorías</option>
                                {categorias.length > 0 ? (
                                    categorias.map((c) => (
                                        <option key={c.id} value={c.id}>{c.nombre}</option>
                                    ))
                                ) : (
                                    <option disabled>No hay categorías disponibles</option>
                                )}
                            </select>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaDollarSign className="text-gray-400"/>
                            </div>
                            <input
                                type="number"
                                placeholder="Precio mínimo"
                                value={filtroPrecioMin}
                                onChange={(e) => setFiltroPrecioMin(e.target.value)}
                                className="pl-10 text-center border border-gray-300 p-2 md:p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-400 w-full transition duration-200"
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaDollarSign className="text-gray-400"/>
                            </div>
                            <input
                                type="number"
                                placeholder="Precio máximo"
                                value={filtroPrecioMax}
                                onChange={(e) => setFiltroPrecioMax(e.target.value)}
                                className="pl-10 text-center border border-gray-300 p-2 md:p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-400 w-full transition duration-200"
                            />
                        </div>
                    </div>

                </div>

                {/* Tabla  */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse">
                            <thead>
                            <tr className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                                <th className="px-4 py-3 text-left font-semibold">Nombre</th>
                                <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Descripción</th>
                                <th className="px-4 py-3 text-left font-semibold">Precio</th>
                                <th className="px-4 py-3 text-left font-semibold">Stock</th>
                                <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">Categoría</th>
                                <th className="px-4 py-3 text-left font-semibold hidden lg:table-cell">Agregado</th>
                                <th className="px-4 py-3 text-center font-semibold">Acciones</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {productosFiltrados.map((producto) => (
                                <tr key={producto.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-4 py-3 font-medium text-gray-900">{producto.nombre}</td>
                                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                                        <div className="line-clamp-2">{producto.descripcion}</div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-900 font-medium">${producto.precio}</td>
                                    <td className={`px-4 py-3 font-bold ${
                                        producto.cantidad < 5
                                            ? "text-red-600 bg-red-50"
                                            : "text-green-600 bg-green-50"
                                    } rounded-lg text-center`}>
                                        {producto.cantidad}
                                    </td>
                                    <td className="px-4 py-3 hidden sm:table-cell">
                                        <span
                                            className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs md:text-sm whitespace-nowrap">
                                            {producto.categoria}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600 hidden lg:table-cell whitespace-nowrap">
                                        {new Date(producto.fechaCreacion).toLocaleDateString("es-ES", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric"
                                        })}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-center space-x-2">
                                            {esAdmin ? (
                                                <>
                                                    <button
                                                        onClick={() => handleEditClick(producto)}
                                                        className="bg-blue-100 text-blue-600 p-1.5 rounded-full hover:bg-blue-200 transition-colors duration-200"
                                                        title="Editar producto"
                                                    >
                                                        <FaEdit size={16}/>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(producto.id)}
                                                        className="bg-red-100 text-red-600 p-1.5 rounded-full hover:bg-red-200 transition-colors duration-200"
                                                        title="Eliminar producto"
                                                    >
                                                        <FaTrash size={16}/>
                                                    </button>
                                                </>
                                            ) : (
                                                producto.cantidad < 5 && (
                                                    <button
                                                        onClick={() => handleReportarInventario(producto)}
                                                        className="bg-yellow-100 text-yellow-600 p-1.5 rounded-full hover:bg-yellow-200 transition-colors duration-200"
                                                        title="Reportar producto con bajo stock"
                                                    >
                                                        <FaExclamationTriangle size={16}/>
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {productosFiltrados.length === 0 && (
                        <div className="text-center py-10 text-gray-500">
                            <FaBox className="mx-auto text-gray-300 mb-3" size={48}/>
                            <p>No se encontraron productos con los filtros seleccionados</p>
                        </div>
                    )}
                </div>
            </div>


            {/* Modal */}
            {modalAgregarOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
                    <div
                        className="bg-white p-5 md:p-8 rounded-lg shadow-lg w-full max-w-xl max-h-screen overflow-y-auto">
                        <h2 className="text-xl md:text-2xl font-bold mb-6 text-purple-700 flex items-center">
                            <FaPlus className="mr-2"/> Agregar Producto
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Nombre:</label>
                                <input
                                    type="text"
                                    value={nuevoProducto.nombre}
                                    onChange={(e) => setNuevoProducto({...nuevoProducto, nombre: e.target.value})}
                                    className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Descripción:</label>
                                <textarea
                                    value={nuevoProducto.descripcion}
                                    onChange={(e) => setNuevoProducto({...nuevoProducto, descripcion: e.target.value})}
                                    className="border border-gray-300 rounded-lg p-3 w-full h-20 focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Precio:</label>
                                    <div className="relative">
                                        <div
                                            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500">$</span>
                                        </div>
                                        <input
                                            type="number"
                                            value={nuevoProducto.precio}
                                            onChange={(e) => setNuevoProducto({
                                                ...nuevoProducto,
                                                precio: e.target.value
                                            })}
                                            className="pl-8 border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Cantidad:</label>
                                    <input
                                        type="number"
                                        value={nuevoProducto.cantidad}
                                        onChange={(e) => setNuevoProducto({...nuevoProducto, cantidad: e.target.value})}
                                        className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Categoría:</label>
                                <select
                                    value={nuevoProducto.categoriaId}
                                    onChange={(e) => setNuevoProducto({...nuevoProducto, categoriaId: e.target.value})}
                                    className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                                >
                                    <option value="">Seleccionar Categoría</option>
                                    {categorias.map((c) => (
                                        <option key={c.id} value={c.id}>{c.nombre}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-8">
                            <button
                                onClick={() => setModalAgregarOpen(false)}
                                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition duration-300 font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleCreate}
                                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition duration-300 shadow-md font-medium"
                            >
                                Guardar Producto
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Modal de editar */}
            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
                    <div
                        className="bg-white p-5 md:p-8 rounded-lg shadow-lg w-full max-w-xl max-h-screen overflow-y-auto">
                        <h2 className="text-xl md:text-2xl font-bold mb-6 text-purple-700 flex items-center">
                            <FaEdit className="mr-2"/> Editar Producto
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Nombre:</label>
                                <input
                                    type="text"
                                    value={productoEdit.nombre}
                                    onChange={(e) => setProductoEdit({...productoEdit, nombre: e.target.value})}
                                    className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Descripción:</label>
                                <textarea
                                    value={productoEdit.descripcion}
                                    onChange={(e) => setProductoEdit({...productoEdit, descripcion: e.target.value})}
                                    className="border border-gray-300 rounded-lg p-3 w-full h-20 focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Precio:</label>
                                    <div className="relative">
                                        <div
                                            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500">$</span>
                                        </div>
                                        <input
                                            type="number"
                                            value={productoEdit.precio}
                                            onChange={(e) => setProductoEdit({...productoEdit, precio: e.target.value})}
                                            className="pl-8 border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Cantidad:</label>
                                    <input
                                        type="number"
                                        value={productoEdit.cantidad}
                                        onChange={(e) => setProductoEdit({...productoEdit, cantidad: e.target.value})}
                                        className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Categoría:</label>
                                <select
                                    value={productoEdit.categoriaId}
                                    onChange={(e) => setProductoEdit({...productoEdit, categoriaId: e.target.value})}
                                    className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                                >
                                    <option value="">Seleccionar Categoría</option>
                                    {categorias.map((c) => (
                                        <option key={c.id} value={c.id}>{c.nombre}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-8">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition duration-300 font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition duration-300 shadow-md font-medium"
                            >
                                Actualizar Producto
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Productos;