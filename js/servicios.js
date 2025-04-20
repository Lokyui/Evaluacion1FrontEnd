// servicios.js - Script para cargar los servicios desde la API con jQuery
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página de servicios cargada, iniciando carga de datos...');
    cargarServicios();
});

function cargarServicios() {
    // Configuración para la llamada AJAX
    const headerParams = { 
        'Authorization': 'Bearer ciisa',
        'X-Requested-With': 'XMLHttpRequest'  // Encabezado requerido por CORS-Anywhere
    };
    
    // Array de proxies CORS para intentar si uno falla
    const proxies = [
        "https://cors-anywhere.herokuapp.com/",
        "https://api.allorigins.win/raw?url=",
        ""  // Sin proxy (como último recurso)
    ];
    
    const apiUrl = "https://ciisa.coningenio.cl/v1/services/";
    let currentProxyIndex = 0;
    
    // Función recursiva para intentar con diferentes proxies
    function intentarConProxy() {
        if (currentProxyIndex >= proxies.length) {
            console.error("Todos los métodos de proxy fallaron. No se pudieron cargar los datos.");
            mostrarError("No se pudieron cargar los servicios después de múltiples intentos. Por favor, intente más tarde.");
            return;
        }
        
        const currentProxy = proxies[currentProxyIndex];
        let fullUrl = "";
        
        if (currentProxy === "https://api.allorigins.win/raw?url=") {
            fullUrl = currentProxy + encodeURIComponent(apiUrl);
        } else if (currentProxy === "") {
            fullUrl = apiUrl;
        } else {
            fullUrl = currentProxy + apiUrl;
        }
        
        console.log(`Intento #${currentProxyIndex + 1}: Usando ${currentProxy ? 'proxy: ' + currentProxy : 'conexión directa'}`);
        console.log('URL completa:', fullUrl);
        
        // Configuración específica para cada tipo de proxy
        let ajaxConfig = {
            url: fullUrl,
            type: "GET",
            dataType: "json",
            headers: headerParams,
            timeout: 15000,  // 15 segundos de timeout
            success: function(data) {
                console.log('Datos de servicios recibidos correctamente');
                console.log(data);
                
                // Verificar si los datos son un array
                if (!Array.isArray(data)) {
                    console.log('Los datos recibidos no son un array, convirtiendo...');
                    // Si no es un array, pero necesitamos tratarlo como tal
                    const dataArray = [data];
                    displayServices(dataArray);
                } else {
                    console.log('Datos recibidos como array con', data.length, 'servicios');
                    for (let i = 0; i < data.length; i++) {
                        console.log('Servicio', i, ':', data[i]);
                    }
                    displayServices(data);
                }
            },
            error: function(xhr, status, error) {
                console.error(`Error con el proxy #${currentProxyIndex + 1}:`, error);
                console.log("Estado:", status);
                console.log("Código de estado:", xhr.status);
                console.log("Respuesta:", xhr.responseText);
                
                // Intentar con el siguiente proxy
                currentProxyIndex++;
                intentarConProxy();
            }
        };
        
        // Ajustes específicos para diferentes proxies
        if (currentProxy === "") {
            // Si estamos intentando sin proxy, modificamos algunas opciones
            ajaxConfig.crossDomain = true;
            ajaxConfig.xhrFields = {
                withCredentials: false
            };
        } else if (currentProxy === "https://cors-anywhere.herokuapp.com/") {
            // Asegurarse de que se envíen los encabezados específicos requeridos por CORS-Anywhere
            ajaxConfig.headers = {
                ...ajaxConfig.headers,
                'X-Requested-With': 'XMLHttpRequest',
                'Origin': window.location.origin
            };
        }
        
        // Realizar la petición
        $.ajax(ajaxConfig);
    }
    
    // Iniciar el proceso con el primer proxy
    intentarConProxy();
}

function mostrarError(mensaje) {
    $('#services-container').html(`
        <div class="col-12 text-center">
            <div class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-circle me-2"></i>
                ${mensaje}
            </div>
        </div>
    `);
}

// Función para mostrar los servicios en la página
function displayServices(services) {
    // Obtener el contenedor de servicios
    const servicesContainer = $('#services-container');
    
    if (!services || services.length === 0) {
        console.log('No se encontraron servicios para mostrar');
        servicesContainer.html(`
            <div class="col-12 text-center">
                <div class="alert alert-info" role="alert">
                    <i class="fas fa-info-circle me-2"></i>
                    No hay servicios disponibles en este momento.
                </div>
            </div>
        `);
        return;
    }
    
    console.log('Mostrando', services.length, 'servicios en la página');
    
    // Limpiar el contenedor
    servicesContainer.empty();
    
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
        
        console.log('Procesando servicio:', service.title);
        
        const serviceCard = $(`
            <div class="col-lg-6 mb-4">
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
            </div>
        `);
        
        servicesContainer.append(serviceCard);
    });
    
    console.log('Servicios mostrados correctamente');
}