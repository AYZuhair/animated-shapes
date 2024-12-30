document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const generateBtn = document.getElementById('generate-btn');
    const shapeContainer = document.getElementById('shape-container');
    const shapeButtons = document.querySelectorAll('.shape-btn');
    
    let selectedShape = '';

    const shapePatterns = {
        triangle: (char) => {
            const size = 5;
            let pattern = '';
            for (let i = 0; i < size; i++) {
                // Add spaces for alignment
                pattern += '<div class="shape-line">';
                for (let s = 0; s < size - i - 1; s++) {
                    pattern += '<span class="shape-char space">&nbsp;</span>';
                }
                // Add characters
                for (let j = 0; j <= i; j++) {
                    pattern += `<span class="shape-char">${char}</span>`;
                }
                pattern += '</div>';
            }
            return pattern;
        },
        
        square: (char) => {
            const size = 4;
            let pattern = '';
            for (let i = 0; i < size; i++) {
                pattern += '<div class="shape-line">';
                for (let j = 0; j < size; j++) {
                    pattern += `<span class="shape-char">${char}</span>`;
                }
                pattern += '</div>';
            }
            return pattern;
        },
        
        diamond: (char) => {
            const size = 5;
            let pattern = '';
            // Upper half
            for (let i = 0; i < size; i++) {
                pattern += '<div class="shape-line">';
                for (let s = 0; s < size - i - 1; s++) {
                    pattern += '<span class="shape-char space">&nbsp;</span>';
                }
                for (let j = 0; j < 2 * i + 1; j++) {
                    pattern += `<span class="shape-char">${char}</span>`;
                }
                pattern += '</div>';
            }
            // Lower half
            for (let i = size - 2; i >= 0; i--) {
                pattern += '<div class="shape-line">';
                for (let s = 0; s < size - i - 1; s++) {
                    pattern += '<span class="shape-char space">&nbsp;</span>';
                }
                for (let j = 0; j < 2 * i + 1; j++) {
                    pattern += `<span class="shape-char">${char}</span>`;
                }
                pattern += '</div>';
            }
            return pattern;
        },
        
        heart: (char) => {
            let pattern = '';
            const heartPattern = [
                ' 00 00 ',
                '0000000',
                ' 00000 ',
                '  000  ',
                '   0   '
            ];
            
            heartPattern.forEach(line => {
                pattern += '<div class="shape-line">';
                [...line].forEach(c => {
                    if (c === '0') {
                        pattern += `<span class="shape-char">${char}</span>`;
                    } else {
                        pattern += '<span class="shape-char space">&nbsp;</span>';
                    }
                });
                pattern += '</div>';
            });
            return pattern;
        },
        
        spiral: (char) => {
            const size = 5;
            let pattern = '';
            const spiralPattern = [
                '00000',
                '    0',
                ' 000 ',
                ' 0   ',
                '00000'
            ];
            
            spiralPattern.forEach(line => {
                pattern += '<div class="shape-line">';
                [...line].forEach(c => {
                    if (c === '0') {
                        pattern += `<span class="shape-char">${char}</span>`;
                    } else {
                        pattern += '<span class="shape-char space">&nbsp;</span>';
                    }
                });
                pattern += '</div>';
            });
            return pattern;
        }
    };

    shapeButtons.forEach(button => {
        button.addEventListener('click', () => {
            shapeButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            selectedShape = button.dataset.shape;
        });
    });

    generateBtn.addEventListener('click', () => {
        const text = textInput.value.trim();
        
        if (!text || !selectedShape) {
            alert('Please enter text and select a shape');
            return;
        }

        const shape = document.createElement('div');
        shape.className = `ascii-shape ${selectedShape}`;
        
        // Get the pattern for the selected shape
        const pattern = shapePatterns[selectedShape](text[0]);
        shape.innerHTML = pattern;
        
        shapeContainer.appendChild(shape);
        
        // Animate each character
        const chars = shape.querySelectorAll('.shape-char:not(.space)');
        chars.forEach((char, index) => {
            char.style.animationDelay = `${index * 0.1}s`;
        });
    });
});