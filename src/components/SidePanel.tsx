import { CSSProperties } from 'react';
import { useAppMode } from '../context/ModeContext';
import Checkpoints from './Checkpoints';
import Journeys from './Journeys';

const sidePanelStyle: CSSProperties = {
  backgroundColor: '#EEE',
  width: '600px',
  textAlign: 'center',
  padding: '15px',
  fontSize: '16px',
  borderLeft: '1px solid #ccc'
};

function SidePanel() {
  const { appMode, setAppMode } = useAppMode();

  return (
    <div style={sidePanelStyle}>
      <button
        onClick={() => setAppMode('checkpoint')}
        disabled={appMode === 'checkpoint'}
      >
        Etapes
      </button>
      <button
        onClick={() => setAppMode('journey')}
        disabled={appMode === 'journey'}
      >
        Parcours
      </button>
      {appMode === 'checkpoint' && <Checkpoints />}
      {appMode === 'journey' && <Journeys />}
    </div>
  );
}

export default SidePanel;
