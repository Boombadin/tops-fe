import SubscriptionService from '../services/subscriptionService'

const addGuestSubscription = async (req, res) => {
  try {
    const { email } = req.body;

    const response = await SubscriptionService.addGuestSubscription(email)
    return res.json(response);
  } catch (e) {
    return res.json({ success: false })
  }
}

export default {
  addGuestSubscription
}
