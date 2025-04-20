function cargarDatos(){
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const apiUrl = "https://ciisa.coningenio.cl/v1/about-us/";
    
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

            $("#about-container").empty();

            if (!response.data || response.data.length === 0) {
                $("#about-container").html("<p>No hay información disponible</p>");
                return;
            }

            for (let i = 0; i < response.data.length; i++) {
                var seccion = response.data[i];

                var titulo = typeof seccion.titulo === 'object' ? 
                            (seccion.titulo.esp || "Sin título") : 
                            seccion.titulo || "Sin título";
                            
                var descripcion = typeof seccion.descripcion === 'object' ? 
                                 (seccion.descripcion.esp || "Sin descripción") : 
                                 seccion.descripcion || "Sin descripción";

                var html = `
                <div class="container my-5">
                    <h2 class="text-center mb-4">${titulo}</h2>
                    <p>${descripcion}</p>
                </div>`;

                $("#about-container").append(html);
            }
        },
        error: function(xhr, status, error) {
            console.error("Error:", error);
            $("#about-container").html("<p>Error al cargar la información</p>");
        }
    });
}

$(document).ready(function(){
    cargarDatos();
});