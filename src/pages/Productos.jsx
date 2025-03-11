import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2"
import { FaPlus } from "react-icons/fa";;
import { FaEdit, FaTrash } from "react-icons/fa";

const Productos = () => {
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
            Swal.fire("Error", "No se pudieron cargar las categorías", "error");
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


    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-6 text-purple-700">📦 Gestión de Productos</h2>
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => setModalOpen(true)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
                >
                    <FaPlus/> Agregar Producto
                </button>
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <input
                    type="text"
                    placeholder="🔍 Buscar por nombre..."
                    value={filtroNombre}
                    onChange={(e) => setFiltroNombre(e.target.value)}
                    className="border p-2 rounded shadow-sm focus:ring-2 focus:ring-purple-400"
                />
                <select
                    value={filtroCategoria}
                    onChange={(e) => setFiltroCategoria(e.target.value)}
                    className="border p-2 rounded shadow-sm focus:ring-2 focus:ring-purple-400"
                >
                    <option value="">Todas las Categorías</option>
                    {categorias.map((c) => (
                        <option key={c.id} value={c.nombre}>{c.nombre}</option>
                    ))}
                </select>
                <input
                    type="number"
                    placeholder="💲 Precio mínimo"
                    value={filtroPrecioMin}
                    onChange={(e) => setFiltroPrecioMin(e.target.value)}
                    className="border p-2 rounded shadow-sm focus:ring-2 focus:ring-purple-400"
                />
                <input
                    type="number"
                    placeholder="💲 Precio máximo"
                    value={filtroPrecioMax}
                    onChange={(e) => setFiltroPrecioMax(e.target.value)}
                    className="border p-2 rounded shadow-sm focus:ring-2 focus:ring-purple-400"
                />
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">

                <table className="w-full border-collapse border border-gray-300 shadow-lg">
                    <thead>
                    <tr className="bg-purple-600 text-white">
                        <th className="border px-4 py-2">Nombre</th>
                        <th className="border px-4 py-2">Descripción</th>
                        <th className="border px-4 py-2">Precio</th>
                        <th className="border px-4 py-2">Stock</th>
                        <th className="border px-4 py-2">Categoría</th>
                        <th className="border px-4 py-2">Agregado</th>
                        <th className="border px-4 py-2">Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {productos.map((producto) => (
                        <tr key={producto.id} className="hover:bg-gray-100">
                            <td className="border px-4 py-2">{producto.nombre}</td>
                            <td className="border px-4 py-2">{producto.descripcion}</td>
                            <td className="border px-4 py-2">${producto.precio}</td>
                            <td className={`border px-4 py-2 font-bold ${producto.cantidad < 5 ? "text-red-600" : "text-green-600"}`}>
                                {producto.cantidad}
                            </td>
                            <td className="border px-4 py-2">{producto.categoria}</td>
                            <td className="border px-4 py-2">
                                {new Date(producto.fechaCreacion).toLocaleDateString("es-ES", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                })}
                            </td>
                            <td className="border px-4 py-2 space-x-2 flex justify-center">
                                <button onClick={() => handleEditClick(producto)}
                                        className="text-blue-500 hover:text-blue-700 text-lg">
                                    <FaEdit/>
                                </button>
                                <button onClick={() => handleDelete(producto.id)}
                                        className="text-red-500 hover:text-red-700 text-lg">
                                    <FaTrash/>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL */}

            {modalAgregarOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-1/3">
                        <h2 className="text-2xl font-bold mb-4">➕ Agregar Producto</h2>

                        <label>Nombre:</label>
                        <input
                            type="text"
                            value={nuevoProducto.nombre}
                            onChange={(e) => setNuevoProducto({...nuevoProducto, nombre: e.target.value})}
                            className="border p-2 w-full rounded mb-4"
                        />

                        <label>Descripción:</label>
                        <textarea
                            value={nuevoProducto.descripcion}
                            onChange={(e) => setNuevoProducto({...nuevoProducto, descripcion: e.target.value})}
                            className="border p-2 w-full rounded mb-4"
                        ></textarea>

                        <label>Precio:</label>
                        <input
                            type="number"
                            value={nuevoProducto.precio}
                            onChange={(e) => setNuevoProducto({...nuevoProducto, precio: e.target.value})}
                            className="border p-2 w-full rounded mb-4"
                        />

                        <label>Cantidad:</label>
                        <input
                            type="number"
                            value={nuevoProducto.cantidad}
                            onChange={(e) => setNuevoProducto({...nuevoProducto, cantidad: e.target.value})}
                            className="border p-2 w-full rounded mb-4"
                        />

                        <label>Categoría:</label>
                        <select
                            value={nuevoProducto.categoriaId}
                            onChange={(e) => setNuevoProducto({...nuevoProducto, categoriaId: e.target.value})}
                            className="border p-2 w-full rounded mb-4"
                        >
                            <option value="">Seleccionar Categoría</option>
                            {categorias.map((c) => (
                                <option key={c.id} value={c.id}>{c.nombre}</option>
                            ))}
                        </select>

                        <div className="flex justify-end space-x-2">
                            <button onClick={() => setModalAgregarOpen(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition">
                                ❌ Cancelar
                            </button>
                            <button onClick={handleCreate}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
                                💾 Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-1/3">
                        <h2 className="text-2xl font-bold mb-4">✏️ Editar Producto</h2>

                        <label>Nombre:</label>
                        <input type="text" value={productoEdit.nombre}
                               onChange={(e) => setProductoEdit({...productoEdit, nombre: e.target.value})}
                               className="border p-2 w-full rounded mb-4"/>

                        <label>Descripción:</label>
                        <textarea value={productoEdit.descripcion}
                                  onChange={(e) => setProductoEdit({...productoEdit, descripcion: e.target.value})}
                                  className="border p-2 w-full rounded mb-4"></textarea>

                        <label>Precio:</label>
                        <input type="number" value={productoEdit.precio}
                               onChange={(e) => setProductoEdit({...productoEdit, precio: e.target.value})}
                               className="border p-2 w-full rounded mb-4"/>

                        <label>Cantidad:</label>
                        <input type="number" value={productoEdit.cantidad}
                               onChange={(e) => setProductoEdit({...productoEdit, cantidad: e.target.value})}
                               className="border p-2 w-full rounded mb-4"/>

                        <label>Categoría:</label>
                        <select value={productoEdit.categoriaId}
                                onChange={(e) => setProductoEdit({...productoEdit, categoriaId: e.target.value})}
                                className="border p-2 w-full rounded mb-4">
                            <option value="">Seleccionar Categoría</option>
                            {categorias.map((c) => (
                                <option key={c.id} value={c.id}>{c.nombre}</option>
                            ))}
                        </select>

                        <div className="flex justify-end space-x-2">
                            <button onClick={() => setModalOpen(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition">❌
                                Cancelar
                            </button>
                            <button onClick={handleUpdate}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">💾
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Productos;
