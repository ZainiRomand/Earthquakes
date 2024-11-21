let singapore = [1.29, 103.85]; // #1 Singapore latlng
let map = L.map('map').setView(singapore, 3); // #2 Set the center point

// setup the tile layers
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// setup a marker
let singaporeMarker = L.marker([1.29, 103.85]);
singaporeMarker.addTo(map);
// show a popup on click
singaporeMarker.bindPopup('<p>Singapore</p>');
// adding an event listener
singaporeMarker.addEventListener('click', function () {
  alert('Singapore');
});

// setup the tile layers
L.tileLayer(
  'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', //demo access token
  }
).addTo(map);

// create marker cluster
let earthquakeMarkerClusterLayer = L.markerClusterGroup();

const jsonData = getEarthquakeActivities();
var promise = jsonData;
promise.then(resolve, reject);

function resolve(records) {
  const data = records.features;
  const arrays = Object.values(data);
  const count = records.metadata.count;
  console.log(count);
  console.log(arrays);
  for (let i = 0; i < count; i++) {
    let pos = data[i].geometry.coordinates;
    let dateTime = convertUnixToGMT8(data[i].properties.time);
    L.marker([pos[1], pos[0]])
      .addTo(earthquakeMarkerClusterLayer)
      .bindPopup(
        `<p>Location: ${data[i].properties.place}</p>
        <p>Magnitude: ${data[i].properties.mag}</p>
        <p>Date & Time (GMT+8): ${dateTime}</p>`
      );
  }
}

function reject(reason) {
  console.log("Couldn't get the records! Reason: " + reason);
}

async function getEarthquakeActivities() {
  const url =
    'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson';

  try {
    // Fetch data from the API
    const response = await fetch(url);

    // Check if the response is successful
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // Parse the JSON data
    const data = await response.json();

    // Log or process the data as needed
    return data;
  } catch (error) {
    // Handle errors (e.g., network issues, invalid response)
    console.error('There was a problem with the fetch operation:', error);
  }
}

function convertUnixToGMT8(unixTimestamp) {
  // Unix timestamp in seconds
  const date = new Date(unixTimestamp);

  // Time zone set as GMT+8
  const gmt8Date = new Date(date.getTime());

  // Format the date and time in a readable format (e.g., YYYY-MM-DD HH:mm:ss)
  const year = gmt8Date.getFullYear();
  const month = String(gmt8Date.getMonth() + 1).padStart(2, '0'); // months are 0-based
  const day = String(gmt8Date.getDate()).padStart(2, '0');
  const hours = String(gmt8Date.getHours()).padStart(2, '0');
  const minutes = String(gmt8Date.getMinutes()).padStart(2, '0');
  const seconds = String(gmt8Date.getSeconds()).padStart(2, '0');

  // Return formatted string
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

earthquakeMarkerClusterLayer.addTo(map);
