import { useTradeStore } from '../store/useTradeStore';

class BinanceService {
  private ws: WebSocket | null = null;
  private reconnectCount = 0;
  private symbols: string[] = [];

  connect(symbols: string[]) {
    this.symbols = symbols;
    const { setStatus, setPrice } = useTradeStore.getState();
    const streams = symbols.map(s => `${s.toLowerCase()}@ticker`).join('/');
    const url = `wss://stream.binance.com:9443/stream?streams=${streams}`;

    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log("Trading Socket Connected");
      this.reconnectCount = 0;
      setStatus('CONNECTED');
    };

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.data) {
        const t = msg.data;
        setPrice({
          symbol: t.s,
          price: parseFloat(t.c),
          changePercent: parseFloat(t.P),
          lastUpdated: Date.now()
        });
      }
    };

    this.ws.onclose = (e) => {
      setStatus('DISCONNECTED');
      if (e.code !== 1000) this.handleReconnect();
    };

    this.ws.onerror = () => this.ws?.close();
  }

  private handleReconnect() {
    const { setStatus } = useTradeStore.getState();
    setStatus('RECONNECTING');
    const delay = Math.min(1000 * Math.pow(2, this.reconnectCount), 30000);

    setTimeout(() => {
      this.reconnectCount++;
      this.connect(this.symbols);
    }, delay);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close(1000);
      this.ws = null;
    }
  }
}

export const binanceService = new BinanceService();