var map = function (p) {
  // Variables for geoJSON
  let data;
  let polygons;
  let allCoordinates = [];
  // Create a variable to hold our map
  let myMap;
  // Create a new Mappa instance using Leaflet.
  const mappa = new Mappa("Leaflet");
  // Initialize eventsApi
  var eventsApi;

  // Lets put all our map options in a single object
  const options = {
    // Use coordinates of Sucé-sur-Erdre for center map
    lat: 47.341551,
    lng: -1.5285694,
    zoom: 9,
    // style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
    style:
      "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
  };

  p.preload = function () {
    // Get data of API
    // Link of dataset : https://data.loire-atlantique.fr/explore/dataset/793866443_fetes-et-manifestations-en-loire-atlantique/table/?disjunctive.commune
    p.loadJSON(
      "https://data.loire-atlantique.fr/api/records/1.0/search/?dataset=793866443_fetes-et-manifestations-en-loire-atlantique&q=&rows=-1",
      p.getData
    );
    data = p.loadJSON(
      "../res/data/departement-44-loire-atlantique.geojson",
      p.getGeoJSON
    );
  };

  // p5.js setup
  p.setup = function () {
    // Create a canvas 640x640
    // canvas = createCanvas(640,640);

    // Create a canvas fullscreen
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight);

    // Create a tile map with coordinates of Nantes Ynov Campus
    myMap = mappa.tileMap(options);

    // polygons = myMap.geoJSON(data, 'Polygon')
    // console.log(polygons)

    // Overlay the canvas over the tile map
    myMap.overlay(canvas);

    // Convert GeoJSON file to an Array
    polygons = myMap.geoJSON(data, "Polygon");
    polygons.forEach(function (trip) {
      trip.forEach(function (coordinate) {
        allCoordinates.push(coordinate);
      });
    });
    // Only redraw the point when the map changes and not every frame.
    myMap.onChange(p.drawPoints);
  };

  p.draw = function () {};

  // Make responsive
  // p.windowResized = function () {
  //   p.resizeCanvas(p.windowWidth * 0.7, p.windowHeight);
  //   p.drawYnov();
  // };

  p.getData = function (data) {
    eventsApi = data;
  };

  p.drawPoints = function () {
    // Clear the previous canvas on every frame
    p.clear();
    // Add a color to our ellipse
    p.stroke(100);
    p.strokeWeight(1);

    // for the latitude and longitude of Nantes Ynov Campus
    const ynov = myMap.latLngToPixel(47.2060661315918, -1.5389937162399292);

    // Using that position, draw an ellipse
    p.fill(245, 66, 96);
    p.ellipse(ynov.x, ynov.y, 20, 20);

    p.fill(120, 187, 204);
    if (eventsApi) {
      const DataLength = Object.keys(eventsApi.records).length;
      for (let i = 0; i < DataLength; i++) {
        const currentEvent = eventsApi.records[i];
        const coordinates = myMap.latLngToPixel(
          currentEvent.geometry.coordinates[1],
          currentEvent.geometry.coordinates[0]
        );
        p.ellipse(coordinates.x, coordinates.y, 20, 20);
      }
    }

    if (allCoordinates.length > 0) {
      p.noFill();
      p.beginShape();
      for (let i = 0; i < allCoordinates.length; i++) {
        let pos = myMap.latLngToPixel(
          allCoordinates[i][1],
          allCoordinates[i][0]
        );
        p.stroke(255, 255, 255, 90);
        p.strokeWeight(4);
        p.vertex(pos.x, pos.y);
      }
      p.endShape();
    }
  };
};
var myp5 = new p5(map, "map");
