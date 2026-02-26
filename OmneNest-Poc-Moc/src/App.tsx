import { useState } from "react";
import AdvancedComponent from "./components/AdvancedComponent"
import AreaChart from "./components/AreaChart"
import CandleChart from "./components/Candle"
import ComparisonChart from "./components/ComparisonChart";
import LineChart from "./components/LineChart"
function App() {
  const [symbols] = useState(["BTCUSDT", "ETHUSDT", "BNBUSDT"]);
  return (
    <div>
      <AreaChart/>
      <CandleChart/>
      <LineChart/>
      <AdvancedComponent/>
         <div style={{ padding: "20px", background: "#ffffff", minHeight: "100vh" }}>
      <h2 style={{ color: "white" }}>Overlay Comparison Chart</h2>
      <ComparisonChart symbols={symbols} />
    </div>
    </div>
  )
}

export default App
