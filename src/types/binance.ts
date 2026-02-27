export interface PriceData {
  symbol: string;
  price: number;
  changePercent: number;
  lastUpdated: number;
}

export type ConnectionStatus = 'CONNECTED' | 'DISCONNECTED' | 'RECONNECTING';

export interface TradeStore {
  prices: Record<string, PriceData>;
  status: ConnectionStatus;
  setPrice: (data: PriceData) => void;
  setStatus: (status: ConnectionStatus) => void;
}