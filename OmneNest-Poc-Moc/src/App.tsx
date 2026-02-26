import AdvancedComponent from "./components/AdvancedComponent"
import AreaChart from "./components/AreaChart"
import CandleChart from "./components/Candle"
import LineChart from "./components/LineChart"


function App() {
  return (
    <div>
      <AreaChart/>
      <CandleChart/>
      <LineChart/>
      <AdvancedComponent/>
    </div>
  )
}

export default App
