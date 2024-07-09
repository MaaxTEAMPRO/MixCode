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

    async function loadPresets() {
        try {
            const response = await fetch('codigos.txt');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.text();
            const presetsContainer = document.getElementById('presets');
            presetsContainer.innerHTML = '';
            const lines = data.split('\n');

            lines.forEach(line => {
                const [name, code] = line.split(' - ');
                const color = code.match(/color=([^>]+)>/)[1]; // Extrai a cor do código
                const presetBlock = document.createElement('div');
                presetBlock.classList.add('preset-block');

                const presetTitle = document.createElement('p');
                presetTitle.textContent = name;
                presetTitle.style.color = color; // Aplica a cor extraída
                presetBlock.appendChild(presetTitle);

                const presetCode = document.createElement('pre');
                presetCode.innerHTML = code;
                presetBlock.appendChild(presetCode);

                presetBlock.addEventListener('click', () => {
                    copyToClipboard(code);
                });

                presetsContainer.appendChild(presetBlock);
            });
        } catch (error) {
            console.error('Failed to load presets:', error);
        }
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Código copiado para a área de transferência!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }

    loadPresets();

    document.querySelectorAll('.style-btn').forEach(button => {
        button.addEventListener('click', () => {
            currentInputId = button.getAttribute('data-input');
            openPopup();
        });
    });

    document.getElementById('apply-style').addEventListener('click', applyStyle);
    document.getElementById('close-popup').addEventListener('click', closePopup);
    document.getElementById('generate-code').addEventListener('click', generateCode);
    document.getElementById('copy-code').addEventListener('click', () => {
        copyToClipboard(codeOutput.textContent);
    });
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

        const inputElement = document.getElementById(`input${currentInputId}`);
        const currentColor = inputElement.style.color || '#FFFFFF';
        hexColorInput.value = rgbToHex(currentColor);
        colorPickerInput.value = rgbToHex(currentColor);
    }

    function closePopup() {
        overlay.style.display = 'none';
        popup.classList.remove('show');
        popup.classList.add('hide');
        setTimeout(() => {
            popup.style.display = 'none';
        }, 300);
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
                const hexColor = localStorage.getItem(`input${i}-color`);
                if (hexColor) {
                    code += `<color=${hexColor}>${input.value}</color>`;
                    styledText += `<span style="${style}">${input.value}</span>`;
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

    function rgbToHex(rgb) {
        if (!rgb) return '#FFFFFF';
        const rgbValues = rgb.match(/\d+/g);
        if (rgbValues && rgbValues.length === 3) {
            return `#${((1 << 24) + (parseInt(rgbValues[0]) << 16) + (parseInt(rgbValues[1]) << 8) + parseInt(rgbValues[2])).toString(16).slice(1).toUpperCase()}`;
        }
        return '#FFFFFF';
    }
});
