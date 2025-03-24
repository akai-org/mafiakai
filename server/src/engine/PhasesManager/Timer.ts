import { InternalError } from "../InternalError";

export class Timer {
  public isRunning = false;


  private timeout_id: NodeJS.Timeout | null = null;
  private callback: (() => void) | null = null;

  constructor() {}

  start(milliseconds: number, callback: () => void) {
    if (this.isRunning || milliseconds === 0) return;
    this.isRunning = true;

    this.started_at = Date.now();
    this.ended_at = this.started_at + milliseconds;

    this.callback = callback;
    this.timeout_id = setTimeout(() => {
      this.isRunning = false;
      callback();
    }, milliseconds);
  }

  extend(milliseconds: number) {
    if (this.isRunning === false || !this.timeout_id || !this.callback || !this.ended_at)
      throw new InternalError("cannotExtendTimer");

    this.ended_at += milliseconds;

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
      this.started_at = null;
      this.ended_at = null;
    }

    this.isRunning = false;
  }
}
