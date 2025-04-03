var map;
function initMap() {
  var mapOptions = {
    center: { lat: -9.667241, lng: -35.73534 },
    zoom: 13,
    mapTypeId: "satellite", // roadmap, satellite, hybrid, terrain
  };
  map = new google.maps.Map(document.getElementById("map"), mapOptions);
}
