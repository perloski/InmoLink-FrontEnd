import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config.js';

export default function EditarUsuario() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState("https://via.placeholder.com/150");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch(`${API_URL}api/perfil`, {
          method: 'GET',
          credentials: 'include'
        });

        if (res.ok) {
          const data = await res.json();
          setName(data.name || "");
          setEmail(data.email || "");
          setBio(data.descripcion || "");
          setAddress(data.direccion || "");
          setPhone(data.telefono || "");
          setPreview(data.foto || "https://via.placeholder.com/150");
          setIsGoogleUser(data.esUsuarioGoogle || false);
        }
      } catch (err) {
        console.error('Failed to load user:', err);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const onImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`${API_URL}api/upload-profile-image`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setPreview(data.url);
      } else {
        const error = await res.json();
        alert('Upload failed: ' + (error.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}api/perfil`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name,
          email: isGoogleUser ? undefined : email,
          password: isGoogleUser ? undefined : password,
          descripcion: bio,
          direccion: address,
          telefono: phone,
          foto: preview,
        }),
      });
      navigate('/perfil', { replace: true });
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl overflow-hidden relative">
        <button
          onClick={() => navigate(-1)} 
          className="absolute top-6 left-6 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        <div className="p-8 pt-16">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Editar Perfil</h2>
          
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="relative group cursor-pointer">
                <img
                  src={preview}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 shadow-sm"
                />
                <label htmlFor="avatar-upload" className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  {uploading ? 'Subiendo...' : 'Subir'}
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onImageChange}
                  disabled={uploading}
                />
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">Toca para cambiar foto</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Descripción</label>
              <textarea
                rows="3"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Dirección</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Teléfono</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>

            {!isGoogleUser && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Nueva Contraseña</label>
                  <input
                    type="password"
                    placeholder="Dejar vacío para no cambiar"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
              </>
            )}

            {isGoogleUser && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                  Email y contraseña gestionados por Google.
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all mt-4"
            >
              Guardar Cambios
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
