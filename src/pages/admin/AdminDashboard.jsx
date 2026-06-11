import { useState, useEffect } from "react";
import { API_URL } from '../../config.js';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ propiedades: 0, usuarios: 0, pendientes: 0 });
  const [pendientes, setPendientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}api/admin/properties?limite=1000`, { credentials: "include" }).then((r) => r.json()),
      fetch(`${API_URL}api/admin/users?limite=1000`, { credentials: "include" }).then((r) => r.json()),
    ])
      .then(([props, users]) => {
        const pendientes = props.propiedades.filter((p) => p.estado === "pendiente");
        setStats({
          propiedades: props.total,
          usuarios: users.total,
          pendientes: pendientes.length,
        });
        setPendientes(pendientes.slice(0, 5));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500">Cargando...</p>;

  const cards = [
    { label: "Propiedades totales", value: stats.propiedades, color: "bg-blue-50 text-blue-700" },
    { label: "Usuarios totales", value: stats.usuarios, color: "bg-purple-50 text-purple-700" },
    { label: "Pendientes de revisión", value: stats.pendientes, color: "bg-yellow-50 text-yellow-700" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-['Cormorant_Garamond'] font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.label} className={`rounded-2xl p-6 ${card.color} luxury-shadow`}>
            <p className="text-sm font-medium uppercase tracking-widest opacity-70">{card.label}</p>
            <p className="text-4xl font-bold mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      {pendientes.length > 0 && (
        <div className="bg-white rounded-2xl luxury-shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Propiedades pendientes de revisión</h2>
          <div className="space-y-3">
            {pendientes.map((p) => (
              <div key={p._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-900">{p.titulo}</p>
                  <p className="text-sm text-gray-500">{p.ubicacion} — ${p.precio?.toLocaleString()}/mes</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                  Pendiente
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
