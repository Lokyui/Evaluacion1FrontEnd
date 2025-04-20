function cargarServicios(){
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const apiUrl = "https://ciisa.coningenio.cl/v1/services/";
    
    $.ajax({
        url: proxyUrl + apiUrl,
        type: "GET",
        dataType: "json",
        headers: { 
            'Authorization': 'Bearer ciisa',
            'Accept': 'json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        success: function(response) {
            console.log("Respuesta:", response);

            $("#services-container").empty();

            if (!response.data || response.data.length === 0) {
                $("#services-container").html("<p>No hay servicios disponibles</p>");
                return;
            }
            
            for (let i = 0; i < response.data.length; i++) {
                var servicio = response.data[i];
                
                if (!servicio.activo) continue;

                var icono = "fas fa-cogs";
                var titulo = servicio.titulo.esp.toLowerCase();
                
                if (titulo.includes("consultoría")) {
                    icono = "fas fa-laptop-code";
                } else if (titulo.includes("multiexperiencia")) {
                    icono = "fas fa-mobile-alt";
                } else if (titulo.includes("ecosistemas")) {
                    icono = "fas fa-network-wired";
                } else if (titulo.includes("low-code")) {
                    icono = "fas fa-code";
                }

                var html = `
                <div class="col-md-6 col-lg-6 mb-4">
                    <div class="card h-100">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-3 text-center">
                                    <i class="${icono} fa-3x text-primary mb-3"></i>
                                </div>
                                <div class="col-md-9">
                                    <h4>${servicio.titulo.esp}</h4>
                                    <p>${servicio.descripcion.esp}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;

                $("#services-container").append(html);
            }
        },
        error: function(xhr, status, error) {
            console.error("Error:", error);
            $("#services-container").html("<p>Error al cargar los servicios</p>");
        }
    });
}

$(document).ready(function(){
    cargarServicios();
});