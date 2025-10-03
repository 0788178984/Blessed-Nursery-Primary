// Netlify Function: Generate PDF and email via Resend
// Requires env var RESEND_API_KEY to be set in Netlify site settings

const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');

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
  if (event.httpMethod === 'OPTIONS') {
    return corsResponse(200, { ok: true });
  }
  if (event.httpMethod !== 'POST') {
    return corsResponse(405, { error: 'Method Not Allowed' });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const recipient = 'asiimwelucky34@gmail.com';
  if (!resendApiKey) {
    return corsResponse(500, { error: 'Missing RESEND_API_KEY configuration' });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (e) {
    return corsResponse(400, { error: 'Invalid JSON body' });
  }

  const {
    childFirstName = '',
    childLastName = '',
    parentEmail = '',
    parentPhone = '',
    program = '',
    intake = '',
    childAge = '',
    additionalInfo = '',
  } = payload;

  try {
    // Build a simple PDF summary
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 portrait (pt)
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const drawText = (text, x, y, size = 12) => {
      page.drawText(text, { x, y, size, font, color: rgb(0, 0, 0) });
    };

    let y = 800;
    drawText('Blessed Nursery & Primary School - Admission Application', 50, y, 16);
    y -= 30;
    drawText(`Submission Date: ${new Date().toISOString()}`, 50, y);
    y -= 20;
    drawText('Applicant Details:', 50, y, 14);
    y -= 22;
    drawText(`Child Name: ${childFirstName} ${childLastName}`.trim(), 50, y);
    y -= 18;
    drawText(`Child Age: ${childAge}`, 50, y);
    y -= 18;
    drawText(`Program: ${program}`, 50, y);
    y -= 18;
    drawText(`Intake: ${intake}`, 50, y);
    y -= 18;
    drawText('Parent/Guardian:', 50, y, 14);
    y -= 22;
    drawText(`Email: ${parentEmail}`, 50, y);
    y -= 18;
    drawText(`Phone: ${parentPhone}`, 50, y);
    y -= 24;
    drawText('Additional Information:', 50, y, 14);
    y -= 22;

    const wrapText = (text, maxWidth = 480, fontSize = 12) => {
      const words = (text || '').split(/\s+/);
      const lines = [];
      let current = '';
      const spaceWidth = font.widthOfTextAtSize(' ', fontSize);
      let lineWidth = 0;
      for (const word of words) {
        const wordWidth = font.widthOfTextAtSize(word, fontSize);
        if (lineWidth + (current ? spaceWidth : 0) + wordWidth > maxWidth) {
          lines.push(current);
          current = word;
          lineWidth = wordWidth;
        } else {
          if (current) {
            current += ' ' + word;
            lineWidth += spaceWidth + wordWidth;
          } else {
            current = word;
            lineWidth = wordWidth;
          }
        }
      }
      if (current) lines.push(current);
      return lines;
    };

    const infoLines = wrapText(additionalInfo, 480, 12);
    for (const line of infoLines) {
      if (y < 60) {
        // new page if needed
        const newPage = pdfDoc.addPage([595.28, 841.89]);
        y = 800;
        newPage.drawText('Additional Information (cont.)', { x: 50, y, size: 14, font });
        y -= 24;
      }
      page.drawText(line, { x: 50, y, size: 12, font });
      y -= 16;
    }

    const pdfBytes = await pdfDoc.save();
    const pdfBase64 = Buffer.from(pdfBytes).toString('base64');

    // Send email via Resend
    const emailPayload = {
      from: 'Admissions <admissions@blessednursery.netlify.app>',
      to: [recipient],
      subject: 'New Admission Application',
      html: `
        <p>A new admission application has been submitted.</p>
        <ul>
          <li><strong>Child:</strong> ${childFirstName} ${childLastName}</li>
          <li><strong>Age:</strong> ${childAge}</li>
          <li><strong>Program:</strong> ${program}</li>
          <li><strong>Intake:</strong> ${intake}</li>
          <li><strong>Parent Email:</strong> ${parentEmail}</li>
          <li><strong>Parent Phone:</strong> ${parentPhone}</li>
        </ul>
        <p>PDF is attached.</p>
      `.trim(),
      attachments: [
        {
          filename: `Admission_${childFirstName || 'Child'}_${childLastName || 'Name'}.pdf`,
          content: pdfBase64,
          contentType: 'application/pdf',
        },
      ],
    };

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
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

