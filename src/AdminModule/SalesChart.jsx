import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import './ChartStyles.css';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

function SalesChart() {
  const [weeklySales, setWeeklySales] = useState({
    thisMonth: [],
    lastMonth: [0, 0, 0, 0],
    completedWeeks: 0,
  });

  useEffect(() => {
    fetch('http://localhost:5000/orders')
      .then(res => res.json())
      .then(orders => {
        const now = new Date();
        const currentMonth = now.getMonth(); // e.g. 8 for September
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const currentYear = now.getFullYear();
        const today = now.getDate();
        const completedWeeks = Math.ceil(today / 7);

        const thisMonthSales = [0, 0, 0, 0];
        const lastMonthSales = [0, 0, 0, 0];

        orders.forEach(order => {
          if (order.status !== 'Completed') return;

          // Use orderDate instead of date
          const orderDate = new Date(order.orderDate);
          const month = orderDate.getMonth();
          const year = orderDate.getFullYear();
          const day = orderDate.getDate();

          let weekIndex = 0;
          if (day <= 7) weekIndex = 0;
          else if (day <= 14) weekIndex = 1;
          else if (day <= 21) weekIndex = 2;
          else weekIndex = 3;

          order.products.forEach(item => {
            const soldUnits = item.quantity;

            if (month === currentMonth && year === currentYear) {
              thisMonthSales[weekIndex] += soldUnits;
            } else if (month === lastMonth && year === currentYear) {
              lastMonthSales[weekIndex] += soldUnits;
            }
          });
        });

        setWeeklySales({
          thisMonth: thisMonthSales.slice(0, completedWeeks),
          lastMonth: lastMonthSales,
          completedWeeks,
        });
      })
      .catch(err => console.error('Failed to fetch sales data:', err));
  }, []);

  const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

  const data = {
    labels,
    datasets: [
      {
        label: 'This Month',
        data: [
          ...weeklySales.thisMonth,
          ...Array(4 - weeklySales.completedWeeks).fill(null),
        ],
        borderColor: '#2ed573',
        backgroundColor: '#2ed57333',
        tension: 0.3,
      },
      {
        label: 'Last Month',
        data: weeklySales.lastMonth.map(val => val || 0),
        borderColor: '#ff4757',
        backgroundColor: '#ff475733',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: context => {
            const value = context.raw;
            return value !== null ? `${value} units sold` : 'Data not available';
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Units Sold',
        },
      },
    },
  };

  return (
    <div className="chart-wrapper">
      <h3>Monthly Sales Overview</h3>
      <Line data={data} options={options} />
    </div>
  );
}

export default SalesChart;
