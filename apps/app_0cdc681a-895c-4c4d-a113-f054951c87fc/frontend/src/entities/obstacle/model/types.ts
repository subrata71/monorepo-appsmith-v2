export interface ObstacleState {
  id: string;
  position: {
    x: number;
    y: number;
  };
  velocity: {
    x: number;
    y: number;
  };
  width: number;
  height: number;
  type: 'basic' | 'tall' | 'wide';
}

export interface ObstacleConfig {
  speed: number;
  spawnX: number;
  groundY: number;
  types: {
    basic: { width: number; height: number };
    tall: { width: number; height: number };
    wide: { width: number; height: number };
  };
}
