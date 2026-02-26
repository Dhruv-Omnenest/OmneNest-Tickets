import React, { useEffect, useRef, useState } from 'react';
import { 
  createChart, 
  CandlestickSeries, 
  LineSeries, 
  ColorType, 
} from 'lightweight-charts';
import type { UTCTimestamp, CandlestickData, LineData, IChartApi } from 'lightweight-charts';

interface BarData extends CandlestickData<UTCTimestamp> {
  close: number;
}

interface IndicatorPoint {
  time: UTCTimestamp;
  value: number | null;
}

const calculateSMA = (data: BarData[], period: number): IndicatorPoint[] => {
  return data.map((val, index) => {
    if (index < period - 1) return { time: val.time, value: null };
    const slice = data.slice(index - period + 1, index + 1);
    const sum = slice.reduce((a, b) => a + b.close, 0);
    return { time: val.time, value: sum / period };
  });
};

const calculateBollingerBands = (data: BarData[], period: number = 20, stdDevMult: number = 2) => {
  const basis = calculateSMA(data, period);
  return basis.map((b, index) => {
    if (index < period - 1 || b.value === null) {
      return { time: b.time, upper: null, lower: null, basis: null };
    }
    const slice = data.slice(index - period + 1, index + 1);
    const mean = b.value;
    const squareDiffs = slice.map(d => Math.pow(d.close - mean, 2));
    const standardDeviation = Math.sqrt(squareDiffs.reduce((a, b) => a + b, 0) / period);
    
    return {
      time: b.time,
      upper: mean + (standardDeviation * stdDevMult),
      lower: mean - (standardDeviation * stdDevMult),
      basis: mean
    };
  });
};

const calculateEMA = (data: (BarData[] | LineData[]), period: number): IndicatorPoint[] => {
  const k = 2 / (period + 1);
  const results: IndicatorPoint[] = [];
  let prevEma: number | null = null;

  data.forEach((val, i) => {
    const currentPrice = 'close' in val ? val.close : (val as LineData).value;
    if (i === 0) {
      prevEma = currentPrice;
      results.push({ time: val.time as UTCTimestamp, value: prevEma });
    } else {
      const ema = (currentPrice - (prevEma ?? 0)) * k + (prevEma ?? 0);
      prevEma = ema;
      results.push({ time: val.time as UTCTimestamp, value: ema });
    }
  });
  return results;
};

const CandleChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [indicator, setIndicator] = useState<string>('BB');

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 500,
      layout: {
        background: { type: ColorType.Solid, color: '#ffffff' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      rightPriceScale: {
        borderColor: '#d1d4dc',
      },
      timeScale: {
        borderColor: '#d1d4dc',
        timeVisible: true,
      },
    });
    chartRef.current = chart;

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    const fetchData = async () => {
      try {
        const response = await fetch('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=200');
        const rawData = await response.json();
        const formattedData: BarData[] = rawData.map((d: any) => ({
          time: (d[0] / 1000) as UTCTimestamp,
          open: parseFloat(d[1]),
          high: parseFloat(d[2]),
          low: parseFloat(d[3]),
          close: parseFloat(d[4]),
        }));

        candleSeries.setData(formattedData);

        if (indicator === 'BB') {
          const bb = calculateBollingerBands(formattedData);
          
          const upperLine = chart.addSeries(LineSeries, { color: '#2196F3', lineWidth: 1, title: 'Upper' });
          const basisLine = chart.addSeries(LineSeries, { color: '#FF9800', lineWidth: 1, title: 'Basis' });
          const lowerLine = chart.addSeries(LineSeries, { color: '#2196F3', lineWidth: 1, title: 'Lower' });

          upperLine.setData(bb.map(d => ({ time: d.time, value: d.upper ?? undefined })));
          basisLine.setData(bb.map(d => ({ time: d.time, value: d.basis ?? undefined })));
          lowerLine.setData(bb.map(d => ({ time: d.time, value: d.lower ?? undefined })));
        } 
        
        else if (indicator === 'MACD') {
          const fast = calculateEMA(formattedData, 12);
          const slow = calculateEMA(formattedData, 26);
          const macdLineData = fast.map((f, i) => ({ 
            time: f.time, 
            value: (f.value ?? 0) - (slow[i].value ?? 0) 
          }));
          
          const macdSeries = chart.addSeries(LineSeries, { color: '#2196F3', priceScaleId: 'left' });
          const signalSeries = chart.addSeries(LineSeries, { color: '#ef5350', priceScaleId: 'left' });

          macdSeries.setData(macdLineData as LineData[]);
          signalSeries.setData(calculateEMA(macdLineData as LineData[], 9) as LineData[]);
          
          chart.priceScale('left').applyOptions({ visible: true, borderColor: '#d1d4dc' });
        }

        chart.timeScale().fitContent();
      } catch (err) {
        console.error("Chart Error:", err);
      }
    };

    fetchData();
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [indicator]);

  return (
    <div style={{ 
      background: '#f8f9fa', 
      padding: '20px', 
      borderRadius: '12px', 
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ 
        marginBottom: '20px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <h2 style={{ margin: 0, color: '#1a1a1a', fontSize: '20px' }}>BTC / USDT</h2>
        <select 
          value={indicator} 
          onChange={(e) => setIndicator(e.target.value)}
          style={{ 
            padding: '10px 16px', 
            borderRadius: '8px', 
            border: '1px solid #d1d4dc',
            fontSize: '14px',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="BB">Bollinger Bands</option>
          <option value="MACD">MACD</option>
        </select>
      </div>
      <div ref={chartContainerRef} style={{ borderRadius: '8px', overflow: 'hidden' }} />
    </div>
  );
};

export default CandleChart;