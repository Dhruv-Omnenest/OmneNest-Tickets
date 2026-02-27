import { useEffect, useState } from "react";
import { binanceService } from "./service/binanceService";
import { PriceTicker } from "./components/PriceTicker";
import { useTradeStore } from "./store/useTradeStore";

function App() {
  const [symbols] = useState(["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT"]);
  const connectionStatus = useTradeStore((state) => state.status);
  
  useEffect(() => {
    binanceService.connect(symbols);
    const handleConnectivity = () => {
      if (navigator.onLine) {
        binanceService.connect(symbols);
      } else {
        binanceService.disconnect();
      }
    };
    window.addEventListener('online', handleConnectivity);
    window.addEventListener('offline', handleConnectivity);
    return () => {
      window.removeEventListener('online', handleConnectivity);
      window.removeEventListener('offline', handleConnectivity);
      binanceService.disconnect();
    };
  }, [symbols]);

  return (
    <div style={{ padding: "40px", background: "#fff", minHeight: "100vh" }}>
      <header style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <h1 style={{ color: 'white', margin: 0 }}>Live Exchange</h1>
        <span style={{ 
          fontSize: '12px', 
          padding: '4px 10px', 
          borderRadius: '20px', 
          background: connectionStatus === 'CONNECTED' ? '#065f46' : '#991b1b',
          color: 'white'
        }}>
          {connectionStatus}
        </span>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
        gap: '20px' 
      }}>
        {symbols.map(s => <PriceTicker key={s} symbol={s} />)}
      </div>

      <div style={{ marginTop: '40px', color: '#b7acac' }}>
        <p>Using Multiplexed Stream: <code>{symbols.join(', ')}</code></p>
      </div>
    </div>
  );
}

export default App;