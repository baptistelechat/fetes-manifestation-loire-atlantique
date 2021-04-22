var map = function (p) {
  //Variables for API call and JSON use
  let eventsApi;
  let bigCities;
  // Variables for geoJSON
  let geoJSON;
  let polygons;
  let allCoordinates = [];
  // Current month
  let month;
  // Create a variable to hold our map
  let myMap;
  // Create a new Mappa instance using Leaflet.
  let mappa = new Mappa("Leaflet");

  // Put all map options in a single object
  let options = {
    // Use coordinates of Sucé-sur-Erdre for center map on screen
    lat: 47.341551,
    lng: -1.5285694,
    zoom: 9,
    // style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
    style:
      "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
  };

  p.preload = function () {
    // Get data of API and JSON
    // Link of dataset : https://data.loire-atlantique.fr/explore/dataset/793866443_fetes-et-manifestations-en-loire-atlantique/table/?disjunctive.commune
    eventsApi = p.loadJSON(
      "https://data.loire-atlantique.fr/api/records/1.0/search/?dataset=793866443_fetes-et-manifestations-en-loire-atlantique&q=&rows=-1"
    );
    geoJSON = p.loadJSON("../res/data/departement-44-loire-atlantique.geojson");
    bigCities = p.loadJSON("../res/data/communauteCommunes.json");
  };

  // p5.js setup
  p.setup = function () {
    // Create a canvas fullscreen
    let canvas = p.createCanvas(p.windowWidth, p.windowHeight);

    // Create a tile map with options
    myMap = mappa.tileMap(options);

    // Overlay the canvas over the tile map
    myMap.overlay(canvas);

    // Convert GeoJSON file to an Array
    polygons = myMap.geoJSON(geoJSON, "Polygon");
    polygons.forEach(function (pt) {
      pt.forEach(function (coordinate) {
        allCoordinates.push(coordinate);
      });
    });
    // Only redraw the point when the map changes and not every frame.
    // myMap.onChange(p.drawPoints);
  };

  // Make responsive
  // p.windowResized = function () {
  //   p.resizeCanvas(p.windowWidth * 0.7, p.windowHeight);
  // };

  p.draw = function () {
    month = document.querySelector("#sliderLabel").textContent.substr(0, 2);
    // Clear the previous canvas on every frame
    p.clear();

    let zoom = myMap.zoom();

    // Get a list of event who is match with current month
    let cityList = [];
    if (eventsApi) {
      let DataLength = eventsApi.records.length;
      for (let i = 0; i < DataLength; i++) {
        let currentEvent = eventsApi.records[i];
        let schedule = currentEvent.fields.ouverturegranule.split(",");
        let openingMonth = [];
        for (let i = 0; i < schedule.length; i++) {
          let open = schedule[i].substr(3, 2);
          openingMonth.push(open);
          let close = schedule[i].substr(15, 2);
          openingMonth.push(close);
        }
        let recurring = [...new Set(openingMonth)];
        if (openingMonth.includes(month)) {
          let coordinates = myMap.latLngToPixel(
            currentEvent.geometry.coordinates[1],
            currentEvent.geometry.coordinates[0]
          );
          if (zoom > 9) {
            if (recurring.length === 1) {
              p.fill(45, 197, 235); // single event
            } else {
              p.fill(50, 168, 82); // recurring event
            }
            p.ellipse(coordinates.x, coordinates.y, 20, 20);
          }
          cityList.push({
            name: currentEvent.fields.commune,
            coordX: coordinates.x,
            coordY: coordinates.y,
          });
        }
      }
    }

    // Calculate length between Event point and Big cities in Loire Atlantique base on community of towns
    // Get an array who contain all length for every Big Cities
    let distEventBigCities = [];
    for (let i = 0; i < Object.keys(bigCities).length; i++) {
      let pt = myMap.latLngToPixel(bigCities[i].coordX, bigCities[i].coordY);
      distEventBigCities[i] = [i];
      for (let j = 0; j < cityList.length; j++) {
        distEventBigCities[i][j] = p.dist(
          cityList[j].coordX,
          cityList[j].coordY,
          pt.x,
          pt.y
        );
      }
    }

    // Calculate mean of length
    let mean = [];
    for (let i = 0; i < distEventBigCities.length; i++) {
      let currentElement = distEventBigCities[i];
      let len = currentElement.length;
      let sum = 0;
      for (let j = 0; j < len; j++) {
        sum += currentElement[j];
      }
      let res = sum / len;
      mean.push(res);
    }
    // document.querySelector('.logName').innerHTML = mean

    // Use mean for set size of circle
    for (let i = 0; i < distEventBigCities.length; i++) {
      let pt = myMap.latLngToPixel(bigCities[i].coordX, bigCities[i].coordY);
      let size = (1 / mean[i]) * 11000;
      // let size = mean[i]/5
      if (zoom <=10 && zoom >=9) {
        p.fill(245, 66, 96, 100);
        p.ellipse(pt.x, pt.y, size, size);
      }
    }

    // Draw Loire Atlantique
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

    // Add a color to our ellipse
    p.stroke(100);
    p.strokeWeight(1);

    // for the latitude and longitude of Nantes Ynov Campus
    let ynov = myMap.latLngToPixel(47.2060661315918, -1.5389937162399292);
    // Using that position, draw an ellipse
    p.fill(228, 240, 0);
    p.ellipse(ynov.x, ynov.y, 20, 20);
  };
};
var myp5 = new p5(map, "map");
