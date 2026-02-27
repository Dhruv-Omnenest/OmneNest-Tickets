import { create } from 'zustand';
import type { TradeStore } from '../types/binance';

export const useTradeStore = create<TradeStore>((set) => ({
  prices: {},
  status: 'DISCONNECTED',
  setPrice: (data) => 
    set((state) => ({
      prices: { ...state.prices, [data.symbol]: data }
    })),
  setStatus: (status) => set({ status }),
}));