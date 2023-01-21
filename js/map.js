var API = "93fb557921f04f9c8a1cecab83930c97";
var longitude = 0;
var latitude = 0;

//init map
var map = L.map('map').setView([37.3861, -122.0839], 14);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


//marker variable
var marker;
//place marker on click
map.on('click', function(e){
    if (marker) {
        map.removeLayer(marker);
    }
    marker = new L.marker(e.latlng).addTo(map);
    getAddress(e);
    adjustRadius();
});


//geocode address from click
function getAddress(e) {
    
    var api_key = API;
    var loc = e.latlng.toString();
    latitude = loc.split(",")[0].split("(")[1];
    longitude = loc.split(",")[1].split(")")[0];
 
    var api_url = 'https://api.opencagedata.com/geocode/v1/json'
 
    var request_url = api_url
    + '?'
    + 'key=' + api_key
    + '&q=' + encodeURIComponent(latitude + ',' + longitude)
    + '&pretty=1'
    + '&no_annotations=1';
 
    // see full list of required and optional parameters:
    // https://opencagedata.com/api#forward
 
    var request = new XMLHttpRequest();
    request.open('GET', request_url, true);
 
    request.onload = function() {
    // see full list of possible response codes:
    // https://opencagedata.com/api#codes
 
       if (request.status === 200){
          // Success!
          var data = JSON.parse(request.responseText);
          // alert(data.results[0].formatted); // print the location
          document.getElementById("addressBox").value = data.results[0].formatted;
    
       } else if (request.status <= 500){
          // We reached our target server, but it returned an error
    
          console.log("unable to geocode! Response code: " + request.status);
          var data = JSON.parse(request.responseText);
          console.log('error msg: ' + data.status.message);
       } else {
          console.log("server error");
       }
    };
 
    request.onerror = function() {
    // There was a connection error of some sort
    console.log("unable to connect to server");
    };
 
    request.send();  // make the request
}




// map.on('moveend', function() { 
//     console.log("LatLng: "+map.getBounds().toBBoxString() + "\nZoom: " + map.getZoom());
// });



//adjust radius
var circle;
var radius;
function adjustRadius() {
    radius = document.getElementById("radius").value;
    if (marker) {
        if (circle || radius == '') {
            map.removeLayer(circle);
        }
        circle = L.circle([latitude, longitude], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: radius
        }).addTo(map);
    }
}



// submit Location

function submitLocation() {
    var outJson = {
        "location": [latitude, longitude],
        "radius": radius
    }

    fetch('https://reqbin.com/echo/post/json', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(outJson)
    }).then(function(response) {
        console.log(response)
        return response.json();
    });
}