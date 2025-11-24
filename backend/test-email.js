require('dotenv').config();
const { sendVerificationEmail } = require('./src/services/emailService');

async function testEmail() {
  const testEmail = process.argv[2] || process.env.EMAIL_USER;
  
  if (!testEmail) {
    console.error('❌ Please provide an email address:');
    console.log('Usage: node test-email.js your-email@example.com');
    process.exit(1);
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    console.error('❌ Email credentials not found in .env file!');
    console.log('\nPlease add to your .env file:');
    console.log('EMAIL_USER=your-email@gmail.com');
    console.log('EMAIL_APP_PASSWORD=your-16-char-app-password');
    console.log('\nSee EMAIL_SETUP.md for detailed instructions.');
    process.exit(1);
  }

  console.log('📧 Sending test verification email...');
  console.log(`   From: ${process.env.EMAIL_USER}`);
  console.log(`   To: ${testEmail}`);
  console.log('');

  try {
    const result = await sendVerificationEmail(
      testEmail,
      'Test User',
      '123456'
    );
    
    console.log('✅ Email sent successfully!');
    console.log('   Message ID:', result.messageId);
    console.log('');
    console.log('Check your inbox (and spam folder) for the verification email.');
  } catch (error) {
    console.error('❌ Email sending failed:');
    console.error('   Error:', error.message);
    console.log('');
    console.log('Troubleshooting:');
    console.log('1. Check your .env file has correct EMAIL_USER and EMAIL_APP_PASSWORD');
    console.log('2. Make sure 2-Step Verification is enabled on Gmail');
    console.log('3. Use an App Password, not your regular Gmail password');
    console.log('4. See EMAIL_SETUP.md for detailed setup instructions');
  }
}

testEmail();

