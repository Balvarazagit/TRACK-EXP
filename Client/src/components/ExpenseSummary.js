// ExpenseSummary.js
import React from 'react';
import '../styles/ExpenseSummary.css';

const ExpenseSummary = ({ expenses, darkMode }) => {
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const highestExpense = expenses.reduce((max, exp) => 
    exp.amount > max.amount ? exp : max, { amount: 0 });
  
  const categoryTotals = {};
  expenses.forEach((exp) => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  const topCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className={`expense-summary ${darkMode ? 'dark' : 'light'}`}>
      <h2 className="summary-title">📊 Expense Summary</h2>
      
      <div className="summary-card">
        <div className="total-section">
          <div className="total-amount">₹{total.toFixed(2)}</div>
          <div className="total-label">Total Expenses</div>
        </div>
        
        {topCategories.length > 0 && (
          <div className="top-categories">
            <h4>Top Categories</h4>
            <div className="categories-list">
              {topCategories.map(([category, amount]) => (
                <div key={category} className="category-item">
                  <span className="category-name">{category}</span>
                  <span className="category-amount">₹{amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {highestExpense.amount > 0 && (
        <div className="highest-expense">
          <div className="highest-header">
            <span className="highest-icon">🏆</span>
            <h4 className="highest-label">Highest Expense</h4>
          </div>
          <div className="highest-details">
            <span className="highest-title">{highestExpense.title}</span>
            <span className="highest-amount">₹{highestExpense.amount.toFixed(2)}</span>
          </div>
          <div className="expense-meta">
            <span className="expense-category">{highestExpense.category}</span>
            <span className="expense-date">
              {new Date(highestExpense.date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseSummary;