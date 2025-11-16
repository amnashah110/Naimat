import React, { useEffect, useRef } from "react";

const MapComponent = ({ coordinates, address }) => {
  const mapContainer = useRef(null);

  useEffect(() => {
    if (!mapContainer.current || !coordinates) return;

    // Load Azure Maps SDK dynamically
    const script = document.createElement("script");
    script.src =
      "https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.js";
    script.async = true;
    script.onload = () => {
      // Load CSS
      const link = document.createElement("link");
      link.href =
        "https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.css";
      link.rel = "stylesheet";
      document.head.appendChild(link);

      // Initialize map after SDK loads
      const atlas = window.atlas;
      if (atlas) {
        const map = new atlas.Map(mapContainer.current, {
          center: coordinates,
          zoom: 15,
          style: "dark",
          authOptions: {
            authType: "subscriptionKey",
            subscriptionKey: "Your_Azure_Maps_Key", // Replace with your key
          },
        });

        // Add marker on map load
        map.events.add("load", () => {
          const popup = new atlas.Popup({
            content: `<div style="padding: 8px; background: #1a1a1a; border: 2px solid #e2d7a0; border-radius: 6px; color: #e2d7a0; font-weight: 600; font-size: 12px; max-width: 180px; word-wrap: break-word;">${address}</div>`,
            pixelOffset: [0, -30],
          });

          const marker = new atlas.HtmlMarker({
            color: "Gold",
            position: coordinates,
            title: address,
            popup: popup,
          });

          map.markers.add(marker);
          popup.open(map, marker);
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (mapContainer.current) {
        mapContainer.current.innerHTML = "";
      }
    };
  }, [coordinates, address]);

  return (
    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: "300px",
        borderRadius: "10px",
        border: "2px solid rgba(226, 215, 160, 0.3)",
        overflow: "hidden",
        backgroundColor: "#2a2a2a",
      }}
    />
  );
};

export default MapComponent;
