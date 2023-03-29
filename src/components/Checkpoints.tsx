import { CSSProperties, FormEvent } from 'react';
import { useCheckpoint } from '../context/CheckpointContext';

const addStepButtonStyle: CSSProperties = {
  borderRadius: '10px',
  width: '250px',
  height: '40px',
  fontSize: '16px'
};

const addStepInputStyle: CSSProperties = {
  width: '240px',
  padding: '5px',
  fontSize: '16px',
  marginBottom: '5px',
}

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

function Checkpoints() {
  const { addCheckpoint, setSelectedCheckpoint, selectedCheckpoint, checkpoints } = useCheckpoint();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = form['checkpoint-name'].value;
    addCheckpoint(name);
    form['checkpoint-name'].value = '';
  };

  return (
    <>
      <h2>Mes étapes</h2>
      <p>Pour ajouter une étape centrer la carte sur la position désirée, saisissez le nom de l'étape, et cliquer sur le bouton ci-dessous:</p>
      <form onSubmit={handleSubmit}>
        <input name="checkpoint-name" required style={addStepInputStyle}></input>
        <button type="submit" style={addStepButtonStyle} >
          Ajouter une étape
        </button>
      </form>
      <div style={stepsStyle}>
        {checkpoints.map((step) => (
          <button
            disabled={step === selectedCheckpoint}
            key={step.name}
            style={stepStyle}
            onClick={() => setSelectedCheckpoint(step)}
          >
            <div>{step.name}</div>
            <div>
              <span>{step.coordinate[0]}</span>
              <span>{step.coordinate[1]}</span>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

export default Checkpoints;
