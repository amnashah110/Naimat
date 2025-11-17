import React, { useEffect, useRef } from "react";
import * as atlas from "azure-maps-control";
import "azure-maps-control/dist/atlas.min.css";

/**
 * AzureMapPicker - A reusable Azure Maps component with location selection
 * 
 * @param {Object} props
 * @param {Function} props.onLocationSelect - Callback function when location is confirmed. Receives { coordinates: [lon, lat], address: string }
 * @param {Array} props.initialCenter - Initial map center [longitude, latitude]. Default: [67.0011, 24.8607] (Karachi)
 * @param {number} props.initialZoom - Initial zoom level. Default: 11
 * @param {number} props.minZoom - Minimum zoom level. Default: 10
 * @param {number} props.maxZoom - Maximum zoom level. Default: 18
 * @param {boolean} props.showGeolocation - Show geolocation button. Default: true
 * @param {string} props.markerColor - Marker color. Default: 'red'
 * @param {string} props.height - Map height CSS value. Default: '500px'
 */
function AzureMapPicker({
  onLocationSelect,
  initialCenter = [67.0011, 24.8607],
  initialZoom = 11,
  minZoom = 10,
  maxZoom = 18,
  showGeolocation = true,
  markerColor = 'red',
  height = '500px'
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      const map = new atlas.Map(mapRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        minZoom: minZoom,
        maxZoom: maxZoom,
        authOptions: {
          authType: 'subscriptionKey',
          subscriptionKey: import.meta.env.VITE_AZURE_MAPS_KEY
        }
      });

      // Wait until map resources are ready
      map.events.add('ready', function () {
        console.log('✅ Map is ready');
        
        // Add zoom controls
        map.controls.add(new atlas.control.ZoomControl(), { position: 'top-right' });

        if (showGeolocation) {
          // Create custom geolocation button
          const geoButton = document.createElement('button');
          geoButton.innerHTML = '📍';
          geoButton.title = 'Use My Current Location';
          geoButton.style.cssText = `
            width: 32px;
            height: 32px;
            background: white;
            border: 2px solid rgba(0,0,0,0.1);
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            transition: all 0.2s ease;
          `;
          
          geoButton.onmouseover = () => {
            geoButton.style.background = '#f0f0f0';
          };
          geoButton.onmouseout = () => {
            geoButton.style.background = 'white';
          };
          
          geoButton.onclick = () => {
            if (!navigator.geolocation) {
              alert('Geolocation is not supported by your browser');
              return;
            }

            geoButton.innerHTML = '🔄';
            geoButton.disabled = true;
            geoButton.style.cursor = 'not-allowed';

            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                const userLocation = [longitude, latitude];

                console.log('✅ Location detected:', { latitude, longitude });

                if (markerRef.current) {
                  markerRef.current.setOptions({ position: userLocation });
                  map.setCamera({
                    center: userLocation,
                    zoom: 17,
                    type: 'ease',
                    duration: 1500
                  });
                  console.log('📍 Map updated to your location');
                }

                geoButton.innerHTML = '📍';
                geoButton.disabled = false;
                geoButton.style.cursor = 'pointer';
              },
              (error) => {
                console.error('❌ Geolocation error:', error.message);
                alert('Unable to retrieve your location.');
                geoButton.innerHTML = '📍';
                geoButton.disabled = false;
                geoButton.style.cursor = 'pointer';
              },
              {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
              }
            );
          };

          // Add button to map container in top-right, below zoom controls
          const mapContainer = mapRef.current;
          const buttonContainer = document.createElement('div');
          buttonContainer.style.cssText = `
            position: absolute;
            top: 90px;
            right: 10px;
            z-index: 1000;
          `;
          buttonContainer.appendChild(geoButton);
          mapContainer.appendChild(buttonContainer);
        }

        // Add a draggable marker at initial center
        const marker = new atlas.HtmlMarker({
          color: markerColor,
          draggable: true,
          position: initialCenter
        });

        map.markers.add(marker);
        markerRef.current = marker;
      });

      mapInstanceRef.current = map;
    }

    // Clean up
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.dispose();
        mapInstanceRef.current = null;
      }
    };
  }, [initialCenter, initialZoom, minZoom, maxZoom, showGeolocation, markerColor]);

  const handleConfirmLocation = () => {
    if (markerRef.current && onLocationSelect) {
      const position = markerRef.current.getOptions().position;
      console.log("📍 Current Coordinates:", {
        longitude: position[0],
        latitude: position[1],
        coordinates: position
      });

      // Return only coordinates, no address
      onLocationSelect({
        coordinates: position
      });
    }
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div style={{ width: '100%', height: height, position: 'relative' }} ref={mapRef}></div>

      <button
        type="button"
        onClick={handleConfirmLocation}
        style={{
          width: "100%",
          padding: "0.75rem",
          backgroundColor: "#19501b",
          color: "#f2e9b9",
          border: "2px solid #f2e9b9",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "600",
          fontSize: "1rem",
          fontFamily: '"DM Mono"',
          transition: "all 0.3s ease"
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#f2e9b9";
          e.target.style.color = "#19501b";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#19501b";
          e.target.style.color = "#f2e9b9";
        }}
      >
        ✓ Confirm Location
      </button>
    </div>
  );
}

export default AzureMapPicker;
