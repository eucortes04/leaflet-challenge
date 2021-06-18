// Store API enpoint inside queryUrl
//var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(response) {
    // Once we get a response, send the data.features object to the createFeatures function
    
  
    features = response.features
  
    function onEachFeature(featureData, layer) {
      layer.bindPopup("<h3>" + featureData.properties.place +
        "</h3><hr><p>" + new Date(featureData.properties.time) + "</p><p>"+ featureData.properties.mag+"</p>");
    }

    function colorDepth(earthquakeDepth){
        if(earthquakeDepth > 90){return "#FF0000";}
        else if(earthquakeDepth > 70){return"#F96000"}
        else if(earthquakeDepth > 50){return"#e59100"}
        else if(earthquakeDepth > 30){return"#c4ba00"}
        else if(earthquakeDepth > 10){return"#91df00"}
        else{return "#00FF00";}
    }
  
  
    var earthquakes = L.geoJSON(features, {
      onEachFeature: onEachFeature,
  //CHANGING SHIT HERE TO GET MARKERS WORKING
      pointToLayer: function (featureData, latlng) {
        return L.circle(latlng,
          {radius: featureData.properties.mag*100000,
           color: "#000000",
           weight: .3,
           fillColor: colorDepth(featureData.geometry.coordinates[2]),
           },
          )
        }
    });
    //LEGEND FROM CLOROPLETH ACTIVITY
    var legend = L.control({position:"bottomright"});
    legend.onAdd = function(){
        var div = L.DomUtil.create("div", "info legend");
        var labels = ["0-10","10-30","30-40","40-50","50-70","90+"];
        var colors = ["#00FF00","#91df00","#c4ba00","#e59100","#F96000","#FF0000"];
        for (var i = 0; i < colors.length; i++){
            div.innerHTML += "<i class='circle' style='background:"+colors[i]+"></i>"+ labels[i];
        }
        return div;
    }
    
    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    });
  
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "dark-v10",
      accessToken: API_KEY
    });
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [
        40.247664005220656, -10.401832477641683
      ],
      zoom: 2,
      layers: [streetmap, earthquakes]
    });
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  });
  