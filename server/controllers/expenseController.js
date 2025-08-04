const mongoose = require("mongoose");

exports.addExpense = async (req, res) => {
  try {
    const { title, category, amount, date } = req.body;
    const userId = req.user.id || req.body.userId; // From token or body

    const newExpense = new Expense({
      title,
      category,
      amount,
      date,
      userId: mongoose.Types.ObjectId(userId),  // ✅ convert to ObjectId
    });

    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    console.error("Error saving expense:", error);
    res.status(500).json({ error: "Failed to add expense" });
  }
};

// Fetch all expenses from a group
exports.getGroupExpenses = async (req, res) => {
  try {
    const groupId = req.query.groupId;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    const expenses = await Expense.find({ userId: { $in: group.members } }).populate('userId', 'name');
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get expenses' });
  }
};
