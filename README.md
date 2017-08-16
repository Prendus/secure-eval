# Secure Eval

Allows secure eval execution of JavaScript code in a browser context.

## How

JavaScript code is sent to an iframe with the sandbox attribute set to `allow-scripts`. The iframe sends the code to a web worker for eval execution.
