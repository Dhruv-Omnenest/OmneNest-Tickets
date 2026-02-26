import React, { useEffect, useRef } from 'react';
import { 
  createChart, 
  AreaSeries,
} from 'lightweight-charts';
import { areaData } from '../data/area';


const AreaChart: React.FC = () => {
  const firstContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!firstContainerRef.current) return;
    const firstChart = createChart(firstContainerRef.current, {
      height: 400,
      layout: { background: { color: '#ffffff' }, textColor: '#333' },
    });
    const areaSeries = firstChart.addSeries(AreaSeries);
    areaSeries.setData(areaData);

    return () => {
      firstChart.remove();
    };
  }, []); 

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
      <div>
        <h3>Area Chart</h3>
        <div ref={firstContainerRef} />
      </div>
      <hr />
    </div>
  );
};

export default AreaChart;