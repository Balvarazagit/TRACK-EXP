import React, { useEffect, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import "../styles/ExpenseChart.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart = ({ expenses, darkMode, isMobile }) => {
  const chartRef = useRef(null);
  
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.canvas.style.transition = "all 0.5s ease";
      chartRef.current.canvas.style.opacity = 0;
      setTimeout(() => {
        chartRef.current.canvas.style.opacity = 1;
      }, 300);
    }
  }, [expenses]);

  const categoryTotals = {};
  expenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const data = {
    labels: Object.keys(categoryTotals),
    datasets: [{
      data: Object.values(categoryTotals),
      backgroundColor: [
        '#6366F1', '#EC4899', '#10B981', '#F59E0B', '#3B82F6',
        '#8B5CF6', '#EF4444', '#14B8A6', '#F97316', '#8B5CF6'
      ],
      borderColor: darkMode ? '#1F2937' : '#F3F4F6',
      borderWidth: 2,
      hoverBorderColor: darkMode ? '#E5E7EB' : '#111827',
      hoverOffset: 10
    }],
  };

  const options = {
    plugins: {
      legend: {
        position: isMobile ? 'bottom' : 'right',
        labels: {
          color: darkMode ? '#E5E7EB' : '#374151',
          font: {
            size: isMobile ? 12 : 14,
            family: 'Inter'
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        },
      },
      tooltip: {
        backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
        titleColor: darkMode ? '#E5E7EB' : '#111827',
        bodyColor: darkMode ? '#D1D5DB' : '#6B7280',
        borderColor: darkMode ? '#374151' : '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        bodyFont: {
          size: 14,
          weight: '500'
        },
        titleFont: {
          size: 16,
          weight: '600'
        },
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ₹${value.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1000
    },
    cutout: isMobile ? '60%' : '50%',
    maintainAspectRatio: false,
    responsive: true
  };

  if (expenses.length === 0) {
  return (
    <div className="chart-empty">
      <p>No expense data for selected category.</p>
    </div>
  );
}

  return (
    <div className="chart-container animate-fade">
      <Pie 
        ref={chartRef}
        data={data} 
        options={options} 
      />
    </div>
  );
};

export default ExpenseChart;