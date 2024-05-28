import React, { useState, useEffect } from 'react';
import './MathKeyboard.css';

const MathKeyboard = ({ onKeyClick, inputRef }) => {
    const [expanded, setExpanded] = useState(true);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [buttonColor, setButtonColor] = useState(Array(20).fill('#ffffff')); // Assuming 20 buttons, adjust if needed
    const [clickedButtonIndex, setClickedButtonIndex] = useState(null);

    function handleDelete() {
        if (!inputRef) return;

        const input = inputRef.current;
        const selectionStart = input.selectionStart;
        const selectionEnd = input.selectionEnd;

        if (selectionStart > 0) {
            const currentValue = input.value;
            const newValue = currentValue.slice(0, selectionStart - 1) + currentValue.slice(selectionEnd);
            const newSelectionStart = selectionStart - 1;

            input.value = newValue;
            input.setSelectionRange(newSelectionStart, newSelectionStart);
            onKeyClick(newValue); // Передаем новое значение, а не пустую строку
        } else if (selectionStart === 0 && selectionEnd === currentValue.length) {
            // Удаляем весь текст, если выделено всё поле
            input.value = '';
            onKeyClick(''); // Передаем пустую строку
        }
    }


    const handleKeyClick = (key, index) => {
        if (key === '\u232b') {
            handleDelete();
        } else {
            let expression = '';
            if (['sqrt', 'sin', 'cos', 'tan', 'ctg', 'ln', 'log'].includes(key)) {
                expression = `${key}(`;
            } else {
                expression = key;
            }
            onKeyClick(expression);
        }
        setClickedButtonIndex(index);
        setButtonColor(prevState => prevState.map((color, i) => i === index ? '#d3d1d1' : '#ffffff'));
        setTimeout(() => {
            setClickedButtonIndex(null);
            setButtonColor(prevState => prevState.map((color, i) => i === index ? '#ffffff' : color));
        }, 200); // Change this value to adjust the duration of button lighting
        inputRef.current.focus();
    };

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const buttonWidth = Math.floor((windowWidth / 5) * 0.7);

    const buttonStyle = {
        flex: '1',
        padding: '10px',
        fontSize: windowWidth <= 480 ? '12px' : '16px',
        backgroundColor: '#ffffff',
        color: '#333333',
        border: '1px solid #cccccc',
        borderRadius: '5px',
        cursor: 'pointer',
        margin: '2px',
        width: `${buttonWidth}px`
    };

    return (
        <div style={{ display: 'flex', height: '50%' }}>
            <div className={expanded ? 'keyboard-expanded' : 'keyboard-collapsed'}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                    padding: '10px',
                    backgroundColor: '#f2f2f2',
                    borderRadius: '10px',
                    flex: expanded ? '1' : '0'
                }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        <button style={{ ...buttonStyle, backgroundColor: clickedButtonIndex === 0 ? '#d3d1d1' : '#ffffff' }}
                                onClick={() => handleKeyClick('x', 0)} onFocus={() => inputRef.current.focus()}>x</button>
                        <button style={{ ...buttonStyle, backgroundColor: clickedButtonIndex === 1 ? '#d3d1d1' : '#ffffff' }}
                                onClick={() => handleKeyClick('y', 1)} onFocus={() => inputRef.current.focus()}>y</button>
                        <button style={{ ...buttonStyle, backgroundColor: clickedButtonIndex === 2 ? '#d3d1d1' : '#ffffff' }}
                                onClick={() => handleKeyClick('ln(', 2)} onFocus={() => inputRef.current.focus()}>ln</button>
                        <button style={{ ...buttonStyle, backgroundColor: clickedButtonIndex === 3 ? '#d3d1d1' : '#ffffff' }}
                                onClick={() => handleKeyClick('log(a, x', 3)} onFocus={() => inputRef.current.focus()}>log</button>
                        <button style={{ ...buttonStyle, backgroundColor: clickedButtonIndex === 4 ? '#d3d1d1' : '#ffffff' }}
                                onClick={() => handleKeyClick('cos(', 4)} onFocus={() => inputRef.current.focus()}>cos</button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        <button style={{ ...buttonStyle, backgroundColor: clickedButtonIndex === 5 ? '#d3d1d1' : '#ffffff' }}
                                onClick={() => handleKeyClick('(', 5)} onFocus={() => inputRef.current.focus()}>(</button>
                        <button style={{ ...buttonStyle, backgroundColor: clickedButtonIndex === 6 ? '#d3d1d1' : '#ffffff' }}
                                onClick={() => handleKeyClick(')', 6)} onFocus={() => inputRef.current.focus()}>)
                        </button>
                        <button style={{ ...buttonStyle, backgroundColor: clickedButtonIndex === 7 ? '#d3d1d1' : '#ffffff' }}
                                onClick={() => handleKeyClick('<', 7)} onFocus={() => inputRef.current.focus()}>{"<"}</button>
                        <button style={{ ...buttonStyle, backgroundColor: clickedButtonIndex === 8 ? '#d3d1d1' : '#ffffff' }}
                                onClick={() => handleKeyClick('>', 8)} onFocus={() => inputRef.current.focus()}>{">"}
                        </button>
                        <button style={{ ...buttonStyle, backgroundColor: clickedButtonIndex === 9 ? '#d3d1d1' : '#ffffff' }}
                                onClick={() => handleKeyClick('sin(', 9)} onFocus={() => inputRef.current.focus()}>sin</button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        <button style={{ ...buttonStyle, backgroundColor: clickedButtonIndex === 10 ? '#d3d1d1' : '#ffffff' }}
                                onClick={() => handleKeyClick('abs(', 10)} onFocus={() => inputRef.current.focus()}>|x|</button>
                        <button style={{ ...buttonStyle, backgroundColor: clickedButtonIndex === 11 ? '#d3d1d1' : '#ffffff' }}
                                onClick={() => handleKeyClick('<=', 11)} onFocus={() => inputRef.current.focus()}>≤</button>
                        <button style={{ ...buttonStyle, backgroundColor: clickedButtonIndex === 12 ? '#d3d1d1' : '#ffffff' }}
                                onClick={() => handleKeyClick('>=', 12)} onFocus={() => inputRef.current.focus()}>≥</button>
                        <button style={{ ...buttonStyle, backgroundColor: clickedButtonIndex === 13 ? '#d3d1d1' : '#ffffff' }}
                                onClick={() => handleKeyClick('ctg(', 13)} onFocus={() => inputRef.current.focus()}>ctg</button>
                        <button style={{ ...buttonStyle, backgroundColor: clickedButtonIndex === 14 ? '#d3d1d1' : '#ffffff' }}
                                onClick={() => handleKeyClick('tan(', 14)} onFocus={() => inputRef.current.focus()}>tan</button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        <button style={{ ...buttonStyle, backgroundColor: clickedButtonIndex === 15 ? '#d3d1d1' : '#ffffff' }}
                                onClick={() => handleKeyClick('sqrt(', 15)} onFocus={() => inputRef.current.focus()}>√</button>
                        <button style={{ ...buttonStyle, backgroundColor: clickedButtonIndex === 16 ? '#d3d1d1' : '#ffffff' }}
                                onClick={() => handleKeyClick('^', 16)} onFocus={() => inputRef.current.focus()}>^</button>
                        <button style={{ ...buttonStyle, backgroundColor: clickedButtonIndex === 17 ? '#d3d1d1' : '#ffffff' }}
                                onClick={() => handleKeyClick('e', 17)} onFocus={() => inputRef.current.focus()}>e</button>
                        <button style={{ ...buttonStyle, backgroundColor: clickedButtonIndex === 18 ? '#d3d1d1' : '#ffffff' }}
                                onClick={() => handleKeyClick('pi', 18)} onFocus={() => inputRef.current.focus()}>π</button>
                        <button style={{ ...buttonStyle, backgroundColor: clickedButtonIndex === 19 ? '#d3d1d1' : '#ffffff' }}
                                onClick={() => handleKeyClick('.', 19)} onFocus={() => inputRef.current.focus()}>,</button>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                    padding: '10px',
                    backgroundColor: '#f2f2f2',
                    borderRadius: '10px',
                    flex: expanded ? '1' : '0'
                }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        <button
                            style={{ ...buttonStyle, backgroundColor: clickedButtonIndex === 20 ? '#d3d1d1' : '#ffffff' }}
                            onClick={() => handleKeyClick('7', 20)} onFocus={() => inputRef.current.focus()}>7
                        </button>
                        <button
                            style={{ ...buttonStyle, backgroundColor: clickedButtonIndex === 21 ? '#d3d1d1' : '#ffffff' }}
                            onClick={() => handleKeyClick('8', 21)} onFocus={() => inputRef.current.focus()}>8
                        </button>
                        <button
                            style={{ ...buttonStyle, backgroundColor: clickedButtonIndex === 22 ? '#d3d1d1' : '#ffffff' }}
                            onClick={() => handleKeyClick('9', 22)} onFocus={() => inputRef.current.focus()}>9
                        </button>
                        <button
                            style={{ ...buttonStyle, backgroundColor: clickedButtonIndex === 23 ? '#d3d1d1' : '#ffffff' }}
                            onClick={handleDelete} onFocus={() => inputRef.current.focus()}>⌫
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        <button
                            style={{ ...buttonStyle, backgroundColor: clickedButtonIndex === 24 ? '#d3d1d1' : '#ffffff' }}
                            onClick={() => handleKeyClick('4', 24)} onFocus={() => inputRef.current.focus()}>4
                        </button>
                        <button
                            style={{ ...buttonStyle, backgroundColor: clickedButtonIndex === 25 ? '#d3d1d1' : '#ffffff' }}
                            onClick={() => handleKeyClick('5', 25)} onFocus={() => inputRef.current.focus()}>5
                        </button>
                        <button
                            style={{ ...buttonStyle, backgroundColor: clickedButtonIndex === 26 ? '#d3d1d1' : '#ffffff' }}
                            onClick={() => handleKeyClick('6', 26)} onFocus={() => inputRef.current.focus()}>6
                        </button>
                        <button
                            style={{ ...buttonStyle, backgroundColor: clickedButtonIndex === 27 ? '#d3d1d1' : '#ffffff' }}
                            onClick={() => handleKeyClick('*', 27)} onFocus={() => inputRef.current.focus()}>*
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        <button
                            style={{ ...buttonStyle, backgroundColor: clickedButtonIndex === 28 ? '#d3d1d1' : '#ffffff' }}
                            onClick={() => handleKeyClick('1', 28)} onFocus={() => inputRef.current.focus()}>1
                        </button>
                        <button
                            style={{ ...buttonStyle, backgroundColor: clickedButtonIndex === 29 ? '#d3d1d1' : '#ffffff' }}
                            onClick={() => handleKeyClick('2', 29)} onFocus={() => inputRef.current.focus()}>2
                        </button>
                        <button
                            style={{ ...buttonStyle, backgroundColor: clickedButtonIndex === 30 ? '#d3d1d1' : '#ffffff' }}
                            onClick={() => handleKeyClick('3', 30)} onFocus={() => inputRef.current.focus()}>3
                        </button>
                        <button
                            style={{ ...buttonStyle, backgroundColor: clickedButtonIndex === 31 ? '#d3d1d1' : '#ffffff' }}
                            onClick={() => handleKeyClick('-', 31)} onFocus={() => inputRef.current.focus()}>-
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        <button
                            style={{ ...buttonStyle, backgroundColor: clickedButtonIndex === 32 ? '#d3d1d1' : '#ffffff' }}
                            onClick={() => handleKeyClick('0', 32)} onFocus={() => inputRef.current.focus()}>0
                        </button>
                        <button
                            style={{ ...buttonStyle, backgroundColor: clickedButtonIndex === 33 ? '#d3d1d1' : '#ffffff' }}
                            onClick={() => handleKeyClick('=', 33)} onFocus={() => inputRef.current.focus()}>=
                        </button>
                        <button
                            style={{ ...buttonStyle, backgroundColor: clickedButtonIndex === 34 ? '#d3d1d1' : '#ffffff' }}
                            onClick={() => handleKeyClick('+', 34)} onFocus={() => inputRef.current.focus()}>+
                        </button>
                        <button
                            style={{ ...buttonStyle, backgroundColor: clickedButtonIndex === 35 ? '#d3d1d1' : '#ffffff' }}
                            onClick={() => handleKeyClick('/', 35)} onFocus={() => inputRef.current.focus()}>/
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MathKeyboard;
