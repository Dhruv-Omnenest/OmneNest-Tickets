import React, { useEffect, useRef } from 'react';
import { createChart, CandlestickSeries, LineSeries, ColorType } from 'lightweight-charts';
import type { UTCTimestamp } from 'lightweight-charts';
const calculateSMA = (data: any[], period: number) => {
  let sma = [];
  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    const sum = slice.reduce((acc, val) => acc + val.close, 0);
    sma.push({ time: data[i].time, value: sum / period });
  }
  return sma;
};



const CandleChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 500,
      layout: { background: { type: ColorType.Solid, color: '#ffffff' }, textColor: '#333' },
      grid: { vertLines: { color: '#f0f0f0' }, horzLines: { color: '#f0f0f0' } },
    });

    const candleSeries = chart.addSeries(CandlestickSeries);

    const upperBand = chart.addSeries(LineSeries, { color: '#2196F3', lineWidth: 1, title: 'BB Upper' });
    const lowerBand = chart.addSeries(LineSeries, { color: '#2196F3', lineWidth: 1, title: 'BB Lower' });

    const fetchData = async () => {
      try {
        const response = await fetch('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=150');
        const rawData = await response.json();
        const formattedData = rawData.map((d: any) => ({
          time: (d[0] / 1000) as UTCTimestamp,
          open: parseFloat(d[1]),
          high: parseFloat(d[2]),
          low: parseFloat(d[3]),
          close: parseFloat(d[4]),
        }));

        candleSeries.setData(formattedData);

        const sma20 = calculateSMA(formattedData,10);
        const bbUpperData = sma20.map(d => ({ time: d.time, value: d.value * 1.05 }));
        const bbLowerData = sma20.map(d => ({ time: d.time, value: d.value * 0.95 }));

        upperBand.setData(bbUpperData);
        lowerBand.setData(bbLowerData);

        chart.timeScale().fitContent();
      } catch (error) {
        console.error("Error loading indicators:", error);
      }
    }
    fetchData();
    return () => chart.remove();
  }, []);

  return (
    <div style={{ padding: '20px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontFamily: 'sans-serif' }}>BTC/USDT with Indicators</h2>
      <div ref={chartContainerRef} />
    </div>
  );
};

export default CandleChart;