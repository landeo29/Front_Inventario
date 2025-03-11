import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import Home from "./pages/Home";
import Usuarios from "./pages/Usuarios";
import Productos from "./pages/Productos";
import Categorias from "./pages/Categorias";
import Sidebar from "./components/Sidebar";

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<Login />} />

                    <Route path="/home" element={
                        <ProtectedRoute>
                            <div className="flex">
                                <Sidebar />
                                <div className="flex-1 p-6">
                                    <Home />
                                </div>
                            </div>
                        </ProtectedRoute>
                    } />

                    <Route path="/usuarios" element={
                        <ProtectedRoute>
                            <div className="flex">
                                <Sidebar />
                                <div className="flex-1 p-6">
                                    <Usuarios />
                                </div>
                            </div>
                        </ProtectedRoute>
                    } />

                    <Route path="/productos" element={
                        <ProtectedRoute>
                            <div className="flex">
                                <Sidebar />
                                <div className="flex-1 p-6">
                                    <Productos />
                                </div>
                            </div>
                        </ProtectedRoute>
                    } />

                    <Route path="/categorias" element={
                        <ProtectedRoute>
                            <div className="flex">
                                <Sidebar />
                                <div className="flex-1 p-6">
                                    <Categorias />
                                </div>
                            </div>
                        </ProtectedRoute>
                    } />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
