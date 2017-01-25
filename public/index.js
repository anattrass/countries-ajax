var countries = null;

var makeRequest = function(url, callback){
  var request = new XMLHttpRequest();
  request.open("GET", url);
  request.onload = callback;
  request.send();
};

var populateList = function(countries){
  var select = document.querySelector("#country-list");

  countries.forEach(function(country){
    var option = document.createElement("option");
    option.innerText = country.name;
    select.appendChild(option);
  });
};


var requestComplete = function(){
  if (this.status !== 200) return;
  var jsonString = this.responseText;
  countries = JSON.parse(jsonString);

  populateList(countries);
};


var borders = function(selectedCountry){
  var borderingCountries = document.querySelector('ul');
  borderingCountries.innerText = "";
  for (country of countries){
    if (selectedCountry.borders.includes(country.alpha3Code)){
        var li = document.createElement('li');
        li.innerText = country.name + "\n" + "Population: " + country.population + "\n" + "Capital City: " + country.capital;
        borderingCountries.appendChild(li);
    };
  }
}

var handleRegionSelectChange = function() {

  var selectedRegion = document.querySelector('#region-list');
  
  console.log(selectedRegion);
  selectedRegion.filter(function(region){

    for (region of regions) {
      if (region === countries.region){
        var li = document.createElement('li');
        li.innerText = countries.name;
        selectedRegion.appendChild(li);
      }
    }
  })
}

var handleSelectChange = function(){
  var selectedCountry = countries.find(function(country){
    return country.name === this.value;
  }.bind(this));
  
  localStorage.setItem('savedCountry', this.value);

  var countryInfo = document.querySelector("#country-info");
  countryInfo.innerText = "Name: " + selectedCountry.name + "\n" + "Population: " + selectedCountry.population + "\n" + "Capital City: " + selectedCountry.capital + "\n" + "\n" + "Bordering Countries:";

  borders(selectedCountry);
  markerAdder(selectedCountry);
};

var markerAdder = function(selectedCountry){
  var newLat = selectedCountry.latlng[0];
  var newLng = selectedCountry.latlng[1];
  var coords = {
    lat: newLat,
    lng: newLng
  }
  mainMap.addMarker(coords);
}



var app = function(){
  localStorage.getItem('savedCountry');
  var url = "https://restcountries.eu/rest/v1/all";
  makeRequest(url, requestComplete);

  var select = document.querySelector('#country-list');
  select.onchange = handleSelectChange;

  var regionSelect = document.querySelector('#region-list');
  regionSelect.onchange = handleRegionSelectChange;

  var center = {lat:45.561025, lng:-81.463280};
  var mapDiv = document.querySelector('#main-map');
  mainMap = new MapWrapper(mapDiv, center, 12);


 
};

window.onload = app;

function flashtext(element, colour) {
  var colourCheck = document.getElementById(element).style.color;
  if(colourCheck === "green") {
    document.getElementById(element).style.color = colour;
  } else {
    document.getElementById(element).style.color = "green";
  }
}

setInterval(function() {
  flashtext("heading", "DodgerBlue");
}, 350);


