import { CSSProperties } from 'react';
import { useJourney } from '../context/JourneyContext';

const journeysStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
}

const journeyStyle: CSSProperties = {
  border: '1px solid #ccc',
  borderRadius: '10px',
  padding: '15px',
}

function Journeys() {
  const { journeys, setSelectedJourney, selectedJourney } = useJourney()

  return (
    <>
      <h2>Mes parcours</h2>
      <div style={journeysStyle}>
        {journeys.map((journey) => (
          <button
            key={journey.name}
            style={journeyStyle}
            onClick={() => setSelectedJourney(journey)}
            disabled={journey === selectedJourney}
          >
            <div>{journey.name}</div>
            <div>{journey.checkpointIdList.length} étapes</div>
            <div style={{ margin: 'auto', width: '50px', height: '20px', background: journey.color }}></div>
          </button>
        ))}
      </div>
    </>
  );
}

export default Journeys;
