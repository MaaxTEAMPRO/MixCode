document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('overlay');
    const popup = document.getElementById('popup');
    const hexColorInput = document.getElementById('hexColorInput');
    const colorPickerInput = document.getElementById('colorPickerInput');
    const boldInput = document.getElementById('boldInput');
    const italicInput = document.getElementById('italicInput');
    const codeOutput = document.getElementById('codeOutput');
    const textOutput = document.getElementById('textOutput');
    let currentInputId;

    // Load saved data from localStorage
    for (let i = 1; i <= 5; i++) {
        const savedText = localStorage.getItem(`input${i}`);
        const savedHexColor = localStorage.getItem(`input${i}-color`);
        if (savedText) {
            document.getElementById(`input${i}`).value = savedText;
            document.getElementById(`input${i}`).style.color = savedHexColor;
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

    hexColorInput.addEventListener('input', () => {
        colorPickerInput.value = hexColorInput.value;
    });

    colorPickerInput.addEventListener('input', () => {
        hexColorInput.value = colorPickerInput.value;
    });

    function openPopup() {
        overlay.style.display = 'block';
        popup.classList.remove('hide');
        popup.classList.add('show');
        popup.style.display = 'block';

        // Load the current color for the input
        const currentColor = document.getElementById(`input${currentInputId}`).style.color;
        if (currentColor) {
            hexColorInput.value = rgbToHex(currentColor);
            colorPickerInput.value = rgbToHex(currentColor);
        } else {
            hexColorInput.value = '#FFFFFF';
            colorPickerInput.value = '#FFFFFF';
        }
    }

    function closePopup() {
        overlay.style.display = 'none';
        popup.classList.remove('show');
        popup.classList.add('hide');
        setTimeout(() => {
            popup.style.display = 'none';
        }, 300); // Duração da animação
    }

    function applyStyle() {
        const hexColor = hexColorInput.value;
        const bold = boldInput.checked;
        const italic = italicInput.checked;

        const input = document.getElementById(`input${currentInputId}`);
        let style = '';

        if (bold) style += 'font-weight:bold;';
        if (italic) style += 'font-style:italic;';
        if (hexColor) style += `color:${hexColor};`;

        input.setAttribute('style', style);
        localStorage.setItem(`input${currentInputId}`, input.value);
        localStorage.setItem(`input${currentInputId}-color`, hexColor);
        closePopup();
    }

    function generateCode() {
        let size = document.getElementById('textSize').value;
        if (!size || size < 1 || size > 300) {
            alert('O tamanho do texto deve estar entre 1 e 300.');
            return;
        }

        let code = `<size=${size}><i>`;
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
                localStorage.removeItem(`input${i}-color`);
            }
            document.getElementById('textSize').value = '';
            localStorage.removeItem('textSize');
            codeOutput.textContent = '';
            textOutput.innerHTML = '';
        }
    }

    // Utility function to convert RGB to HEX
    function rgbToHex(rgb) {
        let result;
        if (rgb && rgb.startsWith('rgb')) {
            const rgbValues = rgb.match(/\d+/g).map(Number);
            result = `#${((1 << 24) + (rgbValues[0] << 16) + (rgbValues[1] << 8) + rgbValues[2]).toString(16).slice(1).toUpperCase()}`;
        }
        return result || '#FFFFFF';
    }
});
