import { InternalError } from "../InternalError";

export class Timer {
  private isRunning = false;

  get running() {
    return this.isRunning;
  }

  private timeout_id: NodeJS.Timeout | null = null;
  private callback: (() => void) | null = null;

  constructor() {}

  start(milliseconds: number, callback: () => void) {
    if (this.isRunning || milliseconds === 0) return;
    this.isRunning = true;

    this.callback = callback;
    this.timeout_id = setTimeout(() => {
      this.isRunning = false;
      callback();
    }, milliseconds);
  }

  extend(milliseconds: number) {
    if (this.isRunning === false || !this.timeout_id || !this.callback) throw new InternalError("cannotExtendTimer");

    clearTimeout(this.timeout_id);
    this.timeout_id = setTimeout(() => {
      this.isRunning = false;
      this.callback!();
    }, milliseconds);
  }

  clear() {
    if (this.timeout_id) {
      clearTimeout(this.timeout_id);
      this.timeout_id = null;
      this.callback = null;
    }

    this.isRunning = false;
  }
}
