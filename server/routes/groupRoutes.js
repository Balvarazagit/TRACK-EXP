const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

// POST /api/group/create
router.post('/create', async (req, res) => {
  try {
    const { userId } = req.body;
    const code = uuidv4().slice(0, 6).toUpperCase();

    const group = new Group({ code, members: [userId] });
    await group.save();

    await User.findByIdAndUpdate(userId, { groupId: group._id });

    res.json({ group });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create group' });
  }
});

// POST /api/group/join
router.post('/join', async (req, res) => {
  try {
    const { code, userId } = req.body;
    const group = await Group.findOne({ code });

    if (!group) return res.status(404).json({ error: 'Invalid code' });

    if (!group.members.includes(userId)) {
      group.members.push(userId);
      await group.save();
    }

    await User.findByIdAndUpdate(userId, { groupId: group._id });

    res.json({ group });
  } catch (err) {
    res.status(500).json({ error: 'Failed to join group' });
  }
});

// DELETE /api/group/:id
router.delete('/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findByIdAndDelete(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
