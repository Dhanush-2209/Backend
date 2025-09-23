import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import './ChartStyles.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function RevenueChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5001/products').then(res => res.json()),
      fetch('http://localhost:5000/orders').then(res => res.json())
    ])
      .then(([products, orders]) => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const productMap = new Map();
        products.forEach(p => {
          productMap.set(String(p.id), parseFloat(p.price) || 0);
        });

        const revenueBuckets = [0, 0, 0, 0]; // Week 1 to Week 4

        orders.forEach(order => {
          if (order.status !== 'Completed' || !order.deliverydate) return;

          const deliveryDate = new Date(order.deliverydate);
          if (
            deliveryDate.getMonth() !== currentMonth ||
            deliveryDate.getFullYear() !== currentYear
          ) return;

          const day = deliveryDate.getDate();
          let weekIndex = 0;
          if (day <= 7) weekIndex = 0;
          else if (day <= 14) weekIndex = 1;
          else if (day <= 21) weekIndex = 2;
          else weekIndex = 3;

          order.products.forEach(item => {
            const price = productMap.get(String(item.productId));
            if (!price || isNaN(price)) return;
            revenueBuckets[weekIndex] += price * item.quantity;
          });
        });

        setChartData({
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [
            {
              label: 'Revenue (₹)',
              data: revenueBuckets,
              backgroundColor: 'rgba(30, 144, 255, 0.6)',
            }
          ]
        });
      })
      .catch(err => console.error('Failed to fetch data:', err));
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: context => `₹${context.raw.toLocaleString()} earned`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Revenue (₹)'
        },
        ticks: {
          callback: value => `₹${value.toLocaleString()}`,
          maxTicksLimit: 5
        }
      },
      x: {
        title: {
          display: true,
          text: 'Week of the Month'
        }
      }
    }
  };

  return (
    <div className="chart-wrapper">
      <h3>Weekly Revenue (Completed Orders This Month)</h3>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default RevenueChart;
