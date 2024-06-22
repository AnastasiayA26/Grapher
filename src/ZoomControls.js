import React, { useRef } from 'react';

//     const handleKeyZoom = (e) => {
//         switch (e.key) {
//             case 'ArrowLeft':
//                 // Focus on the previous button
//                 if (zoomControlsRef.current) {
//                     const currentButtonIndex = document.activeElement.tabIndex;
//                     if (currentButtonIndex > 0) {
//                         zoomControlsRef.current.children[currentButtonIndex - 1].focus();
//                     }
//                 }
//                 break;
//             case 'ArrowRight':
//                 // Focus on the next button
//                 if (zoomControlsRef.current) {
//                     const currentButtonIndex = document.activeElement.tabIndex;
//                     if (currentButtonIndex < zoomControlsRef.current.children.length - 1) {
//                         zoomControlsRef.current.children[currentButtonIndex + 1].focus();
//                     }
//                 }
//                 break;
//             default:
//                 break;
//         }
//     };

//     return (
//         <div
//             ref={zoomControlsRef}
//             tabIndex={-1}
//             style={{ display: 'flex', position: 'absolute', ...style }}
//             onKeyDown={handleKeyZoom}
//         >
//             <button tabIndex={0} onClick={handleZoomInX}>+ X</button>
//             <button tabIndex={1} onClick={handleZoomOutX}>- X</button>
//             <button tabIndex={2} onClick={handleZoomInY}>+ Y</button>
//             <button tabIndex={3} onClick={handleZoomOutY}>- Y</button>
//             <button tabIndex={4} onClick={handleResetZoom}>Reset</button>
//         </div>
//     );
// };


const ZoomControls = ({ onZoomInX, onZoomOutX, onZoomInY, onZoomOutY, onResetZoom, style }) => {
    const containerStyle = {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        ...style
    };
    const zoomControlsRef = useRef(null);
    const buttonStyle = {
        padding: '1.5vh 1.5vw', // Использование относительных единиц для подстройки под размер экрана
        fontSize: '1vw',
        flexShrink: 0, // предотвращение уменьшения размера кнопок при уменьшении контейнера
        backgroundColor: '#f1f1ee'
    };
    
    const handleZoomInX = () => {
        if (onZoomInX) {
            onZoomInX();
        }
    };

    const handleZoomOutX = () => {
        if (onZoomOutX) {
            onZoomOutX();
        }
    };

    const handleZoomInY = () => {
        if (onZoomInY) {
            onZoomInY();
        }
    };

    const handleZoomOutY = () => {
        if (onZoomOutY) {
            onZoomOutY();
        }
    };

    const handleResetZoom = () => {
        if (onResetZoom) {
            onResetZoom();
        }
    };
    
    const handleKeyZoom = (e) => {
        switch (e.key) {
            case 'ArrowLeft':
                // Focus on the previous button
                if (zoomControlsRef.current) {
                    const currentButtonIndex = document.activeElement.tabIndex;
                    if (currentButtonIndex > 0) {
                        zoomControlsRef.current.children[currentButtonIndex - 1].focus();
                    }
                }
                break;
            case 'ArrowRight':
                // Focus on the next button
                if (zoomControlsRef.current) {
                    const currentButtonIndex = document.activeElement.tabIndex;
                    if (currentButtonIndex < zoomControlsRef.current.children.length - 1) {
                        zoomControlsRef.current.children[currentButtonIndex + 1].focus();
                    }
                }
                break;
            default:
                break;
        }
    };

    return (
        <div
            ref={zoomControlsRef}
            tabIndex={-1}
            onKeyDown={handleKeyZoom} 
            style={containerStyle}
        >
            <button tabIndex={0} onClick={handleZoomInX} style={buttonStyle}>+ X</button>
            <button tabIndex={1} onClick={handleZoomOutX} style={buttonStyle}>- X</button>
            <button tabIndex={2} onClick={handleZoomInY} style={buttonStyle}>+ Y</button>
            <button tabIndex={3} onClick={handleZoomOutY} style={buttonStyle}>- Y</button>
            <button tabIndex={4} onClick={handleResetZoom} style={buttonStyle}>Reset</button>
        </div>
    );
};

export default ZoomControls;
