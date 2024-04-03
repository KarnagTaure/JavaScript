(function () {
  const lat = document.querySelector("#lat").value || 40.4194621;
  const lng = document.querySelector("#lng").value || -3.7016401;
  const mapa = L.map("mapa").setView([lat, lng], 16);
  let marker;

  //Utilizar Provider y Geo coder
  const geocodeService = L.esri.Geocoding.geocodeService();

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapa);

  //El pin de ubicacion
  marker = new L.marker([lat, lng], {
    draggable: true,
    autoPan: true,
  }).addTo(mapa);

  //Detectar el movimiento del pin
  marker.on("moveend", function (e) {
    marker = e.target;

    const posicion = marker.getLatLng();

    mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));

    //Obtener la infromacionm de las calles al soltarl el pin
    geocodeService
      .reverse()
      .latlng(posicion, 13)
      .run(function (error, resultado) {
        console.log(resultado);
        marker.bindPopup(resultado.address.LongLabel);

        //LLenar los campos

        //muestra debajo del mapa el nombre de la calle
        document.querySelector(".calle").textContent =
          resultado?.address?.Address ?? "";

        //saca los datos para guardar los en la base de datos
        document.querySelector("#calle").value =
          resultado?.address?.Address ?? "";
        document.querySelector("#lat").value = resultado?.latlng?.lat ?? "";
        document.querySelector("#lng").value = resultado?.latlng?.lng ?? "";
      });
  });
})();
