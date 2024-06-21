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
    return (
        <div style={{ position: 'absolute', ...style }}>
            <button onClick={onZoomInX}>+ X</button>
            <button onClick={onZoomOutX}>- X</button>
            <button onClick={onZoomInY}>+ Y</button>
            <button onClick={onZoomOutY}>- Y</button>
            <button onClick={onResetZoom}>Reset</button>
        </div>
    );
};

export default ZoomControls;

