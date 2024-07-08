document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('overlay');
    const popup = document.getElementById('popup');
    const colorInput = document.getElementById('colorInput');
    const boldInput = document.getElementById('boldInput');
    const italicInput = document.getElementById('italicInput');
    const codeOutput = document.getElementById('codeOutput');
    const textOutput = document.getElementById('textOutput');
    let currentInputId;

    // Load saved data from localStorage
    for (let i = 1; i <= 5; i++) {
        const savedText = localStorage.getItem(`input${i}`);
        if (savedText) {
            document.getElementById(`input${i}`).value = savedText;
        }
    }
    const savedTextSize = localStorage.getItem('textSize');
    if (savedTextSize) {
        document.getElementById('textSize').value = savedTextSize;
    }

    document.querySelectorAll('.style-btn').forEach(button => {
        button.addEventListener('click', () => {
            currentInputId = button.getAttribute('data-input');
            openPopup();
        });
    });

    document.getElementById('apply-style').addEventListener('click', applyStyle);
    document.getElementById('close-popup').addEventListener('click', closePopup);
    document.getElementById('generate-code').addEventListener('click', generateCode);
    document.getElementById('copy-code').addEventListener('click', copyCode);
    document.getElementById('reset-all').addEventListener('click', resetAll);

    function openPopup() {
        overlay.style.display = 'block';
        popup.style.display = 'block';
    }

    function closePopup() {
        overlay.style.display = 'none';
        popup.style.display = 'none';
    }

    function applyStyle() {
        const color = colorInput.value;
        const bold = boldInput.checked;
        const italic = italicInput.checked;

        const input = document.getElementById(`input${currentInputId}`);
        let style = '';

        if (bold) style += 'font-weight:bold;';
        if (italic) style += 'font-style:italic;';
        if (color) style += `color:${color};`;

        input.setAttribute('style', style);
        localStorage.setItem(`input${currentInputId}`, input.value);
        closePopup();
    }

    function generateCode() {
        let code = `<size=${document.getElementById('textSize').value}><i>`;
        let styledText = '';
        for (let i = 1; i <= 5; i++) {
            const input = document.getElementById(`input${i}`);
            if (input.value) {
                const style = input.getAttribute('style');
                if (style && style.includes('color')) {
                    const colorMatch = style.match(/color:([^;]+);/);
                    if (colorMatch) {
                        code += `<color=${colorMatch[1]}>${input.value}</color>`;
                        styledText += `<span style="${style}">${input.value}</span>`;
                    }
                } else {
                    code += input.value;
                    styledText += `<span style="${style}">${input.value}</span>`;
                }
                localStorage.setItem(`input${i}`, input.value);
            }
        }
        code += '</i></size>';
        localStorage.setItem('textSize', document.getElementById('textSize').value);
        codeOutput.textContent = code;
        textOutput.innerHTML = styledText;
    }

    function copyCode() {
        navigator.clipboard.writeText(codeOutput.textContent).then(() => {
            alert('Código copiado!');
        });
    }

    function resetAll() {
        if (confirm('Tem certeza que deseja resetar?')) {
            for (let i = 1; i <= 5; i++) {
                document.getElementById(`input${i}`).value = '';
                document.getElementById(`input${i}`).removeAttribute('style');
                localStorage.removeItem(`input${i}`);
            }
            document.getElementById('textSize').value = '';
            localStorage.removeItem('textSize');
            codeOutput.textContent = '';
            textOutput.innerHTML = '';
        }
    }
});
