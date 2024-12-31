document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const generateBtn = document.getElementById('generate-btn');
    const shapeContainer = document.getElementById('shape-container');
    const shapeButtons = document.querySelectorAll('.shape-btn');
    const colorPicker = document.getElementById('color-picker');
    const sizeSlider = document.getElementById('size-slider');
    const speedSlider = document.getElementById('speed-slider');
    const rotationToggle = document.getElementById('rotation-toggle');
    const rainbowToggle = document.getElementById('rainbow-toggle');
    
    let selectedShape = '';
    let isRainbowMode = false;
    let isRotating = false;

    const shapePatterns = {
        triangle: (char, size = 5) => {
            let pattern = '';
            for (let i = 0; i < size; i++) {
                pattern += '<div class="shape-line">';
                for (let s = 0; s < size - i - 1; s++) {
                    pattern += '<span class="shape-char space">&nbsp;</span>';
                }
                for (let j = 0; j <= i * 2; j++) {
                    pattern += `<span class="shape-char">${char}</span>`;
                }
                pattern += '</div>';
            }
            return pattern;
        },
        
        pyramid: (char, size = 4) => {
            let pattern = '';
            for (let i = 0; i < size; i++) {
                pattern += '<div class="shape-line">';
                for (let s = 0; s < size - i - 1; s++) {
                    pattern += '<span class="shape-char space">&nbsp;</span>';
                }
                for (let j = 0; j <= i * 2; j++) {
                    pattern += `<span class="shape-char">${j % 2 === 0 ? char : '*'}</span>`;
                }
                pattern += '</div>';
            }
            return pattern;
        },
        
        diamond: (char, size = 5) => {
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

        star: (char, size = 5) => {
            let pattern = '';
            const starLines = [
                '    *    ',
                '   ***   ',
                '*********',
                ' ***** ',
                '  ***  ',
                '*  *  *'
            ];
            starLines.forEach(line => {
                pattern += '<div class="shape-line">';
                [...line].forEach(c => {
                    pattern += `<span class="shape-char">${c === '*' ? char : '&nbsp;'}</span>`;
                });
                pattern += '</div>';
            });
            return pattern;
        },

        heart: (char, size = 5) => {
            let pattern = '';
            const heartPattern = [
                ' 00 00 ',
                '0000000',
                '0000000',
                ' 00000 ',
                '  000  ',
                '   0   '
            ];
            heartPattern.forEach(line => {
                pattern += '<div class="shape-line">';
                [...line].forEach(c => {
                    pattern += `<span class="shape-char${c === ' ' ? ' space' : ''}">${c === '0' ? char : '&nbsp;'}</span>`;
                });
                pattern += '</div>';
            });
            return pattern;
        },

        butterfly: (char, size = 6) => {
            let pattern = '';
            const butterflyPattern = [
                '0   0',
                '00 00',
                '00000',
                '00000',
                '00 00',
                '0   0'
            ];
            butterflyPattern.forEach(line => {
                pattern += '<div class="shape-line">';
                [...line].forEach(c => {
                    pattern += `<span class="shape-char">${c === '0' ? char : '&nbsp;'}</span>`;
                });
                pattern += '</div>';
            });
            return pattern;
        },

        spiral: (char, size = 5) => {
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
                    pattern += `<span class="shape-char">${c === '0' ? char : '&nbsp;'}</span>`;
                });
                pattern += '</div>';
            });
            return pattern;
        },

        infinity: (char, size = 4) => {
            let pattern = '';
            const infinityPattern = [
                ' 000 000 ',
                '0   0   0',
                ' 000 000 '
            ];
            infinityPattern.forEach(line => {
                pattern += '<div class="shape-line">';
                [...line].forEach(c => {
                    pattern += `<span class="shape-char">${c === '0' ? char : '&nbsp;'}</span>`;
                });
                pattern += '</div>';
            });
            return pattern;
        },

        crown: (char, size = 4) => {
            let pattern = '';
            const crownPattern = [
                '  0   0  ',
                ' 000 000 ',
                '000000000'
            ];
            crownPattern.forEach(line => {
                pattern += '<div class="shape-line">';
                [...line].forEach(c => {
                    pattern += `<span class="shape-char">${c === '0' ? char : '&nbsp;'}</span>`;
                });
                pattern += '</div>';
            });
            return pattern;
        },

        cat: (char, size = 5) => {
            let pattern = '';
            const catPattern = [
                ' 0   0 ',
                '0 0 0 0',
                '0  0  0',
                ' 00000 ',
                '  000  '
            ];
            catPattern.forEach(line => {
                pattern += '<div class="shape-line">';
                [...line].forEach(c => {
                    pattern += `<span class="shape-char">${c === '0' ? char : '&nbsp;'}</span>`;
                });
                pattern += '</div>';
            });
            return pattern;
        }
    };

    // Rainbow color generator
    function getRainbowColor(index) {
        const rainbow = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8F00FF'];
        return rainbow[index % rainbow.length];
    }

    // Interactive features
    let isDragging = false;
    let dragTarget = null;
    let initialX;
    let initialY;

    document.addEventListener('mousedown', e => {
        if (e.target.closest('.ascii-shape')) {
            isDragging = true;
            dragTarget = e.target.closest('.ascii-shape');
            initialX = e.clientX - dragTarget.offsetLeft;
            initialY = e.clientY - dragTarget.offsetTop;
            dragTarget.style.cursor = 'grabbing';
        }
    });

    document.addEventListener('mousemove', e => {
        if (isDragging && dragTarget) {
            e.preventDefault();
            const x = e.clientX - initialX;
            const y = e.clientY - initialY;
            dragTarget.style.left = `${x}px`;
            dragTarget.style.top = `${y}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        if (dragTarget) {
            dragTarget.style.cursor = 'grab';
            dragTarget = null;
        }
    });

    // Shape generation and animation
    function generateShape() {
        const text = textInput.value.trim() || '*';
        const size = parseInt(sizeSlider.value);
        const speed = parseFloat(speedSlider.value);
        
        if (!selectedShape) {
            alert('Please select a shape');
            return;
        }

        const shape = document.createElement('div');
        shape.className = `ascii-shape ${selectedShape}`;
        shape.style.position = 'relative';
        shape.style.cursor = 'grab';
        
        const pattern = shapePatterns[selectedShape](text[0], size);
        shape.innerHTML = pattern;
        
        shapeContainer.appendChild(shape);
        
        // Animate characters
        const chars = shape.querySelectorAll('.shape-char:not(.space)');
        chars.forEach((char, index) => {
            char.style.animationDuration = `${1 / speed}s`;
            char.style.animationDelay = `${index * 0.1 / speed}s`;
            
            if (isRainbowMode) {
                char.style.color = getRainbowColor(index);
            } else {
                char.style.color = colorPicker.value;
            }
        });

        // Add rotation if enabled
        if (isRotating) {
            shape.style.animation = `rotate 4s linear infinite`;
        }

        // Add double-click to remove
        shape.addEventListener('dblclick', () => {
            shape.style.animation = 'fadeOut 0.5s forwards';
            setTimeout(() => shape.remove(), 500);
        });
    }

    // Event listeners
    shapeButtons.forEach(button => {
        button.addEventListener('click', () => {
            shapeButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            selectedShape = button.dataset.shape;
        });
    });

    generateBtn.addEventListener('click', generateShape);
    
    colorPicker.addEventListener('input', () => {
        if (!isRainbowMode) {
            document.querySelectorAll('.shape-char').forEach(char => {
                char.style.color = colorPicker.value;
            });
        }
    });

    rainbowToggle.addEventListener('change', () => {
        isRainbowMode = rainbowToggle.checked;
        if (isRainbowMode) {
            document.querySelectorAll('.ascii-shape').forEach(shape => {
                const chars = shape.querySelectorAll('.shape-char:not(.space)');
                chars.forEach((char, index) => {
                    char.style.color = getRainbowColor(index);
                });
            });
        } else {
            document.querySelectorAll('.shape-char').forEach(char => {
                char.style.color = colorPicker.value;
            });
        }
    });

    rotationToggle.addEventListener('change', () => {
        isRotating = rotationToggle.checked;
        document.querySelectorAll('.ascii-shape').forEach(shape => {
            shape.style.animation = isRotating ? 'rotate 4s linear infinite' : 'none';
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            generateShape();
        } else if (e.key === 'Delete' || e.key === 'Backspace') {
            const shapes = document.querySelectorAll('.ascii-shape');
            const lastShape = shapes[shapes.length - 1];
            if (lastShape) {
                lastShape.remove();
            }
        }
    });
});