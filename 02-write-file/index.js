const readline = require('readline');
const fs = require('fs');

// Create an interface to read from the terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to prompt the user for input
function promptUser() {
  rl.question('Enter your message (type "exit" to end): ', function (message) {
    // Check if the user wants to exit
    if (message.toLowerCase() === 'exit') {
      console.log('Exiting...');
      rl.close(); // Close the readline interface
    } else {
      // Save the message to a text file
      fs.appendFile(
        './02-write-file/messages.txt',
        message + '\n',
        function (err) {
          if (err) throw err;
          console.log('Message saved to messages.txt');

          // Continue prompting for the next message
          promptUser();
        },
      );
    }
  });
}

// Start the prompt
promptUser();

// Event listener for when the interface is closed
rl.on('close', function () {
  process.exit(0); // Exit the Node.js process
});
