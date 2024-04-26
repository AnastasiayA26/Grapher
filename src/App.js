import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import MathKeyboard from './MathKeyboard';

function App() {
    const [functions, setFunctions] = useState([]);
    const [functionInput, setFunctionInput] = useState('');
    const [plotData, setPlotData] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [xRange, setXRange] = useState([-100, 100]);
    const [yRange, setYRange] = useState([-100, 100]);

    const calculatePlotData = () => {
        try {
            if (functionInput.trim() === '') {
                setErrorMessage('Введите функцию');
                return;
            }

            const newFunctions = [...functions, { func: functionInput, color: getRandomColor() }];
            setFunctions(newFunctions);

            const traces = newFunctions.map(({ func, color }, index) => {
                const xValues = [];
                const yValues = [];
                const step = 0.01; // Уменьшаем шаг для более плотного распределения точек

                for (let x = xRange[0]; x <= xRange[1]; x += step) {
                    const y = eval(func.replace('x', x));
                    xValues.push(x);
                    yValues.push(y);
                }

                return {
                    x: xValues,
                    y: yValues,
                    mode: 'lines',
                    type: 'scatter',
                    line: {
                        color: color,
                        width: 2
                    },
                    name: `Функция ${index + 1}`
                };
            });

            setPlotData(traces);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Неверная функция');
        }
    };


    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    useEffect(() => {
        calculatePlotData();
    }, [functions]); // Пересчитываем графики при изменении списка функций

    const layout = {
        width: 800,
        height: 600,
        xaxis: {
            title: '',
            range: xRange,
            zeroline: true,
            zerolinecolor: '#000',
            zerolinewidth: 2,
            gridcolor: '#ddd',
            gridwidth: 1,
            tickangle: 0 // Устанавливаем угол подписей делений по оси X
        },
        yaxis: {
            title: '',
            range: yRange,
            zeroline: true,
            zerolinecolor: '#000',
            zerolinewidth: 2,
            gridcolor: '#ddd',
            gridwidth: 1
        },
        autosize: true,
        legend: {
            x: 0,
            y: 1,
            xanchor: 'left',
            yanchor: 'top'
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Введите функцию"
                    value={functionInput}
                    onChange={(e) => setFunctionInput(e.target.value)}
                    style={{ marginRight: '10px', padding: '10px' }}
                />
                <button
                    onClick={() => {
                        setFunctionInput('');
                        calculatePlotData();
                    }}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        backgroundColor: '#1a73e8',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Добавить функцию
                </button>
            </div>
            <div style={{ width: '800px', height: '600px', marginBottom: '20px' }}>
                <Plot
                    data={plotData}
                    layout={layout}
                    onRelayout={(event) => {
                        if (event['xaxis.range[0]'] && event['xaxis.range[1]']) {
                            setXRange([event['xaxis.range[0]'], event['xaxis.range[1]']]);
                        }
                        if (event['yaxis.range[0]'] && event['yaxis.range[1]']) {
                            setYRange([event['yaxis.range[0]'], event['yaxis.range[1]']]);
                        }
                    }}
                />
            </div>
            <MathKeyboard onKeyClick={(key) => setFunctionInput(functionInput + key)} />
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
}

export default App;
