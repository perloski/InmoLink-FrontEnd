import React, { useState, useEffect } from 'react';
import Navbar from '../componentes/Navbar';
import { useNavigate, useLocation } from 'react-router-dom';
import { obtenerPropiedad, editarPropiedades, eliminarPropiedad } from '../servicios/propiedad.service';
import SelectorServicios from '../componentesPropiedades/moleculas/SelectorServicios';
import GaleriaFotos from '../componentesPropiedades/moleculas/GaleriaFotos';
import Mapa from '../componentesPropiedades/moleculas/Mapa';
import { API_URL } from '../config.js';

export default function EditarPublicacion() {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.propiedadId;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) {
        setError('No property ID provided');
        setLoading(false);
        return;
      }
      try {
        const result = await obtenerPropiedad(id);
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const onServiceToggle = (category, service) => {
    setData(prev => ({
      ...prev,
      servicios: {
        ...prev.servicios,
        [category]: {
          ...prev.servicios[category],
          [service]: !prev.servicios[category][service]
        }
      }
    }));
  };

  const onUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const body = new FormData();
      body.append('image', file);

      const res = await fetch(`${API_URL}api/upload-property-image`, {
        method: 'POST',
        credentials: 'include',
        body
      });

      if (!res.ok) throw new Error('Upload failed');
      const result = await res.json();

      setData(prev => ({
        ...prev,
        fotos: [...(prev.fotos || []), result.url]
      }));
    } catch (err) {
      console.error('Upload error:', err);
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const onRemovePhoto = (index) => {
    setData(prev => ({
      ...prev,
      fotos: prev.fotos.filter((_, i) => i !== index)
    }));
  };

  const onLocationUpdate = (e) => {
    setData(prev => ({
      ...prev,
      coordenadas: { lat: e.latlng.lat, lng: e.latlng.lng }
    }));
  };

  const onDelete = async () => {
    setDeleting(true);
    try {
      await eliminarPropiedad(id);
      navigate('/perfil/mis-casas');
    } catch (err) {
      setError(err.message);
      setShowConfirmModal(false);
    } finally {
      setDeleting(false);
    }
  };

  const onSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await editarPropiedades(id, data);
      navigate(`/perfil/alquiler/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p className="text-lg">Cargando...</p>
    </div>
  );

  if (error || !data) return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100">
          <p className="font-bold">Error</p>
          <p>{error || 'No se pudo cargar la propiedad'}</p>
        </div>
        <button onClick={() => navigate('/perfil/mis-casas')} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl">
          Volver
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fdfcfb]">
      <Navbar />
      
      <div className="container mx-auto px-6 py-12">
        <div className="flex items-center mb-12">
          <button onClick={() => navigate('/perfil/mis-casas')} className="p-3 bg-white shadow-sm rounded-full text-gray-400 hover:text-black transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 ml-8">Editar Residencia</h1>
        </div>

        <div className="bg-white w-full max-w-6xl mx-auto rounded-[3rem] shadow-xl overflow-hidden p-10 md:p-16 border border-gray-50">
          <form onSubmit={onSave} className="space-y-12">
            
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">Galería</h3>
              <GaleriaFotos
                fotos={data.fotos || []}
                onUpload={onUpload}
                onRemove={onRemovePhoto}
                uploading={uploading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Título</label>
                  <input
                    type="text"
                    name="titulo"
                    value={data.titulo || ''}
                    onChange={onInputChange}
                    className="w-full py-3 bg-transparent border-b border-gray-100 focus:border-black outline-none transition-all font-serif text-2xl font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Precio / Noche</label>
                    <input
                      type="number"
                      name="precio"
                      value={data.precio || ''}
                      onChange={onInputChange}
                      className="w-full py-3 bg-transparent border-b border-gray-100 focus:border-black outline-none transition-all font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Habitaciones</label>
                    <input
                      type="number"
                      name="habitaciones"
                      value={data.habitaciones || 1}
                      onChange={onInputChange}
                      className="w-full py-3 bg-transparent border-b border-gray-100 focus:border-black outline-none transition-all font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Ubicación</label>
                  <input
                    type="text"
                    name="ubicacion"
                    value={data.ubicacion || ''}
                    onChange={onInputChange}
                    className="w-full py-3 bg-transparent border-b border-gray-100 focus:border-black outline-none transition-all"
                  />
                </div>
              </div>

              <div className="h-full flex flex-col">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Descripción</label>
                <textarea
                  name="descripcion"
                  value={data.descripcion || ''}
                  onChange={onInputChange}
                  rows="8"
                  className="w-full p-6 rounded-3xl bg-gray-50 border-none focus:ring-1 focus:ring-black/5 outline-none resize-none flex-grow italic text-gray-600"
                ></textarea>
              </div>
            </div>

            {data.servicios && (
              <div className="space-y-6">
                <h3 className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">Amenidades</h3>
                <SelectorServicios
                  servicios={data.servicios}
                  handleServiceChange={onServiceToggle}
                />
              </div>
            )}

            {data.coordenadas && (
              <div className="space-y-6">
                <h3 className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">Geolocalización</h3>
                <div className="rounded-[2rem] overflow-hidden border border-gray-50">
                  <Mapa
                    coordenadas={data.coordenadas}
                    handleLocationChange={onLocationUpdate}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col-reverse md:flex-row gap-6 pt-10 border-t border-gray-50">
              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                className="w-full md:w-1/4 py-5 px-6 rounded-full bg-red-600 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all"
              >
                Eliminar
              </button>
              <button
                type="button"
                onClick={() => navigate('/perfil/mis-casas')}
                className="w-full md:w-1/4 py-5 px-6 rounded-full border border-gray-100 text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-black hover:bg-gray-50"
              >
                Descartar
              </button>
              <button
                type="submit"
                disabled={loading || uploading}
                className="w-full md:w-2/4 bg-black text-white font-bold text-[10px] uppercase tracking-[0.2em] py-5 px-6 rounded-full hover:bg-gray-800 shadow-xl disabled:opacity-50"
              >
                {loading || uploading ? 'Guardando...' : 'Guardar Modificaciones'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-white rounded-[2.5rem] p-12 w-full max-w-md border border-gray-50 shadow-xl">
            <p className="text-gray-900 mb-8 text-center text-3xl font-['Cormorant_Garamond'] font-bold leading-tight">
              {deleting ? "Eliminando..." : "Eliminar publicacion? Esta accion no se puede deshacer."}
            </p>
            <div className="flex flex-col space-y-4">
              <button
                onClick={onDelete}
                disabled={deleting}
                className={`w-full py-4 text-white rounded-full font-bold text-[10px] uppercase tracking-[0.2em] transition-all
                  ${deleting
                    ? 'bg-red-300 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 transform hover:-translate-y-0.5 luxury-shadow'}`}
              >
                {deleting ? "Por favor espere..." : "Eliminar"}
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={deleting}
                className={`w-full py-4 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] transition-all
                  ${deleting
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-400 hover:text-black hover:bg-gray-50'}`}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}