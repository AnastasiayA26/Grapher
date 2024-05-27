
import React, { useState, useEffect, useRef } from 'react';
import Plot from 'react-plotly.js';
import MathKeyboard from './MathKeyboard.js';
//import { createSmartappDebugger, createAssistant } from '@salutejs/client';
import { evaluate } from 'mathjs';
import './styles.css';
import './index.css';
import { make_function } from './math_parser.js';

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

    useEffect(() => {
        calculatePlotData();
    }, [functions, hiddenFunctions, xRange, yRange]);

    // useEffect(() => {
    //     window.addFunction = addFunction;
    //     window.deleteFunction = deleteFunction;
    //     window.getFunctions = () => functions;
    //
    //     const handleAssistantData = (event) => {
    //         console.log('handleAssistantData:', event);
    //         const { action } = event;
    //         if (action) {
    //             switch (action.type) {
    //                 case 'add_math_function':
    //                     return addFunction(action.parameters.function);
    //                 case 'delete_math_function':
    //                     return deleteFunction(action.parameters.function);
    //                 case 'build_graph':
    //                     return buildGraph(action.parameters.exponential_and_logarithmic_functions);
    //                 default:
    //                     console.error('Unknown action type:', action.type);
    //             }
    //         }
    //     };
    //
    //     if (process.env.NODE_ENV === 'development') {
    //         const smartappDebuggerInstance = createSmartappDebugger({
    //             token: process.env.REACT_APP_TOKEN || '',
    //             initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP}`,
    //             getState,
    //             nativePanel: {
    //                 defaultText: 'ччччччч',
    //                 screenshotMode: false,
    //                 tabIndex: -1,
    //             },
    //         });
    //         smartappDebuggerInstance.on('data', handleAssistantData);
    //     } else {
    //         const assistantInstance = createAssistant({ getState });
    //         assistantInstance.on('data', handleAssistantData);
    //     }
    // }, [functions]);

    const calculatePlotData = () => {
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
    };

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
            const updatedHiddenFunctions = [...prevHiddenFunctions];
            const functionIndex = updatedHiddenFunctions.indexOf(index);
            if (functionIndex === -1) {
                updatedHiddenFunctions.push(index);
            } else {
                updatedHiddenFunctions.splice(functionIndex, 1);
            }
            return updatedHiddenFunctions;
        });
    };

    const handleKeyboardButtonClick = () => {
        setIsKeyboardExpanded(!isKeyboardExpanded);
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
                        type="text"
                        placeholder="Введите функцию"
                        value={functionInput}
                        onChange={handleFunctionInputChange}
                        autoFocus
                        onKeyDown={(e) => e.stopPropagation()}
                        style={{ marginRight: '10px', padding: '10px', width: '80%', margin: '0' }}
                    />
                    <button
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
                <div style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: '1' }}>
                    <MathKeyboard
                        inputRef={inputRef}
                        onKeyClick={(key) => setFunctionInput(functionInput + key)}
                    />
                    <div style={{ textAlign: 'center', paddingTop: '5px' }}>
                        <span onClick={() => setIsKeyboardExpanded(false)} style={{ cursor: 'pointer' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
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
