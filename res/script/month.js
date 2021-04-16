function month(e) {
  switch (e.value) {
    case "1":
      document.getElementById('sliderLabel').innerHTML = "01 - Janvier"
      break;
    case "2":
      document.getElementById('sliderLabel').innerHTML = "02 - Février"
      break;
    case "3":
      document.getElementById('sliderLabel').innerHTML = "03 - Mars"
      break;
    case "4":
      document.getElementById('sliderLabel').innerHTML = "04 - Avril"
      break;
    case "5":
      document.getElementById('sliderLabel').innerHTML = "05 - Mai"
      break;
    case "6":
      document.getElementById('sliderLabel').innerHTML = "06 - Juin"
      break;
    case "7":
      document.getElementById('sliderLabel').innerHTML = "07 - Juillet"
      break;
    case "8":
      document.getElementById('sliderLabel').innerHTML = "08 - Août"
      break;
    case "9":
      document.getElementById('sliderLabel').innerHTML = "09 - Septembre"
      break;
    case "10":
      document.getElementById('sliderLabel').innerHTML = "10 - Octobre"
      break;
    case "11":
      document.getElementById('sliderLabel').innerHTML = "11 - Novembre"
      break;
    case "12":
      document.getElementById('sliderLabel').innerHTML = "12 - Décembre"
      break;
    default:
      document.getElementById('sliderLabel').innerHTML = "01 - Janvier"
      break;
  }
}