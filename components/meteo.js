var meteo = function (p) {
  // Les variables
  let contentImgMeteo;
  let tabData;
  let meteo, h2Meteo, h2MeteoSpan, temperature, vent, uv;
  let currentMonth;
  let currentId;

  p.preload = function () {
    tabData = p.loadJSON("../res/data/meteo.json");
  };

  p.setup = function () {
    // les balises html
    meteo = p.select("#meteo-panel");
    h2Meteo = p.select("#titre-meteo");
    h2MeteoSpan = p.select("#titre-meteo span");
    temperature = p.select(".temperature > span");
    vent = p.select(".indice-vent > p");
    uv = p.select(".indice-uv > p");
    contentImgMeteo = p.select(".content-meteo-img");
    ImgMeteo = p.select(".content-meteo-img img");
  };

  p.draw = function () {
    currentMonth = document.querySelector("#sliderLabel").textContent.substr(5);

    currentId = parseInt(document.querySelector("#sliderLabel").textContent.substr(0, 2))-1

    //Affiche le mois du titre h2
    let moisData = currentMonth;
    h2MeteoSpan.html(moisData);

    //Affiche la température
    let temperatureData = tabData[currentId].Temperature;
    temperature.html(temperatureData);

    //Affiche l'indice du vent
    let ventData = tabData[currentId].Vent;
    vent.html(ventData);

    //Affiche l'indice uv
    let uvData = tabData[currentId].UV;
    uv.html(uvData);

    switch (tabData[currentId].Meteo) {
      case "Gelée":
        var srcImg = "../res/img/snow-icon.png";
        var altImg = "Gelée";
        break;
      case "Éclaircie":
        var srcImg = "../res/img/sunandcloud-icon.png";
        var altImg = "Éclaircie";
        break;
      case "Tempête":
        var srcImg = "../res/img/storm-icon.png";
        var altImg = "Tempête";
        break;
      case "Averse":
        var srcImg = "../res/img/rain-icon.png";
        var altImg = "Averse";
        break;
      case "Ensoleillé":
        var srcImg = "../res/img/sun-icon.png";
        var altImg = "Ensoleillé";
        break;
    }

    ImgMeteo.attribute("src", srcImg);
    ImgMeteo.attribute("alt", altImg);
  };
};

var myp5 = new p5(meteo, "meteo-panel");
