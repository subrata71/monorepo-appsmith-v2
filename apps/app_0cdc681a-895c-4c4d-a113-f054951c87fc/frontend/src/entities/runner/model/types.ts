export interface RunnerState {
  position: {
    x: number;
    y: number;
  };
  velocity: {
    x: number;
    y: number;
  };
  isJumping: boolean;
  isGrounded: boolean;
  width: number;
  height: number;
}

export interface RunnerConfig {
  moveSpeed: number;
  jumpForce: number;
  gravity: number;
  groundY: number;
  maxX: number;
  minX: number;
}
