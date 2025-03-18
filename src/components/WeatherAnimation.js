import React, { useEffect, useRef } from 'react';
import { Application } from 'pixi.js';
import createSunAnimation from '../animations/createSunAnimation';
import createCloudAnimation from '../animations/createCloudAnimation';
import createRainAnimation from '../animations/createRainAnimation';
import createSnowAnimation from '../animations/createSnowAnimation';
import createWindAnimation from '../animations/createWindAnimation';
import createThunderAnimation from '../animations/createThunderAnimation';
import createFogAnimation from '../animations/createFogAnimation';
import createSunCloudAnimation from '../animations/createSunCloudAnimation';
import createMoonAndStarsAnimation from '../animations/createMoonAndStarsAnimation';

const WeatherAnimation = ({ weatherType, isNight }) => {
  const pixiContainer = useRef(null);
  const appRef = useRef(null);

  useEffect(() => {
    if (!pixiContainer.current) return;

    if (appRef.current) {
      appRef.current.destroy(true);
      appRef.current = null;
    }

    const app = new Application();
    app.init({ width: 200, height: 150, backgroundAlpha: 0 }).then(() => {
      if (!pixiContainer.current) return;
      pixiContainer.current.appendChild(app.canvas);
      appRef.current = app;

      if (isNight) {
        createMoonAndStarsAnimation(app);
      } else {
        const animationFunctions = {
          sun: createSunAnimation,
          cloudy: createCloudAnimation,
          sunwithcloud: createSunCloudAnimation,
          rain: createRainAnimation,
          snow: createSnowAnimation,
          wind: createWindAnimation,
          thunder: createThunderAnimation,
          fog: createFogAnimation,
        };

        animationFunctions[weatherType]?.(app);
      }
    });

    return () => {
      if (appRef.current) {
        appRef.current.destroy(true);
        appRef.current = null;
      }
    };
  }, [weatherType, isNight]);

  return <div ref={pixiContainer} className={isNight ? 'night-mode' : ''} />;
};

export default WeatherAnimation;
