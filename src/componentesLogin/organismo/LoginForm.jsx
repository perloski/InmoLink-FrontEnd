import LoginFields from "../moleculas/LoginFields";
import Button from "../atomos/Button";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { LinkText } from "../atomos/LinkText";
import { API_URL } from '../../config.js';
function LoginForm() {
    const [form, setForm] = useState({
        email: '',
        password: ''
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
            const response = await fetch(`${API_URL}api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                body: JSON.stringify(form)
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.msg || 'Error al iniciar sesión');
                return;
            }

            if (response.ok) { 
                localStorage.setItem('token', data.token); //guarda el token el el localstorage (cookie)
            navigate("/");
            }

        } catch (err) {
            setError('Error de conexión: ' + err.message);
        } finally {
            setLoading(false);
        }
    };
    const handleGoogleLogin = () => {
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
            
            <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold">
                <LinkText text="¿No tienes cuenta?" linkText="Regístrate" to="/register" className="text-gray-400 hover:text-black transition-colors"/>
                <a href="#" className="text-gray-400 hover:text-black transition-colors">¿Olvidó su contraseña?</a>
            </div>

            {error && <p className="text-red-600 text-[10px] uppercase tracking-widest font-bold text-center bg-red-50 p-3 rounded-xl">{error}</p>}
            
            <div className="space-y-4 pt-4">
                <button 
                    onClick={handleSubmit}
                    disabled={loading} 
                    className="w-full py-4 rounded-full bg-black text-white text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-gray-800 transition-all transform hover:-translate-y-0.5 luxury-shadow disabled:opacity-50"
                >
                    {loading ? 'Procesando...' : 'Iniciar Sesión'}
                </button>

                <div className="relative flex items-center justify-center py-2">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                    <span className="relative bg-white px-4 text-[8px] uppercase tracking-[0.3em] text-gray-300 font-bold">O continuar con</span>
                </div>

                <button 
                    onClick={handleGoogleLogin}
                    disabled={loading} 
                    className="w-full py-4 rounded-full border border-gray-100 bg-white text-black text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
                >
                    <img src="https://www.svgrepo.com/show/355037/google.svg" className="h-4 w-4" alt="Google" />
                    Google Account
                </button>
            </div>
        </div>
    );
}

export default LoginForm;