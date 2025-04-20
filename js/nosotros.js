// nosotros.js - Script para cargar la información de Nosotros desde la API

document.addEventListener('DOMContentLoaded', function() {
    const aboutContainer = document.getElementById('about-container');
    
    // Función para cargar la información de Nosotros desde la API
    async function loadAboutInfo() {
        try {
            const response = await fetch('https://ciisa.coningenio.cl/v1/about-us/', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ciisa'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Error al cargar la información: ${response.status}`);
            }
            
            const data = await response.json();
            displayAboutInfo(data);
            
        } catch (error) {
            console.error('Error:', error);
            aboutContainer.innerHTML = `
                <div class="text-center">
                    <div class="alert alert-danger" role="alert">
                        <i class="fas fa-exclamation-circle me-2"></i>
                        Error al cargar la información. Por favor, intente nuevamente más tarde.
                    </div>
                </div>
            `;
        }
    }
    
    // Función para mostrar la información de Nosotros en la página
    function displayAboutInfo(aboutInfo) {
        if (!aboutInfo || Object.keys(aboutInfo).length === 0) {
            aboutContainer.innerHTML = `
                <div class="text-center">
                    <div class="alert alert-info" role="alert">
                        <i class="fas fa-info-circle me-2"></i>
                        No hay información disponible en este momento.
                    </div>
                </div>
            `;
            return;
        }
        
        // Limpiar el contenedor
        aboutContainer.innerHTML = '';
        
        // Crear la sección de Misión y Visión
        const missionVisionSection = document.createElement('div');
        missionVisionSection.className = 'row g-4 mb-5';
        missionVisionSection.innerHTML = `
            <div class="col-md-6">
                <div class="card h-100 mission-card">
                    <div class="card-body">
                        <h3 class="card-title mb-4">
                            <i class="fas fa-bullseye text-primary me-2"></i>Misión
                        </h3>
                        <p class="card-text">${aboutInfo.mission}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card h-100 vision-card">
                    <div class="card-body">
                        <h3 class="card-title mb-4">
                            <i class="fas fa-eye text-primary me-2"></i>Visión
                        </h3>
                        <p class="card-text">${aboutInfo.vision}</p>
                    </div>
                </div>
            </div>
        `;
        
        aboutContainer.appendChild(missionVisionSection);
        
        // Crear la sección de Valores si existe
        if (aboutInfo.values && aboutInfo.values.length > 0) {
            const valuesSection = document.createElement('div');
            valuesSection.className = 'values-section mt-5';
            
            let valuesHTML = `
                <h3 class="text-center mb-4">Nuestros Valores</h3>
                <div class="row g-4">
            `;
            
            aboutInfo.values.forEach(value => {
                valuesHTML += `
                    <div class="col-md-4 mb-4">
                        <div class="card h-100">
                            <div class="card-body text-center">
                                <h4 class="card-title">${value.title}</h4>
                                <p class="card-text">${value.description}</p>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            valuesHTML += `</div>`;
            valuesSection.innerHTML = valuesHTML;
            
            aboutContainer.appendChild(valuesSection);
        }
        
        // Crear la sección de Historia si existe
        if (aboutInfo.history) {
            const historySection = document.createElement('div');
            historySection.className = 'history-section mt-5';
            historySection.innerHTML = `
                <h3 class="text-center mb-4">Nuestra Historia</h3>
                <div class="row">
                    <div class="col-lg-10 mx-auto">
                        <div class="card">
                            <div class="card-body">
                                <p class="card-text">${aboutInfo.history}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            aboutContainer.appendChild(historySection);
        }
    }
    
    // Cargar la información al iniciar la página
    loadAboutInfo();
});