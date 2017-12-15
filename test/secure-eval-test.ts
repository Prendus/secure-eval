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

        test('Code times out after time limit', [jsc.nat(500)], (arbNumber) => {
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
