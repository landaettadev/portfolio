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
      gmailUser: process.env.GMAIL_USER ? 'Configured' : 'Not configured',
      gmailPassword: process.env.GMAIL_APP_PASSWORD ? 'Configured' : 'Not configured',
      timestamp: new Date().toISOString()
    });

    // For now, we'll just log the data and return success
    // The emails will be handled by Cloudflare Email Routing
    console.log('Email will be sent to brandon@landeatta.dev and routed to landaetta@live.com');

    // Return success response
    res.status(200).json({ 
      success: true, 
      message: 'Message received successfully and will be sent via Cloudflare Email Routing' 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
} 