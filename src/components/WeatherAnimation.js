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
  const containerRef = useRef(null);
  const appRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (appRef.current) {
      appRef.current.destroy(true);
      appRef.current = null;
    }

    const setup = async () => {
      const app = new Application();
      await app.init({
        width: 200,
        height: 150,
        backgroundAlpha: 0,
      });

      containerRef.current.appendChild(app.canvas);
      appRef.current = app;

      if (isNight) {
        createMoonAndStarsAnimation(app);
      } else {
        const map = {
          sun: createSunAnimation,
          cloudy: createCloudAnimation,
          sunwithcloud: createSunCloudAnimation,
          rain: createRainAnimation,
          snow: createSnowAnimation,
          wind: createWindAnimation,
          thunder: createThunderAnimation,
          fog: createFogAnimation,
        };
        map[weatherType]?.(app);
      }
    };

    setup();

    return () => {
      if (appRef.current) {
        appRef.current.destroy(true);
        appRef.current = null;
      }
    };
  }, [weatherType, isNight]);

  return <div ref={containerRef} className={isNight ? 'night-mode' : ''} />;
};

export default WeatherAnimation;
