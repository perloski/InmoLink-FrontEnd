import React, { useState, useEffect } from 'react';
import Navbar from '../componentes/Navbar.jsx';
import { useNavigate } from 'react-router-dom';
import Propiedad from '../componentes/Propiedad.jsx';
import { API_URL } from '../config.js';

const HomeInmoLink = () => {
  const navigate = useNavigate();
  const [propiedades, setPropiedades] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estados para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const [filtros, setFiltros] = useState({
    busqueda: '',
    precio: { min: '', max: '' },
    metrosCuadrados: { min: '', max: '' },
    habitaciones: '',
    ambientes: '',
    ordenPrecio: 'asc'
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const sanitized = (type === 'number' && value !== '' && Number(value) < 0) ? '0' : value;
    setFiltros({ ...filtros, [name]: sanitized });
  };
  const handleNestedChange = (e, categoria, campo) => {
    const { value, type } = e.target;
    const sanitized = type === 'number' && value !== '' && Number(value) < 0 ? '0' : value;
    setFiltros({ ...filtros, [categoria]: { ...filtros[categoria], [campo]: sanitized } });
  };
  const handleKeyDown = (e) => { if (e.key === 'Enter') aplicarFiltros(1); };

  const aplicarFiltros = async (pagina = 1) => {
    setLoading(true);
    try {
      const payload = {
        filtros: {
          busqueda: filtros.busqueda,
          precio: { min: filtros.precio.min || undefined, max: filtros.precio.max || undefined },
          metrosCuadrados: { min: filtros.metrosCuadrados.min || undefined, max: filtros.metrosCuadrados.max || undefined },
          habitaciones: filtros.habitaciones ? Number(filtros.habitaciones) : undefined,
          ambientes: filtros.ambientes ? Number(filtros.ambientes) : undefined,
          ordenPrecio: filtros.ordenPrecio
        },
        pagina: pagina,
        limite: 21
      };
      const response = await fetch(`${API_URL}filtros/properties/filtrar`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success) {
        setPropiedades(data.propiedades);
        setTotalPaginas(data.totalPaginas);
        setPaginaActual(data.pagina);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => { aplicarFiltros(1); }, []);

  const manejarRuta = (propiedad) => {
    navigate(`/perfil/alquiler/${propiedad._id}`, { state: { propiedad } });
  }

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      aplicarFiltros(nuevaPagina);
    }
  };

  // --- LÓGICA ESTÉTICA PARA GENERAR NÚMEROS DE PÁGINA ---
  // Esto evita que se muestren 100 botones si hay 100 páginas.
  // Muestra: Primera, Última, Actual y sus vecinas.
  const obtenerNumerosPaginacion = () => {
    const delta = 1; // Cuántas páginas mostrar a los lados de la actual
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPaginas; i++) {
      if (i === 1 || i === totalPaginas || (i >= paginaActual - delta && i <= paginaActual + delta)) {
        range.push(i);
      }
    }

    range.forEach(i => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  return (
    <div className='min-h-screen bg-[#fdfcfb] font-sans'>
      <Navbar>
        <div className="flex w-full max-w-xl mx-auto group">
          <input type="text" name="busqueda" value={filtros.busqueda} onChange={handleChange} onKeyDown={handleKeyDown} className="w-full py-2.5 px-6 border-y border-l border-gray-200 rounded-l-full focus:outline-none focus:ring-1 focus:ring-black/5 bg-white/50 backdrop-blur-sm transition-all" placeholder="Buscar residencias, villas..." />
          <button type="button" onClick={() => aplicarFiltros(1)} className="px-8 py-2.5 text-white bg-black rounded-r-full hover:bg-gray-800 transition-all font-semibold text-xs uppercase tracking-widest">
            Buscar
          </button>
        </div>
      </Navbar>

      <div className="container mx-auto p-6 md:p-12">
        <header className="mb-12 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-['Cormorant_Garamond'] text-gray-900 mb-4">Residencias Exclusivas</h1>
          <p className="text-gray-500 font-light tracking-widest uppercase text-xs">Encuentra tu próximo hogar con nosotros</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* BARRA LATERAL (Filtros) */}
          <aside className="w-full lg:w-1/4 lg:min-w-[300px]">
            <div className="sticky top-28 bg-white p-8 rounded-3xl luxury-shadow border border-gray-50">
              <h3 className="font-['Cormorant_Garamond'] text-2xl text-gray-900 mb-8 border-b border-gray-100 pb-4">
                Refinar Búsqueda
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Dormitorios</label>
                  <input type="number" min="0" name="habitaciones" value={filtros.habitaciones} onChange={handleChange} onKeyDown={(e) => e.key === '-' && e.preventDefault()} className="w-full border-gray-100 border-b p-2 focus:border-black outline-none transition-all text-sm bg-transparent" placeholder="Ej: 3" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Rango de Precio</label>
                  <div className="flex gap-4">
                    <input type="number" min="0" value={filtros.precio.min} onChange={(e) => handleNestedChange(e, 'precio', 'min')} onKeyDown={(e) => e.key === '-' && e.preventDefault()} className="w-1/2 border-gray-100 border-b p-2 focus:border-black outline-none transition-all text-sm bg-transparent" placeholder="Mín" />
                    <input type="number" min="0" value={filtros.precio.max} onChange={(e) => handleNestedChange(e, 'precio', 'max')} onKeyDown={(e) => e.key === '-' && e.preventDefault()} className="w-1/2 border-gray-100 border-b p-2 focus:border-black outline-none transition-all text-sm bg-transparent" placeholder="Máx" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Superficie (m²)</label>
                  <div className="flex gap-4">
                    <input type="number" min="0" value={filtros.metrosCuadrados.min} onChange={(e) => handleNestedChange(e, 'metrosCuadrados', 'min')} onKeyDown={(e) => e.key === '-' && e.preventDefault()} className="w-1/2 border-gray-100 border-b p-2 focus:border-black outline-none transition-all text-sm bg-transparent" placeholder="Mín" />
                    <input type="number" min="0" value={filtros.metrosCuadrados.max} onChange={(e) => handleNestedChange(e, 'metrosCuadrados', 'max')} onKeyDown={(e) => e.key === '-' && e.preventDefault()} className="w-1/2 border-gray-100 border-b p-2 focus:border-black outline-none transition-all text-sm bg-transparent" placeholder="Máx" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Ordenamiento</label>
                  <select name="ordenPrecio" value={filtros.ordenPrecio} onChange={handleChange} className="w-full border-gray-100 border-b p-2 bg-transparent focus:border-black outline-none cursor-pointer text-sm">
                    <option value="asc">Menor Precio</option>
                    <option value="desc">Mayor Precio</option>
                  </select>
                </div>
              </div>

              <button onClick={() => aplicarFiltros(1)} className="w-full mt-10 bg-black text-white font-bold text-[10px] uppercase tracking-[0.2em] py-4 rounded-full hover:bg-gray-800 transition-all active:scale-[0.98] luxury-shadow">
                {loading ? 'Filtrando...' : 'Aplicar Selección'}
              </button>
            </div>
          </aside>

          {/* CONTENIDO PRINCIPAL */}
          <main className="w-full lg:w-3/4">
            <div className="flex justify-between items-center mb-10 pb-4 border-b border-gray-100">
              <span className="text-gray-400 text-xs font-light tracking-widest uppercase">
                <span className="text-gray-900 font-bold">{propiedades.length}</span> Propiedades encontradas
              </span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100">
                Página {paginaActual} / {totalPaginas}
              </span>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
              </div>
            ) : propiedades.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {propiedades.map((prop) => (
                    <div key={prop._id} onClick={() => manejarRuta(prop)} className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl rounded-2xl">
                      <Propiedad propiedad={prop} />
                    </div>
                  ))}
                </div>

                {/* --- PAGINACIÓN ESTÉTICA --- */}
                <div className="flex justify-center items-center mt-12 gap-2 select-none">

                  {/* Botón Anterior */}
                  <button
                    onClick={() => cambiarPagina(paginaActual - 1)}
                    disabled={paginaActual === 1}
                    className={`h-10 w-10 flex items-center justify-center rounded-full transition-all duration-200 ${paginaActual === 1
                      ? 'text-gray-300 cursor-not-allowed bg-transparent'
                      : 'text-gray-600 hover:bg-white hover:text-blue-600 hover:shadow-md border border-transparent hover:border-gray-200 bg-white shadow-sm'
                      }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>

                  {/* Números Dinámicos */}
                  <div className="flex gap-2 bg-gray-100 p-1 rounded-full shadow-inner">
                    {obtenerNumerosPaginacion().map((num, index) => (
                      num === '...' ? (
                        <span key={index} className="h-8 w-8 flex items-center justify-center text-gray-400 font-bold">...</span>
                      ) : (
                        <button
                          key={index}
                          onClick={() => cambiarPagina(num)}
                          className={`h-8 w-8 flex items-center justify-center rounded-full text-sm font-bold transition-all duration-200 ${paginaActual === num
                            ? 'bg-white text-blue-600 shadow-md scale-105'
                            : 'text-gray-500 hover:bg-gray-200 hover:text-gray-800'
                            }`}
                        >
                          {num}
                        </button>
                      )
                    ))}
                  </div>

                  {/* Botón Siguiente */}
                  <button
                    onClick={() => cambiarPagina(paginaActual + 1)}
                    disabled={paginaActual === totalPaginas}
                    className={`h-10 w-10 flex items-center justify-center rounded-full transition-all duration-200 ${paginaActual === totalPaginas
                      ? 'text-gray-300 cursor-not-allowed bg-transparent'
                      : 'text-gray-600 hover:bg-white hover:text-blue-600 hover:shadow-md border border-transparent hover:border-gray-200 bg-white shadow-sm'
                      }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
                {/* --------------------------- */}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-lg font-medium">No encontramos propiedades.</p>
                <p className="text-sm">Intenta ajustar tus filtros de búsqueda.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
export default HomeInmoLink;