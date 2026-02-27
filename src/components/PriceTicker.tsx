import { memo, useEffect, useRef } from 'react';
import { useTradeStore } from '../store/useTradeStore';

export const PriceTicker = memo(({ symbol }: { symbol: string }) => {
  const data = useTradeStore((state) => state.prices[symbol]);
  const status = useTradeStore((state) => state.status);
  const prevPrice = useRef<number>(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data?.price && cardRef.current) {
      // Flash effect logic
      const color = data.price >= prevPrice.current ? '#22c55e' : '#ef4444';
      cardRef.current.style.borderLeft = `4px solid ${color}`;
      prevPrice.current = data.price;
    }
  }, [data?.price]);

  if (!data) return <div style={{ color: '#999' }}>Waiting for {symbol}...</div>;

  return (
    <div ref={cardRef} style={{
      padding: '15px',
      background: '#ffffff',
      borderRadius: '8px',
      color: '#1a1a1a',
      border: '1px solid #e5e7eb',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      opacity: status === 'CONNECTED' ? 1 : 0.5,
      transition: 'all 0.3s ease'
    }}>
      <div style={{ fontSize: '12px', color: '#888' }}>{symbol}</div>
      <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
        ${data.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </div>
      <div style={{ color: data.changePercent >= 0 ? '#22c55e' : '#ef4444', fontSize: '13px' }}>
        {data.changePercent >= 0 ? '▲' : '▼'} {Math.abs(data.changePercent)}%
      </div>
    </div>
  );
});