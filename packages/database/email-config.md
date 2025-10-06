# Email Configuration for Supabase Auth

## 🎯 Overview
This document contains the email templates and configuration needed for RunDay's authentication system.

## 📧 Email Templates Setup

### 1. Confirmation Email Template (Sign Up)

**Subject**: Welcome to RunDay - Confirm your email

**Body**:
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to RunDay! 🏃‍♂️</h1>
  </div>
  
  <div style="padding: 40px 30px; background: #f9f9f9;">
    <h2 style="color: #333; margin-top: 0;">Confirm Your Email Address</h2>
    <p style="color: #666; font-size: 16px; line-height: 1.5;">
      Thanks for joining RunDay! We're excited to help you discover amazing running events and track your progress.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}" 
         style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
        Confirm Email Address
      </a>
    </div>
    
    <p style="color: #999; font-size: 14px; margin-top: 30px;">
      If the button doesn't work, copy and paste this link into your browser:<br>
      <span style="word-break: break-all;">{{ .ConfirmationURL }}</span>
    </p>
    
    <p style="color: #999; font-size: 14px;">
      This link will expire in 24 hours. If you didn't create an account with RunDay, you can safely ignore this email.
    </p>
  </div>
  
  <div style="padding: 20px 30px; background: #333; text-align: center;">
    <p style="color: #999; font-size: 14px; margin: 0;">
      © 2025 RunDay Platform. Ready to run? 🏃‍♀️
    </p>
  </div>
</div>
```

### 2. Magic Link Email Template (Sign In)

**Subject**: Sign in to RunDay

**Body**:
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Sign in to RunDay 🏃‍♂️</h1>
  </div>
  
  <div style="padding: 40px 30px; background: #f9f9f9;">
    <h2 style="color: #333; margin-top: 0;">Your Sign-in Link</h2>
    <p style="color: #666; font-size: 16px; line-height: 1.5;">
      Click the button below to securely sign in to your RunDay account.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}" 
         style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
        Sign in to RunDay
      </a>
    </div>
    
    <p style="color: #999; font-size: 14px; margin-top: 30px;">
      If the button doesn't work, copy and paste this link into your browser:<br>
      <span style="word-break: break-all;">{{ .ConfirmationURL }}</span>
    </p>
    
    <p style="color: #999; font-size: 14px;">
      This link will expire in 1 hour. If you didn't request this sign-in link, you can safely ignore this email.
    </p>
  </div>
  
  <div style="padding: 20px 30px; background: #333; text-align: center;">
    <p style="color: #999; font-size: 14px; margin: 0;">
      © 2025 RunDay Platform. Ready to run? 🏃‍♀️
    </p>
  </div>
</div>
```

### 3. Password Recovery Email Template

**Subject**: Reset your RunDay password

**Body**:
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Reset Your Password 🔒</h1>
  </div>
  
  <div style="padding: 40px 30px; background: #f9f9f9;">
    <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>
    <p style="color: #666; font-size: 16px; line-height: 1.5;">
      We received a request to reset your RunDay account password. Click the button below to create a new password.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}" 
         style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
        Reset Password
      </a>
    </div>
    
    <p style="color: #999; font-size: 14px; margin-top: 30px;">
      If the button doesn't work, copy and paste this link into your browser:<br>
      <span style="word-break: break-all;">{{ .ConfirmationURL }}</span>
    </p>
    
    <p style="color: #999; font-size: 14px;">
      This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
    </p>
  </div>
  
  <div style="padding: 20px 30px; background: #333; text-align: center;">
    <p style="color: #999; font-size: 14px; margin: 0;">
      © 2025 RunDay Platform. Ready to run? 🏃‍♀️
    </p>
  </div>
</div>
```

## ⚙️ Supabase Configuration Steps

### 1. Authentication Settings
- Go to **Authentication** → **Settings** in Supabase Dashboard
- **Site URL**: `http://localhost:3000` (development) / `https://yourdomain.com` (production)
- **Redirect URLs**: Add both admin and user app URLs:
  - `http://localhost:3000/auth/callback`
  - `http://localhost:3001/auth/callback`

### 2. Email Templates
1. Go to **Authentication** → **Email Templates**
2. Update each template (Confirm signup, Magic Link, Recovery) with the HTML above
3. Test the templates using the preview feature

### 3. Email Provider (Optional for Production)
For production, configure SMTP:
- Go to **Settings** → **Authentication**
- **SMTP Settings**: Configure your email provider (SendGrid, Mailgun, etc.)
- For development, Supabase's default email works fine

### 4. Rate Limiting
- **Enable email rate limiting**: Prevent spam
- **Max emails per hour**: 10 per user (adjust as needed)

---

**Next Steps**: After setting up these configurations, test the authentication flow!