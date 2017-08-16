export function secureEval(code: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const secureEvalIframe: HTMLIFrameElement = document.createElement('iframe');
        secureEvalIframe.setAttribute('sandbox', 'allow-scripts');
        secureEvalIframe.setAttribute('style', 'display: none;');
        secureEvalIframe.setAttribute('src', '/node_modules/secure-eval/secure-eval-iframe.html'); //TODO is it possible to do this inline? Then I could put the secure eval code in this file and make it even more portable, just a function. It will be possible with the srcdoc attribute, once Edge supports it

        secureEvalIframe.addEventListener('load', () => {
            secureEvalIframe.contentWindow.postMessage(code, '*'); // It is fine to the the targetOrigin as *, because we do not care if a malicious site reads the code that we send. The code is not expected to be confidential if it is client-side. We only care that when the code is executed that it does not cause harm, which is why it is going to the secure iframe
        });

        window.addEventListener('message', windowListener);

        document.body.appendChild(secureEvalIframe);

        function windowListener(event: Event) {
            if (event.data.type !== 'secure-eval-iframe-result') { // Because we are listening to all messages on the window, we must check for only the result from our secure iframe
                return;
            }

            window.removeEventListener('message', windowListener); // remove the listener to avoid a memory leak
            document.body.removeChild(secureEvalIframe); // remove the iframe to avoid a memory leak

            resolve(event.data);
        }
    });
}
