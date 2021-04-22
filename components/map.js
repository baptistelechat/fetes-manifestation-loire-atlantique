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

  // Variables for weather
  let tab = [];
  let tabX = [];
  let rectX = 0;
  let pgSun;
  let pgStorm;
  let pgWind;

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
    p.ellipseMode(p.CENTER);
    p.rectMode(p.CENTER);
    p.imageMode(p.CENTER);

    for (i = 0; i < 50; i++) {
      tab[i] = p.random(0, 300);
      tabX[i] = p.random(0, 300);
    }

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
          // Display point and set color according with category
          if (zoom > 9) {
            switch (currentEvent.fields.categorie) {
              case "Spectacle":
              case "Théatre":
              case "Cinéma":
              case "Conférence":
              case "Festival":
              case "Concert":
                p.fill(0, 157, 224); // single event
                if (recurring.length === 1) {
                  p.ellipse(coordinates.x, coordinates.y, 20, 20); // single event
                } else {
                  p.rect(currentEvent.x, currentEvent.y, 20); // recurring event
                }
                let d1 = p.dist(
                  p.mouseX,
                  p.mouseY,
                  coordinates.x,
                  coordinates.y
                );
                if (d1 < 20) {
                  document.querySelector(
                    ".subtitle"
                  ).innerHTML = `📌 ${currentEvent.fields.categorie} : ${currentEvent.fields.nomoffre} (${currentEvent.fields.commune})`;
                }
                break;
              case "Sortie nature / environnement":
              case "Randonnée":
              case "Rallye":
              case "Visites et sorties à thèmes":
                p.fill(40, 149, 72); // single event
                if (recurring.length === 1) {
                  p.ellipse(coordinates.x, coordinates.y, 20, 20); // single event
                } else {
                  p.rect(coordinates.x, coordinates.y, 20); // recurring event
                }
                let d2 = p.dist(
                  p.mouseX,
                  p.mouseY,
                  coordinates.x,
                  coordinates.y
                );
                if (d2 < 20) {
                  document.querySelector(
                    ".subtitle"
                  ).innerHTML = `📌 ${currentEvent.fields.categorie} : ${currentEvent.fields.nomoffre} (${currentEvent.fields.commune})`;
                }
                break;
              case "Brocantes & vide-greniers":
              case "Marché":
              case "Fêtes populaires":
              case "Manifestation Nationale":
              case "Foire ou salon":
              case "Exposition":
                p.fill(220, 145, 27);
                if (recurring.length === 1) {
                  p.ellipse(coordinates.x, coordinates.y, 20, 20); // single event
                } else {
                  p.rect(coordinates.x, coordinates.y, 20); // recurring event
                }
                let d3 = p.dist(
                  p.mouseX,
                  p.mouseY,
                  coordinates.x,
                  coordinates.y
                );
                if (d3 < 20) {
                  document.querySelector(
                    ".subtitle"
                  ).innerHTML = `📌 ${currentEvent.fields.categorie} : ${currentEvent.fields.nomoffre} (${currentEvent.fields.commune})`;
                }
                break;
              case "Manifestation sportive":
              case "Danse (spectacle)":
                p.fill(90, 40, 127);
                if (recurring.length === 1) {
                  p.ellipse(coordinates.x, coordinates.y, 20, 20); // single event
                } else {
                  p.rect(coordinates.x, coordinates.y, 20); // recurring event
                }
                let d4 = p.dist(
                  p.mouseX,
                  p.mouseY,
                  coordinates.x,
                  coordinates.y
                );
                if (d4 < 20) {
                  document.querySelector(
                    ".subtitle"
                  ).innerHTML = `📌 ${currentEvent.fields.categorie} : ${currentEvent.fields.nomoffre} (${currentEvent.fields.commune})`;
                }
                break;
              case "Contes et lectures":
              case "Stages-Atelier-Jeux":
                p.fill(232, 25, 115);
                if (recurring.length === 1) {
                  p.ellipse(coordinates.x, coordinates.y, 20, 20); // single event
                } else {
                  p.rect(coordinates.x, coordinates.y, 20); // recurring event
                }
                let d5 = p.dist(
                  p.mouseX,
                  p.mouseY,
                  coordinates.x,
                  coordinates.y
                );
                if (d5 < 20) {
                  document.querySelector(
                    ".subtitle"
                  ).innerHTML = `📌 ${currentEvent.fields.categorie} : ${currentEvent.fields.nomoffre} (${currentEvent.fields.commune})`;
                }
                break;
              default:
                break;
            }
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
      let res = Math.floor(sum / len);
      mean.push(res);
    }

    // Use mean for set size of circle
    for (let i = 0; i < distEventBigCities.length; i++) {
      let copy = mean.slice();
      let n = copy.sort();
      let q1 = n[Math.floor((n.length - 1) * 0.25)];
      let q3 = n[Math.floor((n.length - 1) * 0.75)];

      let pt = myMap.latLngToPixel(bigCities[i].coordX, bigCities[i].coordY);
      let size = (1 / mean[i]) * 11000;
      // let size = mean[i]/5
      if (zoom <= 10 && zoom >= 9) {
        if (mean[i] <= q1) {
          p.fill(4, 209, 14, 100);
          // p.storm(size);
          // p.image(pgStorm, pt.x, pt.y);
        } else if (mean[i] >= q1 && mean[i] <= q3) {
          p.fill(252, 186, 3, 100);
          // p.wind(size);
          // p.image(pgWind, pt.x, pt.y);
        } else {
          p.fill(245, 66, 96, 100);
          // p.sun(size);
          // p.image(pgSun, pt.x, pt.y);
        }
        p.ellipse(pt.x, pt.y, size, size);
        let d = p.dist(p.mouseX, p.mouseY, pt.x, pt.y);
        if (d < size * 0.8) {
          document.querySelector(
            ".subtitle"
          ).innerHTML = `🏡 ${bigCities[i].name} (${bigCities[i].city})`;
        }
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

    if (zoom > 9) {
      // for the latitude and longitude of Nantes Ynov Campus
      let ynov = myMap.latLngToPixel(47.2060661315918, -1.5389937162399292);
      // Using that position, draw an ellipse
      p.fill(228, 240, 0);
      p.ellipse(ynov.x, ynov.y, 20, 20);
      let dYnov = p.dist(p.mouseX, p.mouseY, ynov.x, ynov.y);
      if (dYnov < 20) {
        document.querySelector(".subtitle").innerHTML = `📚 NANTES YNOV CAMPUS`;
      }
    }
  };

  // Wind animation
  // p.wind = function (size) {
  //   pgWind = p.createGraphics(size, size);
  //   pgWind.colorMode(p.HSB, 360, 100, 100, 100);
  //   for (i = 0; i < 20; i++) {
  //     // p.frameRate(5);
  //     let dataX = pgWind.random(0, size);
  //     let dataY = pgWind.random(0, size);
  //     let data = pgWind.random(50, 100);
  //     let couleurInteractive = pgWind.map(data, 50, 100, 200, 255);
  //     let tailleInteractive = pgWind.map(data, 50, 100, 100, 600);
  //     pgWind.stroke(couleurInteractive, 100, 100, 50);
  //     pgWind.fill(couleurInteractive, 100, 100, 20);

  //     pgWind.rect(rectX, dataY, tailleInteractive, 1);
  //     rectX += 20;
  //     if (rectX > size) {
  //       rectX = 0;
  //     }
  //   }
  // };

  // Sun Animation
  // p.sun = function (size) {
  //   pgSun = p.createGraphics(size, size);
  //   pgSun.colorMode(p.HSB, 360, 100, 100, 100);
  //   for (let i = 0; i < tab.length; i++) {
  //     let data = pgSun.random(50, 100);
  //     let dataX = pgSun.random(0, size);
  //     let couleurInteractive = pgSun.map(data, 50, 100, 40, 60);
  //     let tailleInteractive = pgSun.map(data, 50, 100, 5, 25);
  //     pgSun.fill(couleurInteractive, 100, 100, 50);
  //     pgSun.stroke(50, 100, 100, 100);
  //     pgSun.triangle(tabX[i], tab[i], 20, 20, 20, 20);
  //     tab[i]++;
  //     if (tab[i] > size) {
  //       tab[i] = 0;
  //       tabX[i] = p.random(0, 300);
  //     }
  //   }
  // };

  // Storm animation
  // p.storm = function (size) {
  //   pgStorm = p.createGraphics(size, size);
  //   pgStorm.colorMode(p.HSB, 360, 100, 100, 100);
  //   for (let i = tab.length / 2; i < tab.length; i++) {
  //     let data = pgStorm.random(50, 100);
  //     let couleurInteractive = pgStorm.map();
  //     pgStorm.fill(couleurInteractive, 100, 100, 50);
  //     pgStorm.stroke(50, 100, 100, 100);
  //     pgStorm.push();
  //     pgStorm.translate(tabX[i], tab[i]);
  //     pgStorm.rotate(tab[i] * (Math.PI / 180));
  //     if (pgStorm.frameCount % parseInt(pgStorm.random(1, 3)) == 0) {
  //       //triangle(tabX[i]-10, tab[i], tabX[i]+20, tab[i]+20, tabX[i]+20, tab[i]-20);
  //       pgStorm.triangle(-10, 0, 0 + 20, 0 + 20, 0 + 20, 0 - 20);
  //     }
  //     pgStorm.pop();

  //     tab[i]++;
  //     if (tab[i] > pgStorm.size) {
  //       tab[i] = 0;
  //       tabX[i] = pgStorm.random(0, 300);
  //     }
  //   }

  //   for (i = 0; i < tab.length / 2; i++) {
  //     let data = pgStorm.random(50, 100);
  //     let couleurInteractive = pgStorm.map(data, 50, 100, 40, 60);
  //     pgStorm.fill(couleurInteractive, 100, 100, 50);
  //     pgStorm.stroke(50, 100, 100, 100);
  //     pgStorm.push();
  //     pgStorm.translate(tabX[i], tab[i]);
  //     pgStorm.rotate(-(tab[i] * (Math.PI / 180)));
  //     if (pgStorm.frameCount % parseInt(pgStorm.random(1, 3)) == 0) {
  //       //triangle(tabX[i]-10, tab[i], tabX[i]+20, tab[i]+20, tabX[i]+20, tab[i]-20);
  //       pgStorm.triangle(-10, 0, 0 + 20, 0 + 20, 0 + 20, 0 - 20);
  //     }
  //     pgStorm.pop();

  //     tab[i]++;
  //     if (tab[i] > size) {
  //       tab[i] = 0;
  //       tabX[i] = pgStorm.random(0, 300);
  //     }
  //   }
  // };
};
var myp5 = new p5(map, "map");
