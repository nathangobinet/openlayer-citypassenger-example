import { Coordinate } from 'ol/coordinate';
import { CSSProperties, useState } from 'react';
import Map from './components/Map/Map';
import SearchAddress from './components/SearchAddress';
import SidePanel from './components/SidePanel';
import { CheckpointContextProvider } from './context/CheckpointContext';
import { JourneyContextProvider } from './context/JourneyContext';
import { MapContextProvider } from './context/MapContext';
import { ModeContextProvider } from './context/ModeContext';

const flexStyle: CSSProperties = {
  display: 'flex',
};

const mapContainerStyle: CSSProperties = {
  position: 'relative',
  width: '100%',
};

function App() {
  const [searchLocation, setSearchLocation] = useState<Coordinate>();

  return (
    <MapContextProvider>
      <CheckpointContextProvider>
        <JourneyContextProvider>
          <ModeContextProvider>
            <div style={flexStyle}>
              <div style={mapContainerStyle}>
                <SearchAddress setSearchLocation={setSearchLocation} />
                <Map searchLocation={searchLocation}
                />
              </div>
              <SidePanel />
            </div>
          </ModeContextProvider>
        </JourneyContextProvider>
      </CheckpointContextProvider>
    </MapContextProvider>
  );
}

export default App;
