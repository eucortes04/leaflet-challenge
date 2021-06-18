// Store API enpoint inside queryUrl

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

//perform a GET request to query URL
d3.json(queryUrl,function(data){
    //send the data.features object to the createFeatures function
    createFeatures(data.features);
});

function createFeatures(earthquakeData){

    //create popup with earthquake description for each feature
    function onEachFeature(feature,layer) {
        layer.bindPopup("<h3>"+ feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    //create geoJson layer with features array on earthquakeData object
    //run onEachFeature for each piece of data
    var earthquakes = L.geoJson(earthquakeData, {
        onEachFeature: onEachFeature
    });

    //sending earthquake layer to createMap function
    createMap(earthquakes)
}

//Create map function
function createMap(earthquakes){
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",{
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id:"mapbox/streets-v11",
        accessToken: API_KEY,

    });

    //define basemaps
    var baseMaps = {
        "Street Map": streetmap,
    }

    var overlayMaps = {
        Earthquakes: earthquakes
    };

    var myMap = L.map("map",{
        center: [37.09, -95.71],
        zoom: 5,
        layers:[streetmap, earthquakes]
    });
}