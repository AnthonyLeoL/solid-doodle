import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const ZoomedMap = ({ countryCode, show }) => {
  const [geoJSONData, setGeoJSONData] = useState(null);

  useEffect(() => {
    if (!countryCode) {
      return;
    }
    fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`)
      .then((response) => response.json())
      .then((data) => {
        if (data[0] && data[0].latlng) {
          setGeoJSONData({
            type: "Feature",
            properties: {},
            geometry: {
              type: "Point",
              coordinates: [data[0].latlng[1], data[0].latlng[0]],
            },
          });
        }
      });
  }, [countryCode]);

  const latlng = [
    geoJSONData?.geometry.coordinates[1],
    geoJSONData?.geometry.coordinates[0],
  ];

  if (!geoJSONData) {
    return <div>Loading...</div>;
  }

  return (
    <MapContainer
      key={latlng.toString()}
      center={latlng}
      zoom={5}
      style={{ height: "300px", width: "500px" }}
    >
      {show && (
        <>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <GeoJSON data={geoJSONData} />
        </>
      )}
    </MapContainer>
  );
};

export default ZoomedMap;
