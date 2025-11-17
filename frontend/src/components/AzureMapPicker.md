# AzureMapPicker Component

A reusable Azure Maps component for location selection with draggable marker, geolocation, and reverse geocoding.

## Features

- 🗺️ Interactive Azure Maps integration
- 📍 Draggable marker for precise location selection
- 🧭 Geolocation button to use current location
- 🔍 Reverse geocoding to get address from coordinates
- ⚙️ Customizable zoom levels, marker color, and height
- ✅ Confirm button with callback

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
import AzureMapPicker from "../components/AzureMapPicker";

function MyComponent() {
  const [location, setLocation] = useState(null);

  const handleLocationSelect = (locationData) => {
    console.log(locationData);
    // locationData = {
    //   coordinates: [longitude, latitude]
    // }
    setLocation(locationData);
  };

  return (
    <AzureMapPicker onLocationSelect={handleLocationSelect} />
  );
}
```

### With Modal

```jsx
import AzureMapPicker from "../components/AzureMapPicker";

function MyComponent() {
  const [showModal, setShowModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleLocationSelect = (locationData) => {
    setSelectedLocation(locationData);
    setShowModal(false);
  };

  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Select Location
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Select Your Location</h3>
            <button onClick={() => setShowModal(false)}>×</button>
            
            <AzureMapPicker 
              onLocationSelect={handleLocationSelect}
              initialCenter={[67.0011, 24.8607]} // Karachi
              initialZoom={12}
              height="400px"
            />
          </div>
        </div>
      )}
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onLocationSelect` | `Function` | **Required** | Callback function when location is confirmed. Receives `{ coordinates: [lon, lat] }` |
| `initialCenter` | `Array` | `[67.0011, 24.8607]` | Initial map center `[longitude, latitude]` (default: Karachi) |
| `initialZoom` | `Number` | `11` | Initial zoom level (1-20) |
| `minZoom` | `Number` | `10` | Minimum zoom level |
| `maxZoom` | `Number` | `18` | Maximum zoom level |
| `showGeolocation` | `Boolean` | `true` | Show/hide geolocation button |
| `markerColor` | `String` | `'red'` | Color of the draggable marker |
| `height` | `String` | `'500px'` | Map height (any valid CSS height value) |

## Example with Custom Props

```jsx
<AzureMapPicker 
  onLocationSelect={handleLocationSelect}
  initialCenter={[74.3587, 31.5204]} // Lahore
  initialZoom={13}
  minZoom={8}
  maxZoom={20}
  markerColor="blue"
  height="600px"
  showGeolocation={true}
/>
```

## Return Value

The `onLocationSelect` callback receives an object with:

```javascript
{
  coordinates: [longitude, latitude] // Array of numbers
}
```

## Notes

- The map requires a valid Azure Maps subscription key in environment variables
- Geolocation requires user permission in the browser
- No reverse geocoding - only coordinates are returned
- The marker is draggable by default for precise location selection
- Zoom controls are automatically added to the top-right corner
