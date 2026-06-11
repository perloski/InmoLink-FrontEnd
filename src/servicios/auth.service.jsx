import { API_URL } from '../config.js';

export const deleteCuenta = async (password) =>{
    try{
        const respuesta = await fetch(`${API_URL}api/perfil`,{
        method: "DELETE",
        headers:{
            'Content-Type': 'application/json',

        },
        credentials: 'include',
        body: JSON.stringify({password: password})
        
    });
    return respuesta;
    }catch(error){
        throw new Error("Error de conexion con el servidor");
    }
}

export const logoutCuenta = async ()=>{

    try{
        const respuesta = await fetch(`${API_URL}api/logout`,{
        method: "POST",
        credentials: 'include'
    });
    return respuesta;

    }catch(error){
        throw new Error("Error de conexion con el servidor");
    }
}

export const getUserProfile = async () => {
    const res = await fetch(`${API_URL}api/perfil`, {
        method: 'GET',
        credentials: 'include'
    });
    
    if (!res.ok) {
        return null; 
    }
    
    return res.json();
}