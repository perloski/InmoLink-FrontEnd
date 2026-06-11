import { API_URL } from '../config.js';

export const verPropiedades = async () => {
    const response = await fetch(`${API_URL}properties/mine`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Error al obtener las propiedades");
    }
    const data = await response.json();
    return data;
}

export const obtenerPropiedad = async (id) => {
    const response = await fetch(`${API_URL}properties/${id}`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Error al obtener la propiedad");
    }
    const data = await response.json();
    return data;
}

export const editarPropiedades = async (id, credenciales) => {
    const response = await fetch(`${API_URL}properties/${id}`, {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify(credenciales),
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Error al editar la propiedad");
    }
    const data = await response.json();
    return data;
}