import React, { useState, useEffect } from 'react';

const MathKeyboard = ({ onKeyClick }) => {
    const [expanded, setExpanded] = useState(true);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const handleKeyClick = (key) => {
        let expression = '';
        if (['sqrt', 'sin', 'cos', 'tan', 'ctg', 'ln', 'log'].includes(key)) {
            expression = `${key}(`;
        } else {
            expression = key;
        }
        onKeyClick(expression);
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

    // Calculate the width of each button dynamically based on the window width
    const buttonWidth = Math.floor((windowWidth / 5) * 0.8); // Divide by the number of buttons in a row

    const buttonStyle = {
        flex: '1',
        padding: '10px',
        fontSize: '16px',
        backgroundColor: '#ffffff',
        color: '#333333',
        border: '1px solid #cccccc',
        borderRadius: '5px',
        cursor: 'pointer',
        margin: '2px',
        width: `${buttonWidth}px` // Set the width dynamically
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', height: '100%' }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                padding: '10px',
                backgroundColor: '#f2f2f2',
                borderRadius: '10px',
                flex: expanded ? '1' : '0'
            }}>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    <button style={buttonStyle} onClick={() => handleKeyClick('x')}>x</button>
                    <button style={buttonStyle} onClick={() => handleKeyClick('y')}>y</button>
                    <button style={buttonStyle} onClick={() => handleKeyClick('ln( )')}>ln</button>
                    <button style={buttonStyle} onClick={() => handleKeyClick('log( )')}>log</button>
                    <button style={buttonStyle} onClick={() => handleKeyClick('cos( )')}>cos</button>
                </div>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    <button style={buttonStyle} onClick={() => handleKeyClick('(')}>(</button>
                    <button style={buttonStyle} onClick={() => handleKeyClick(')')}>)</button>
                    <button style={buttonStyle} onClick={() => handleKeyClick('<')}>{"<"}</button>
                    <button style={buttonStyle} onClick={() => handleKeyClick('>')}>{">"}</button>
                    <button style={buttonStyle} onClick={() => handleKeyClick('sin( )')}>sin</button>
                </div>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    <button style={buttonStyle} onClick={() => handleKeyClick('| |')}>|x|</button>
                    <button style={buttonStyle} onClick={() => handleKeyClick('<=')}>≤</button>
                    <button style={buttonStyle} onClick={() => handleKeyClick('>=')}>≥</button>
                    <button style={buttonStyle} onClick={() => handleKeyClick('=')}>=</button>
                    <button style={buttonStyle} onClick={() => handleKeyClick('tan( )')}>tan</button>
                </div>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    <button style={buttonStyle} onClick={() => handleKeyClick('sqrt( )')}>√</button>
                    <button style={buttonStyle} onClick={() => handleKeyClick('^')}>^</button>
                    <button style={buttonStyle} onClick={() => handleKeyClick('e')}>e</button>
                    <button style={buttonStyle} onClick={() => handleKeyClick('π')}>π</button>
                    <button style={buttonStyle} onClick={() => handleKeyClick('.')}>,</button>
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
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    <button style={buttonStyle} onClick={() => handleKeyClick('7')}>7</button>
                    <button style={buttonStyle} onClick={() => handleKeyClick('8')}>8</button>
                    <button style={buttonStyle} onClick={() => handleKeyClick('9')}>9</button>
                    <button style={buttonStyle} onClick={() => handleKeyClick('delete')}>del</button>
                </div>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    <button style={buttonStyle} onClick={() => handleKeyClick('4')}>4</button>
                    <button style={buttonStyle} onClick={() => handleKeyClick('5')}>5</button>
                    <button style={buttonStyle} onClick={() => handleKeyClick('6')}>6</button>
                    <button style={buttonStyle} onClick={() => handleKeyClick('*')}>*</button>
                </div>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    <button style={buttonStyle} onClick={() => handleKeyClick('1')}>1</button>
                    <button style={buttonStyle} onClick={() => handleKeyClick('2')}>2</button>
                    <button style={buttonStyle} onClick={() => handleKeyClick('3')}>3</button>
                    <button style={buttonStyle} onClick={() => handleKeyClick('-')}>-</button>
                </div>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    <button style={buttonStyle} onClick={() => handleKeyClick('0')}>0</button>
                    <button style={buttonStyle} onClick={() => handleKeyClick('=')}>=</button>
                    <button style={buttonStyle} onClick={() => handleKeyClick('+')}>+</button>
                    <button style={buttonStyle} onClick={() => handleKeyClick('/')}>/</button>
                </div>
            </div>
        </div>
    );
};

export default MathKeyboard;