var map;
function initMap() {
    $.get("http://opendata.hccg.gov.tw/dataset/3b137260-88f3-4e20-8062-4368dbcdcb46/resource/9f3c9b74-3770-4e0a-819c-856551e3759f/download/20150312104612415.json",function(data){
        
        data.forEach(function(d, i) {
            address = d.地址;
            console.log(address);
            codeAddress(address);
        });
    });



    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 24.803131, lng: 120.966453},
        zoom: 10
    });

    // Add some markers to the map.
    // Note: The code uses the JavaScript Array.prototype.map() method to
    // create an array of markers based on a given "locations" array.
    // The map() method here has nothing to do with the Google Maps API.
    var infoWin  = new google.maps.InfoWindow();

    var markers = locations.map(function(location, i) {
        var marker = new google.maps.Marker({
            position: location,
            label: {text: location.sna}
        });

        var content = '<div class="map">'+location.sno+' '+location.sna+'<div>';

        google.maps.event.addListener(marker, 'click', function(evt) {
            infoWin.setContent(content);
            infoWin.open(map, marker);
        })
        return marker;
    });

    // Add a marker clusterer to manage the markers.
    var markerCluster = new MarkerClusterer(map, markers,
    {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});

    var input = document.getElementById('pac-input');
    
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
        map: map
    });
    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });

    autocomplete.addListener('place_changed', function() {
        infowindow.close();
        var place = autocomplete.getPlace();
        if (!place.geometry) {
        return;
        }

        if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
        } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
        }

        // Set the position of the marker using the place ID and location.
        marker.setPlace({
        placeId: place.place_id,
        location: place.geometry.location
        });
        marker.setVisible(true);

        document.getElementById('place-name').textContent = place.name;
        document.getElementById('place-id').textContent = place.place_id;
        document.getElementById('place-address').textContent =
            place.formatted_address;
        infowindow.setContent(document.getElementById('infowindow-content'));
        infowindow.open(map, marker);
    });
}

function codeAddress(address) {
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);

		document.getElementById("lat").value=results[0].geometry.location.lat();
		document.getElementById("lng").value=results[0].geometry.location.lng();
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });

		showAddress(results[0], marker);
      } else {
        alert("失敗, 原因: " + status);
      }
    });
}

function showAddress(result, marker) {
    var popupContent = result.formatted_address;
    popup.setContent(popupContent);
    popup.open(map, marker);
}

var locations = []
