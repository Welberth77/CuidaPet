let map;
let myLatlng;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  myLatlng = new google.maps.LatLng(-9.652692, -35.709994);

  const mapOptions = {
    zoom: 13,
    center: myLatlng,
    mapTypeId: "roadmap",
    styles: [
      {
        featureType: "poi",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "transit",
        stylers: [{ visibility: "off" }],
      },
    ],
  };

  map = new google.maps.Map(document.getElementById("map"), mapOptions);
}

function mostrarMinhaLocalizacao() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        const marker = new google.maps.Marker({
          position: pos,
          map: map,
          title: "Você está aqui!",
          icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            scaledSize: new google.maps.Size(30, 30), // ajustar Tamanho
          },
        });

        const infowindow = new google.maps.InfoWindow({
          content: "<strong>Você está aqui!</strong>",
        });

        marker.addListener("click", () => {
          infowindow.open(map, marker);
        });

        map.setCenter(pos);
        map.setZoom(15);
      },
      () => {
        alert("Não foi possível obter sua localizaCÃO.");
      }
    );
  } else {
    alert("Geolocalização não é suportada pelo seu navegador.");
  }
}

window.initMap = initMap;
