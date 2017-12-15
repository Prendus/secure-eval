import {jsc} from '../jsverify';
import {secureEval} from '../secure-eval';

class SecureEvalTest extends HTMLElement {
    prepareTests(test) {
        test('evaling a postMessage returns correct object', [jsc.number], async (arbNumber) => {
            const message: {
                arbNumber: number,
                type: 'secure-eval-iframe-result'
            } = await secureEval(`
                postMessage({
                    arbNumber: ${arbNumber}
                });
            `);

            return (
                message.arbNumber === arbNumber &&
                message.type === 'secure-eval-iframe-result'
            );
        });

        test('evaling code with an error returns correct object', [jsc.number], async (arbNumber) => {
            const message: {
                type: 'secure-eval-iframe-result',
                error: string
            } = await secureEval(`
                throw ${arbNumber};
            `);

            return (
                message.type === 'secure-eval-iframe-result',
                message.error === arbNumber.toString()
            );
        });

        //TODO the problem I am trying to fix below is how to know when the web worker is finished. If the user does not provide a postMessage or if an error is not thrown, the secure-eval promise will never finish, becuase I only resolve
        //TODO from inside of th message handler. Also, look into how to clean up web workers properly, because that might be what is crashing Chrome
        test('Code times out after 10000 milliseconds', [jsc.number], (arbNumber) => {
            return new Promise(async (resolve, reject) => {
                // const timer = setTimeout(() => {
                //     reject(false);
                // }, 15000);

                console.log('before')

                await secureEval(`
                    // while (true) {}
                    console.log('monkey')
                `);

                console.log('here we come')

                // clearTimeout(timer);

                resolve(true);
                // return true;
            });
        });
    }
}

window.customElements.define('secure-eval-test', SecureEvalTest);
