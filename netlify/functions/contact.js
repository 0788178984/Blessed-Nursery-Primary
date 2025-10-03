// Netlify Function: Contact form email via Resend
// Requires env var RESEND_API_KEY

function corsResponse(statusCode, bodyObj) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
    body: JSON.stringify(bodyObj),
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return corsResponse(200, { ok: true });
  if (event.httpMethod !== 'POST') return corsResponse(405, { error: 'Method Not Allowed' });

  const resendApiKey = process.env.RESEND_API_KEY;
  const recipient = 'asiimwelucky34@gmail.com';
  if (!resendApiKey) return corsResponse(500, { error: 'Missing RESEND_API_KEY' });

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (e) {
    return corsResponse(400, { error: 'Invalid JSON body' });
  }

  const { name = '', email = '', subject = '', message = '' } = payload;

  try {
    const html = `
      <p>You have a new contact message:</p>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Subject:</strong> ${subject}</li>
      </ul>
      <p><strong>Message:</strong></p>
      <pre style="white-space:pre-wrap">${message}</pre>
    `.trim();

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Contact <contact@blessednursery.netlify.app>',
        to: [recipient],
        subject: subject || 'Website Contact Message',
        reply_to: email || undefined,
        html,
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      return corsResponse(502, { error: 'Email send failed', details: txt });
    }

    return corsResponse(200, { ok: true });
  } catch (err) {
    return corsResponse(500, { error: 'Server error', details: err.message });
  }
};

