import React, { useState, useEffect, useRef } from 'react';
import './MathKeyboard.css';


const MathKeyboard = ({ onKeyClick, inputRef }) => {
    const [expanded, setExpanded] = useState(true);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [buttonColor, setButtonColor] = useState(Array(20).fill('#ffffff')); // Assuming 20 buttons, adjust if needed
    const [clickedButtonIndex, setClickedButtonIndex] = useState(null);
    const [currentFocusIndex, setCurrentFocusIndex] = useState(null);
    const [functionInput, setFunctionInput] = useState(''); // Add state for function input
    const buttonRefs = useRef([]);


    // Initialize buttonRefs
    useEffect(() => {
        buttonRefs.current = Array(30).fill(null).map((_, i) => buttonRefs.current[i] || React.createRef());
    }, []);

    useEffect(() => {
        if (inputRef && inputRef.current) {
            inputRef.current.value = functionInput;
        }
    }, [functionInput, inputRef]);

    // function handleDelete() {
    //     if (!inputRef || !inputRef.current) return;
    //
    //     const input = inputRef.current;
    //     const selectionStart = input.selectionStart;
    //     const selectionEnd = input.selectionEnd;
    //     let newValue;
    //
    //     if (input.value.length === 0) {
    //         // Если инпут пустой, просто вернуть без дальнейших действий
    //         return;
    //     }
    //
    //     if (selectionStart === selectionEnd) {
    //         if (selectionStart > 0) {
    //             newValue = input.value.slice(0, selectionStart - 1) + input.value.slice(selectionEnd);
    //             input.setSelectionRange(selectionStart - 1, selectionStart - 1);
    //         }
    //     } else {
    //         newValue = input.value.slice(0, selectionStart) + input.value.slice(selectionEnd);
    //         input.setSelectionRange(selectionStart, selectionStart);
    //     }
    //
    //     input.value = newValue;
    //     setFunctionInput(newValue); // Update functionInput state
    //     onKeyClick(newValue);
    //     input.focus();
    // }
    //
    // const handleKeyClick = (key, index) => {
    //     const input = inputRef.current;
    //     const selectionStart = input.selectionStart;
    //     const selectionEnd = input.selectionEnd;
    //     let newValue;
    //
    //     if (key === '\u232b') { // Delete key
    //         handleDelete();
    //     } else {
    //         let expression = '';
    //         if (['sqrt', 'sin', 'cos', 'tan', 'ctg', 'ln', 'log'].includes(key)) {
    //             expression = `${key}(`;
    //         } else {
    //             expression = key;
    //         }
    //
    //         newValue = input.value.slice(0, selectionStart) + expression + input.value.slice(selectionEnd);
    //         input.value = newValue;
    //         setFunctionInput(newValue); // Update functionInput state
    //         input.setSelectionRange(selectionStart + expression.length, selectionStart + expression.length);
    //         onKeyClick(newValue);
    //     }
    //
    //     setClickedButtonIndex(index);
    //     setButtonColor(prevState => prevState.map((color, i) => i === index ? '#d3d1d1' : '#ffffff'));
    //     setTimeout(() => {
    //         setClickedButtonIndex(null);
    //         setButtonColor(prevState => prevState.map((color, i) => i === index ? '#ffffff' : color));
    //     }, 200); // Change this value to adjust the duration of button lighting
    //     input.focus();
    // };


    function handleDelete() {
        if (!inputRef || !inputRef.current) return;

        const input = inputRef.current;
        const selectionStart = input.selectionStart;
        const selectionEnd = input.selectionEnd;
        let newValue;

        if (selectionEnd - 1 > 0) {
            const currentValue = input.value;
            newValue = currentValue.slice(0, selectionStart - 1) + currentValue.slice(selectionEnd);
            const newSelectionEnd = selectionEnd - 1;

            input.value = newValue;
            input.setSelectionRange(newSelectionEnd, newSelectionEnd);
            inputRef.current = input;
            onKeyClick('');
        } else if (selectionStart === input.value.length || selectionEnd === 1) {
            newValue = '';
            input.value = newValue;
            inputRef.current = input;
            onKeyClick('');
            input.setSelectionRange(0, 0);
        } else {
            return; // Do nothing if the cursor is at the beginning and there is no selection
         }
     }



    const handleKeyClick = (key, index) => {
        if (key === '\u232b') {
            setCurrentFocusIndex(index);
            handleDelete();
        } else {
            setCurrentFocusIndex(index);
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


    const handleKeyDown = (event) => {
        const { key, shiftKey } = event;

        if (key === 'Tab') {
            event.preventDefault(); // Prevent default tab behavior

            let newIndex = currentFocusIndex !== null ? currentFocusIndex : 0; // Default to 0 if currentFocusIndex is null

            // Calculate the next index based on whether the shift key is pressed
            newIndex = shiftKey ? (newIndex - 1 + 30) % 30 : (newIndex + 1) % 30;

            setCurrentFocusIndex(newIndex);
            buttonRefs.current[newIndex]?.current && buttonRefs.current[newIndex].current.focus();
        } else if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown') {
            event.preventDefault();

            let newIndex = currentFocusIndex !== null ? currentFocusIndex : 0; // Default to 0 if currentFocusIndex is null

            switch (key) {
                case 'ArrowLeft':
                    newIndex = (newIndex - 1 + 30) % 30; // Wrap around to end
                    break;
                case 'ArrowRight':
                    newIndex = (newIndex + 1 + 30) % 30; // Wrap around to beginning
                    break;
                case 'ArrowUp':
                    newIndex = (newIndex - 10 + 30) % 30; // Move up by one row, wrapping around
                    break;
                case 'ArrowDown':
                    newIndex = (newIndex + 10) % 30; // Move down by one row, wrapping around
                    break;
                default:
                    break;
            }

            setCurrentFocusIndex(newIndex);
            buttonRefs.current[newIndex]?.current && buttonRefs.current[newIndex].current.focus();
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentFocusIndex]);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const buttonWidth = Math.floor(windowWidth / 10);
    const keyboardHeightPercentage = '30%'; // Процентное значение высоты контейнера кнопок относительно высоты экрана

    const buttonStyle = {
        flex: '1',
        padding: windowWidth <= 480 ? '1%' : '0.75%', // Используем проценты для адаптивного padding
        fontSize: windowWidth <= 480 ? '10px' : '16px',
        backgroundColor: '#ffffff',
        color: '#333333',
        border: '1px solid #cccccc',
        borderRadius: '5px',
        cursor: 'pointer',
        margin: '2px',
        width: `${buttonWidth}px`
    };


    return (
        <div style={{ display: 'flex', height: keyboardHeightPercentage }}>
            <div className={expanded ? 'keyboard-expanded' : 'keyboard-collapsed'}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '3px',
                    padding: '7px',
                    backgroundColor: '#f2f2f2',
                    borderRadius: '10px',
                    flex: expanded ? '1' : '0'
                }}>
                    <div style={{display: 'flex', flexWrap: 'wrap'}}>
                        <button
                            ref={buttonRefs.current[0]}
                            className="focusable"
                            tabIndex="0"
                            style={{...buttonStyle, backgroundColor: clickedButtonIndex === 0 ? '#d3d1d1' : '#ffffff'}}
                            onClick={() => handleKeyClick('x', 0)}> x
                        </button>
                        <button
                            ref={buttonRefs.current[1]}
                            className="focusable"
                            tabIndex="1"
                            style={{...buttonStyle, backgroundColor: clickedButtonIndex === 1 ? '#d3d1d1' : '#ffffff'}}
                            onClick={() => handleKeyClick('e', 1)}>e
                        </button>
                        <button
                            ref={buttonRefs.current[2]}
                            className="focusable"
                            tabIndex="2"
                            style={{...buttonStyle, backgroundColor: clickedButtonIndex === 2 ? '#d3d1d1' : '#ffffff'}}
                            onClick={() => handleKeyClick('ln(', 2)}>ln
                        </button>
                        <button
                            ref={buttonRefs.current[3]}
                            className="focusable"
                            tabIndex="3"
                            style={{...buttonStyle, backgroundColor: clickedButtonIndex === 3 ? '#d3d1d1' : '#ffffff'}}
                            onClick={() => handleKeyClick('log(a, x', 3)}>log
                        </button>
                        <button
                            ref={buttonRefs.current[4]}
                            className="focusable"
                            tabIndex="4"
                            style={{...buttonStyle, backgroundColor: clickedButtonIndex === 4 ? '#d3d1d1' : '#ffffff'}}
                            onClick={() => handleKeyClick('/', 4)}>/
                        </button>
                        <div style={{width: `${buttonWidth / 4}px`}}/>
                        <button
                            ref={buttonRefs.current[5]}
                            className="focusable"
                            tabIndex="5"
                            style={{...buttonStyle, backgroundColor: clickedButtonIndex === 5 ? '#d3d1d1' : '#ffffff'}}
                            onClick={() => handleKeyClick('6', 5)}>6
                        </button>
                        <button
                            ref={buttonRefs.current[6]}
                            className="focusable"
                            tabIndex="6"
                            style={{...buttonStyle, backgroundColor: clickedButtonIndex === 6 ? '#d3d1d1' : '#ffffff'}}
                            onClick={() => handleKeyClick('7', 6)}>7
                        </button>
                        <button
                            ref={buttonRefs.current[7]}
                            className="focusable"
                            tabIndex="7"
                            style={{...buttonStyle, backgroundColor: clickedButtonIndex === 7 ? '#d3d1d1' : '#ffffff'}}
                            onClick={() => handleKeyClick('8', 7)}>8
                        </button>
                        <button
                            ref={buttonRefs.current[8]}
                            className="focusable"
                            tabIndex="8"
                            style={{...buttonStyle, backgroundColor: clickedButtonIndex === 8 ? '#d3d1d1' : '#ffffff'}}
                            onClick={() => handleKeyClick('9', 8)}>9
                        </button>
                        <button
                            ref={buttonRefs.current[9]}
                            className="focusable"
                            tabIndex="9"
                            style={{...buttonStyle, backgroundColor: clickedButtonIndex === 9 ? '#d3d1d1' : '#ffffff'}}
                            onClick={handleDelete}>⌫
                        </button>
                    </div>
                    <div style={{display: 'flex', flexWrap: 'wrap'}}>
                        <button
                            ref={buttonRefs.current[10]}
                            className="focusable"
                            tabIndex="10"
                            style={{...buttonStyle, backgroundColor: clickedButtonIndex === 10 ? '#d3d1d1' : '#ffffff'}}
                            onClick={() => handleKeyClick('(', 10)}>(
                        </button>
                        <button
                            ref={buttonRefs.current[11]}
                            className="focusable"
                            tabIndex="11"
                            style={{...buttonStyle, backgroundColor: clickedButtonIndex === 11 ? '#d3d1d1' : '#ffffff'}}
                            onClick={() => handleKeyClick(')', 11)}>)
                        </button>
                        <button
                            ref={buttonRefs.current[12]}
                            className="focusable"
                            tabIndex="12"
                            style={{...buttonStyle, backgroundColor: clickedButtonIndex === 12 ? '#d3d1d1' : '#ffffff'}}
                            onClick={() => handleKeyClick('tan(', 12)}>tan
                        </button>
                        <button
                            ref={buttonRefs.current[13]}
                            className="focusable"
                            tabIndex="13"
                            style={{...buttonStyle, backgroundColor: clickedButtonIndex === 13 ? '#d3d1d1' : '#ffffff'}}
                            onClick={() => handleKeyClick('sin(', 13)}>sin
                        </button>
                        <button
                            ref={buttonRefs.current[14]}
                            className="focusable"
                            tabIndex="14"
                            style={{...buttonStyle, backgroundColor: clickedButtonIndex === 14 ? '#d3d1d1' : '#ffffff'}}
                            onClick={() => handleKeyClick('^', 14)}>^
                        </button>
                        <div style={{width: `${buttonWidth / 4}px`}}/>
                        <button
                            ref={buttonRefs.current[15]}
                            className="focusable"
                            tabIndex="15"
                            style={{...buttonStyle, backgroundColor: clickedButtonIndex === 15 ? '#d3d1d1' : '#ffffff'}}
                            onClick={() => handleKeyClick('2', 15)}>2
                        </button>
                        <button
                            ref={buttonRefs.current[16]}
                            className="focusable"
                            tabIndex="16"
                            style={{...buttonStyle, backgroundColor: clickedButtonIndex === 16 ? '#d3d1d1' : '#ffffff'}}
                            onClick={() => handleKeyClick('3', 16)}>3
                        </button>
                        <button
                            ref={buttonRefs.current[17]}
                            className="focusable"
                            tabIndex="17"
                            style={{...buttonStyle, backgroundColor: clickedButtonIndex === 17 ? '#d3d1d1' : '#ffffff'}}
                            onClick={() => handleKeyClick('4', 17)}>4
                        </button>
                        <button
                            ref={buttonRefs.current[18]}
                            className="focusable"
                            tabIndex="18"
                            style={{...buttonStyle, backgroundColor: clickedButtonIndex === 18 ? '#d3d1d1' : '#ffffff'}}
                            onClick={() => handleKeyClick('5', 18)}>5
                        </button>
                        <button
                            ref={buttonRefs.current[19]}
                            className="focusable"
                            tabIndex="19"
                            style={{...buttonStyle, backgroundColor: clickedButtonIndex === 19 ? '#d3d1d1' : '#ffffff'}}
                            onClick={() => handleKeyClick('*', 19)}>*
                        </button>
                    </div>
                    <div style={{display: 'flex', flexWrap: 'wrap'}}>
                        <button
                            ref={buttonRefs.current[20]}
                            className="focusable"
                            tabIndex="20"
                            style={{...buttonStyle, backgroundColor: clickedButtonIndex === 20 ? '#d3d1d1' : '#ffffff'}}
                            onClick={() => handleKeyClick('abs(', 20)}>|x|
                        </button>
                        <button
                            ref={buttonRefs.current[21]}
                            className="focusable"
                            tabIndex="21"
                            style={{...buttonStyle, backgroundColor: clickedButtonIndex === 21 ? '#d3d1d1' : '#ffffff'}}
                            onClick={() => handleKeyClick('.', 21)}>,
                        </button>
                        <button
                            ref={buttonRefs.current[22]}
                            className="focusable"
                            tabIndex="22"
                            style={{...buttonStyle, backgroundColor: clickedButtonIndex === 22 ? '#d3d1d1' : '#ffffff'}}
                            onClick={() => handleKeyClick('cos(', 22)}>cos
                        </button>
                        <button
                            ref={buttonRefs.current[23]}
                            className="focusable"
                            tabIndex="23"
                            style={{...buttonStyle, backgroundColor: clickedButtonIndex === 23 ? '#d3d1d1' : '#ffffff'}}
                            onClick={() => handleKeyClick('ctg(', 23)}>ctg
                        </button>
                        <button
                            ref={buttonRefs.current[24]}
                            className="focusable"
                            tabIndex="24"
                            style={{...buttonStyle, backgroundColor: clickedButtonIndex === 24 ? '#d3d1d1' : '#ffffff'}}
                            onClick={() => handleKeyClick('pi', 24)}>π
                        </button>
                        <div style={{width: `${buttonWidth / 4}px`}}/>
                        <button
                            ref={buttonRefs.current[25]}
                            className="focusable"
                            tabIndex="25"
                            style={{...buttonStyle, backgroundColor: clickedButtonIndex === 25 ? '#d3d1d1' : '#ffffff'}}
                            onClick={() => handleKeyClick('0', 25)}>0
                        </button>
                        <button
                            ref={buttonRefs.current[26]}
                            className="focusable"
                            tabIndex="26"
                            style={{...buttonStyle, backgroundColor: clickedButtonIndex === 26 ? '#d3d1d1' : '#ffffff'}}
                            onClick={() => handleKeyClick('1', 26)}>1
                        </button>
                        <button
                            ref={buttonRefs.current[27]}
                            className="focusable"
                            tabIndex="27"
                            style={{...buttonStyle, backgroundColor: clickedButtonIndex === 27 ? '#d3d1d1' : '#ffffff'}}
                            onClick={() => handleKeyClick('=', 27)}>=
                        </button>
                        <button
                            ref={buttonRefs.current[28]}
                            className="focusable"
                            tabIndex="28"
                            style={{...buttonStyle, backgroundColor: clickedButtonIndex === 28 ? '#d3d1d1' : '#ffffff'}}
                            onClick={() => handleKeyClick('+', 28)}>+
                        </button>
                        <button
                            ref={buttonRefs.current[29]}
                            className="focusable"
                            tabIndex="29"
                            style={{...buttonStyle, backgroundColor: clickedButtonIndex === 29 ? '#d3d1d1' : '#ffffff'}}
                            onClick={() => handleKeyClick('-', 29)}>-
                        </button>
                    </div>
                    <div style={{display: 'flex', flexWrap: 'wrap'}}>
                        <div style={{width: `${buttonWidth / 4}px`}}/>
                    </div>
                </div>
            </div>
        </div>

    );
};


export default MathKeyboard;


