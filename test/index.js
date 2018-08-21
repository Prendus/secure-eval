import '../node_modules/guesswork/test-runner.ts';
import './secure-eval-test.ts';

window.document.body.innerHTML = `
    <test-runner>
        <secure-eval-test></secure-eval-test>
    </test-runner>
`;
