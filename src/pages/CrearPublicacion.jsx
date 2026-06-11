import React, { useState } from 'react';
import Navbar from '../componentes/Navbar';
import { useNavigate } from 'react-router-dom';
import FormularioPropiedad from '../componentesPropiedades/organismos/FormularioPropiedad';
import { API_URL } from '../config.js';

const CrearPublicacion = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async (formData) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}properties`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Error al crear la publicación');
      }

      navigate('/perfil/mis-casas', { replace: true });

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfcfb]">
      <Navbar />
      <div className="container mx-auto px-6 py-12">

        <div className="flex items-center mb-12">
          <button 
            onClick={() => navigate(-1)} 
            className="p-3 bg-white shadow-sm rounded-full text-gray-400 hover:text-black transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-4xl md:text-5xl font-['Cormorant_Garamond'] font-bold text-gray-900 ml-8">Nueva Publicación</h1>
        </div>

        <div className="bg-white w-full max-w-5xl mx-auto rounded-[3rem] luxury-shadow overflow-hidden p-10 md:p-16 border border-gray-50">
            <h2 className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em] mb-12 text-center">Detalles de la Residencia</h2>

          {error && (
            <div className="mb-10 p-4 bg-red-50 text-red-700 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-center">
              {error}
            </div>
          )}

          <FormularioPropiedad onSubmit={handleCreate} loading={loading} />

        </div>
      </div>
    </div>
  );
};

export default CrearPublicacion;
