[![CircleCI](https://circleci.com/gh/Prendus/secure-eval.svg?style=shield)](https://circleci.com/gh/Prendus/secure-eval) [![npm version](https://img.shields.io/npm/v/secure-eval.svg?style=flat)](https://www.npmjs.com/package/secure-eval) [![dependency Status](https://david-dm.org/prendus/secure-eval/status.svg)](https://david-dm.org/prendus/secure-eval) [![devDependency Status](https://david-dm.org/prendus/secure-eval/dev-status.svg)](https://david-dm.org/prendus/secure-eval?type=dev)

# Secure Eval

Allows relatively secure execution of JavaScript code in a browser context.

## Use

Basically you just import the `secureEval` function, pass it some code as a string, and await the result.
`secureEval` returns a promise with the result of what you `window.parent.postMessage`:

```
import { secureEval } from 'secure-eval';

const dangerousCode = `
    const dangerousValue = 5;

    window.parent.postMessage({
        type: 'secure-eval-iframe-result',
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

An HTML string with the JavaScript code string embedded in a script tag of type module is sent to an ephemeral iframe through the src attribute. The iframe's sandbox attribute is set to `allow-scripts` and the style attribute is set to `display:none`. The code has no access to the DOM, cookies, local storage, session storage, or anything else really of the document the iframe is in. In my opinion, and after a few years of light research, this is extremely secure.

Infinite loops are still possible. From my research, there is not currently a way to mitigate them.

## Documentation

```
interface SecureEvalResult {
    type: 'secure-eval-iframe-result';
    [key: string]: any;
}

function secureEval(code: string): Promise<SecureEvalResult>
```

The `secureEval` function takes the code to eval as a string and returns a promise with the result.
