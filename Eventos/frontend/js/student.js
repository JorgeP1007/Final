import { fetchEvents, registerForEvent } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    await loadEvents();
    
    // Configurar el modal de registro
    const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
    const confirmRegisterBtn = document.getElementById('confirm-register');
    
    confirmRegisterBtn.addEventListener('click', async () => {
        const eventId = document.getElementById('event-id').value;
        const studentName = document.getElementById('student-name').value;
        const studentId = document.getElementById('student-id').value;
        const studentEmail = document.getElementById('student-email').value;
        
        if (!studentName || !studentId || !studentEmail) {
            alert('Por favor complete todos los campos');
            return;
        }
        
        try {
            const result = await registerForEvent(eventId);
            if (result) {
                alert('Registro exitoso!');
                registerModal.hide();
                await loadEvents();
            }
        } catch (error) {
            console.error('Error al registrarse:', error);
            alert('Error al registrarse. Por favor intente nuevamente.');
        }
    });
});

async function loadEvents() {
    const eventsList = document.getElementById('events-list');
    eventsList.innerHTML = '<p>Cargando eventos...</p>';
    
    try {
        const events = await fetchEvents();
        
        if (events.length === 0) {
            eventsList.innerHTML = '<p>No hay eventos programados en este momento.</p>';
            return;
        }
        
        eventsList.innerHTML = '';
        
        events.forEach(event => {
            const eventDate = new Date(event.date);
            const formattedDate = eventDate.toLocaleDateString('es-MX', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const eventCard = document.createElement('div');
            eventCard.className = 'col-md-4 mb-4';
            eventCard.innerHTML = `
                <div class="card event-card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${event.name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${event.activity_type}</h6>
                        <p class="card-text">${event.description}</p>
                        <ul class="list-group list-group-flush mb-3">
                            <li class="list-group-item"><strong>Fecha:</strong> ${formattedDate}</li>
                            <li class="list-group-item"><strong>Lugar:</strong> ${event.location}</li>
                            <li class="list-group-item"><strong>Registrados:</strong> ${event.registered_students}</li>
                        </ul>
                        <button class="btn btn-primary register-btn" data-event-id="${event.id}">Registrarse</button>
                    </div>
                </div>
            `;
            
            eventsList.appendChild(eventCard);
        });
        
        // Agregar event listeners a los botones de registro
        document.querySelectorAll('.register-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const eventId = e.target.getAttribute('data-event-id');
                const eventName = e.target.closest('.card').querySelector('.card-title').textContent;
                
                document.getElementById('event-id').value = eventId;
                document.getElementById('modal-event-name').textContent = `Evento: ${eventName}`;
                
                const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
                registerModal.show();
            });
        });
        
    } catch (error) {
        console.error('Error al cargar eventos:', error);
        eventsList.innerHTML = '<p>Error al cargar los eventos. Por favor recargue la página.</p>';
    }
}
