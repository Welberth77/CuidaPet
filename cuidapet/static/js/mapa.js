let map;
let userLocation;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  // Inicializa o mapa em um ponto padrão (caso o usuário não permita o acesso à sua localização)
  userLocation = new google.maps.LatLng(-9.652692, -35.709994);

  const mapOptions = {
    zoom: 13,
    center: userLocation,
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
        // A posição do usuário é salva para ser usada na busca de locais próximos
        userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // Atualiza o mapa e centraliza na localização do usuário
        map.setCenter(userLocation);
        map.setZoom(15);

        const marker = new google.maps.Marker({
          position: userLocation,
          map: map,
          title: "Você está aqui!",
          icon: {
            url: "https://cdn-icons-png.flaticon.com/512/616/616408.png",
            scaledSize: new google.maps.Size(30, 30),
          },
        });

        const infowindow = new google.maps.InfoWindow({
          content: "<strong>Você está aqui!</strong>",
        });

        marker.addListener("click", () => {
          infowindow.open(map, marker);
        });

      },
      () => {
        alert("Não foi possível obter sua localização.");
      }
    );
  } else {
    alert("Geolocalização não é suportada pelo seu navegador.");
  }
}

async function mostrarLocais() {
  const { PlacesService } = await google.maps.importLibrary("places");

  const service = new google.maps.places.PlacesService(map);
  const tipos = ["veterinary_care", "pet_store"];

  tipos.forEach((tipo) => {
    const request = {
      location: userLocation, // Agora usando a localização do usuário
      radius: 5000, // Raio de 5 km
      type: tipo,
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        results.forEach((place) => {
          criarMarcador(place, tipo);
        });
      }
    });
  });
}

function criarMarcador(place, tipo) {
  const icons = {
    veterinary_care: "https://maps.google.com/mapfiles/kml/shapes/hospitals.png",
    pet_store: "https://maps.google.com/mapfiles/kml/shapes/hospitals.png",
  };

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
    icon: {
      url: icons[tipo],
      scaledSize: new google.maps.Size(25, 25),
    },
    title: place.name,
  });

  const infowindow = new google.maps.InfoWindow({
    content: `<strong>${place.name}</strong><br>${place.vicinity}`,
  });

  marker.addListener("click", () => {
    infowindow.open(map, marker);
  });
}

window.initMap = initMap;
