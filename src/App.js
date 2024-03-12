// src/App.js

import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Polygon } from "@react-google-maps/api";
import "./App.css";

const MapContainer = ({ zones, setZones }) => {
  const [map, setMap] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [newZone, setNewZone] = useState([]);
  const [zoneName, setZoneName] = useState("");
  const [zoneDescription, setZoneDescription] = useState("");
  const [selectedZoneIndex, setSelectedZoneIndex] = useState(null);

  const handleMapLoad = (map) => {
    setMap(map);
  };

  // ... (unchanged functions)
  const handlePolygonComplete = (polygon) => {
    setDrawing(false);
    setNewZone(
      polygon
        .getPath()
        .getArray()
        .map(({ lat, lng }) => ({ lat, lng }))
    );
  };

  const handleMapClick = (event) => {
    if (drawing) {
      setNewZone([...newZone, event.latLng.toJSON()]);
    }
  };

  const handleStartDrawing = () => {
    setDrawing(true);
    setNewZone([]);
  };

  const handleFinishDrawing = () => {
    if (newZone.length > 2) {
      const newZones = [
        ...zones,
        { name: zoneName, description: zoneDescription, polygon: newZone },
      ];
      setZones(newZones);
      localStorage.setItem("zones", JSON.stringify(newZones));
    }
    setDrawing(false);
    setNewZone([]);
    setZoneName("");
    setZoneDescription("");
  };

  useEffect(() => {
    const storedZones = JSON.parse(localStorage.getItem("zones")) || [];
    setZones(storedZones);
  }, []);

  const handleEditZone = (index) => {
    const selectedZone = zones[index];
    setZoneName(selectedZone.name);
    setZoneDescription(selectedZone.description);
    setNewZone(selectedZone.polygon);
    setSelectedZoneIndex(index);
  };

  const handleDeleteZone = (index) => {
    const updatedZones = [...zones];
    updatedZones.splice(index, 1);
    setZones(updatedZones);
    localStorage.setItem("zones", JSON.stringify(updatedZones));
    setSelectedZoneIndex(null);
  };

  const handleUpdateZone = () => {
    if (selectedZoneIndex !== null) {
      const updatedZones = [...zones];
      updatedZones[selectedZoneIndex] = {
        name: zoneName,
        description: zoneDescription,
        polygon: newZone,
      };
      setZones(updatedZones);
      localStorage.setItem("zones", JSON.stringify(updatedZones));
      setZoneName("");
      setZoneDescription("");
      setNewZone([]);
      setSelectedZoneIndex(null);
    }
  };

  return (
    <div className="container">
      <h1>Add Zone</h1>
      <LoadScript googleMapsApiKey="Your_Google_API_Key">
        <GoogleMap
          id="map"
          mapContainerStyle={{ height: "400px", width: "100%" }}
          zoom={8}
          center={{ lat: 0, lng: 0 }}
          onLoad={handleMapLoad}
          onClick={handleMapClick}
        >
          {drawing && (
            <Polygon
              path={newZone}
              options={{ fillColor: "#00FF00", fillOpacity: 0.35 }}
            />
          )}
        </GoogleMap>
      </LoadScript>

      <div className="input-group">
        <label>Zone Name</label>
        <input
          type="text"
          value={zoneName}
          onChange={(e) => setZoneName(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Zone Description</label>
        <input
          type="text"
          value={zoneDescription}
          onChange={(e) => setZoneDescription(e.target.value)}
        />
      </div>

      <div className="buttons">
        <button onClick={handleStartDrawing}>Start Drawing</button>
        <button onClick={handleFinishDrawing}>Finish Drawing</button>
        <button onClick={handleUpdateZone}>Update Zone</button>
      </div>

      <div className="table-container">
        <h2>Saved Zones</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {zones.map((zone, index) => (
              <tr key={index}>
                <td>{zone.name}</td>
                <td>{zone.description}</td>
                <td>
                  <button onClick={() => handleEditZone(index)}>Edit</button>
                </td>
                <td>
                  <button onClick={() => handleDeleteZone(index)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function App() {
  const [zones, setZones] = useState([]);

  useEffect(() => {
    const storedZones = JSON.parse(localStorage.getItem("zones")) || [];
    setZones(storedZones);
  }, []);

  return (
    <div className="App">
      <MapContainer zones={zones} setZones={setZones} />
    </div>
  );
}

export default App;
