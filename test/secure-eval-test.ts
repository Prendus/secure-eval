import jsverify from 'jsverify-es-module';
import {secureEval, SecureEvalResult} from '../secure-eval';

class SecureEvalTest extends HTMLElement {
    prepareTests(test: any) {
        test('evaling a postMessage returns correct object', [jsverify.nat(500)], async (arbNumber: number) => {
            const message: SecureEvalResult = await secureEval(`
                window.parent.postMessage({
                    type: 'secure-eval-iframe-result',
                    arbNumber: ${arbNumber}
                }, '*');
            `);

            return (
                message.arbNumber === arbNumber &&
                message.type === 'secure-eval-iframe-result'
            );
        });

        test('evaling code with an error returns correct object', [jsverify.nat(500)], async (arbNumber: number) => {
            const message: SecureEvalResult = await secureEval(`
                throw ${arbNumber};
            `);
            
            return (
                message.type === 'secure-eval-iframe-result' &&
                message.error === arbNumber.toString()
            );
        });

        // test('Code times out after time limit', [jsverify.nat(500)], (arbNumber: number) => {
        //     return new Promise(async (resolve, reject) => {
        //         const timer = setTimeout(() => {
        //             reject(false);
        //         }, arbNumber + 10000);

        //         await secureEval(`
        //             while (true) {}
        //         `, arbNumber);

        //         clearTimeout(timer);

        //         resolve(true);
        //     });
        // });
    }
}

window.customElements.define('secure-eval-test', SecureEvalTest);
