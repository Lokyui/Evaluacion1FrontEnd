// servicios.js - Script para cargar los servicios desde la API

document.addEventListener('DOMContentLoaded', function() {
    const servicesContainer = document.getElementById('services-container');
    
    // Función para cargar los servicios desde la API
    async function loadServices() {
        try {
            const response = await fetch('https://ciisa.coningenio.cl/v1/services/', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ciisa'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Error al cargar los servicios: ${response.status}`);
            }
            
            const data = await response.json();
            displayServices(data);
            
        } catch (error) {
            console.error('Error:', error);
            servicesContainer.innerHTML = `
                <div class="col-12 text-center">
                    <div class="alert alert-danger" role="alert">
                        <i class="fas fa-exclamation-circle me-2"></i>
                        Error al cargar los servicios. Por favor, intente nuevamente más tarde.
                    </div>
                </div>
            `;
        }
    }
    
    // Función para mostrar los servicios en la página
    function displayServices(services) {
        if (!services || services.length === 0) {
            servicesContainer.innerHTML = `
                <div class="col-12 text-center">
                    <div class="alert alert-info" role="alert">
                        <i class="fas fa-info-circle me-2"></i>
                        No hay servicios disponibles en este momento.
                    </div>
                </div>
            `;
            return;
        }
        
        // Limpiar el contenedor
        servicesContainer.innerHTML = '';
        
        // Iconos para cada tipo de servicio
        const serviceIcons = {
            'Consultoría Digital': 'fas fa-laptop-code',
            'Soluciones Multiexperiencia': 'fas fa-mobile-alt',
            'Evolución de Ecosistemas': 'fas fa-network-wired',
            'Soluciones Low-Code': 'fas fa-code'
        };
        
        // Crear tarjetas para cada servicio
        services.forEach((service, index) => {
            const icon = serviceIcons[service.title] || 'fas fa-cogs';
            const serviceId = service.title.toLowerCase().replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            
            const serviceCard = document.createElement('div');
            serviceCard.className = 'col-lg-6 mb-4';
            serviceCard.innerHTML = `
                <div id="${serviceId}" class="card h-100 service-detail-card">
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col-md-4 text-center mb-3 mb-md-0">
                                <div class="icon-wrapper mb-3">
                                    <i class="${icon} fa-3x text-primary"></i>
                                </div>
                            </div>
                            <div class="col-md-8">
                                <h3 class="card-title">${service.title}</h3>
                                <p class="card-text">${service.description}</p>
                                <h5 class="mt-3">Beneficios:</h5>
                                <ul class="benefits-list">
                                    ${service.benefits.map(benefit => `<li><i class="fas fa-check-circle text-primary me-2"></i>${benefit}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            servicesContainer.appendChild(serviceCard);
        });
    }
    
    // Cargar los servicios al iniciar la página
    loadServices();
});