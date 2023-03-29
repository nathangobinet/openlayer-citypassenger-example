export interface Checkpoint {
  coordinate: Coordinate,
  name: string,
  id: number,
}

export interface Journey {
  name: string,
  color: string,
  checkpointIdList: number[],
}

export type AppMode = 'checkpoint' | 'journey';