import { useState, useEffect } from "react";
import BadgeEstado from "../../componentesAdmin/BadgeEstado";
import ModalConfirmacion from "../../componentesAdmin/ModalConfirmacion";
import { API_URL } from '../../config.js';

export default function AdminProperties() {
  const [propiedades, setPropiedades] = useState([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("");
  const [ordenar, setOrdenar] = useState("");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");

  // Modal
  const [modal, setModal] = useState(null); // { tipo, propiedad, accion }

  const cargar = async (page = 1) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (busqueda) params.set("busqueda", busqueda);
    if (estado) params.set("estado", estado);
    if (ordenar) params.set("ordenar", ordenar);
    if (precioMin) params.set("precioMin", precioMin);
    if (precioMax) params.set("precioMax", precioMax);
    params.set("pagina", page);
    params.set("limite", 15);

    try {
      const res = await fetch(`${API_URL}api/admin/properties?${params}`, { credentials: "include" });
      const data = await res.json();
      setPropiedades(data.propiedades || []);
      setTotal(data.total || 0);
      setPagina(data.pagina || 1);
      setTotalPaginas(data.totalPaginas || 1);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { cargar(1); }, [busqueda, estado, ordenar, precioMin, precioMax]);

  const cambiarEstado = async (id, nuevoEstado) => {
    await fetch(`${API_URL}api/admin/properties/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ estado: nuevoEstado }),
    });
    setModal(null);
    cargar(pagina);
  };

  const eliminar = async (id) => {
    await fetch(`${API_URL}api/admin/properties/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setModal(null);
    cargar(pagina);
  };

  /*const guardarPropiedad = async (id, data) => {
    await fetch(`${API_URL}api/admin/properties/${id}`, {
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
        <h1 className="text-3xl font-['Cormorant_Garamond'] font-bold text-gray-900">Propiedades</h1>
        <span className="text-sm text-gray-500">{total} resultados</span>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl luxury-shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Buscar por título o ubicación..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
          />
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
          >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="activa">Activa</option>
            <option value="pausada">Pausada</option>
            <option value="rechazada">Rechazada</option>
          </select>
          <select
            value={ordenar}
            onChange={(e) => setOrdenar(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
          >
            <option value="">Más recientes</option>
            <option value="precio_asc">Precio ↑</option>
            <option value="precio_desc">Precio ↓</option>
            <option value="tamanio_asc">Tamaño ↑</option>
            <option value="tamanio_desc">Tamaño ↓</option>
            <option value="titulo_asc">Título A-Z</option>
            <option value="estado">Estado</option>
          </select>
          <input
            type="number"
            placeholder="Precio mín"
            value={precioMin}
            onChange={(e) => setPrecioMin(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
          />
          <input
            type="number"
            placeholder="Precio máx"
            value={precioMax}
            onChange={(e) => setPrecioMax(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl luxury-shadow overflow-hidden">
        {loading ? (
          <p className="p-6 text-gray-500 text-center">Cargando...</p>
        ) : propiedades.length === 0 ? (
          <p className="p-6 text-gray-500 text-center">No se encontraron propiedades</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-xs">Propiedad</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-xs">Propietario</th>
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
                    <td className="px-6 py-4 text-gray-600">{p.propietarioId?.name || p.propietarioId?.email || "—"}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">${p.precio?.toLocaleString()}/mes</td>
                    <td className="px-6 py-4 text-gray-600">{p.tamanio} m²</td>
                    <td className="px-6 py-4"><BadgeEstado estado={p.estado} /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        
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
                          onClick={() => setModal({ tipo: "eliminar", propiedad: p })}
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

        {/* Pagination */}
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
      {modal?.tipo === "aprobar" && (
        <ModalConfirmacion
          titulo="Aprobar propiedad"
          mensaje={`¿Aprobar "${modal.propiedad.titulo}"?`}
          onConfirmar={() => cambiarEstado(modal.propiedad._id, "activa")}
          onCancelar={() => setModal(null)}
          textoConfirmar="Aprobar"
          variante="success"
        />
      )}
      {modal?.tipo === "rechazar" && (
        <ModalConfirmacion
          titulo="Rechazar propiedad"
          mensaje={`¿Rechazar "${modal.propiedad.titulo}"?`}
          onConfirmar={() => cambiarEstado(modal.propiedad._id, "rechazada")}
          onCancelar={() => setModal(null)}
          textoConfirmar="Rechazar"
          variante="danger"
        />
      )}
      {modal?.tipo === "pausar" && (
        <ModalConfirmacion
          titulo="Pausar propiedad"
          mensaje={`¿Pausar "${modal.propiedad.titulo}"?`}
          onConfirmar={() => cambiarEstado(modal.propiedad._id, "pausada")}
          onCancelar={() => setModal(null)}
          textoConfirmar="Pausar"
          variante="warning"
        />
      )}
      {modal?.tipo === "activar" && (
        <ModalConfirmacion
          titulo="Activar propiedad"
          mensaje={`¿Activar "${modal.propiedad.titulo}"?`}
          onConfirmar={() => cambiarEstado(modal.propiedad._id, "activa")}
          onCancelar={() => setModal(null)}
          textoConfirmar="Activar"
          variante="success"
        />
      )}
      {modal?.tipo === "eliminar" && (
        <ModalConfirmacion
          titulo="Eliminar propiedad"
          mensaje={`¿Eliminar "${modal.propiedad.titulo}"? Esta acción no se puede deshacer.`}
          onConfirmar={() => eliminar(modal.propiedad._id)}
          onCancelar={() => setModal(null)}
          textoConfirmar="Eliminar"
          variante="danger"
        />
      )}
      {modal?.tipo === "editar" && (
        <ModalEditarPropiedad
          propiedadId={modal.propiedad._id}
          onGuardar={guardarPropiedad}
          onCancelar={() => setModal(null)}
        />
      )}
    </div>
  );
}
