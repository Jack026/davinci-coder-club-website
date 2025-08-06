const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

// Contact form submission
router.post('/', [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters long'),
    body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
    body('privacy').equals('on').withMessage('You must agree to the privacy policy')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            firstName,
            lastName,
            email,
            phone,
            subject,
            message,
            inquiryType,
            department,
            year,
            skills,
            newsletter
        } = req.body;

        // Create email transporter
        const transporter = nodemailer.createTransporter({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email content
        const emailContent = `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Inquiry Type:</strong> ${inquiryType}</p>
            ${department ? `<p><strong>Department:</strong> ${department}</p>` : ''}
            ${year ? `<p><strong>Academic Year:</strong> ${year}</p>` : ''}
            ${skills ? `<p><strong>Skills:</strong> ${skills}</p>` : ''}
            <p><strong>Newsletter Subscription:</strong> ${newsletter ? 'Yes' : 'No'}</p>
            <h3>Message:</h3>
            <p>${message.replace(/\n/g, '<br>')}</p>
        `;

        // Send email to admin
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: `[Da-Vinci Coder Club] ${subject}`,
            html: emailContent
        });

        // Send auto-reply to user
        const autoReplyContent = `
            <h2>Thank you for contacting Da-Vinci Coder Club!</h2>
            <p>Dear ${firstName},</p>
            <p>We have received your message and will get back to you within 24 hours.</p>
            <p><strong>Your inquiry details:</strong></p>
            <ul>
                <li><strong>Subject:</strong> ${subject}</li>
                <li><strong>Inquiry Type:</strong> ${inquiryType}</li>
                <li><strong>Submitted on:</strong> ${new Date().toLocaleDateString()}</li>
            </ul>
            <p>Best regards,<br>Da-Vinci Coder Club Team</p>
        `;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank you for contacting Da-Vinci Coder Club',
            html: autoReplyContent
        });

        // Save to database (optional)
        // You can implement database saving here

        res.json({ 
            message: 'Message sent successfully! We will get back to you soon.',
            success: true
        });

    } catch (error) {
        console.error('Error sending contact email:', error);
        res.status(500).json({ 
            error: 'Failed to send message. Please try again later.',
            success: false
        });
    }
});

// Newsletter subscription
router.post('/newsletter', [
    body('email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email } = req.body;

        // Add to newsletter database/service
        // Implementation depends on your newsletter service (MailChimp, SendGrid, etc.)

        res.json({ 
            message: 'Successfully subscribed to newsletter!',
            success: true
        });

    } catch (error) {
        console.error('Error subscribing to newsletter:', error);
        res.status(500).json({ 
            error: 'Failed to subscribe. Please try again later.',
            success: false
        });
    }
});

module.exports = router;