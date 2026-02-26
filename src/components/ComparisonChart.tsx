import React, { useEffect, useRef } from "react";
import { createChart, LineSeries } from "lightweight-charts";

type Props = {
    symbols: string[];
};

const colors = ["blue", "orange", "green", "red", "purple"];

const ComparisonChart: React.FC<Props> = ({ symbols }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const chart = createChart(containerRef.current, {
            height: 400,
        });

        const normalize = (data: any[]) => {
            const first = data[0].value;
            return data.map((item) => ({
                time: item.time,
                value: (item.value / first - 1) * 100,
            }));
        };

        const fetchData = async (symbol: string) => {
            const res = await fetch(
                `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1d&limit=100`
            );
            const json = await res.json();

            return json.map((item: any) => ({
                time: item[0] / 1000,
                value: parseFloat(item[4]),
            }));
        };

        symbols.map(async (symbol, index) => {
            const series = chart.addSeries(LineSeries, {
                color: colors[index % colors.length],
                lineWidth: 2,
            });

            const rawData = await fetchData(symbol);
            const normalizedData = normalize(rawData);

            series.setData(normalizedData);
        });

        chart.timeScale().fitContent();

        return () => {
            chart.remove();
        };
    }, [symbols]);

    return (
        <div>
            <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
                {symbols.map((symbol, index) => (
                    <div key={symbol} style={{ color: colors[index % colors.length] }}>
                        ● {symbol}
                    </div>
                ))}
            </div>

            <div ref={containerRef} />
        </div>
    );
};

export default ComparisonChart;