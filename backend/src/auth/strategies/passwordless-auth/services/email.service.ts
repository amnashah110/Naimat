import { Inject, Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type { ConfigType } from '@nestjs/config';
import emailConfig from 'src/auth/config/email.config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(@Inject(emailConfig.KEY) private emailConfiguration: ConfigType<typeof emailConfig>)
  {
    this.transporter = nodemailer.createTransport({
      host: this.emailConfiguration.host,
      port: this.emailConfiguration.port,
      secure: this.emailConfiguration.secure,
      auth: {
        user: this.emailConfiguration.auth.user,
        pass: this.emailConfiguration.auth.pass,
      },
    });
  }

  async sendLoginCode(email: string, code: string)
  {
    const from = this.emailConfiguration.from;
    const appUrl = this.emailConfiguration.appUrl;
    const html = `
      <div style="font-family:system-ui,Segoe UI,Roboto,Arial">
        <h2>Your login code</h2>
        <p>Use this code to sign in. It expires in 5 minutes.</p>
        <div style="font-size:28px;letter-spacing:4px;font-weight:700">${code}</div>
        <p>If you didn’t request this, you can safely ignore this email.</p>
        <hr/>
        <p style="color:#666">© ${new Date().getFullYear()} <a href="${appUrl}">Our App</a></p>
      </div>
    `;

    await this.transporter.sendMail({
      from,
      to: email,
      subject: `Naimat Login Code [${code}]`,
      text: `Your login code is: ${code}. It expires in 5 minutes.`,
      html,
    });
  }

  async sendRecipientDetailsToDonar(
    donorEmail: string,
    donorName: string,
    recipientName: string,
    recipientEmail: string,
    recipientContact: string,
  ) {
    const from = this.emailConfiguration.from;
    const html = `
      <meta name="color-scheme" content="light only">
      <meta name="supported-color-schemes" content="light only">
      <style>
        a {
          color: #87CEEB !important;
          text-decoration: none !important;
        }
        a:hover {
          color: #B0E0E6 !important;
          text-decoration: underline !important;
        }
        @media (prefers-color-scheme: dark) {
          div, p, h2, a { 
            background: #000000 !important;
            color: rgb(242, 233, 185) !important;
          }
          h2 { color: rgb(242, 233, 185) !important; }
          p { color: rgb(242, 233, 185) !important; }
          a { color: #87CEEB !important; }
          a:hover { color: #B0E0E6 !important; }
          p.footer-text { color: rgb(200, 190, 160) !important; }
          div.divider { background: rgb(242, 233, 185) !important; }
          a.button { background: rgb(242, 233, 185) !important; color: #000000 !important; }
          img.logo { filter: invert(100%) !important; }
        }
      </style>

      <div style="font-family: 'Open Sans', Helvetica, Arial, sans-serif; max-width:600px; margin:0 auto; padding-top:24px; border-radius:12px; background-color:#000000 !important; color: rgb(242, 233, 185) !important; box-shadow:0 8px 24px rgba(0,0,0,0.5); text-align:center; overflow:hidden;" bgcolor="#000000">
        
        <!-- Logo -->
        <div style="width: 100px; height: 100px; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
          <img class="logo" src="cid:logo" alt="Naimat Logo" style="width: 100%; height: auto; object-fit: contain;" />
        </div>

        <!-- Title -->
        <h2 style="color: rgb(242, 233, 185); font-size: 24px; font-weight: 800; margin-bottom: 16px; letter-spacing: -0.2px;">
          Hi ${donorName}!<br />You're about to make a difference!
        </h2>

        <!-- Message -->
        <p style="font-size: 15px; color: rgb(242, 233, 185); line-height: 1.6; margin: 0 auto 24px; max-width: 480px; padding: 12px 16px;">
          We hope you're doing well. You have been assigned a recipient. Please check the details below and follow the next steps to proceed.
        </p>

        <!-- Recipient Details -->
        <h2 style="color: rgb(242, 233, 185); font-size: 20px; font-weight: 800; margin-bottom: 16px; letter-spacing: -0.2px;">
          Recipient Details
        </h2>
        <p style="font-size: 15px; color: rgb(242, 233, 185); line-height: 1.6; margin: 0 auto 24px; max-width: 480px; text-align: left;">
          <strong>Name:</strong> ${recipientName}<br/>
          <strong>Email Address:</strong> <a href="mailto:${recipientEmail}" style="color: #87CEEB !important; text-decoration: none;">${recipientEmail}</a><br/>
          <strong>Contact Number:</strong> <a href="tel:${recipientContact}" style="color: #87CEEB !important; text-decoration: none;">${recipientContact}</a><br/>
        </p>
        
        <!-- Next Steps -->
        <h2 style="color: rgb(242, 233, 185); font-size: 20px; font-weight: 800; margin-bottom: 16px; letter-spacing: -0.2px;">
          Next Steps
        </h2>
        <p style="font-size: 15px; color: rgb(242, 233, 185); line-height: 1.6; margin: 0 auto 24px; max-width: 480px;">
          You may contact your recipient to introduce yourself and coordinate any next actions. Remember to maintain privacy and communicate respectfully.
        </p>

        <!-- Footer -->
        <div class="divider" style="height: 1px; background: rgb(242, 233, 185); margin: 24px auto; max-width: 80%;"></div>
        
        <p class="footer-text" style="font-size: 12px; color: rgb(200, 190, 160); line-height: 1.5; margin: 0 0 16px;">
          This email was intended for ${donorEmail}. <br/>If this email was not meant for you, feel free to ignore it.
        </p>
        <br/>
      </div>
    `;

    // Attach logo
    const logoPath = "./././assets/Logo.png";

    await this.transporter.sendMail({
      from,
      to: donorEmail,
      subject: 'Naimat - Recipient Assigned for Your Donation',
      html,
      attachments: [
        {
          filename: 'logo.png',
          path: logoPath,
          cid: 'logo'
        }
      ]
    });
  }

  async sendVolunteerDetailsToDonor(
    donorEmail: string,
    donorName: string,
    volunteerName: string,
    volunteerEmail: string,
    volunteerContact: string,
  ) {
    const from = this.emailConfiguration.from;
    const html = `
      <meta name="color-scheme" content="light only">
      <meta name="supported-color-schemes" content="light only">
      <style>
        a { color: #87CEEB !important; text-decoration: none !important; }
        a:hover { color: #B0E0E6 !important; text-decoration: underline !important; }
        @media (prefers-color-scheme: dark) {
          div, p, h2, a { background: #000 !important; color: rgb(242, 233, 185) !important; }
          h2 { color: rgb(242, 233, 185) !important; }
          p { color: rgb(242, 233, 185) !important; }
          a { color: #87CEEB !important; }
          a:hover { color: #B0E0E6 !important; }
          p.footer-text { color: rgb(200, 190, 160) !important; }
          div.divider { background: rgb(242, 233, 185) !important; }
          a.button { background: rgb(242, 233, 185) !important; color: #000 !important; }
          img.logo { filter: invert(100%) !important; }
        }
      </style>

      <div style="font-family:'Open Sans', Helvetica, Arial, sans-serif; max-width:600px; margin:0 auto; padding:24px; border-radius:12px; background-color:#000; color:rgb(242, 233, 185); box-shadow:0 8px 24px rgba(0,0,0,0.5); text-align:center; overflow:hidden;">
        
        <!-- Logo -->
        <div style="width:100px; height:100px; margin:0 auto 24px; display:flex; align-items:center; justify-content:center;">
          <img class="logo" src="cid:logo" alt="Naimat Logo" style="width:100%; height:auto; object-fit:contain;" />
        </div>

        <!-- Greeting -->
        <h2 style="font-size:24px; font-weight:800; margin-bottom:16px; letter-spacing:-0.2px;">
          Hi ${donorName}!<br/>Your donation will soon reach its recipient!
        </h2>

        <!-- Message -->
        <p style="font-size:15px; line-height:1.6; margin:0 auto 24px; max-width:480px; padding:0 16px;">
          We're excited to inform you that a volunteer has been assigned to deliver your donation. Below are the volunteer's details for your reference.
        </p>

        <!-- Volunteer Details -->
        <h2 style="font-size:20px; font-weight:800; margin-bottom:16px; letter-spacing:-0.2px;">Volunteer Details</h2>
        <p style="font-size:15px; line-height:1.6; margin:0 auto 24px; max-width:480px; text-align:left;">
          <strong>Name:</strong> ${volunteerName}<br/>
          <strong>Email:</strong> <a href="mailto:${volunteerEmail}">${volunteerEmail}</a><br/>
          <strong>Contact:</strong> <a href="tel:${volunteerContact}">${volunteerContact}</a><br/>
        </p>

        <!-- Next Steps -->
        <h2 style="font-size:20px; font-weight:800; margin-bottom:16px; letter-spacing:-0.2px;">Next Steps</h2>
        <p style="font-size:15px; line-height:1.6; margin:0 auto 24px; max-width:480px;">
          You may contact the volunteer if you have any special instructions or questions. Please ensure your donation is ready and accessible for pickup. Thank you for making a difference!
        </p>

        <!-- Footer -->
        <div class="divider" style="height:1px; background:rgb(242, 233, 185); margin:24px auto; max-width:80%;"></div>
        <p class="footer-text" style="font-size:12px; line-height:1.5; margin:0 0 16px;">
          This email was sent to ${donorEmail}. If you received this by mistake, you can ignore it.
        </p>
      </div>
    `;

    // Attach logo
    const logoPath = "./././assets/Logo.png";

    await this.transporter.sendMail({
      from,
      to: donorEmail,
      subject: 'Naimat - Volunteer Assigned for Your Donation Delivery',
      html,
      attachments: [
        {
          filename: 'logo.png',
          path: logoPath,
          cid: 'logo'
        }
      ]
    });
  }
}
