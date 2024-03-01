
const sendMail = require('./sendmail');
const notifier = require('node-notifier'); 

async function sendNotificationAndEmail() {
  try {
  
    let password = sendMail.generateTemporaryPassword();
  
    let mail = sendMail.sendTemporaryPassword(password);
    
    console.log('Temporary password sent via email:', password);
    
    // Send notification
    notifier.notify({
      title: 'Notification Title',
      message: `Email Body: you got an email`, 
      // Add an icon (optional)
      icon: 'path/to/icon.png',
      wait: true
    });

    notifier.on('click', function (notifierObject, options, event) {
      console.log('Notification clicked');
    });
  
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
