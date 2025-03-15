export class StateManager<State extends Record<string, any>> {
  private handlers: Partial<{ [key in keyof State]: (value: State[key]) => void }> = {};

  on<P extends keyof State>(property: P, callback: (value: State[P]) => void) {
    this.handlers[property] = callback;
  }

  emit<P extends keyof State>(property: P, value: State[P]) {
    const handler = this.handlers[property];
    if (handler) handler(value);
  }
}
