type Listener<T extends any[] = any[]> = (...args: T) => void;

class EventBus<Events extends Record<string, any[]>> {
  private listeners: {
    [K in keyof Events]?: Listener<Events[K]>[];
  } = {};

  on<K extends keyof Events>(event: K, callback: Listener<Events[K]>): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(callback);
  }

  off<K extends keyof Events>(event: K, callback: Listener<Events[K]>): void {
    const eventListeners = this.listeners[event];
    if (!eventListeners) {
      throw new Error(`Нет события: ${String(event)}`);
    }
    this.listeners[event] = eventListeners.filter(l => l !== callback);
  }

  emit<K extends keyof Events>(event: K, ...args: Events[K]): void {
    const eventListeners = this.listeners[event];
    if (!eventListeners) {
      throw new Error(`Нет события: ${String(event)}`);
    }
    eventListeners.forEach(listener => listener(...args));
  }
}

export default EventBus;
