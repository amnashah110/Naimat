# AzureMapViewer Component

A read-only Azure Maps component for displaying a location marker without editing capabilities. Perfect for showing pickup locations, delivery addresses, or any fixed location on a map.

## Features

- 🗺️ Interactive Azure Maps (pan and zoom enabled)
- 📍 Fixed marker at specified coordinates
- 🎨 Customizable marker color and map height
- ⚙️ Optional zoom controls
- 🛡️ Fallback UI when coordinates are unavailable
- 🧹 Automatic cleanup on unmount

## Installation

Make sure you have Azure Maps Control installed:

```bash
npm install azure-maps-control
```

And set your Azure Maps subscription key in `.env`:

```
VITE_AZURE_MAPS_KEY=your_subscription_key_here
```

## Usage

### Basic Usage

```jsx
import AzureMapViewer from "../components/AzureMapViewer";

function MyComponent() {
  return (
    <AzureMapViewer 
      lat={24.8607} 
      lon={67.0011} 
    />
  );
}
```

### In a Modal or Card

```jsx
import AzureMapViewer from "../components/AzureMapViewer";

function DonationDetails({ donation }) {
  return (
    <div className="details-modal">
      <h3>Pickup Location</h3>
      
      <AzureMapViewer 
        lat={donation.latitude} 
        lon={donation.longitude}
        zoom={15}
        height="400px"
        markerColor="blue"
      />
      
      <p>Address: {donation.address}</p>
    </div>
  );
}
```

### With Custom Styling

```jsx
<AzureMapViewer 
  lat={31.5204}
  lon={74.3587}
  zoom={16}
  markerColor="green"
  height="250px"
  showZoomControls={false}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `lat` | `Number` | **Required** | Latitude of the location to display |
| `lon` | `Number` | **Required** | Longitude of the location to display |
| `zoom` | `Number` | `14` | Zoom level (1-20) |
| `markerColor` | `String` | `'red'` | Color of the location marker |
| `height` | `String` | `'300px'` | Map height (any valid CSS height value) |
| `showZoomControls` | `Boolean` | `true` | Show/hide zoom controls |

## Comparison with AzureMapPicker

| Feature | AzureMapViewer | AzureMapPicker |
|---------|----------------|----------------|
| Purpose | Display location | Select location |
| Marker | Fixed | Draggable |
| Geolocation | ❌ | ✅ |
| Confirm Button | ❌ | ✅ |
| Reverse Geocoding | ❌ | ✅ |
| User Interaction | View only (pan/zoom) | Full interaction |

## Example Use Cases

### 1. Show Donation Pickup Location
```jsx
<AzureMapViewer 
  lat={donation.coordinates[0]} 
  lon={donation.coordinates[1]}
  zoom={15}
  height="300px"
/>
```

### 2. Display Store Location
```jsx
<AzureMapViewer 
  lat={store.latitude}
  lon={store.longitude}
  zoom={17}
  markerColor="blue"
  height="400px"
/>
```

### 3. Show Delivery Address
```jsx
<AzureMapViewer 
  lat={order.deliveryLat}
  lon={order.deliveryLon}
  zoom={16}
  markerColor="green"
  height="350px"
  showZoomControls={false}
/>
```

## Fallback Behavior

If `lat` or `lon` are not provided or are invalid, the component displays a friendly fallback message:

```
┌─────────────────────────┐
│                         │
│  Location not available │
│                         │
└─────────────────────────┘
```

## Notes

- The map requires a valid Azure Maps subscription key
- Users can pan and zoom the map but cannot move the marker
- The component automatically cleans up map resources on unmount
- Rounded corners are applied by default for better UI integration
