interface EmitEvent extends Event {
  data?: any;
}

export class WebSocketClient extends EventTarget {
  number = 0;
  autoReconnectInterval = 5 * 1000;
  url?: string;
  client?: WebSocket;
  onmessage?: (data: any) => void;
  onopen?: (event: Event) => void;
  onclose?: (event: CloseEvent) => void;
  onerror?: (event: Event) => void;

  open(url: string): void {
    this.url = url;
    console.log(`WebSocket: connecting to ${this.url}`);
    this.client = new WebSocket(this.url);
    this.client.onopen = (event: Event): void => {
      console.log(`WebSocket: connected;`);
      if (this.onopen) {
        this.onopen(event);
      }
    };

    this.client.onmessage = (event): void => {
      this.number++;
      this.handleMessage(event);
    };

    this.client.onclose = (event): void => {
      if (this.onclose) {
        this.onclose(event);
      }
      switch (event.code) {
        case 1000:
          console.log('WebSocket: Closed');
          break;
        default:
          this.reconnect();
          break;
      }
    };

    this.client.onerror = (event): void => {
      if (this.onerror) {
        this.onerror(event);
      }
    };
  }

  send(data: any): void {
    if (!this.client) {
      throw new Error('socket is not currently connected');
    }
    this.client.send(data);
  }

  removeClientListeners(): void {
    if (!this.client) {
      return;
    }
    this.client.onopen = null;
    this.client.onmessage = null;
    this.client.onclose = null;
    this.client.onerror = null;
  }

  reconnect(): void {
    if (!this.url) {
      return;
    }
    console.log(`WebSocketClient: Retry in ${this.autoReconnectInterval}ms`);
    this.removeClientListeners();
    setTimeout(() => {
      if (!this.url) {
        return;
      }
      console.log("WebSocketClient: Reconnecting...");
      this.open(this.url);
    }, this.autoReconnectInterval);
  }

  handleMessage(event: MessageEvent): void {
    try {
      const msg = JSON.parse(event.data);
      if (this.onmessage) {
        this.onmessage(msg);
      }
      const emitEvent = (new Event(msg.type) as EmitEvent);
      emitEvent.data = msg.data;
      this.dispatchEvent(emitEvent);
    }
    catch (ex) {
      console.error('invalid message');
    }
  }
}
