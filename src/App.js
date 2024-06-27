import React, { useState, useEffect, useRef } from 'react';
import Plot from 'react-plotly.js';
import MathKeyboard from './MathKeyboard.js';
import { createSmartappDebugger, createAssistant } from '@salutejs/client';
import 'normalize.css';
import './styles.css';
import './index.css';
//import './voice.css';
import './MathKeyboard.css';
import { ButtonGroup, Button } from "@mui/material";
//import ZoomControls from './ZoomControls.js';
import { make_function } from './math_parser.js';
import { useSpatnavInitialization, useSection, getCurrentFocusedElement } from '@salutejs/spatial';
const App = () => {
    const [functions, setFunctions] = useState([]);
    const [functionInput, setFunctionInput] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [xRange, setXRange] = useState([-100, 100]);
    const [yRange, setYRange] = useState([-100, 100]);
    const [isFunctionListVisible, setIsFunctionListVisible] = useState(false);
    const [hiddenFunctions, setHiddenFunctions] = useState([]);
    const [isKeyboardExpanded, setIsKeyboardExpanded] = useState(true);
    const [isHelpVisible, setIsHelpVisible] = useState(false); // State for help visibility
    const inputRef = useRef(null);
    const assistantRef = useRef(null);
    const addButtonRef = useRef(null);
    const functionListRef = useRef(null);
    const functionRefs = useRef([]);
    const colorRefs = useRef([]);
    const removeButtonRefs = useRef([]);
    const closeButtonRef = useRef(null);
    const zoomControlsRef = useRef(null);
    const buttonRefs = useRef([]);
    const [showError, setShowError] = useState(false);
    const [isErrorVisible, setIsErrorVisible] = useState(false);


    // Initialize buttonRefs
    useEffect(() => {
        buttonRefs.current = Array(37).fill(null).map((_, i) => buttonRefs.current[i] || React.createRef());
    }, []);

    useEffect(() => {
        if (isErrorVisible) {
            const timer = setTimeout(() => {
                setIsErrorVisible(false);
            }, 10000);

            // Очистка таймера, если компонент размонтируется раньше
            return () => clearTimeout(timer);
        }
    }, [isErrorVisible]);


    const [plotLayout, setPlotLayout] = useState({
        autosize: true,
        margin: { t: 50, r: 50, b: 50, l: 50 },
        xaxis: {
            zeroline: true,
            zerolinecolor: '#000',
            range: [-20, 20],
            tickfont: {
                size: (window.innerWidth < 1300) ? 16 : 30
            },  // Adjust tick font size for x-axis
            gridcolor: '#ababab', // Цвет линий сетки
            gridwidth: 1,
            color: '#ffffff',
        },
        yaxis: {
            zeroline: true,
            zerolinecolor: '#000',
            range: [-20, 20],
            tickfont: { size: (window.innerWidth < 1300) ? 16 : 30},  // Adjust tick font size for y-axis
            gridcolor: '#ababab', // Цвет линий сетки
            gridwidth: 1,
            color: '#ffffff',
        },

        paper_bgcolor: '#5e7ca4', // Цвет фона за пределами графика
        plot_bgcolor: '#5e7ca4'   // Цвет фона самой области графика

    });

    useEffect(() => {
        const handleResize = () => {
            setPlotLayout((prevLayout) => ({
                ...prevLayout,
                width: window.innerWidth * 0.67, // Примерное значение ширины графика
                height: window.innerHeight * 0.65, // Примерное значение высоты графика
            }));
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const handleZoomInX = () => {
        setPlotLayout(prevLayout => ({
            ...prevLayout,
            xaxis: {
                ...prevLayout.xaxis,
                range: [prevLayout.xaxis.range[0] * 0.8, prevLayout.xaxis.range[1] * 0.8]
            }
        }));
    };

    const handleZoomOutX = () => {
        setPlotLayout(prevLayout => ({
            ...prevLayout,
            xaxis: {
                ...prevLayout.xaxis,
                range: [prevLayout.xaxis.range[0] / 0.8, prevLayout.xaxis.range[1] / 0.8]
            }
        }));
    };

    const handleZoomInY = () => {
        setPlotLayout(prevLayout => ({
            ...prevLayout,
            yaxis: {
                ...prevLayout.yaxis,
                range: [prevLayout.yaxis.range[0] * 0.8, prevLayout.yaxis.range[1] * 0.8]
            }
        }));
    };

    const handleZoomOutY = () => {
        setPlotLayout(prevLayout => ({
            ...prevLayout,
            yaxis: {
                ...prevLayout.yaxis,
                range: [prevLayout.yaxis.range[0] / 0.8, prevLayout.yaxis.range[1] / 0.8]
            }
        }));
    };

    const handleResetZoom = () => {
        setPlotLayout((prevLayout) => ({
            ...prevLayout,
            xaxis: {
                ...prevLayout.xaxis,
                range: [-20, 20], // Reset x-axis range
            },
            yaxis: {
                ...prevLayout.yaxis,
                range: [-50, 50], // Reset y-axis range
            },
        }));
    };

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
        window.addMathFunction = (func, context) => {
            setFunctionInput(prev => prev + func);
        };
        window.buildMathFunction = (func) => {
            setFunctions(prevFunctions => [
                ...prevFunctions,
                { func: func, color: getRandomColor() }
            ]);
        };
        const getState = () => ({ functions });
        const assistant = initializeAssistant(getState);
        assistant.on('data', handleAssistantData);
    }, [functions]);

    useEffect(() => {
        if (isKeyboardExpanded && functionListRef.current) {
            functionListRef.current.focus();
        }
    }, [isKeyboardExpanded]);

    useEffect(() => {
        if (isHelpVisible && closeButtonRef.current) {
            closeButtonRef.current.focus();
        }
    }, [isHelpVisible]);

    const addMathFunction = (func) => {
        setFunctions((prevFunctions) => [
            ...prevFunctions,
            { func: func, color: getRandomColor() }
        ]);
    };

    const triggerAddFunctionButtonClick = () => {
        if (buttonRefs?.current[31]) {
            buttonRefs?.current[31].current.click();
        }
    };

    const handleAssistantData = (event) => {
        console.log('handleAssistantData: event', event);
        const { action } = event;
    
        /////////////////////////////////////////////
        if (action && action.type === 'build_math_function') {
          if (action.parameters && action.parameters.function) {
            const func = action.parameters.function;
            addMathFunction(func);
            //FunctionList(func);
        } 
          triggerAddFunctionButtonClick();
        }
        /////////////////////////////////////////////
        else if (action && action.parameters) {
          if (action.parameters.function) {
            const func = action.parameters.function;
            addMathFunction(func);
            triggerAddFunctionButtonClick();
          }
        } else {
          console.error('Action parameters or function is undefined:', action);
        }
    };

    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            buttonRefs?.current[0].focus();
        } else if (e.key === 'ArrowDown') {
            if (functions.length > 0) {
                functionRefs.current[0].focus();
            }
        } else if (e.key === 'ArrowRight') {
            if (buttonRefs.current[31] && buttonRefs.current[31].current) {
                buttonRefs.current[31].current.focus();
            }
        }
    };

    const handleAddFunctionKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleAddFunction();
        } else if (e.key === 'ArrowDown' && functionRefs.current.length > 0) {
            functionRefs.current[0].focus();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            inputRef.current.focus();
        } else if (e.key === 'ArrowRight') {
            if (buttonRefs?.current[1].current) {
                buttonRefs?.current[1].current.focus();
            } else if (zoomControlsRef.current) {
                zoomControlsRef.current.focus();
            } else if (addButtonRef.current) {
                buttonRefs?.current[0].focus();
            }
        }
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
            try {
                const newFunction = make_function(functionInput.trim());
                if (newFunction) {
                    console.log('Function created successfully:', functionInput);
                    setFunctions([...functions, { func: functionInput, color: getRandomColor() }]);
                    setFunctionInput('');
                    setErrorMessage('');
                    setIsErrorVisible(false); // Скрыть сообщение об ошибке
                } else {
                    console.log('Function creation returned undefined or null.');
                    setErrorMessage('Ошибка: функция не может быть построена.');
                    setIsErrorVisible(true); // Показать сообщение об ошибке
                }
            } catch (error) {
                console.log('Error during function creation:', error);
                setErrorMessage(``);


                setIsErrorVisible(true); // Показать сообщение об ошибке
            }
        } else {
            setErrorMessage('Введите функцию.');
            setIsErrorVisible(true); // Показать сообщение об ошибке
        }
    };

    const handleFunctionRemove = (index) => {
        setFunctions((prevFunctions) => prevFunctions.filter((_, i) => i !== index));
    };

    const FunctionList = ({functions, hiddenFunctions}) => (
        <div
            ref={functionListRef}
            style={{marginTop: '10px'}}
            tabIndex={-1}
        >
            <div
                style={{
                    backgroundColor: '#fff',
                    padding: '1vw',  // Используем относительную единицу измерения
                    width: '23vw',  // Ширина поля в процентах от ширины экрана
                    margin: '0',
                    borderRadius: '5px',
                    border: '1px solid black',
                    fontSize: '1.4vw',  // Размер шрифта в относительной единице измерения
                }}
            >
                {functions.map((func, index) => (
                    <div
                        key={index}
                        tabIndex={1}
                        ref={el => functionRefs.current[index] = el}
                        className="focusable"
                        style={{padding: '5px', display: 'flex', alignItems: 'center', cursor: 'pointer'}}
                        onKeyDown={(e) => handleFunctionKeyDown(e, index)}
                    >
                        <div
                            ref={(el) => colorRefs.current[index] = el}
                            style={{
                                width: '1.5vw',
                                height: '1.5vw',
                                color: '#fff',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: func.color,
                                marginRight: '0.5vw',
                                border: '1px solid #ddd',

                            }}
                            tabIndex={1}
                            onClick={() => handleFunctionToggle(index)}
                            onKeyDown={(e) => handleColorKeyDown(e, index)}
                        >
                            {hiddenFunctions.includes(index) && (
                                <span style={{color: '#ddd', fontSize: '12px'}}>•</span>
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
                                handleFunctionEdit(index, {...func, func: e.target.textContent})
                            }
                        >
                            {func.func}
                        </span>
                        <button
                            ref={(el) => removeButtonRefs.current[index] = el}
                            onClick={() => handleFunctionRemove(index)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'red',
                                cursor: 'pointer',
                                fontSize: '1.4vw'
                            }}
                            tabIndex={1}
                            onKeyDown={(e) => handleRemoveButtonKeyDown(e, index)}
                        >
                            ✖
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

    const handleFunctionKeyDown = (e, index) => {
        console.log(e);
        if (e.key === 'ArrowDown' && index < functions.length - 1) {
            e.preventDefault();
            colorRefs.current[index + 1].focus();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (index > 0) {
                colorRefs.current[index - 1].focus();
            } else {
                inputRef.current.focus();
            }
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            removeButtonRefs.current[index].focus();
        }
    };

    const handleColorKeyDown = (e, index) => {
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            removeButtonRefs.current[index].focus();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            functionRefs.current[index].focus();
        } else if (e.key === 'ArrowDown' && index < colorRefs.current.length - 1) {
            e.preventDefault();
            colorRefs.current[index + 1].focus();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (index > 0) {
                colorRefs.current[index - 1].focus();
            } else {
                inputRef.current.focus(); // Устанавливаем фокус на поле ввода
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            inputRef.current.focus(); // Устанавливаем фокус на поле ввода
            setHiddenFunctions((prevHiddenFunctions) => {
                if (prevHiddenFunctions.includes(index)) {
                    return prevHiddenFunctions.filter((i) => i !== index);
                } else {
                    return [...prevHiddenFunctions, index];
                }
            });
        }
    };

    const handleRemoveButtonKeyDown = (e, index) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            colorRefs.current[index].focus();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            functionRefs.current[index].focus();
        } else if (e.key === 'ArrowDown' && index < functions.length - 1) {
            e.preventDefault();
            colorRefs.current[index + 1].focus();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (index > 0) {
                colorRefs.current[index - 1].focus();
            } else {
                inputRef.current.focus();
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            setFunctions((prevFunctions) => {
                const updatedFunctions = prevFunctions.filter((_, i) => i !== index);
                if (index === 0) {
                    // If deleting the first function, set focus to inputRef.current
                    inputRef.current.focus();
                } else if (index === functions.length - 1) {
                    // If deleting the last function, set focus to the previous color button
                    colorRefs.current[index - 1].focus();
                } else {
                    // Otherwise, set focus to the next color button after deletion
                    colorRefs.current[index].focus();
                }
                return updatedFunctions;
            });
        }
    };

    const handleFunctionToggle = (index) => {
        setHiddenFunctions((prevHiddenFunctions) => {
            if (prevHiddenFunctions.includes(index)) {
                return prevHiddenFunctions.filter((i) => i !== index);
            } else {
                return [...prevHiddenFunctions, index];
            }
        });
    };

    const handleRelayout = (event) => {
        if (event['xaxis.range[0]'] && event['xaxis.range[1]']) {
            setXRange([event['xaxis.range[0]'], event['xaxis.range[1]']]);
        }
        if (event['yaxis.range[0]'] && event['yaxis.range[1]']) {
            setYRange([event['yaxis.range[0]'], event['yaxis.range[1]']]);
        }
    };


    const toggleHelpModal = (isOpen) => {
        setIsHelpVisible(isOpen);

        setTimeout(() => {
            if (isOpen && closeButtonRef.current) {
                closeButtonRef.current.focus();
            } else if (!isOpen) {
                if (buttonRefs?.current[32].current) {
                    buttonRefs?.current[32].current.focus();
                }
            }
        }, 0);
    };
    // Example usage
    const openHelp = () => toggleHelpModal(true);
    const closeHelp = () => toggleHelpModal(false);

    const handleHelpButtonKeyDown = (e) => {
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            if (zoomControlsRef.current) {
                const buttons = zoomControlsRef.current.querySelectorAll("button");
                if (buttons.length > 0) {
                    buttons[0].focus(); // Устанавливаем фокус на первую кнопку в контейнере
                }
            }
        }
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            if (buttonRefs.current[31] && buttonRefs.current[31].current) {
                buttonRefs.current[31].current.focus();
            }
        }
    }

    const generatePlotData = () => {
        return functions.map(({func, color}, index) => {
            if (hiddenFunctions.includes(index)) {
                return null;  // Если функция скрыта, возвращаем null
            }

            let f;
            try {
                f = make_function(func);
            } catch (error) {
                setErrorMessage(`Ошибка в функции: ${func}`);
                return null;
            }

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
                type: 'scatter',
                mode: 'lines',
                marker: {color},
                name: func
            };
        }).filter(data => data !== null);  // Исключаем null значения из возвращаемого массива
    };

    const isTouchDevice = () => {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    };

    const isSmartTV = () => {
        return /TV|SmartTV|AppleTV|GoogleTV|HbbTV|NetCast.TV/i.test(navigator.userAgent);
    };

    const handleTouchStart = (e) => {
        if (isTouchDevice() || isSmartTV()) {
            e.preventDefault(); // Prevent default touch event to avoid showing system keyboard
        }
    };

    const handleKeyZoom = (e) => {
        const buttons = zoomControlsRef.current.querySelectorAll("button");
        const currentButtonIndex = Array.from(buttons).findIndex(button => button === document.activeElement);
        switch (e.key) {
            case "ArrowLeft":
                if (currentButtonIndex > 0) {
                    buttons[currentButtonIndex - 1].focus();
                } else {
                    // Если текущий элемент - первая кнопка, фокусируемся на кнопке помощи
                    if (buttonRefs?.current[1].current) {
                        buttonRefs?.current[1].current.focus();
                    }
                }
                break;
            case "ArrowRight":
                if (currentButtonIndex < buttons.length - 1) {
                    buttons[currentButtonIndex + 1].focus();
                }
                break;
            default:
                break;
        }
    };

    const zoomButtonStyle = {
        padding: '0.1vw',
        width: '5vw',  // Adjust as needed
        backgroundColor: '#2f4c72',
        color: '#fff',
        border: 'none',
        fontSize: '1.2vw',  // Adjust as needed
    };
    const helpButtonStyle = {
        width: '3vw',
        height: '3vw',
        backgroundColor: '#2f4c72',
        color: '#fff',
        border: 'none',
        borderRadius: '50%',
        fontSize: '2vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    const helpModalStyle = {
        position: 'fixed',
        top: '35%',
        left: '25%',
        transform: 'translateY(-50%)',
        backgroundColor: '#e6f1fa',
        padding: '2vw',
        borderRadius: '8px',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
        zIndex: '999'
    };
    const ErrorModalStyle = {
        position: 'fixed',
        top: '28%',
        left: '25%',
        transform: 'translateY(-50%)',
        backgroundColor: '#f6cdd0',
        padding: '2vw',
        borderRadius: '8px',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
        zIndex: '999'
    };

    const helpModalTextStyle = {
        fontSize: '1.4vw'
    };

    return (
        <div style={{display: 'flex', height: '100vh'}}>
            <div className="app-container"
                 style={{flex: '1', height: 'auto', borderRight: '3px solid #ccc', flexDirection: 'column'}}>
                <div className="input-panel" style={{display: 'flex', alignItems: 'center'}}>
                    <input
                        tabIndex={30}
                        ref={inputRef}
                        type="text"
                        placeholder="5*x + 1"
                        value={functionInput}
                        onChange={handleFunctionInputChange}
                        onKeyDown={handleInputKeyDown}
                        onTouchStart={handleTouchStart}  // Prevent default touch event to avoid showing system keyboard
                        style={{
                            padding: '1vw',  // Используем относительную единицу измерения
                            width: '18vw',  // Ширина поля в процентах от ширины экрана
                            margin: '0',
                            border: '1px solid black',
                            fontSize: '1.4vw',  // Размер шрифта в относительной единице измерения
                        }}
                    />
                    <button
                        tabIndex={31}
                        ref={buttonRefs?.current[31]}
                        className="focusable"
                        onClick={handleAddFunction}
                        onKeyDown={handleAddFunctionKeyDown}
                        style={{
                            padding: '1vw',
                            width: '5vw',// Используем относительную единицу измерения
                            backgroundColor: '#2f4c72',
                            color: '#fff',
                            border: 'none',
                            fontSize: '1.4vw',  // Размер шрифта в относительной единице измерения
                        }}
                    >
                        +
                    </button>
                    {isErrorVisible && (
                            <div className="error-message-container" style={ErrorModalStyle}>
                                <p style={helpModalTextStyle}>{<div>
                                    <p style={helpModalTextStyle}>Ошибка: функция не может быть построена</p>
                                    <p style={helpModalTextStyle}>Проверьте правильность ввода:</p>
                                    <ul>
                                        <li style={helpModalTextStyle}>убедитесь, что используете знак * для умножения</li>
                                        <li style={helpModalTextStyle}>проверьте отсутствие символа "=" в выражении</li>
                                    </ul>
                                    <p style={helpModalTextStyle}>Пример записи: cos(3*x - 1)</p>
                                </div>}</p>
                            </div>
                        )}
                </div>
                {isFunctionListVisible && (
                    <FunctionList functions={functions} hiddenFunctions={hiddenFunctions}/>
                )}
            </div>
            <div style={{padding: '3px', position: 'relative', top: '1px', zIndex: '2'}}>
    <span onClick={openHelp} style={{cursor: 'pointer'}}>
        <button
            tabIndex={32}
            ref={buttonRefs?.current[32]}
            style={helpButtonStyle}
            onKeyDown={handleHelpButtonKeyDown}
        >
            ?
        </button>
    </span>
                {/* Модальное окно справки */}
                {isHelpVisible && (
                    <div
                        className="help-modal"
                        style={helpModalStyle}
                    >
                        <h4 style={helpModalTextStyle}>Справка</h4>
                        <p style={helpModalTextStyle}>Приложение позволяет строить графики математических функций</p>
                        <ol>
                            <strong style={helpModalTextStyle}>Добавление функций:</strong>
                            <ul>
                                <li style={helpModalTextStyle}>Необходимо ввести математическое выражение в поле c 5*x + 1 и
                                    нажмите кнопку <span className="button">+</span></li>
                                <li style={helpModalTextStyle}>Примеры: 5*x + 1, sin(3*x)</li>
                            </ul>
                            <strong style={helpModalTextStyle}>Управление функциями:</strong>
                            <ul>
                                <li style={helpModalTextStyle}>Для скрытия/отображения функции необходимо кликнуть на маркер
                                    окрашенного круга рядом с функцией
                                </li>
                                <li style={helpModalTextStyle}>Для удаления функции необходимо нажать на крестик в списке функций
                                </li>
                            </ul>
                            <strong style={helpModalTextStyle}>Изменение масштаба графика:</strong>
                            <ul>
                                <li style={helpModalTextStyle}>Используются манипуляторы на графике для изменения
                                    масштаба по осям X и Y
                                </li>
                            </ul>
                        </ol>
                        <button
                            ref={closeButtonRef}
                            onClick={closeHelp}
                            style={{
                                padding: '1vw',
                                backgroundColor: '#2f4c72',
                                color: '#fff',
                                border: 'none',
                                cursor: 'pointer',
                                borderRadius: '4px',
                                marginTop: '1vw',
                                fontSize: '1.4vw' // Размер шрифта для кнопки "Закрыть"
                            }}
                        >
                            Закрыть
                        </button>
                    </div>
                )}
            </div>
            <div className="plot-panel" style={{flex: '3', padding: '10px'}}>
                <Plot
                    data={generatePlotData()}
                    layout={plotLayout}
                    config={{displayModeBar: false}}
                    style={{width: '100%', height: '100%'}
                    }
                />
                <div
                    ref={zoomControlsRef}
                    tabIndex={-1}
                    onKeyDown={handleKeyZoom}
                    style={{
                        position: 'absolute',
                        width: '60%',
                        top: '0%',
                        right: '1.5%',
                        // backgroundColor: "#90a4c0",

                    }}
                >
                    <ButtonGroup variant="contained" aria-label="Basic button group" size="large">
                        <Button ref={buttonRefs?.current[33]} tabIndex={33} onClick={handleZoomInX} style={zoomButtonStyle}>+ X</Button>
                        <Button ref={buttonRefs?.current[34]} tabIndex={34} onClick={handleZoomOutX} style={zoomButtonStyle}>- X</Button>
                        <Button ref={buttonRefs?.current[35]} tabIndex={35} onClick={handleZoomInY} style={zoomButtonStyle}>+ Y</Button>
                        <Button ref={buttonRefs?.current[36]} tabIndex={36} onClick={handleZoomOutY} style={zoomButtonStyle}>- Y</Button>
                        <Button ref={buttonRefs?.current[37]} tabIndex={37} onClick={handleResetZoom} style={zoomButtonStyle}>Reset</Button>

                    </ButtonGroup>
                </div>
            </div>
            {
                isKeyboardExpanded && (
                    <div
                        style={{position: 'absolute', bottom: '0.05%', zIndex: '1'}}>
                        <MathKeyboard
                            functionInput={functionInput}
                            setFunctionInput={setFunctionInput}
                            tabIndex={-1}
                            inputRef={inputRef}
                            buttonRefs={buttonRefs}
                            onKeyClick={(key) => setFunctionInput(functionInput => functionInput + key)}
                        />
                        <div style={{textAlign: 'center', paddingTop: '0.25%'}}>
                        <span onClick={() => setIsKeyboardExpanded(false)} style={{cursor: 'pointer'}}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 40 20 24" width="3.5em" height="13.0em">
                                <path fill="none" d="M0 0h24v24H0z"/>
                                <path d="M7 10l5 5 5-5H7z"/>
                            </svg>
                        </span>
                        </div>
                    </div>
                )
            }
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


