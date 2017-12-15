import {jsc} from '../jsverify';
import {secureEval, SecureEvalResult} from '../secure-eval';

class SecureEvalTest extends HTMLElement {
    prepareTests(test: any) {
        test('evaling a postMessage returns correct object', [jsc.number], async (arbNumber: number) => {
            const message: SecureEvalResult = await secureEval(`
                postMessage({
                    arbNumber: ${arbNumber}
                });
            `);

            return (
                message.arbNumber === arbNumber &&
                message.type === 'secure-eval-iframe-result'
            );
        });

        test('evaling code with an error returns correct object', [jsc.number], async (arbNumber: number) => {
            const message: SecureEvalResult = await secureEval(`
                throw ${arbNumber};
            `);

            return (
                message.type === 'secure-eval-iframe-result',
                message.error === arbNumber.toString()
            );
        });

        test('Code times out after time limit', [jsc.nat(500)], (arbNumber: number) => {
            return new Promise(async (resolve, reject) => {
                const timer = setTimeout(() => {
                    reject(false);
                }, arbNumber + 10000);

                await secureEval(`
                    while (true) {}
                `, arbNumber);

                clearTimeout(timer);

                resolve(true);
            });
        });
    }
}

window.customElements.define('secure-eval-test', SecureEvalTest);
