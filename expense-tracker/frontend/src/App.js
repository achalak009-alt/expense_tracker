import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function App() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    amount: "",
    category: "",
    date: "",
    description: ""
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const res = await axios.get("https://expense-tracker-h01c.onrender.com/expenses");
    setExpenses(res.data);
  };

  const deleteExpense = async (id) => {
    await axios.delete(`https://expense-tracker-h01c.onrender.com/delete/${id}`);
    fetchExpenses();
  };

  const editExpense = async (id) => {
    const newAmount = prompt("Enter new amount:");
    if (!newAmount) return;

    await axios.put(`https://expense-tracker-h01c.onrender.com/update/${id}`, {
      ...form,
      amount: newAmount
    });

    fetchExpenses();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("https://expense-tracker-h01c.onrender.com/add", form);
    fetchExpenses();
  };

  // Chart Data
  const categories = ["shopping", "food", "bills", "travel", "others"];

  const categoryTotals = categories.map(cat =>
    expenses
      .filter(e => e.category === cat)
      .reduce((sum, e) => sum + Number(e.amount), 0)
  );

  const data = {
    labels: categories,
    datasets: [
      {
        label: "Expenses by Category",
        data: categoryTotals,
        backgroundColor: "rgba(0, 102, 255, 0.6)",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "white" } },
    },
    scales: {
      x: {
        ticks: { color: "white" },
        grid: { display: false },
      },
      y: {
        ticks: { color: "white" },
        grid: { color: "rgba(255,255,255,0.15)" },
      },
    },
  };

  return (
    <div className="container">
      <h1 className="title">💰 Expense Tracker</h1>

      <form className="form" onSubmit={handleSubmit}>
        <input placeholder="Amount"
          onChange={e => setForm({...form, amount: e.target.value})}/>

        <input placeholder="Category"
          onChange={e => setForm({...form, category: e.target.value})}/>

        <input type="date"
          onChange={e => setForm({...form, date: e.target.value})}/>

        <input placeholder="Description"
          onChange={e => setForm({...form, description: e.target.value})}/>

        <button type="submit">➕ Add Expense</button>
      </form>

      <div className="analytics-container">
        <h2>Analytics</h2>
        <div className="chart-box">
          <Bar data={data} options={options} />
        </div>
      </div>

      <div className="expense-list">
        {expenses.map(e => (
          <div key={e.id} className="card">
            <p>₹{e.amount}</p>
            <span>{e.category}</span>
            <small>{e.date}</small>
            <button onClick={() => editExpense(e.id)}>✏️ Edit</button>
            <button onClick={() => deleteExpense(e.id)}>❌ Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;