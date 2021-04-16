// Sketch Two
var info = function (p) {
  let font,
    fontsize = 30;
  let bookFont;
  let imgsun, imgrain, imgsnow, imgcloud, imgstorm, imgwind, imguv;
  var tabData;

  p.preload = function () {
    // Ensure the .ttf or .otf font stored in the assets directory
    // is loaded before setup() and draw() are called
    font = p.loadFont("./res/fonts/Futura.ttf");
    bookFont = p.loadFont("./res/fonts/Futura-Book.ttf");
    p.loadJSON("./res/data/meteo.json", p.getData);
    imgsun = p.loadImage("./res/img/sun-icon.png");
    imgrain = p.loadImage("./res/img/rain-icon.png");
    imgsnow = p.loadImage("./res/img/snow-icon.png");
    imgcloud = p.loadImage("./res/img/sunandcloud-icon.png");
    imgstorm = p.loadImage("./res/img/storm-icon.png");
    imgwind = p.loadImage("./res/img/wind-icon.png");
    imguv = p.loadImage("./res/img/uv-icon.png");
  };

  p.setup = function () {
    p.createCanvas(p.windowWidth*0.29, p.windowHeight);
    p.background(255);
  };

  p.getData = function (data) {
    tabData = data;
  };

  p.draw = function () {
    var dataY = -160;
    // Align the text to the right
    // and run drawWords() in the left third of the canvas
    for (var i = 0; i < 12; i++) {
      dataY = dataY + 200;
      p.textAlign(p.LEFT);
      p.fill(0);
      switch (tabData[i].Meteo) {
        case "Gelée":
          p.image(imgsnow, p.windowWidth - 20, dataY + 50, 100, 100);
          break;
        case "Eclaircie":
          p.image(imgcloud, p.windowWidth - 20, dataY + 50, 100, 100);
          break;
        case "Tempête":
          p.image(imgstorm, p.windowWidth - 20, dataY + 50, 100, 100);
          break;
        case "Averse":
          p.image(imgrain, p.windowWidth - 20, dataY + 50, 100, 100);
          break;
        case "Ensoleillé":
          p.image(imgsun, p.windowWidth - 20, dataY + 50, 100, 100);
          break;
        default:
          p.image(imgsnow, p.windowWidth - 20, dataY + 50, 100, 100);
      }
      // Affichage température
      p.textFont(bookFont);
      p.textSize(22);
      p.text(tabData[i].Temperature + "degrés C", 150, dataY + 50);

      //Affichage icone indice vent
      p.image(imgwind, 150, dataY + 80, 40, 40);
      //Affichage icone indice UV
      p.image(imguv, 145, dataY + 125, 40, 40);

      //Affichage donnée indice vent
      p.textFont(bookFont);
      p.textSize(16);
      p.text(tabData[i].Vent, 200, dataY + 95);

      //Affichage donnée indice UV
      p.textFont(bookFont);
      p.textSize(16);
      p.text(tabData[i].UV, 200, dataY + 140);

      //Affichage titre
      p.textFont(font);
      p.textSize(fontsize);
      p.text("La météo de " + tabData[i].Mois, 20, dataY);
    }
  };

  p.windowResized = function(){
    p.resizeCanvas(p.windowWidth*0.29, p.windowHeight);
  }
};
var myp5 = new p5(info, "info");
