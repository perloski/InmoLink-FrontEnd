import { API_URL } from '../config.js';
const RESERVATION_URL = `${API_URL}reservation`;

export const getReservationsByProperty = async (propertyId) => {
    try {
        const response = await fetch(`${RESERVATION_URL}/property/${propertyId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Error al obtener disponibilidad');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en getReservationsByProperty:', error);
        throw error;
    }
};

export const getHostReservations = async () => {
    try {
        const response = await fetch(`${RESERVATION_URL}/host`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Error al obtener solicitudes');
        return await response.json();
    } catch (error) {
        console.error('Error en getHostReservations:', error);
        throw error;
    }
};

export const updateReservationStatus = async (id, status) => {
    try {
        const response = await fetch(`${RESERVATION_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ estado: status }),
        });
        if (!response.ok) throw new Error('Error al actualizar estado');
        return await response.json();
    } catch (error) {
        console.error('Error en updateReservationStatus:', error);
        throw error;
    }
};

export const createReservation = async (reservationData) => {
    try {
        const response = await fetch(RESERVATION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(reservationData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al crear la reserva');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en createReservation:', error);
        throw error;
    }
};

export const getMyReservations = async () => {
    try {
        const response = await fetch(RESERVATION_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Error al obtener reservas');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en getMyReservations:', error);
        throw error;
    }
};
