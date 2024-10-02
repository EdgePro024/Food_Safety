// Add a base map layer (street layer)
const map = L.map('map').setView([26.8206, 30.8025], 6);


// Define base layers
const OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  name: 'OpenTopoMap',
  maxZoom: 17
});

const Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  name: 'Esri_WorldImagery',
});

const OpenStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Add base layers to the map
Esri_WorldImagery.addTo(map);

// Create layer control
const baseMaps = {
  "صورة القمر الصناعي": Esri_WorldImagery,
  "خريطة طبوغرافية": OpenTopoMap,
   " شبكة الطرق": OpenStreetMap
};

// Create GeoJSON layer
const geojsonLayer = L.geoJSON(geeom, {
    pointToLayer: function (feature, latlng) {
        // Define a custom icon
        const icon = L.divIcon({
            className: 'custom-icon', // Define a CSS class for custom styling
            html: `<img src="./img/Main_Pin_shadow.png" alt="" class="img">`, // Use your icon URL here
            iconSize: [32, 32], // Size of the icon
        });

        return L.marker(latlng, { icon: icon });
    },
    style: styleFeature,
    onEachFeature: onEachFeature
});



  const geojsonLayer2 = L.geoJSON(geooom, {
    pointToLayer: function (feature, latlng) {
        // Define a custom icon
        const icon = L.divIcon({
            className: 'custom-icon', 
            html: `<img src="./img/braches_Pin_shadow.png" alt="" class="img">`,
            iconSize: [32, 32], 
        });

        return L.marker(latlng, { icon: icon });
    },
    style: styleFeature,
    onEachFeature: onEachFeature
});

function styleFeaturee(feature) {
  return {
    color: 'black', 
    weight: 2, 
    fillColor: 'transparent', 
    fillOpacity: 0 
  };
}

function combineGeoJSON(geojson1, geojson2) {
  const combinedFeatures = geojson1.features.concat(geojson2.features);
  return {
    type: 'FeatureCollection',
    features: combinedFeatures
  };
}

// Combine govv and gover
const combinedGeoJSON = combineGeoJSON(govv, gover);


const combinedGeoJsonLayer = L.geoJSON(combinedGeoJSON, {
  style: styleFeaturee, 
  onEachFeature: onEachFeature
});


combinedGeoJsonLayer.addTo(map);


// Add GeoJSON layer to the overlays object
const overlays = {
  "مقر رئيسي": geojsonLayer,
  "مقر فرعي":geojsonLayer2,
  "المحافظات":combinedGeoJsonLayer

};


L.control.layers(baseMaps, overlays).addTo(map);


geojsonLayer.addTo(map);


///////////////////////////////////


function styleFeature(feature) {
    return {
        color: feature.properties.color || 'black',
        weight: 2,
        opacity: 1,
        fillOpacity: -0.1
    };
}

// Function to handle feature highlighting
function highlightFeature(e) {
    const layer = e.target;
    layer.setStyle({
        weight: 4,
        color: 'red',
        fillOpacity: -0.1
    });
}

// Function to reset feature highlighting
function resetHighlight(e) {
    geojsonLayer.resetStyle(e.target);
}




function onEachFeature(feature, layer) {
  layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: function (e) {
        
          
          const latLng = e.target.getLatLng ? e.target.getLatLng() : e.target.getLatLngs();
          if (latLng) {
            map.flyTo(latLng, 15);
          }
    
          // Update the info box with feature properties
          document.getElementById('governorat').innerText = feature.properties.governorat || 'N/A';
          document.getElementById('district').innerText = feature.properties.district || 'N/A';
          document.getElementById('address').innerText = feature.properties.address || 'N/A';
          document.getElementById('location').innerText = feature.properties.Location_T || 'N/A';
          document.getElementById('distance').innerText = feature.properties.distance || 'N/A';
          document.getElementById('infoBox').style.display = 'block';

          

      }
  });

  // Bind popup with name field
  if (feature.properties && feature.properties.name) {
    layer.bindPopup(feature.properties.name); 
}

let tooltipContent = `
    <div class="tooltip-content">
        <div class="tooltip-row">
        <span>${feature.properties.governorat || 'N/A'}</span>
            <strong>:المحافظة</strong>
            
        </div>
        <div class="tooltip-row">
          
            <span>${feature.properties.Location_T || 'N/A'}</span>
              <strong>:النوع</strong>
        </div>
        
    </div>
`;

layer.bindTooltip(tooltipContent, { sticky: true, direction: 'rtl' });

}


map.on('click', function () {
  document.getElementById('infoBox').style.display = 'none';
});


geojsonLayer.addTo(map);



const geocoder = L.Control.Geocoder.nominatim();
L.Control.geocoder({
  geocoder: geocoder
}).addTo(map);


const locateControl = L.control({ position: 'topleft' });

locateControl.onAdd = function (map) {
  const button = L.DomUtil.create('button', 'locate-btn');
  button.innerHTML = 'تحديد الموقع';
  button.onclick = function () {
    map.locate({ setView: true, maxZoom: 16 });
  };
  return button;
};

locateControl.addTo(map);

// Event listener for location found
map.on('locationfound', function (e) {
  const radius = e.accuracy / 2;

  // Add a marker for the user's location
  L.marker(e.latlng).addTo(map)
    .bindPopup('موقعك')
    .openPopup();

  // Optionally, add a circle around the location
  L.circle(e.latlng, radius).addTo(map);
});


L.Measure = {
  linearMeasurement: "قياس المسافات",
  areaMeasurement: "قياس المساحات",
  start: "بدأ",
  meter: "m",
  kilometer: "km",
  squareMeter: "m²",
  squareKilometers: "km²",
  };

  var measure = L.control.measure({}).addTo(map);