export interface BarPoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export const timeSeriesData: BarPoint[] = [
  { time: '2024-05-01', open: 150.00, high: 153.00, low: 149.50, close: 150.25 },
  { time: '2024-05-10', open: 150.25, high: 154.20, low: 150.00, close: 152.10 },
  { time: '2024-05-20', open: 152.10, high: 158.50, low: 151.20, close: 157.80 },
  { time: '2024-05-30', open: 157.80, high: 162.00, low: 157.00, close: 160.40 },
  { time: '2024-06-01', open: 160.40, high: 161.00, low: 155.00, close: 156.20 },
  { time: '2024-06-10', open: 156.20, high: 159.00, low: 154.80, close: 158.10 },
  { time: '2024-06-20', open: 158.10, high: 158.50, low: 150.20, close: 151.50 },
  { time: '2024-06-30', open: 151.50, high: 155.00, low: 151.00, close: 154.30 },
  { time: '2024-07-01', open: 154.30, high: 158.00, low: 154.00, close: 157.90 },
  { time: '2024-07-10', open: 157.90, high: 165.20, low: 157.50, close: 164.10 },
  { time: '2024-07-20', open: 164.10, high: 172.00, low: 163.00, close: 170.50 },
  { time: '2024-07-30', open: 170.50, high: 178.00, low: 170.00, close: 177.20 },
];