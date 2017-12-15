[![CircleCI](https://circleci.com/gh/Prendus/secure-eval.svg?style=shield)](https://circleci.com/gh/Prendus/secure-eval) [![npm version](https://img.shields.io/npm/v/secure-eval.svg?style=flat)](https://www.npmjs.com/package/secure-eval) [![dependency Status](https://david-dm.org/prendus/secure-eval/status.svg)](https://david-dm.org/prendus/secure-eval) [![devDependency Status](https://david-dm.org/prendus/secure-eval/dev-status.svg)](https://david-dm.org/prendus/secure-eval?type=dev)

# Secure Eval

Allows secure eval execution of JavaScript code in a browser context.

## Use

Basically you just import the `secureEval` function, pass it some code as a string, and await the result.
`secureEval` returns a promise with the result of what you `postMessage`:

```
import {secureEval} from 'node_modules/secure-eval/secure-eval';

const dangerousCode = `
    const dangerousValue = 5;

    postMessage({
        dangerousValue
    });
`;

executeDangerousUserCode(dangerousCode);

async function executeDangerousUserCode(code) {
    const result = await secureEval(code);
    console.log(result.dangerousValue);
}
```

## Security

The JavaScript code string is sent to an iframe with the sandbox attribute set to `allow-scripts`.
The iframe sends the code to a web worker for eval execution.
The code has no access to the DOM, cookies, local storage, session storage, or anything else really of the document the iframe is in.
In my opinion, and after a few years of light research, this is extremely secure.

## Documentation

```
interface SecureEvalResult {
    type: 'secure-eval-iframe-result' | 'secure-eval-iframe-worker-terminated';
    [key: string]: any;
}

function secureEval(code: string, timeLimit: number = 10000): Promise<SecureEvalResult>
```

The `secureEval` function takes the code to eval as a string, the time limit for the web worker, and returns a promise with the result.
