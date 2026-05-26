const axios = require('axios');

async function sendEmail({ to, subject, html }) {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    console.log('[email stub]', { to, subject });
    return { sent: false, stub: true };
  }

  await axios.post(
    'https://api.sendgrid.com/v3/mail/send',
    {
      personalizations: [{ to: [{ email: to }] }],
      from: { email: process.env.SENDGRID_FROM_EMAIL || 'orders@luxebeauty.co.za' },
      subject,
      content: [{ type: 'text/html', value: html }],
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return { sent: true };
}

function orderConfirmationEmail(order, user) {
  return `
    <h1>Thank you for your order, ${user.first_name || 'Customer'}!</h1>
    <p>Order <strong>${order.order_number}</strong> has been received.</p>
    <p>Total: <strong>R${parseFloat(order.total_amount).toFixed(2)}</strong></p>
    <p>Status: ${order.status} | Payment: ${order.payment_status}</p>
    <p>We'll notify you when your order ships.</p>
    <p>Luxe Beauty — South Africa</p>
  `;
}

module.exports = { sendEmail, orderConfirmationEmail };
