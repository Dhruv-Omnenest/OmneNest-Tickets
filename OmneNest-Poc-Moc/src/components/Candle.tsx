import React, { useEffect, useRef } from 'react';
import { createChart, CandlestickSeries, ColorType } from 'lightweight-charts';
import type { UTCTimestamp } from 'lightweight-charts';
const CandleChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: { background: { type: ColorType.Solid, color: '#fbfcfe' }, textColor: '#0a0a0a' },
    });

    const candleSeries = chart.addSeries(CandlestickSeries);
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=100'
        );
        const rawData = await response.json();
        const formattedData = rawData.map((d: any) => ({
          time: (d[0] / 1000) as UTCTimestamp, 
          open: parseFloat(d[1]),
          high: parseFloat(d[2]),
          low: parseFloat(d[3]),
          close: parseFloat(d[4]),
        }));

        candleSeries.setData(formattedData);
        chart.timeScale().fitContent();
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();

    return () => chart.remove();
  }, []);

  return (
    <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px' }}>
      <h2>Stock Market</h2>
      <div ref={chartContainerRef} />
    </div>
  );
};

export default CandleChart;