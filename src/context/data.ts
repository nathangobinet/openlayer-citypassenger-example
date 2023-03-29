import { Checkpoint, Journey } from '../types';

export const checkpoints: Checkpoint[] = [
  {
    id: 0,
    name: 'Parc',
    coordinate: [
      2.268037660351867,
      48.80339838997668
    ]
  },
  {
    id: 1,
    name: 'Collège',
    coordinate: [
      2.2702485009466833,
      48.80316459004453
    ]
  },
  {
    id: 2,
    name: 'Maternelle',
    coordinate: [
      2.2699314895569245,
      48.80107779702092
    ]
  },
  {
    id: 3,
    name: 'Lycée',
    coordinate: [
      2.2717719499473574,
      48.79566231873429
    ]
  },
  {
    id: 4,
    name: 'Stade',
    coordinate: [
      2.2593546444769523,
      48.80053525037292
    ]
  }
];

export const journeys: Journey[] = [
  {
    name: 'Centre ville',
    color: 'red',
    checkpointIdList: [0, 1, 2],
  },
  {
    name: 'Scolaire',
    color: 'blue',
    checkpointIdList: [1, 2, 3],
  },
  {
    name: 'Complet',
    color: 'green',
    checkpointIdList: [4, 0, 1, 2, 3],
  },
]
