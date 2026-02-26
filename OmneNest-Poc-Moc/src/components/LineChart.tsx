import {  createChart, LineSeries } from "lightweight-charts";
import { useEffect, useRef } from "react";
import { areaData } from "../data/area";


const LineChart :React.FC= ()=>{
    const containerRef= useRef<HTMLDivElement>(null);

    useEffect(()=>{
     if (!containerRef.current) return;
      const timeSeries = createChart(containerRef.current,
        {

            height:400,
            layout:{
                background:{color: "#fff"}
            }
        }
      )
     const series= timeSeries.addSeries(LineSeries);

      series.setData(areaData)
      
      return ()=>{
        timeSeries.remove();
      }
    })
    return(
        <div>
            <div ref={containerRef}
            style={{ position: 'relative', width: '100%'}}
            >

            </div>
        </div>
    )
}



export default LineChart;