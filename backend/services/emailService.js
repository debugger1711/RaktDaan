const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

// Send welcome email after registration
const sendWelcomeEmail = async (user) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: `"RaktDaan" <${process.env.SMTP_EMAIL}>`,
      to: user.email,
      subject: 'Welcome to RaktDaan - Together We Save Lives',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 0;">
          <div style="background: #1d3557; padding: 32px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">❤️ RaktDaan</h1>
            <p style="color: #9cb5c9; margin: 8px 0 0;">Connecting Donors, Saving Lives</p>
          </div>
          <div style="padding: 32px; background: #ffffff;">
            <h2 style="color: #1e293b; margin-top: 0;">Welcome, ${user.name}!</h2>
            <p style="color: #475569; line-height: 1.6;">
              Thank you for joining RaktDaan as a <strong>${user.role}</strong>. 
              You're now part of a community dedicated to saving lives through blood donation.
            </p>
            ${user.role === 'donor' ? `
            <p style="color: #475569; line-height: 1.6;">
              Your blood group <strong>${user.bloodGroup}</strong> is registered. 
              You'll be notified when someone in your area needs your help.
            </p>
            ` : ''}
            <a href="${process.env.FRONTEND_URL}/login" 
               style="display: inline-block; background: #e63946; color: #fff; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 16px;">
              Go to Dashboard
            </a>
          </div>
          <div style="padding: 24px 32px; background: #f1f5f9; text-align: center;">
            <p style="color: #94a3b8; font-size: 13px; margin: 0;">
              &copy; ${new Date().getFullYear()} RaktDaan. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending welcome email:', error.message);
    // Don't throw - email failure shouldn't block registration
  }
};

// Send password reset email
const sendPasswordResetEmail = async (user, resetToken) => {
  try {
    const transporter = createTransporter();
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: `"RaktDaan" <${process.env.SMTP_EMAIL}>`,
      to: user.email,
      subject: 'RaktDaan - Password Reset Request',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1d3557; padding: 32px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">❤️ RaktDaan</h1>
          </div>
          <div style="padding: 32px; background: #ffffff;">
            <h2 style="color: #1e293b; margin-top: 0;">Password Reset</h2>
            <p style="color: #475569; line-height: 1.6;">
              You requested a password reset. Click the button below to set a new password.
              This link expires in <strong>30 minutes</strong>.
            </p>
            <a href="${resetUrl}" 
               style="display: inline-block; background: #e63946; color: #fff; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 16px;">
              Reset Password
            </a>
            <p style="color: #94a3b8; font-size: 13px; margin-top: 24px;">
              If you didn't request this, please ignore this email.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending password reset email:', error.message);
    throw new Error('Email could not be sent');
  }
};

// Send request match notification email
const sendRequestMatchEmail = async (donor, request) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: `"RaktDaan" <${process.env.SMTP_EMAIL}>`,
      to: donor.email,
      subject: `Urgent: ${request.bloodGroup} Blood Needed at ${request.hospital}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1d3557; padding: 32px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">❤️ RaktDaan</h1>
          </div>
          <div style="padding: 32px; background: #ffffff;">
            <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <h3 style="color: #991b1b; margin: 0 0 8px;">🚨 ${request.urgency} Blood Request</h3>
              <p style="color: #b91c1c; margin: 0;">
                <strong>${request.bloodGroup}</strong> blood type — ${request.unitsRequired} unit(s) needed
              </p>
            </div>
            <h2 style="color: #1e293b; margin-top: 0;">Hi ${donor.name},</h2>
            <p style="color: #475569; line-height: 1.6;">
              A patient at <strong>${request.hospital}</strong> in <strong>${request.city}</strong> 
              needs <strong>${request.bloodGroup}</strong> blood urgently.
            </p>
            <p style="color: #475569; line-height: 1.6;">
              <strong>Patient:</strong> ${request.patientName}<br>
              <strong>Contact:</strong> ${request.contactNumber}
            </p>
            <a href="${process.env.FRONTEND_URL}/donor" 
               style="display: inline-block; background: #e63946; color: #fff; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 16px;">
              View Request & Respond
            </a>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Request match email sent to ${donor.email}`);
  } catch (error) {
    console.error('Error sending match email:', error.message);
  }
};

// Send request status update email
const sendStatusUpdateEmail = async (requester, request, status) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: `"RaktDaan" <${process.env.SMTP_EMAIL}>`,
      to: requester.email,
      subject: `Update: Your blood request for ${request.patientName} is now ${status}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1d3557; padding: 32px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">❤️ RaktDaan</h1>
          </div>
          <div style="padding: 32px; background: #ffffff;">
            <h2 style="color: #1e293b; margin-top: 0;">Hi ${requester.name},</h2>
            <p style="color: #475569; line-height: 1.6;">
              The status of your blood request for <strong>${request.patientName}</strong> has been updated to <strong>${status}</strong>.
            </p>
            <a href="${process.env.FRONTEND_URL}/dashboard?requestId=${request._id}" 
               style="display: inline-block; background: #e63946; color: #fff; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 16px;">
              View Details
            </a>
          </div>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending status update email:', error.message);
  }
};

// Send donor found notification email
const sendDonorFoundEmail = async (requester, request, donor) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: `"RaktDaan" <${process.env.SMTP_EMAIL}>`,
      to: requester.email,
      subject: `Donor Found! Someone accepted your blood request`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1d3557; padding: 32px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">❤️ RaktDaan</h1>
          </div>
          <div style="padding: 32px; background: #ffffff;">
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <h3 style="color: #166534; margin: 0 0 8px;">✅ Donor Found!</h3>
            </div>
            <h2 style="color: #1e293b; margin-top: 0;">Hi ${requester.name},</h2>
            <p style="color: #475569; line-height: 1.6;">
              Great news! <strong>${donor.name}</strong> (${donor.bloodGroup}) has accepted your blood request at ${request.hospital}.
            </p>
            <p style="color: #475569; line-height: 1.6;">
              Please log in to your dashboard to view their contact details and coordinate the donation.
            </p>
            <a href="${process.env.FRONTEND_URL}/dashboard?requestId=${request._id}" 
               style="display: inline-block; background: #e63946; color: #fff; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 16px;">
              View Donor Details
            </a>
          </div>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending donor found email:', error.message);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendRequestMatchEmail,
  sendStatusUpdateEmail,
  sendDonorFoundEmail,
};
