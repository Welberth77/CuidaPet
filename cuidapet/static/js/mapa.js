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
            url: "https://cdn-icons-png.flaticon.com/512/616/616408.png",
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
      location: myLatlng,
      radius: 5000,
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
    veterinary_care: "https://cdn-icons-png.flaticon.com/512/6036/6036818.png",
    pet_store: "https://cdn-icons-png.flaticon.com/512/3520/3520667.png",
  };

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
    icon: {
      url: icons[tipo],
      scaledSize: new google.maps.Size(25, 25), // ajustar Tamanho
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
