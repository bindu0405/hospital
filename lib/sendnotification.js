// Import the sendmail module
const sendMail = require('./sendmail');
const notifier = require('node-notifier'); // Assuming you have installed the node-notifier library

// Function to send notification and email
async function sendNotificationAndEmail() {
  try {
    // Generate temporary password
    const password = sendMail.generateTemporaryPassword();
    
    // Send temporary password via email
    let mail = sendMail.sendTemporaryPassword(password);
    
    console.log('Temporary password sent via email:', password);
    
    // Send notification
    notifier.notify({
      title: 'Notification Title',
      message: `Email Body: you got an email`, // Include email body in the notification message
      // Add an icon (optional)
      icon: 'path/to/icon.png',
      // Wait for a response from the user (optional)
      wait: true
    });
  
    // Handle click event when the notification is clicked (optional)
    notifier.on('click', function (notifierObject, options, event) {
      console.log('Notification clicked');
    });
  
    // Handle timeout event when the notification expires (optional)
    notifier.on('timeout', function (notifierObject, options) {
      console.log('Notification timed out');
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

module.exports = {
  sendNotificationAndEmail: sendNotificationAndEmail
};
