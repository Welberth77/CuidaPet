let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  var myLatlng = new google.maps.LatLng(-9.652692, -35.709994);

  var mapOptions = {
    zoom: 13,
    center: myLatlng,
    mapTypeId: "roadmap", //roadmap, satellite, hybrid, terrain
  };

  var map = new google.maps.Map(document.getElementById("map"), mapOptions);
}

initMap();
