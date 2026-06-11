import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BadgeEstado from "../../componentesAdmin/BadgeEstado";
import ModalConfirmacion from "../../componentesAdmin/ModalConfirmacion";
import AdminLayout from "../../componentesAdmin/AdminLayout";
import { API_URL } from '../../config.js';

export default function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [tab, setTab] = useState("propiedades");

  const cargar = async () => {
    try {
      const res = await fetch(`${API_URL}api/admin/users/${id}`, { credentials: "include" });
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { cargar(); }, [id]);

  const cambiarEstadoPropiedad = async (propId, nuevoEstado) => {
    await fetch(`${API_URL}api/admin/properties/${propId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ estado: nuevoEstado }),
    });
    setModal(null);
    cargar();
  };

  const eliminarPropiedad = async (propId) => {
    await fetch(`${API_URL}api/admin/properties/${propId}`, {
      method: "DELETE",
      credentials: "include",
    });
    setModal(null);
    cargar();
  };

  const guardarPropiedad = async (propId, formData) => {
    await fetch(`${API_URL}api/admin/properties/${propId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData),
    });
    setModal(null);
    cargar();
  };

  const actualizarReserva = async (reservaId, nuevoEstado) => {
    await fetch(`${API_URL}api/reservation/${reservaId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ estado: nuevoEstado }),
    });
    setModal(null);
    cargar();
  };

  if (loading) return <AdminLayout><p className="text-gray-500">Cargando...</p></AdminLayout>;
  if (!data) return <AdminLayout><p className="text-red-500">Usuario no encontrado</p></AdminLayout>;

  const { user, propiedades, reservasComoInquilino, reservasComoHost } = data;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Back button + header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/usuarios")}
            className="p-2 bg-white rounded-xl luxury-shadow hover:bg-gray-50 transition-colors text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-['Cormorant_Garamond'] font-bold text-gray-900">
              {user.name || "Sin nombre"}
            </h1>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* User info card */}
        <div className="bg-white rounded-2xl luxury-shadow p-6">
          <div className="flex items-start gap-6">
            {user.foto ? (
              <img src={user.foto} alt="" className="h-20 w-20 rounded-full object-cover" />
            ) : (
              <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-2xl font-bold">
                {(user.name || user.email || "?")[0].toUpperCase()}
              </div>
            )}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Rol</p>
                <BadgeEstado estado={user.rol} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Teléfono</p>
                <p className="text-sm text-gray-700 mt-1">{user.telefono || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Dirección</p>
                <p className="text-sm text-gray-700 mt-1">{user.direccion || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Registro</p>
                <p className="text-sm text-gray-700 mt-1">{new Date(user.createdAt).toLocaleDateString("es-AR")}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Descripción</p>
                <p className="text-sm text-gray-700 mt-1">{user.descripcion || "—"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 luxury-shadow w-fit">
          <button
            onClick={() => setTab("propiedades")}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-colors ${tab === "propiedades" ? "bg-black text-white" : "text-gray-600 hover:bg-gray-50"}`}
          >
            Propiedades ({propiedades.length})
          </button>
          <button
            onClick={() => setTab("reservas-inquilino")}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-colors ${tab === "reservas-inquilino" ? "bg-black text-white" : "text-gray-600 hover:bg-gray-50"}`}
          >
            Como Inquilino ({reservasComoInquilino.length})
          </button>
          <button
            onClick={() => setTab("reservas-host")}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-colors ${tab === "reservas-host" ? "bg-black text-white" : "text-gray-600 hover:bg-gray-50"}`}
          >
            Como Host ({reservasComoHost.length})
          </button>
        </div>

        {/* Tab: Properties */}
        {tab === "propiedades" && (
          <div className="bg-white rounded-2xl luxury-shadow overflow-hidden">
            {propiedades.length === 0 ? (
              <p className="p-6 text-gray-500 text-center">Este usuario no tiene propiedades publicadas</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-xs">Propiedad</th>
                      <th className="text-left px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-xs">Precio</th>
                      <th className="text-left px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-xs">Tamaño</th>
                      <th className="text-left px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-xs">Estado</th>
                      <th className="text-right px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-xs">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {propiedades.map((p) => (
                      <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {p.fotos?.[0] ? (
                              <img src={p.fotos[0]} alt="" className="h-10 w-10 rounded-lg object-cover" />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">Sin foto</div>
                            )}
                            <div>
                              <p className="font-semibold text-gray-900">{p.titulo}</p>
                              <p className="text-xs text-gray-500">{p.ubicacion}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">${p.precio?.toLocaleString()}/mes</td>
                        <td className="px-6 py-4 text-gray-600">{p.tamanio} m²</td>
                        <td className="px-6 py-4"><BadgeEstado estado={p.estado} /></td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setModal({ tipo: "editarPropiedad", propiedad: p })}
                              className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                              Editar
                            </button>
                            {p.estado === "pendiente" && (
                              <>
                                <button
                                  onClick={() => setModal({ tipo: "aprobar", propiedad: p })}
                                  className="px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                                >
                                  Aprobar
                                </button>
                                <button
                                  onClick={() => setModal({ tipo: "rechazar", propiedad: p })}
                                  className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                >
                                  Rechazar
                                </button>
                              </>
                            )}
                            {p.estado === "activa" && (
                              <button
                                onClick={() => setModal({ tipo: "pausar", propiedad: p })}
                                className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                              >
                                Pausar
                              </button>
                            )}
                            {p.estado === "pausada" && (
                              <button
                                onClick={() => setModal({ tipo: "activar", propiedad: p })}
                                className="px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                              >
                                Activar
                              </button>
                            )}
                            <button
                              onClick={() => setModal({ tipo: "eliminarPropiedad", propiedad: p })}
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
          </div>
        )}

        {/* Tab: Reservations as tenant */}
        {tab === "reservas-inquilino" && (
          <div className="bg-white rounded-2xl luxury-shadow overflow-hidden">
            {reservasComoInquilino.length === 0 ? (
              <p className="p-6 text-gray-500 text-center">Este usuario no tiene reservas como inquilino</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-xs">Propiedad</th>
                      <th className="text-left px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-xs">Fechas</th>
                      <th className="text-left px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-xs">Precio Total</th>
                      <th className="text-left px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-xs">Estado</th>
                      <th className="text-right px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-xs">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {reservasComoInquilino.map((r) => (
                      <tr key={r._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">{r.propiedadId?.titulo || "Propiedad eliminada"}</p>
                          <p className="text-xs text-gray-500">{r.propiedadId?.ubicacion}</p>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-xs">
                          {new Date(r.fechaInicio).toLocaleDateString("es-AR")} — {new Date(r.fechaFin).toLocaleDateString("es-AR")}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">${r.precioTotal?.toLocaleString()}</td>
                        <td className="px-6 py-4"><BadgeEstado estado={r.estado} /></td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {r.estado === "pendiente" && (
                              <>
                                <button
                                  onClick={() => setModal({ tipo: "activarReserva", reserva: r })}
                                  className="px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                                >
                                  Aprobar
                                </button>
                                <button
                                  onClick={() => setModal({ tipo: "rechazarReserva", reserva: r })}
                                  className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                >
                                  Rechazar
                                </button>
                              </>
                            )}
                            {r.estado === "activa" && (
                              <button
                                onClick={() => setModal({ tipo: "pausarReserva", reserva: r })}
                                className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                              >
                                Pausar
                              </button>
                            )}
                            {r.estado === "pausada" && (
                              <button
                                onClick={() => setModal({ tipo: "activarReserva", reserva: r })}
                                className="px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                              >
                                Activar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab: Reservations as host */}
        {tab === "reservas-host" && (
          <div className="bg-white rounded-2xl luxury-shadow overflow-hidden">
            {reservasComoHost.length === 0 ? (
              <p className="p-6 text-gray-500 text-center">Este usuario no tiene reservas como host</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-xs">Propiedad</th>
                      <th className="text-left px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-xs">Inquilino</th>
                      <th className="text-left px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-xs">Fechas</th>
                      <th className="text-left px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-xs">Precio Total</th>
                      <th className="text-left px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-xs">Estado</th>
                      <th className="text-right px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-xs">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {reservasComoHost.map((r) => (
                      <tr key={r._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">{r.propiedadId?.titulo || "Propiedad eliminada"}</p>
                          <p className="text-xs text-gray-500">{r.propiedadId?.ubicacion}</p>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{r.inquilinoId?.name || r.inquilinoId?.email || "—"}</td>
                        <td className="px-6 py-4 text-gray-600 text-xs">
                          {new Date(r.fechaInicio).toLocaleDateString("es-AR")} — {new Date(r.fechaFin).toLocaleDateString("es-AR")}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">${r.precioTotal?.toLocaleString()}</td>
                        <td className="px-6 py-4"><BadgeEstado estado={r.estado} /></td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {r.estado === "pendiente" && (
                              <>
                                <button
                                  onClick={() => setModal({ tipo: "activarReserva", reserva: r })}
                                  className="px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                                >
                                  Aprobar
                                </button>
                                <button
                                  onClick={() => setModal({ tipo: "rechazarReserva", reserva: r })}
                                  className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                >
                                  Rechazar
                                </button>
                              </>
                            )}
                            {r.estado === "activa" && (
                              <button
                                onClick={() => setModal({ tipo: "pausarReserva", reserva: r })}
                                className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                              >
                                Pausar
                              </button>
                            )}
                            {r.estado === "pausada" && (
                              <button
                                onClick={() => setModal({ tipo: "activarReserva", reserva: r })}
                                className="px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                              >
                                Activar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {modal?.tipo === "editarPropiedad" && (
        <ModalEditarPropiedad
          propiedadId={modal.propiedad._id}
          onGuardar={guardarPropiedad}
          onCancelar={() => setModal(null)}
        />
      )}
      {modal?.tipo === "aprobar" && (
        <ModalConfirmacion
          titulo="Aprobar propiedad"
          mensaje={`¿Aprobar "${modal.propiedad.titulo}"?`}
          onConfirmar={() => cambiarEstadoPropiedad(modal.propiedad._id, "activa")}
          onCancelar={() => setModal(null)}
          textoConfirmar="Aprobar"
          variante="success"
        />
      )}
      {modal?.tipo === "rechazar" && (
        <ModalConfirmacion
          titulo="Rechazar propiedad"
          mensaje={`¿Rechazar "${modal.propiedad.titulo}"?`}
          onConfirmar={() => cambiarEstadoPropiedad(modal.propiedad._id, "rechazada")}
          onCancelar={() => setModal(null)}
          textoConfirmar="Rechazar"
          variante="danger"
        />
      )}
      {modal?.tipo === "pausar" && (
        <ModalConfirmacion
          titulo="Pausar propiedad"
          mensaje={`¿Pausar "${modal.propiedad.titulo}"?`}
          onConfirmar={() => cambiarEstadoPropiedad(modal.propiedad._id, "pausada")}
          onCancelar={() => setModal(null)}
          textoConfirmar="Pausar"
          variante="warning"
        />
      )}
      {modal?.tipo === "activar" && (
        <ModalConfirmacion
          titulo="Activar propiedad"
          mensaje={`¿Activar "${modal.propiedad.titulo}"?`}
          onConfirmar={() => cambiarEstadoPropiedad(modal.propiedad._id, "activa")}
          onCancelar={() => setModal(null)}
          textoConfirmar="Activar"
          variante="success"
        />
      )}
      {modal?.tipo === "eliminarPropiedad" && (
        <ModalConfirmacion
          titulo="Eliminar propiedad"
          mensaje={`¿Eliminar "${modal.propiedad.titulo}"? Esta acción no se puede deshacer.`}
          onConfirmar={() => eliminarPropiedad(modal.propiedad._id)}
          onCancelar={() => setModal(null)}
          textoConfirmar="Eliminar"
          variante="danger"
        />
      )}
      {modal?.tipo === "activarReserva" && (
        <ModalConfirmacion
          titulo="Activar reserva"
          mensaje="¿Activar esta reserva?"
          onConfirmar={() => actualizarReserva(modal.reserva._id, "activa")}
          onCancelar={() => setModal(null)}
          textoConfirmar="Activar"
          variante="success"
        />
      )}
      {modal?.tipo === "rechazarReserva" && (
        <ModalConfirmacion
          titulo="Rechazar reserva"
          mensaje="¿Rechazar esta reserva?"
          onConfirmar={() => actualizarReserva(modal.reserva._id, "rechazada")}
          onCancelar={() => setModal(null)}
          textoConfirmar="Rechazar"
          variante="danger"
        />
      )}
      {modal?.tipo === "pausarReserva" && (
        <ModalConfirmacion
          titulo="Pausar reserva"
          mensaje="¿Pausar esta reserva?"
          onConfirmar={() => actualizarReserva(modal.reserva._id, "pausada")}
          onCancelar={() => setModal(null)}
          textoConfirmar="Pausar"
          variante="warning"
        />
      )}
    </AdminLayout>
  );
}
