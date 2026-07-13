const templateWrapper = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Notification</title>
    <style>
        body {
            font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f7f6;
            margin: 0;
            padding: 0;
            color: #333333;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
            overflow: hidden;
        }
        .header {
            background-color: #4a90e2;
            color: #ffffff;
            padding: 25px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .content {
            padding: 30px 40px;
            line-height: 1.6;
        }
        .content h2 {
            color: #2c3e50;
            font-size: 20px;
            margin-top: 0;
        }
        .button {
            display: inline-block;
            background-color: #4a90e2;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 25px;
            border-radius: 4px;
            font-weight: 600;
            margin-top: 20px;
            text-align: center;
        }
        .footer {
            background-color: #f8f9fa;
            color: #888888;
            text-align: center;
            padding: 20px;
            font-size: 13px;
            border-top: 1px solid #eeeeee;
        }
        .otp-code {
            font-size: 32px;
            font-weight: bold;
            color: #4a90e2;
            letter-spacing: 5px;
            text-align: center;
            margin: 20px 0;
            padding: 15px;
            background-color: #f4f7f6;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="container">
        ${content}
    </div>
</body>
</html>
`;

export const getSignupVerificationEmailTemplate = (username, email, otp) => {
    return templateWrapper(`
        <div class="header">
            <h1>Verify Your Email</h1>
        </div>
        <div class="content">
            <h2>Hello ${username},</h2>
            <p>Thank you for registering an account using <strong>${email}</strong>. To complete your registration, please verify your email address by entering the following One-Time Password (OTP):</p>
            
            <div class="otp-code">${otp}</div>
            
            <p>This code will expire in 5 minutes. If you did not request this verification, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Our Company. All rights reserved.</p>
        </div>
    `);
};

export const getSignupSuccessEmailTemplate = (username, email) => {
    return templateWrapper(`
        <div class="header" style="background-color: #2ecc71;">
            <h1>Registration Successful</h1>
        </div>
        <div class="content">
            <h2>Welcome aboard, ${username}!</h2>
            <p>Your account associated with <strong>${email}</strong> has been successfully created and verified.</p>
            <p>We're thrilled to have you with us. You can now log in to your account and start exploring our services.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Our Company. All rights reserved.</p>
        </div>
    `);
};

export const getForgotPasswordEmailTemplate = (username, email, otp) => {
    return templateWrapper(`
        <div class="header" style="background-color: #e67e22;">
            <h1>Password Reset Request</h1>
        </div>
        <div class="content">
            <h2>Hello ${username},</h2>
            <p>We received a request to reset the password for your account associated with <strong>${email}</strong>.</p>
            <p>If you made this request, please use the following One-Time Password (OTP) to reset your password:</p>
            
            <div class="otp-code">${otp}</div>
            
            <p style="margin-top: 25px; font-size: 14px; color: #7f8c8d;">If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Our Company. All rights reserved.</p>
        </div>
    `);
};

export const getPasswordResetSuccessEmailTemplate = (username, email) => {
    return templateWrapper(`
        <div class="header" style="background-color: #2ecc71;">
            <h1>Password Reset Successful</h1>
        </div>
        <div class="content">
            <h2>Hello ${username},</h2>
            <p>The password for your account (<strong>${email}</strong>) has been successfully reset.</p>
            <p>If you performed this action, no further action is needed.</p>
            <p style="color: #e74c3c; font-weight: bold; margin-top: 20px;">If you did not change your password, please contact our support team immediately, as your account may have been compromised.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Our Company. All rights reserved.</p>
        </div>
    `);
};

export const getAccountDeletionRequestEmailTemplate = (
    username,
    email,
    otp
) => {
    return templateWrapper(`
        <div class="header" style="background-color: #e74c3c;">
            <h1>Account Deletion Request</h1>
        </div>
        <div class="content">
            <h2>Hello ${username},</h2>
            <p>We received a request to permanently delete your account associated with <strong>${email}</strong>.</p>
            <p>Please note that this action is <strong>irreversible</strong>. All your data will be permanently erased.</p>
            <p>If you wish to proceed with the deletion, please use the following One-Time Password (OTP) to confirm:</p>
            
            <div class="otp-code">${otp}</div>
            
            <p style="margin-top: 25px; font-size: 14px; color: #7f8c8d;">If you did not request this, please ignore this email and your account will remain active. We recommend changing your password if you suspect unauthorized access.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Our Company. All rights reserved.</p>
        </div>
    `);
};

export const getAccountDeletionSuccessEmailTemplate = (username, email) => {
    return templateWrapper(`
        <div class="header" style="background-color: #34495e;">
            <h1>Account Deleted</h1>
        </div>
        <div class="content">
            <h2>Goodbye, ${username}</h2>
            <p>Your account associated with <strong>${email}</strong> has been successfully and permanently deleted.</p>
            <p>We're sorry to see you go. All of your personal data has been securely removed from our systems.</p>
            <p>If you ever change your mind, you are always welcome to create a new account with us.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Our Company. All rights reserved.</p>
        </div>
    `);
};
