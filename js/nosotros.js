// nosotros.js - Script para cargar la información de Nosotros desde la API con jQuery
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página cargada, iniciando carga de datos...');
    cargarDatos();
});

function cargarDatos() {
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
    
    const apiUrl = "https://ciisa.coningenio.cl/v1/about-us/";
    let currentProxyIndex = 0;
    
    // Función recursiva para intentar con diferentes proxies
    function intentarConProxy() {
        if (currentProxyIndex >= proxies.length) {
            console.error("Todos los métodos de proxy fallaron. No se pudieron cargar los datos.");
            mostrarError("No se pudo cargar la información después de múltiples intentos. Por favor, intente más tarde.");
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
                console.log('Datos recibidos correctamente');
                console.log(data);
                
                // Verificar si los datos son un array
                if (!Array.isArray(data)) {
                    console.log('Los datos recibidos no son un array');
                    mostrarInformacion(data);
                } else {
                    console.log('Datos recibidos como array con', data.length, 'elementos');
                    for (let i = 0; i < data.length; i++) {
                        console.log('Elemento', i, ':', data[i]);
                    }
                    // Si es un array, mostrar solo el primer elemento o todos según necesidades
                    if (data.length > 0) {
                        mostrarInformacion(data[0]);
                    } else {
                        mostrarError("No se encontró información para mostrar");
                    }
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
    $('#about-container').html(`
        <div class="text-center">
            <div class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-circle me-2"></i>
                ${mensaje}
            </div>
        </div>
    `);
}

function mostrarInformacion(info) {
    // Asumiendo que tenemos un contenedor con id "about-container"
    const aboutContainer = $('#about-container');
    
    if (!info || Object.keys(info).length === 0) {
        aboutContainer.html(`
            <div class="text-center">
                <div class="alert alert-info" role="alert">
                    <i class="fas fa-info-circle me-2"></i>
                    No hay información disponible en este momento.
                </div>
            </div>
        `);
        return;
    }
    
    // Limpiar contenedor
    aboutContainer.empty();
    
    // Crear la sección de Misión y Visión
    const missionVisionSection = $('<div class="row g-4 mb-5"></div>');
    missionVisionSection.html(`
        <div class="col-md-6">
            <div class="card h-100 mission-card">
                <div class="card-body">
                    <h3 class="card-title mb-4">
                        <i class="fas fa-bullseye text-primary me-2"></i>Misión
                    </h3>
                    <p class="card-text">${info.mission}</p>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="card h-100 vision-card">
                <div class="card-body">
                    <h3 class="card-title mb-4">
                        <i class="fas fa-eye text-primary me-2"></i>Visión
                    </h3>
                    <p class="card-text">${info.vision}</p>
                </div>
            </div>
        </div>
    `);
    
    aboutContainer.append(missionVisionSection);
    
    // Crear la sección de Valores si existe
    if (info.values && info.values.length > 0) {
        const valuesSection = $('<div class="values-section mt-5"></div>');
        let valuesHTML = `
            <h3 class="text-center mb-4">Nuestros Valores</h3>
            <div class="row g-4">
        `;
        
        info.values.forEach(value => {
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
        valuesSection.html(valuesHTML);
        
        aboutContainer.append(valuesSection);
    }
    
    // Crear la sección de Historia si existe
    if (info.history) {
        const historySection = $('<div class="history-section mt-5"></div>');
        historySection.html(`
            <h3 class="text-center mb-4">Nuestra Historia</h3>
            <div class="row">
                <div class="col-lg-10 mx-auto">
                    <div class="card">
                        <div class="card-body">
                            <p class="card-text">${info.history}</p>
                        </div>
                    </div>
                </div>
            </div>
        `);
        
        aboutContainer.append(historySection);
    }
}