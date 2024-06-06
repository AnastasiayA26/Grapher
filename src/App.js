import React, { useState, useEffect, useRef } from 'react';
import Plot from 'react-plotly.js';
import MathKeyboard from './MathKeyboard.js';
import { createSmartappDebugger, createAssistant } from '@salutejs/client';
import './styles.css';
import './index.css';
import { make_function } from './math_parser.js';
import { SpatialNavigation } from '@salutejs/spatial';

const App = () => {
    const [functions, setFunctions] = useState([]);
    const [functionInput, setFunctionInput] = useState('');
    const [plotData, setPlotData] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [xRange, setXRange] = useState([-100, 100]);
    const [yRange, setYRange] = useState([-100, 100]);
    const [isFunctionListVisible, setIsFunctionListVisible] = useState(false);
    const [hiddenFunctions, setHiddenFunctions] = useState([]);
    const [isKeyboardExpanded, setIsKeyboardExpanded] = useState(false);
    const [keyboardButtonColor, setKeyboardButtonColor] = useState('#1a73e8');
    const inputRef = useRef(null);
    const assistantRef = useRef(null);

    useEffect(() => {
        calculatePlotData();
    }, [functions, hiddenFunctions, xRange, yRange]);

    const initializeAssistant = (getState) => {
        if (process.env.NODE_ENV === 'development') {
            return createSmartappDebugger({
                token: process.env.REACT_APP_TOKEN ?? '',
                initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP}`,
                getState,
            });
        }
        return createAssistant({ getState });
    };

    useEffect(() => {
        window.addMathFunction = (func) => {
            setFunctionInput(prev => prev + func);
        };

        // window.BuildMathFunction = (func, context) => {
        //     context.functions.push({
        //         func: func,
        //         color: getRandomColor()
        //     });
        //     context.calculatePlotData();
        // };

        const getState = () => ({ functions });

        const assistant = initializeAssistant(getState);
        assistant.on('data', handleAssistantData);
    }, [functions]);

    useEffect(() => {
        SpatialNavigation.init();
        SpatialNavigation.add({
            selector: '.focusable'
        });

        const handleKeyDown = (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    SpatialNavigation.move('up');
                    break;
                case 'ArrowDown':
                    SpatialNavigation.move('down');
                    break;
                case 'ArrowLeft':
                    SpatialNavigation.move('left');
                    break;
                case 'ArrowRight':
                    SpatialNavigation.move('right');
                    break;
                case 'Enter':
                    document.activeElement.click();
                    break;
                case 'Backspace':
                    // Обработка кнопки Back
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleAssistantData = (event) => {
        console.log('handleAssistantData:', event);
        const { action } = event;

        if (action && action.parameters && action.parameters.function) {
            const func = action.parameters.function;
            window.addMathFunction(func);
        } else {
            console.error('Action parameters or function is undefined:', action);
        }
    };

    function calculatePlotData() {
        const traces = functions
            .filter((func, index) => !hiddenFunctions.includes(index))
            .map(({ func, color }, index) => {
                let f = make_function(func);
                const xValues = [];
                const yValues = [];
                const step = (xRange[1] - xRange[0]) / 1000;

                for (let x = xRange[0]; x <= xRange[1]; x += step) {
                    try {
                        const y = f(x);
                        xValues.push(x);
                        yValues.push(y);
                    } catch (error) {
                        setErrorMessage(`Ошибка вычисления функции: ${func}`);
                    }
                }

                return {
                    x: xValues,
                    y: yValues,
                    mode: 'lines',
                    type: 'scatter',
                    line: {
                        color: color,
                        width: 2,
                    },
                    name: `Функция ${index + 1}`,
                };
            });

        setPlotData(traces);
        setErrorMessage('');
    }

    const handleFunctionEdit = (index, editedFunction) => {
        setFunctions((prevFunctions) => {
            const updatedFunctions = [...prevFunctions];
            updatedFunctions[index] = editedFunction;
            return updatedFunctions;
        });
    };

    const handleFunctionInputChange = (e) => {
        setFunctionInput(e.target.value);
    };

    const handleAddFunction = () => {
        if (functionInput.trim() !== '') {
            // Добавляем функцию в строку ввода
            setFunctionInput(prevFunctionInput => prevFunctionInput + functionInput.trim());
            setFunctions([...functions, { func: functionInput, color: getRandomColor() }]);
            setFunctionInput('');
            setIsFunctionListVisible(true);
            setErrorMessage('');
        } else {
            setErrorMessage('Введите функцию.');
        }
    };
    

    const handleFunctionRemove = (index) => {
        setFunctions((prevFunctions) => prevFunctions.filter((_, i) => i !== index));
    };

    const FunctionList = ({ functions, hiddenFunctions }) => (
        <div style={{ marginTop: '10px' }}>
            <div
                style={{
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    padding: '10px',
                    width: 'auto',
                    maxHeight: '200px',
                    overflowY: 'auto',
                }}
            >
                {functions.map((func, index) => (
                    <div
                        key={index}
                        className="focusable"
                        style={{ padding: '5px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    >
                        <div
                            style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: func.color,
                                marginRight: '5px',
                                cursor: 'pointer',
                                border: '1px solid #ddd',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            onClick={() => handleFunctionToggle(index)}
                        >
                            {hiddenFunctions.includes(index) && (
                                <span style={{ color: '#ddd', fontSize: '12px' }}>•</span>
                            )}
                        </div>
                        <span
                            style={{
                                flex: 1,
                                fontStyle: hiddenFunctions.includes(index) ? 'italic' : 'normal',
                                textDecoration: hiddenFunctions.includes(index) ? 'line-through' : 'none',
                            }}
                            contentEditable={!hiddenFunctions.includes(index)}
                            suppressContentEditableWarning={true}
                            onBlur={(e) =>
                                handleFunctionEdit(index, { ...func, func: e.target.textContent })
                            }
                        >
                            {func.func}
                        </span>
                        <button
                            onClick={() => handleFunctionRemove(index)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'red',
                                cursor: 'pointer',
                                fontSize: '16px',
                                marginLeft: '5px',
                            }}
                        >
                            ✖
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

    const handleFunctionToggle = (index) => {
        setHiddenFunctions((prevHiddenFunctions) => {
            if (prevHiddenFunctions.includes(index)) {
                return prevHiddenFunctions.filter((i) => i !== index);
            } else {
                return [...prevHiddenFunctions, index];
            }
        });
    };

    const handleKeyboardButtonClick = () => {
        setIsKeyboardExpanded((prev) => !prev);
        setKeyboardButtonColor((prev) => (prev === '#1a73e8' ? '#34a853' : '#1a73e8'));
    };

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowDown') {
            setIsKeyboardExpanded(true);
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }
    };

    const handleKeyUp = (event) => {
        if (event.key === 'ArrowDown') {
            setIsKeyboardExpanded(false);
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }
    };

    useEffect(() => {
        if (isKeyboardExpanded && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isKeyboardExpanded]);

    const handleRelayout = (event) => {
        if (event['xaxis.range[0]'] && event['xaxis.range[1]']) {
            setXRange([event['xaxis.range[0]'], event['xaxis.range[1]']]);
        }
        if (event['yaxis.range[0]'] && event['yaxis.range[1]']) {
            setYRange([event['yaxis.range[0]'], event['yaxis.range[1]']]);
        }
    };

    return (
        <div
            style={{ display: 'flex', height: '100vh' }}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            tabIndex={-1}
        >
            <div style={{ flex: '1', height: '100%', borderRight: '1px solid #ccc' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                        ref={inputRef}
                        className="focusable"
                        type="text"
                        placeholder="5*x + 1"
                        value={functionInput}
                        onChange={handleFunctionInputChange}
                        autoFocus
                        onKeyDown={(e) => e.stopPropagation()}
                        style={{ marginRight: '10px', padding: '10px', width: '80%', margin: '0' }}
                    />
                    <button
                        className="focusable"
                        onClick={handleAddFunction}
                        style={{
                            width: '20%',
                            padding: '10px',
                            backgroundColor: '#1a73e8',
                            color: '#fff',
                            margin: '0',
                        }}
                    >


                        +
                    </button>
                </div>
                {isFunctionListVisible && (
                    <FunctionList functions={functions} hiddenFunctions={hiddenFunctions} />
                )}
            </div>
            <div style={{ flex: '4', height: '100%', position: 'relative' }}>
                <Plot
                    data={plotData}
                    layout={{
                        autosize: true,
                        xaxis: {
                            range: xRange,
                            zeroline: true,
                            zerolinecolor: '#000',
                            fixedrange: false,
                        },
                        yaxis: {
                            scaleanchor: 'x',
                            scaleratio: 1,
                            range: yRange,
                            zeroline: true,
                            zerolinecolor: '#000',
                            fixedrange: false,
                        },
                    }}
                    useResizeHandler={true}
                    style={{ width: '100%', height: '100%' }}
                    onRelayout={handleRelayout}
                />
                {!isKeyboardExpanded && (
                    <button
                        className="focusable"
                        onClick={handleKeyboardButtonClick}
                        style={{
                            position: 'absolute',
                            top: '0px',
                            left: '0.5%',
                            padding: '10px',
                            fontSize: '14px',
                            backgroundColor: keyboardButtonColor,
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        <span role="img" aria-label="keyboard-icon">
                            ⌨️
                        </span>
                    </button>
                )}
            </div>
            {isKeyboardExpanded && (
                <div style={{ position: 'absolute', bottom: '0.05%', left: '1.5%', zIndex: '1'}}>
                    <MathKeyboard
                        inputRef={inputRef}
                        onKeyClick={(key) => setFunctionInput(functionInput + key)}
                    />
                    <div style={{ textAlign: 'center', paddingTop: '0.25%' }}>
            <span onClick={() => setIsKeyboardExpanded(false)} style={{ cursor: 'pointer' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1.5em" height="1.5em">
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M7 10l5 5 5-5H7z" />
                </svg>
            </span>
                    </div>
                </div>
            )}
        </div>
    );
};

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export default App;
