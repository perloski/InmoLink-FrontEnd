import LoginFields from "../moleculas/LoginFields";
import Button from "../atomos/Button";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { LinkText } from "../atomos/LinkText";
import { API_URL } from '../../config.js';

function RegisterForm() {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (field, value) => {
        setForm({ ...form, [field]: value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_URL}api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(form)
            });

            const data = await response.json();

            if (!response.ok) {
                // Manejar errores de validación de Zod o mensaje directo
                if (data.errors && Array.isArray(data.errors)) {
                    setError(data.errors[0].mensaje);
                } else {
                    setError(data.msg || 'Error al registrarse');
                }
                return;
            }
            navigate("/");
        } catch (err) {
            setError('Error de conexión: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleRegister = () => {
        setLoading(true);
        window.location.href = `${API_URL}auth/google`;
    };

    return (
        <div className="space-y-8">
            <LoginFields
                email={form.email}
                password={form.password}
                onChange={handleChange}
            />
            
            <div className="flex justify-center text-[10px] uppercase tracking-widest font-bold">
                <LinkText text="¿Ya tiene una cuenta?" linkText="Inicie Sesión" to="/login" className="text-gray-400 hover:text-black transition-colors"/>
            </div>

            {error && <p className="text-red-600 text-[10px] uppercase tracking-widest font-bold text-center bg-red-50 p-3 rounded-xl">{error}</p>}
            
            <div className="space-y-4 pt-4">
                <button 
                    onClick={handleSubmit}
                    disabled={loading} 
                    className="w-full py-4 rounded-full bg-black text-white text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-gray-800 transition-all transform hover:-translate-y-0.5 luxury-shadow disabled:opacity-50"
                >
                    {loading ? 'Creando cuenta...' : 'Registrarse Ahora'}
                </button>

                <div className="relative flex items-center justify-center py-2">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                    <span className="relative bg-white px-4 text-[8px] uppercase tracking-[0.3em] text-gray-300 font-bold">O unirse con</span>
                </div>

                <button 
                    onClick={handleGoogleRegister}
                    disabled={loading} 
                    className="w-full py-4 rounded-full border border-gray-100 bg-white text-black text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
                >
                    <img src="https://www.svgrepo.com/show/355037/google.svg" className="h-4 w-4" alt="Google" />
                    Google Identity
                </button>
            </div>
        </div>
    );
}

export default RegisterForm;