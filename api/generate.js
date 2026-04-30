export default async function handler(req, res) {
  if (req.method !== 'POST') console.log('Key starts with:', (process.env.ANTHROPIC_API_KEY || 'MISSING').substring(0, 10)); {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { tool, inputs } = req.body;

  if (!tool || !inputs) {
    return res.status(400).json({ error: 'Missing tool or inputs' });
  }

  const systemPrompts = {
    listing: `You are Pender, an expert real estate copywriter with 20 years of experience writing MLS listing descriptions that sell properties fast. Write compelling, vivid, Fair Housing-compliant listing descriptions. Focus on lifestyle and emotional appeal, not just features. Never use discriminatory language. Keep descriptions between 150-200 words. Be specific, evocative, and professional.`,

    buyerEmail: `You are Pender, an expert real estate communications specialist. Write warm, professional buyer follow-up emails that feel personal and genuine — not templated. The goal is to keep the relationship alive and move toward the next showing or offer. Keep emails concise (under 150 words), friendly, and action-oriented.`,

    negotiationEmail: `You are Pender, an expert real estate negotiator and communicator. Write strategic, professional offer and negotiation emails for real estate agents. Tone should be confident but collaborative — firm on key points while keeping the relationship intact. Under 200 words. Professional and tactful.`,

    openHouse: `You are Pender, an expert real estate marketing specialist. Write engaging open house invitation copy for real estate agents — suitable for email, social media, or flyers. Create excitement and urgency while staying professional. Include a clear call to action. Keep it under 120 words and make it feel like an event worth attending.`
  };

  const userPrompts = {
    listing: `Write a compelling MLS listing description for this property:
Address: ${inputs.address || 'Not provided'}
Bedrooms/Bathrooms: ${inputs.beds || '?'}BD / ${inputs.baths || '?'}BA
Square Footage: ${inputs.sqft || 'Not provided'}
Price: ${inputs.price || 'Not provided'}
Key Features: ${inputs.features || 'Not provided'}
Neighborhood/Location Highlights: ${inputs.neighborhood || 'Not provided'}
Additional Notes: ${inputs.notes || 'None'}`,

    buyerEmail: `Write a follow-up email to a buyer I recently worked with:
Buyer Name: ${inputs.buyerName || 'the buyer'}
Properties Shown: ${inputs.properties || 'several homes'}
Date of Showing: ${inputs.showingDate || 'recently'}
Buyer's Key Preferences: ${inputs.preferences || 'Not provided'}
Next Steps I Want to Suggest: ${inputs.nextSteps || 'schedule another showing'}
My Name/Signature: ${inputs.agentName || 'Your Agent'}`,

    negotiationEmail: `Write a professional negotiation/offer email:
Situation: ${inputs.situation || 'submitting an offer'}
Property Address: ${inputs.propertyAddress || 'the property'}
Offer Details: ${inputs.offerDetails || 'Not provided'}
Key Points to Communicate: ${inputs.keyPoints || 'Not provided'}
Tone Needed: ${inputs.tone || 'professional and firm'}
My Name: ${inputs.agentName || 'Your Agent'}`,

    openHouse: `Write open house invitation copy:
Property Address: ${inputs.address || 'Not provided'}
Date & Time: ${inputs.datetime || 'Not provided'}
Key Property Highlights: ${inputs.highlights || 'Not provided'}
Neighborhood: ${inputs.neighborhood || 'Not provided'}
Price: ${inputs.price || 'Not provided'}
My Name/Brokerage: ${inputs.agentName || 'Your Agent'}`
  };

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1024,
        system: systemPrompts[tool],
        messages: [{ role: 'user', content: userPrompts[tool] }]
      })
    });

   if (!response.ok) {
  const error = await response.json();
  console.log('Anthropic error:', JSON.stringify(error));
  return res.status(response.status).json({ error: error.error?.message || JSON.stringify(error) });
}

    const data = await response.json();
    const text = data.content[0]?.text || '';

    return res.status(200).json({ result: text });
  } catch (err) {
    console.error('Generate error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
