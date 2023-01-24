import { CSSProperties } from 'react';
import { Step } from '../App';

const sidePanelStyle: CSSProperties = {
  backgroundColor: '#EEE',
  width: '600px',
  textAlign: 'center',
  padding: '15px',
  fontSize: '16px',
  borderLeft: '1px solid #ccc'
};

const addStepButtonStyle: CSSProperties = {
  borderRadius: '10px',
  width: '250px',
  height: '40px',
  fontSize: '16px'
};

const stepsStyle: CSSProperties = {
  marginTop: '15px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
}

const stepStyle: CSSProperties = {
  border: '1px solid #ccc',
  borderRadius: '10px',
  padding: '15px',
}

interface SidePanelSpec {
  steps: Step[],
  addStep: () => void,
  setSelectedStep: React.Dispatch<React.SetStateAction<Step | undefined>>,
}

function SidePanel({ steps, addStep, setSelectedStep }: SidePanelSpec) {
  return (
    <div style={sidePanelStyle}>
      <h2>Mes étapes</h2>
      <p>Pour ajouter une étape centrer la carte sur la position désirée et cliquer sur le bouton ci-dessous:</p>
      <button
        onClick={addStep}
        style={addStepButtonStyle}
      >
        Ajouter une étape
      </button>
      <div style={stepsStyle}>
        {steps.map((step) => (
          <button
            key={step.name}
            style={stepStyle}
            onClick={() => setSelectedStep(step)}
          >
            <div>{step.name}</div>
            <div>
              <span>{step.coordinate[0]}</span>
              <span>{step.coordinate[1]}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default SidePanel;
