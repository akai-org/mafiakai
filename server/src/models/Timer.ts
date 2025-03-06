function null_or_undefined(x: any | null | undefined) {
  return x === null || x === undefined;
}

export class Timer {
  public isRunning = false;
  private timeout_id: NodeJS.Timeout | null = null;
  private callback: (() => void) | null = null;
  private until: number | null = null;
  constructor(private time: number) {}

  getUntil() {
    return this.until;
  }

  extend(milliseconds: number) {
    if (this.isRunning === false || null_or_undefined(this.timeout_id) || null_or_undefined(this.callback)) {
      throw new Error("Nothing is scheduled.");
    }
    clearTimeout(this.timeout_id!);
    this.isRunning = true;
    this.until = Date.now() + milliseconds;
    setTimeout(() => {
      this.isRunning = false;
      this.callback!();
    }, milliseconds);
  }

  start(callback: () => void) {
    clearTimeout(this.timeout_id!);
    this.isRunning = true;
    this.until = Date.now() + this.time;
    this.callback = callback;
    this.timeout_id = setTimeout(() => {
      this.isRunning = false;
      callback();
    }, this.time);
  }
}
