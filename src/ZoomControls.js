import React from 'react';

export const handleZoomInX = (setZoomX) => {
    setZoomX((prevZoom) => prevZoom * 1.5);
};

export const handleZoomInY = (setZoomY) => {
    setZoomY((prevZoom) => prevZoom * 1.5);
};

export const handleZoomOutX = (setZoomX) => {
    setZoomX((prevZoom) => prevZoom / 1.5);
};

export const handleZoomOutY = (setZoomY) => {
    setZoomY((prevZoom) => prevZoom / 1.5);
};

export const handleResetZoom = (setZoomX, setZoomY) => {
    setZoomX(1);
    setZoomY(1);
};

const ZoomControls = ({ onZoomInX, onZoomOutX, onZoomInY, onZoomOutY, onResetZoom, style }) => {
    const containerStyle = {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        ...style
    };
    const buttonStyle = {
        padding: '1.5vh 1.5vw', // Использование относительных единиц для подстройки под размер экрана
        fontSize: '1vw',
        flexShrink: 0, // предотвращение уменьшения размера кнопок при уменьшении контейнера
        backgroundColor: '#f1f1ee'
    };

    return (
        <div style={containerStyle}>
            <button onClick={onZoomInX} style={buttonStyle}>+ X</button>
            <button onClick={onZoomOutX} style={buttonStyle}>- X</button>
            <button onClick={onZoomInY} style={buttonStyle}>+ Y</button>
            <button onClick={onZoomOutY} style={buttonStyle}>- Y</button>
            <button onClick={onResetZoom} style={buttonStyle}>Reset</button>
        </div>
    );
};

export default ZoomControls;
