import Newsletter from '../../models/blog/newsletter.model.js';

export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      if (existing.subscribed) {
        return res.status(400).json({ success: false, message: 'Already subscribed!' });
      }
      existing.subscribed = true;
      await existing.save();
      return res.json({ success: true, message: 'Re-subscribed successfully!' });
    }

    await Newsletter.create({ email });
    res.status(201).json({ success: true, message: 'Subscribed successfully! Welcome aboard 🎉' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;
    await Newsletter.findOneAndUpdate({ email }, { subscribed: false });
    res.json({ success: true, message: 'Unsubscribed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getSubscribers = async (req, res) => {
  try {
    const count = await Newsletter.countDocuments({ subscribed: true });
    const subscribers = await Newsletter.find({ subscribed: true }).sort('-subscribedAt').limit(50);
    res.json({ success: true, data: subscribers, total: count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};