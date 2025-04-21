import { fetchEvents, createEvent, updateEvent, deleteEvent } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    await loadAdminEvents();
    
    // Formulario para crear eventos
    const createEventForm = document.getElementById('create-event-form');
    createEventForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const eventData = {
            name: document.getElementById('event-name').value,
            description: document.getElementById('event-description').value,
            date: document.getElementById('event-date').value,
            location: document.getElementById('event-location').value,
            activity_type: document.getElementById('event-type').value
        };
        
        try {
            const newEvent = await createEvent(eventData);
            if (newEvent) {
                alert('Evento creado exitosamente!');
                createEventForm.reset();
                await loadAdminEvents();
            }
        } catch (error) {
            console.error('Error al crear evento:', error);
            alert('Error al crear el evento. Por favor intente nuevamente.');
        }
    });
});

async function loadAdminEvents() {
    const adminEventsList = document.getElementById('admin-events-list');
    adminEventsList.innerHTML = '<p>Cargando eventos...</p>';
    
    try {
        const events = await fetchEvents();
        
        if (events.length === 0) {
            adminEventsList.innerHTML = '<p>No hay eventos creados.</p>';
            return;
        }
        
        adminEventsList.innerHTML = '';
        
        const table = document.createElement('table');
        table.className = 'table table-striped table-hover';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Tipo</th>
                    <th>Fecha</th>
                    <th>Lugar</th>
                    <th>Registrados</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="admin-events-table-body">
            </tbody>
        `;
        
        adminEventsList.appendChild(table);
        const tableBody = document.getElementById('admin-events-table-body');
        
        events.forEach(event => {
            const eventDate = new Date(event.date);
            const formattedDate = eventDate.toLocaleDateString('es-MX', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${event.name}</td>
                <td>${event.activity_type}</td>
                <td>${formattedDate}</td>
                <td>${event.location}</td>
                <td>${event.registered_students}</td>
                <td>
                    <button class="btn btn-sm btn-warning edit-btn" data-event-id="${event.id}">Editar</button>
                    <button class="btn btn-sm btn-danger delete-btn" data-event-id="${event.id}">Eliminar</button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Agregar event listeners para los botones de editar y eliminar
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const eventId = e.target.getAttribute('data-event-id');
                openEditModal(eventId);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const eventId = e.target.getAttribute('data-event-id');
                if (confirm('¿Está seguro que desea eliminar este evento?')) {
                    deleteEventAndRefresh(eventId);
                }
            });
        });
        
    } catch (error) {
        console.error('Error al cargar eventos:', error);
        adminEventsList.innerHTML = '<p>Error al cargar los eventos. Por favor recargue la página.</p>';
    }
}

async function openEditModal(eventId) {
    // Implementar lógica para abrir un modal de edición
    // Similar al modal de registro pero para editar los datos del evento
    alert(`Editar evento con ID: ${eventId}. Esta funcionalidad se implementará en una versión futura.`);
}

async function deleteEventAndRefresh(eventId) {
    try {
        const result = await deleteEvent(eventId);
        if (result) {
            alert('Evento eliminado exitosamente!');
            await loadAdminEvents();
        }
    } catch (error) {
        console.error('Error al eliminar evento:', error);
        alert('Error al eliminar el evento. Por favor intente nuevamente.');
    }
}
