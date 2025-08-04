// routes/expenseRoutes.js
const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// POST expense
router.post("/", async (req, res) => {
  try {
    const { title, amount, date, category, userId, groupId } = req.body;

    // ✅ Update this validation
    if (!title || !amount || !date || !category || !userId) {
      return res.status(400).json({ message: "All fields are required including userId and groupId" });
    }

    const expense = new Expense({
      title,
      amount,
      date,
      category,
      userId,
      groupId, // ✅ make sure this is saved
    });

    const saved = await expense.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error saving expense:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET expenses by userId
router.get('/:userId', async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.params.userId });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE expense
router.delete('/:id', async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/expenses?groupId=...
router.get("/", async (req, res) => {
  const { groupId } = req.query;

  try {
    if (!groupId) {
      return res.status(400).json({ error: "groupId is required" });
    }

    const expenses = await Expense.find({ groupId }).populate("userId", "name email");
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
