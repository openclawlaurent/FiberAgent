export default function handler(req, res) {
  const { agent_id, merchant_url, cashback_rate } = req.query;

  if (!merchant_url || !agent_id) {
    return res.status(400).json({ error: 'Missing merchant_url or agent_id' });
  }

  // Decode the merchant URL
  const decodedUrl = decodeURIComponent(merchant_url);

  // Track this referral (optional - would go to your backend)
  console.log(`[REFERRAL] Agent: ${agent_id}, Merchant: ${decodedUrl}, Cashback: ${cashback_rate}`);

  // Redirect through wild.link with proper params
  // Format: https://wild.link/r/{merchant_id}?u={encoded_url}&agent={agent_id}
  const wildlinkUrl = new URL('https://wild.link/r');
  wildlinkUrl.searchParams.append('u', decodedUrl);
  wildlinkUrl.searchParams.append('agent', agent_id);
  if (cashback_rate) wildlinkUrl.searchParams.append('cb', cashback_rate);

  res.redirect(302, wildlinkUrl.toString());
}
