function month(e) {
  switch (e.value) {
    case "1":
      document.getElementById('sliderLabel').innerHTML = "Janvier"
      break;
    case "2":
      document.getElementById('sliderLabel').innerHTML = "Février"
      break;
    case "3":
      document.getElementById('sliderLabel').innerHTML = "Mars"
      break;
    case "4":
      document.getElementById('sliderLabel').innerHTML = "Avril"
      break;
    case "5":
      document.getElementById('sliderLabel').innerHTML = "Mai"
      break;
    case "6":
      document.getElementById('sliderLabel').innerHTML = "Juin"
      break;
    case "7":
      document.getElementById('sliderLabel').innerHTML = "Juillet"
      break;
    case "8":
      document.getElementById('sliderLabel').innerHTML = "Août"
      break;
    case "9":
      document.getElementById('sliderLabel').innerHTML = "Septembre"
      break;
    case "10":
      document.getElementById('sliderLabel').innerHTML = "Octobre"
      break;
    case "11":
      document.getElementById('sliderLabel').innerHTML = "Novembre"
      break;
    case "12":
      document.getElementById('sliderLabel').innerHTML = "Décembre"
      break;
    default:
      document.getElementById('sliderLabel').innerHTML = "Janvier"
      break;
  }

}