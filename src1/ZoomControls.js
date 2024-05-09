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

const ZoomControls = ({ handleZoomInX, handleZoomOutX, handleZoomInY, handleZoomOutY, handleResetZoom }) => {
    return (
        <div style={{ marginTop: '20px', marginLeft: '10px', zIndex: 10 }}>
            <button className="custom-button" onClick={handleZoomInX}>Zoom In X</button>
            <button className="custom-button" onClick={handleZoomOutX}>Zoom Out X</button>
            <button className="custom-button" onClick={handleZoomInY}>Zoom In Y</button>
            <button className="custom-button" onClick={handleZoomOutY}>Zoom Out Y</button>
            <button className="custom-button" onClick={handleResetZoom}>Reset Zoom</button>
        </div>
    );
};

export default ZoomControls;

