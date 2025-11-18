import React, { useEffect, useRef } from "react";
import * as atlas from "azure-maps-control";
import "azure-maps-control/dist/atlas.min.css";

/**
 * AzureMapViewer - A read-only Azure Maps component for displaying a location
 * 
 * @param {Object} props
 * @param {number} props.lat - Latitude of the location to display
 * @param {number} props.lon - Longitude of the location to display
 * @param {number} props.zoom - Zoom level. Default: 14
 * @param {string} props.markerColor - Marker color. Default: 'red'
 * @param {string} props.height - Map height CSS value. Default: '300px'
 * @param {boolean} props.showZoomControls - Show zoom controls. Default: true
 */
function AzureMapViewer({
  lat,
  lon,
  zoom = 14,
  markerColor = 'red',
  height = '300px',
  showZoomControls = true
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current && lat && lon) {
      const map = new atlas.Map(mapRef.current, {
        center: [lon, lat],
        zoom: zoom,
        interactive: true, // Allow panning and zooming
        authOptions: {
          authType: 'subscriptionKey',
          subscriptionKey: import.meta.env.VITE_AZURE_MAPS_KEY
        }
      });

      // Wait until map resources are ready
      map.events.add('ready', function () {
        console.log('✅ Map viewer is ready');
        
        // Add zoom controls if enabled
        if (showZoomControls) {
          map.controls.add(new atlas.control.ZoomControl(), { position: 'top-right' });
        }

        // Create a data source and add a point
        const dataSource = new atlas.source.DataSource();
        map.sources.add(dataSource);
        
        // Add the location point
        dataSource.add(new atlas.data.Point([lon, lat]));
        
        // Create a symbol layer to render the marker
        const symbolLayer = new atlas.layer.SymbolLayer(dataSource, null, {
          iconOptions: {
            image: `marker-${markerColor}`,
            size: 0.8,
            anchor: 'center',
            allowOverlap: true
          }
        });
        
        map.layers.add(symbolLayer);
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
  }, [lat, lon, zoom, markerColor, showZoomControls]);

  if (!lat || !lon) {
    return (
      <div style={{ 
        width: '100%', 
        height: height, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        color: '#666'
      }}>
        Location not available
      </div>
    );
  }

  return (
    <div 
      style={{ 
        width: '100%', 
        height: height, 
        position: 'relative',
        borderRadius: '8px',
        overflow: 'hidden'
      }} 
      ref={mapRef}
    />
  );
}

export default AzureMapViewer;
