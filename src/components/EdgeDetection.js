// src/components/EdgeDetection.js
/* global cv */

import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';

const EdgeDetection = () => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadOpenCV = async () => {
            await new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = '/opencv.js';
                script.onload = () => {
                    setIsLoaded(true);
                    resolve();
                };
                document.body.appendChild(script);
            });
        };

        loadOpenCV();
    }, []);

    useEffect(() => {
        if (isLoaded) {
            const interval = setInterval(() => {
                detectEdges();
            }, 100); // Adjust the interval for performance

            return () => clearInterval(interval);
        }
    }, [isLoaded]);

    const detectEdges = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
            const img = new Image();
            img.src = imageSrc;
            img.onload = () => {
                const mat = cv.imread(img);
                const edges = new cv.Mat();
                cv.cvtColor(mat, mat, cv.COLOR_RGBA2GRAY); // Convert to grayscale
                cv.Canny(mat, edges, 100, 200); // Edge detection
                cv.imshow(canvasRef.current, edges); // Show edges in canvas
                mat.delete(); // Clean up
                edges.delete(); // Clean up
            };
        }
    };

    return (
        <div>
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                style={{ display: 'none' }} // Hide the webcam feed
            />
            <canvas ref={canvasRef} />
        </div>
    );
};

export default EdgeDetection;
