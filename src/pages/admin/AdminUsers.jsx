import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BadgeEstado from "../../componentesAdmin/BadgeEstado";
import ModalConfirmacion from "../../componentesAdmin/ModalConfirmacion";
import { API_URL } from '../../config.js';

export default function AdminUsers() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [loading, setLoading] = useState(true);

  const [busqueda, setBusqueda] = useState("");
  const [rol, setRol] = useState("");
  const [ordenar, setOrdenar] = useState("");

  const [modal, setModal] = useState(null);

  const cargar = async (page = 1) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (busqueda) params.set("busqueda", busqueda);
    if (rol) params.set("rol", rol);
    if (ordenar) params.set("ordenar", ordenar);
    params.set("pagina", page);
    params.set("limite", 20);

    try {
      const res = await fetch(`${API_URL}api/admin/users?${params}`, { credentials: "include" });
      const data = await res.json();
      setUsuarios(data.usuarios || []);
      setTotal(data.total || 0);
      setPagina(data.pagina || 1);
      setTotalPaginas(data.totalPaginas || 1);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { cargar(1); }, [busqueda, rol, ordenar]);

  const cambiarRol = async (id, nuevoRol) => {
    await fetch(`${API_URL}api/admin/users/${id}/role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ rol: nuevoRol }),
    });
    setModal(null);
    cargar(pagina);
  };

  const eliminar = async (id) => {
    await fetch(`${API_URL}api/admin/users/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setModal(null);
    cargar(pagina);
  };

  /*const guardarUsuario = async (id, data) => {
    await fetch(`${API_URL}api/admin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    setModal(null);
    cargar(pagina);
  };*/

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-['Cormorant_Garamond'] font-bold text-gray-900">Usuarios</h1>
        <span className="text-sm text-gray-500">{total} resultados</span>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl luxury-shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
          />
          <select
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
          >
            <option value="">Todos los roles</option>
            <option value="usuario">Usuario</option>
            <option value="admin">Admin</option>
          </select>
          <select
            value={ordenar}
            onChange={(e) => setOrdenar(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
          >
            <option value="">Más recientes</option>
            <option value="name_asc">Nombre A-Z</option>
            <option value="name_desc">Nombre Z-A</option>
            <option value="email_asc">Email A-Z</option>
            <option value="rol">Rol</option>
            <option value="antiguo">Más antiguos</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl luxury-shadow overflow-hidden">
        {loading ? (
          <p className="p-6 text-gray-500 text-center">Cargando...</p>
        ) : usuarios.length === 0 ? (
          <p className="p-6 text-gray-500 text-center">No se encontraron usuarios</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-xs">Usuario</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-xs">Email</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-xs">Rol</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-xs">Registro</th>
                  <th className="text-right px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-xs">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {usuarios.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {u.foto ? (
                          <img src={u.foto} alt="" className="h-10 w-10 rounded-full object-cover" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm font-bold">
                            {(u.name || u.email || "?")[0].toUpperCase()}
                          </div>
                        )}
                        <span className="font-semibold text-gray-900">{u.name || "Sin nombre"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{u.email}</td>
                    <td className="px-6 py-4"><BadgeEstado estado={u.rol} /></td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {new Date(u.createdAt).toLocaleDateString("es-AR")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/usuarios/${u._id}`)}
                          className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          Ver

                        </button>
                        {u.rol === "usuario" ? (
                          <button
                            onClick={() => setModal({ tipo: "hacerAdmin", usuario: u })}
                            className="px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                          >
                            Hacer Admin
                          </button>
                        ) : (
                          <button
                            onClick={() => setModal({ tipo: "quitarAdmin", usuario: u })}
                            className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            Quitar Admin
                          </button>
                        )}
                        <button
                          onClick={() => setModal({ tipo: "eliminar", usuario: u })}
                          className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPaginas > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-gray-100">
            <button
              onClick={() => cargar(pagina - 1)}
              disabled={pagina <= 1}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-600">Página {pagina} de {totalPaginas}</span>
            <button
              onClick={() => cargar(pagina + 1)}
              disabled={pagina >= totalPaginas}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {modal?.tipo === "hacerAdmin" && (
        <ModalConfirmacion
          titulo="Hacer Admin"
          mensaje={`¿Convertir a "${modal.usuario.name || modal.usuario.email}" en administrador?`}
          onConfirmar={() => cambiarRol(modal.usuario._id, "admin")}
          onCancelar={() => setModal(null)}
          textoConfirmar="Hacer Admin"
          variante="warning"
        />
      )}
      {modal?.tipo === "quitarAdmin" && (
        <ModalConfirmacion
          titulo="Quitar Admin"
          mensaje={`¿Remover el rol de administrador de "${modal.usuario.name || modal.usuario.email}"?`}
          onConfirmar={() => cambiarRol(modal.usuario._id, "usuario")}
          onCancelar={() => setModal(null)}
          textoConfirmar="Quitar Admin"
          variante="warning"
        />
      )}
      {modal?.tipo === "eliminar" && (
        <ModalConfirmacion
          titulo="Eliminar usuario"
          mensaje={`¿Eliminar a "${modal.usuario.name || modal.usuario.email}" y todas sus propiedades y reservas? Esta acción no se puede deshacer.`}
          onConfirmar={() => eliminar(modal.usuario._id)}
          onCancelar={() => setModal(null)}
          textoConfirmar="Eliminar"
          variante="danger"
        />
      )}
      {modal?.tipo === "editar" && (
        <ModalEditarUsuario
          usuarioId={modal.usuario._id}
          onGuardar={guardarUsuario}
          onCancelar={() => setModal(null)}
        />
      )}
    </div>
  );
}
