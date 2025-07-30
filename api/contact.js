import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Log the contact form data for debugging
    console.log('Contact form submission:', {
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString()
    });

    // Option 1: Use Cloudflare Email Routing (No third party needed)
    // Since you have Cloudflare Email Routing configured,
    // we can send to brandon@landeatta.dev and it will be routed to landaetta@live.com
    
    // Option 2: Use Gmail SMTP (Free, no third party)
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD
        }
      });

      const mailOptions = {
        from: `"${name}" <${email}>`,
        to: 'brandon@landeatta.dev', // Will be routed to landaetta@live.com
        subject: `Contact Form: ${subject}`,
        text: `
          Name: ${name}
          Email: ${email}
          Subject: ${subject}
          Message: ${message}
        `,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong style="color: #374151;">Name:</strong> ${name}</p>
              <p><strong style="color: #374151;">Email:</strong> <a href="mailto:${email}" style="color: #2563eb;">${email}</a></p>
              <p><strong style="color: #374151;">Subject:</strong> ${subject}</p>
            </div>
            <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb;">
              <h3 style="color: #374151; margin-top: 0;">Message:</h3>
              <p style="color: #374151; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
              <p>This message was sent from the contact form on <a href="https://landeatta.dev" style="color: #2563eb;">landeatta.dev</a></p>
              <p>Timestamp: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully via Gmail SMTP');
    } else {
      console.log('Gmail credentials not configured, logging data only');
    }

    // Return success response
    res.status(200).json({ 
      success: true, 
      message: 'Message received successfully' 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
} 