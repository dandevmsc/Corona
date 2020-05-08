var x = document.getElementById("locdatadiv");

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km

    return d;
}


function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    var ar = []
    for (i = 0; i < locdatai.length; i++) {
        ar.push(getDistanceFromLatLonInKm(position.coords.latitude, position.coords.longitude, locdatai[i]['Lat'], locdatai[i]['Long-']))
    }
    var j = ar.indexOf(Math.min(...ar));
    x.innerHTML = "Your Location: " + locdatai[j]['Combined-Key'] + " Confirmed: " + locdatai[j]['Confirmed'].toLocaleString() + "; Deaths: " + locdatai[j]['Deaths'].toLocaleString() + "; Recovered: " + locdatai[j]['Recovered'].toLocaleString() + "; Active: " + locdatai[j]['Active'].toLocaleString()
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred."
            break;
    }
}




getLocation()