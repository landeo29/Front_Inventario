import React, { useState, useEffect } from "react";
import axios from "axios";

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [productoEdit, setProductoEdit] = useState({ id: "", nombre: "", descripcion: "", precio: "", cantidad: "", categoriaId: "" });

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
            } else {
                setError("No hay productos disponibles.");
            }
        } catch (error) {
            setError("Error al cargar productos.");
            console.error("Error al obtener productos:", error);
        }
    };

    const fetchCategorias = async () => {
        try {
            const response = await axios.get("http://localhost:5016/api/categorias/listar", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            if (response.status === 200) {
                setCategorias(response.data);
            } else {
                setError("No hay categorías disponibles.");
            }
        } catch (error) {
            console.error("Error al obtener categorías:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;

        try {
            await axios.delete(`http://localhost:5016/api/productos/eliminar/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            setProductos(productos.filter((p) => p.id !== id));
        } catch {
            setError("No se pudo eliminar el producto.");
        }
    };

    const handleEditClick = (producto) => {
        setProductoEdit({
            id: producto.id,
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio: producto.precio,
            cantidad: producto.cantidad,
            categoriaId: producto.categoriaId || "",
        });
        setModalOpen(true);
    };

    const handleUpdate = async () => {
        try {
            await axios.put(
                `http://localhost:5016/api/productos/actualizar/${productoEdit.id}`,
                {
                    nombre: productoEdit.nombre,
                    descripcion: productoEdit.descripcion,
                    precio: productoEdit.precio,
                    cantidad: productoEdit.cantidad,
                    categoriaId: categorias.find(c => c.nombre === productoEdit.categoria)?.id || productoEdit.categoriaId,
                },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            fetchProductos();
            setModalOpen(false);
        } catch {
            setError("No se pudo actualizar el producto.");
        }
    };


    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-6 text-purple-700">📦 Gestión de Productos</h2>

            {error && <p className="text-red-500">{error}</p>}

            <input
                type="text"
                placeholder="🔍 Buscar por nombre o categoría..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="border p-2 mb-4 w-full rounded shadow-sm focus:ring-2 focus:ring-purple-400"
            />

            {productos.length === 0 && !error ? (
                <p className="text-gray-500">No hay productos registrados.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 shadow-lg">
                        <thead>
                        <tr className="bg-purple-600 text-white">
                            <th className="border px-4 py-2">Nombre</th>
                            <th className="border px-4 py-2">Descripción</th>
                            <th className="border px-4 py-2">Precio</th>
                            <th className="border px-4 py-2">Cantidad</th>
                            <th className="border px-4 py-2">Categoría</th>
                            <th className="border px-4 py-2">Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {productos
                            .filter((p) => p.nombre.toLowerCase().includes(filtro.toLowerCase()) || p.categoria.toLowerCase().includes(filtro.toLowerCase()))
                            .map((producto) => (
                                <tr key={producto.id} className="hover:bg-gray-100">
                                    <td className="border px-4 py-2">{producto.nombre}</td>
                                    <td className="border px-4 py-2">{producto.descripcion}</td>
                                    <td className="border px-4 py-2">${producto.precio}</td>
                                    <td className="border px-4 py-2">{producto.cantidad}</td>
                                    <td className="border px-4 py-2">{producto.categoria}</td>
                                    <td className="border px-4 py-2 space-x-2">
                                        <button
                                            onClick={() => handleEditClick(producto)}
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(producto.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                        >
                                            🗑️ Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-1/3">
                        <h2 className="text-2xl font-bold mb-4">✏️ Editar Producto</h2>

                        <label className="block mb-2">Nombre:</label>
                        <input
                            type="text"
                            value={productoEdit.nombre}
                            onChange={(e) => setProductoEdit({ ...productoEdit, nombre: e.target.value })}
                            className="border p-2 w-full rounded mb-4"
                        />

                        <label className="block mb-2">Descripción:</label>
                        <textarea
                            value={productoEdit.descripcion}
                            onChange={(e) => setProductoEdit({ ...productoEdit, descripcion: e.target.value })}
                            className="border p-2 w-full rounded mb-4"
                        ></textarea>

                        <label className="block mb-2">Precio:</label>
                        <input
                            type="number"
                            value={productoEdit.precio}
                            onChange={(e) => setProductoEdit({ ...productoEdit, precio: e.target.value })}
                            className="border p-2 w-full rounded mb-4"
                        />

                        <label className="block mb-2">Cantidad:</label>
                        <input
                            type="number"
                            value={productoEdit.cantidad}
                            onChange={(e) => setProductoEdit({ ...productoEdit, cantidad: e.target.value })}
                            className="border p-2 w-full rounded mb-4"
                        />

                        <label className="block mb-2">Categoría:</label>
                        <select
                            value={productoEdit.categoriaId}
                            onChange={(e) => setProductoEdit({...productoEdit, categoriaId: Number(e.target.value)})}
                            className="border p-2 w-full rounded mb-4"
                        >
                            {categorias.map((categoria) => (
                                <option key={categoria.id} value={categoria.id}>
                                    {categoria.nombre}
                                </option>
                            ))}
                        </select>

                        <button onClick={handleUpdate} className="bg-green-500 text-white px-4 py-2 rounded">
                            💾 Guardar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Productos;
