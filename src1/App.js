import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import MathKeyboard from './MathKeyboard';
import { evaluate } from 'mathjs';
import './styles.css'
import './index.css';
import ZoomControls, { handleZoomInX, handleZoomOutX, handleZoomInY, handleZoomOutY, handleResetZoom } from './ZoomControls';
//import parser from './parser';

function App() {
   const [functions, setFunctions] = useState([]);
   const [functionInput, setFunctionInput] = useState('');
   const [plotData, setPlotData] = useState([]);
   const [errorMessage, setErrorMessage] = useState('');
   const [xRange, setXRange] = useState([-100, 100]);
   const [yRange, setYRange] = useState([-100, 100]);
   const [isKeyboardExpanded, setIsKeyboardExpanded] = useState(false);
   const [hiddenFunctions, setHiddenFunctions] = useState([]);
   const [isFunctionListVisible, setIsFunctionListVisible] = useState(false);
   const [zoomX, setZoomX] = useState(1);
   const [zoomY, setZoomY] = useState(1);

   const calculatePlotData = () => {
       const traces = functions
           .filter((func, index) => !hiddenFunctions.includes(index))
           .map(({ func, color }, index) => {
               const xValues = [];
               const yValues = [];
               const step = 0.01;
               for (let x = xRange[0]; x <= xRange[1]; x += step) {
                   const replacedFunc = func.replace(/x/g, x).replace(/y/g, x);
                   const y = evaluate(replacedFunc);
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
                   name: `Function ${index + 1}`
                };
            });

       setPlotData(traces);
       setErrorMessage('');
   };

    const addFunction = () => {
    const newFunction = { func: functionInput, color: getRandomColor() };
    setFunctions([...functions, newFunction]);
    setFunctionInput('');
    setIsFunctionListVisible(true);
    calculatePlotData();
    };

    const editFunction = (index, editedFunction) => {
    const updatedFunctions = [...functions];
    updatedFunctions[index] = editedFunction;
    setFunctions(updatedFunctions);
    calculatePlotData();
    };

//   const addFunction = () => {
//    try {
//        //const parseTree = parser.get_parser().parse(functionInput);
//        const newFunction = { func: functionInput, color: getRandomColor() };
//        setFunctions([...functions, newFunction]);
//        setFunctionInput('');
//        calculatePlotData();
//    }
//    catch (error) {
//        setErrorMessage('Invalid funcyion syntax');
//    }
//  };

//   const editFunction = (index, editedFunction) => {
//    try{
//        //const parseTree = parser.get_parser().parse(editedFunction.func);
//        const updatedFunctions = [...functions];
//        updatedFunctions[index] = editedFunction;
//        setFunctions(updatedFunctions);
//        calculatePlotData();
//    }
//    catch (error){
//        setErrorMessage('Invalid function syntax');
//    }
        
//   };

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
   }, [functions, xRange, yRange, hiddenFunctions, zoomX, zoomY]);

   const layout = {
       width: '100%',
       height: '100%',
       xaxis: {
           title: '',
           range: [xRange[0] / zoomX, xRange[1] / zoomX],
           zeroline: true,
           zerolinecolor: '#000',
           zerolinewidth: 2,
           gridcolor: '#ddd',
           gridwidth: 1,
           tickangle: 0
       },
       yaxis: {
           title: '',
           range: [yRange[0] / zoomY, yRange[1] / zoomY],
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
           <div style={{ marginBottom: '20px', marginLeft: '10px' }}>
               <input
                   type="text"
                   placeholder="Enter function"
                   value={functionInput}
                   onChange={(e) => setFunctionInput(e.target.value)}
                   style={{ marginRight: '10px', padding: '10px', width: 'calc(100% - 120px)'}}
               />
               <button
                   onClick={addFunction}
                   style={{
                       padding: '10px 20px',
                       fontSize: '16px',
                       backgroundColor: '#1a73e8',
                       color: '#fff',
                       border: 'none',
                       borderRadius: '8px',
                       cursor: 'pointer'
                   }}
               >
                   Add
               </button>
               <button
                   onClick={() => setIsKeyboardExpanded(!isKeyboardExpanded)}
                   style={{
                       padding: '10px',
                       fontSize: '16px',
                       backgroundColor: '#1a73e8',
                       color: '#fff',
                       border: 'none',
                       borderRadius: '5px',
                       cursor: 'pointer'
                   }}
               >
                   <span role="img" aria-label="keyboard-icon">
                       ⌨️
                   </span>
               </button>
           </div>
           {isKeyboardExpanded &&
               <div style={{ position: 'fixed', bottom: '20px', left: '20px' }}>
                   <MathKeyboard onKeyClick={(key) => setFunctionInput(functionInput + key)} />
                   <div style={{ textAlign: 'center', paddingTop: '5px' }}>
                       <span onClick={() => setIsKeyboardExpanded(false)} style={{ cursor: 'pointer' }}>
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                               <path fill="none" d="M0 0h24v24H0z"/>
                               <path d="M7 10l5 5 5-5H7z"/>
                           </svg>
                       </span>
                   </div>
               </div>
           }
            <div className="plot-container">  
               <div style={{ position: 'absolute', top: 0, right: 0 }}>
                   <div style={{ width: '100%', height: '100%' }}>
                       <Plot
                           data={plotData}
                           layout={layout}
                       />
                   </div>
               </div>
            </div>
            <ZoomControls
                handleZoomInX={handleZoomInX}
                handleZoomOutX={handleZoomOutX}
                handleZoomInY={handleZoomInY}
                handleZoomOutY={handleZoomOutY}
                handleResetZoom={handleResetZoom}
            />

           <FunctionList
               functions={functions}
               hiddenFunctions={hiddenFunctions}
               onFunctionToggle={(index) => {
                   const updatedFunctions = [...hiddenFunctions];
                   if (updatedFunctions.includes(index)) {
                       updatedFunctions.splice(updatedFunctions.indexOf(index), 1);
                   } else {
                       updatedFunctions.push(index);
                   }
                   setHiddenFunctions(updatedFunctions);
               }}
               onFunctionEdit={editFunction}
           />
           {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
       </div>
   );
}

const FunctionList = ({ functions, hiddenFunctions, onFunctionToggle, onFunctionEdit }) => (
   <div style={{ marginTop: '20px' }}>
       <div style={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '5px', padding: '10px', width: 'auto', maxHeight: '200px', overflowY: 'auto' }}>
           {functions.map((func, index) => (
               <div key={index} style={{ padding: '5px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
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
                           justifyContent: 'center'
                       }}
                       onClick={() => onFunctionToggle(index)}
                   >
                       {hiddenFunctions.includes(index) && <span style={{ color: '#ddd', fontSize: '12px' }}>•</span>}
                   </div>
                   <span
                       style={{
                           fontStyle: hiddenFunctions.includes(index) ? 'italic' : 'normal',
                           textDecoration: hiddenFunctions.includes(index) ? 'line-through' : 'none'
                       }}
                       contentEditable={!hiddenFunctions.includes(index)}
                       suppressContentEditableWarning={true}
                       onBlur={(e) => onFunctionEdit(index, { ...func, func: e.target.textContent })}
                   >
                       {func.func}
                   </span>
               </div>
           ))}
       </div>
   </div>
);

export default App;
