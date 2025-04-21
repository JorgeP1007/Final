const API_BASE_URL = 'http://localhost:5000';

async function fetchEvents() {
    try {
        const response = await fetch(`${API_BASE_URL}/events`);
        if (!response.ok) {
            throw new Error('Error al cargar los eventos');
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

async function fetchEventById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/events/${id}`);
        if (!response.ok) {
            throw new Error('Error al cargar el evento');
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function createEvent(eventData) {
    try {
        const response = await fetch(`${API_BASE_URL}/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData),
        });
        
        if (!response.ok) {
            throw new Error('Error al crear el evento');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function updateEvent(id, eventData) {
    try {
        const response = await fetch(`${API_BASE_URL}/events/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData),
        });
        
        if (!response.ok) {
            throw new Error('Error al actualizar el evento');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function deleteEvent(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/events/${id}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            throw new Error('Error al eliminar el evento');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function registerForEvent(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/events/${id}/register`, {
            method: 'POST',
        });
        
        if (!response.ok) {
            throw new Error('Error al registrarse para el evento');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export { 
    fetchEvents, 
    fetchEventById, 
    createEvent, 
    updateEvent, 
    deleteEvent, 
    registerForEvent 
};
