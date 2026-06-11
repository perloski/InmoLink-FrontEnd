import React, { useState } from 'react';
import Boton from '../../componentes/Boton';
import DatosPrincipales from '../moleculas/DatosPrincipales';
import SelectorServicios from '../moleculas/SelectorServicios';
import GaleriaFotos from '../moleculas/GaleriaFotos';
import Mapa from '../moleculas/Mapa';
import { API_URL } from '../../config.js';

export default function FormularioPropiedad({ onSubmit, loading }) {
  const [data, setData] = useState({
    titulo: '',
    descripcion: '',
    ubicacion: '',
    coordenadas: { lat: 0, lng: 0 },
    precio: '',
    tamanio: 1,
    habitaciones: 1,
    servicios: {
      basicos: { wifi: false, agua_caliente: false, aire_acondicionado: false, calefaccion: false, articulos_higiene: false },
      cocina: { cocina: false, microondas: false, heladera: false, horno: false, cafetera: false, utensilios_basicos: false },
      seguridad: { botiquin: false, detector_humo: false, detector_monoxido: false, extintor: false, caja_fuerte: false },
      estacionamiento: { estacionamiento_gratis: false, estacionamiento_paga: false, estacionamiento_cubierto: false },
      entretenimiento: { televisor: false, streaming: false, parlantes: false, juegos_mesa: false },
      accesibilidad: { rampa_acceso: false, ascensor: false, pasillos_anchos: false, banio_adaptado: false }
    },
    fotos: []
  });

  const [uploading, setUploading] = useState(false);

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

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Upload failed');
      }

      const result = await res.json();
      setData(prev => ({
        ...prev,
        fotos: [...prev.fotos, result.url]
      }));
    } catch (err) {
      console.error('Image upload failed:', err);
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const onRemove = (index) => {
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

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(data); }} className="space-y-8">
      <DatosPrincipales
        formData={data}
        handleChange={onInputChange}
      />

      <hr className="border-gray-200" />

      <SelectorServicios
        servicios={data.servicios}
        handleServiceChange={onServiceToggle}
      />

      <hr className="border-gray-200" />

      <Mapa
        coordenadas={data.coordenadas}
        handleLocationChange={onLocationUpdate}
      />

      <GaleriaFotos
        fotos={data.fotos}
        onUpload={onUpload}
        onRemove={onRemove}
        uploading={uploading}
      />

      <div className="flex justify-end pt-6">
        <div className="w-full md:w-1/3">
          <Boton type="submit" disabled={loading || uploading}>
            {loading ? 'Guardando...' : 'Publicar Propiedad'}
          </Boton>
        </div>
      </div>
    </form>
  );
}