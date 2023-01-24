import { Coordinate } from 'ol/coordinate';
import { CSSProperties, useRef, useState } from 'react';
import Map, { ForwardMap } from './components/Map/Map';
import SearchAddress from './components/SearchAddress';
import SidePanel from './components/SidePanel';

export interface Step {
  coordinate: Coordinate,
  name: string,
}

const defaultSteps: Step[] = [
  {
    "name": "Étape 1",
    "coordinate": [
      2.268037660351867,
      48.80339838997668
    ]
  },
  {
    "name": "Étape 2",
    "coordinate": [
      2.2702485009466833,
      48.80316459004453
    ]
  },
  {
    "name": "Étape 4",
    "coordinate": [
      2.2699314895569245,
      48.80107779702092
    ]
  },
  {
    "name": "Étape 5",
    "coordinate": [
      2.2717719499473574,
      48.79566231873429
    ]
  },
  {
    "name": "Étape 6",
    "coordinate": [
      2.2593546444769523,
      48.80053525037292
    ]
  }
];

const flexStyle: CSSProperties = {
  display: 'flex',
};

const mapContainerStyle: CSSProperties = {
  position: 'relative',
  width: '100%',
};

function App() {
  const [steps, setSteps] = useState<Step[]>(defaultSteps);
  const [selectedStep, setSelectedStep] = useState<Step>();
  const [searchLocation, setSearchLocation] = useState<Coordinate>();
  const mapRef = useRef<ForwardMap>(null);

  const addStep = () => {
    if (!mapRef.current) return;
    const coordinate = mapRef.current.getCenter();
    if (!coordinate) return;
    setSteps([...steps, { name: `Étape ${steps.length + 1}`, coordinate }]);
  };

  return (
    <div style={flexStyle}>
      <div style={mapContainerStyle}>
        <SearchAddress setSearchLocation={setSearchLocation} />
        <Map
          ref={mapRef}
          selectedStep={selectedStep}
          setSelectedStep={setSelectedStep}
          steps={steps}
          searchLocation={searchLocation}
        />
      </div>
      <SidePanel
        setSelectedStep={setSelectedStep}
        steps={steps}
        addStep={addStep}
      />
    </div>
  );
}

export default App;
