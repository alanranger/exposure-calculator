// Wait for React and ReactDOM to load
document.addEventListener('DOMContentLoaded', function() {
  const { React, ReactDOM } = window;
  const { useState, useEffect, useCallback, useRef } = React;
  
  // Scene image URLs
  const sceneImageUrls = {
    landscape: {
      dawn: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&h=450&fit=crop&q=80",
      sunrise: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&h=450&fit=crop&q=80",
      midday: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=450&fit=crop&q=80",
      sunset: "https://images.unsplash.com/photo-1472120435266-53107fd0c44a?w=800&h=450&fit=crop&q=80",
      dusk: "https://images.unsplash.com/photo-1490682143684-14369e18dce8?w=800&h=450&fit=crop&q=80",
      night: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=800&h=450&fit=crop&q=80"
    },
    cityscape: {
      dawn: "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800&h=450&fit=crop&q=80",
      sunrise: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=450&fit=crop&q=80",
      midday: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=450&fit=crop&q=80",
      sunset: "https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=800&h=450&fit=crop&q=80",
      dusk: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&h=450&fit=crop&q=80",
      night: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&h=450&fit=crop&q=80"
    },
    forest: {
      dawn: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&h=450&fit=crop&q=80",
      sunrise: "https://images.unsplash.com/photo-1511497584788-876760111969?w=800&h=450&fit=crop&q=80",
      midday: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&h=450&fit=crop&q=80",
      sunset: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&h=450&fit=crop&q=80",
      dusk: "https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?w=800&h=450&fit=crop&q=80",
      night: "https://images.unsplash.com/photo-1516214104703-d870798883c5?w=800&h=450&fit=crop&q=80"
    },
    portrait: {
      dawn: "https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=800&h=450&fit=crop&q=80",
      sunrise: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=450&fit=crop&q=80",
      midday: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=450&fit=crop&q=80",
      sunset: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop&q=80",
      dusk: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=800&h=450&fit=crop&q=80",
      night: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=450&fit=crop&q=80"
    },
    wildlife: {
      dawn: "https://images.unsplash.com/photo-1484406566174-9da000fda645?w=800&h=450&fit=crop&q=80",
      sunrise: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&h=450&fit=crop&q=80",
      midday: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=800&h=450&fit=crop&q=80",
      sunset: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&h=450&fit=crop&q=80",
      dusk: "https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?w=800&h=450&fit=crop&q=80",
      night: "https://images.unsplash.com/photo-1566159196870-56191d4c2971?w=800&h=450&fit=crop&q=80"
    },
    sports: {
      dawn: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&h=450&fit=crop&q=80",
      sunrise: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=450&fit=crop&q=80",
      midday: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=450&fit=crop&q=80",
      sunset: "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=800&h=450&fit=crop&q=80",
      dusk: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=800&h=450&fit=crop&q=80",
      night: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=450&fit=crop&q=80"
    }
  };

  // Reference settings for midday
  const REFERENCE_APERTURE = 5.6;
  const REFERENCE_ISO = 100;
  const REFERENCE_SHUTTER_SPEED = 1 / 2000;
  const REFERENCE_EV = 12;

  // Auto ISO settings
  const MIN_SHUTTER_SPEED = 1 / 60; // Minimum shutter speed for auto ISO
  const MAX_AUTO_ISO = 102400; // Maximum ISO for auto ISO

  // Standard photographic stops with 1/3 increments
  const standardApertures = [
    1.4, 1.6, 1.8, 2, 2.2, 2.5, 2.8, 3.2, 3.5, 4, 4.5, 5.0, 5.6, 6.3, 7.1, 8, 9, 10, 11, 13, 14, 16, 18, 20, 22, 25, 29, 32
  ];

  // Shutter speeds in seconds (1/x for most values)
  // Order from slowest (30") to fastest (1/8000)
  const standardShutterSpeeds = [
    30, 25, 20, 15, 13, 10, 8, 6, 5, 4, 3.2, 2.5, 2, 1.6, 1.3, 1, 0.8, 0.6, 0.5, 0.4, 0.3, 1/4, 1/5, 1/6, 1/8, 1/10, 1/13, 1/15, 1/20, 1/25, 1/30, 1/40, 1/50, 1/60, 1/80, 1/100, 1/125, 1/160, 1/200, 1/250, 1/320, 1/400, 1/500, 1/640, 1/800, 1/1000, 1/1250, 1/1600, 1/2000, 1/2500, 1/3200, 1/4000, 1/5000, 1/6400, 1/8000
  ];

  // ISO values with 1/3 increments
  const standardIsoValues = [
    50, 64, 80, 100, 125, 160, 200, 250, 320, 400, 500, 640, 800, 1000, 1250, 1600, 2000, 2500, 3200, 4000, 5000, 6400, 8000, 10000, 12800, 16000, 20000, 25600, 32000, 40000, 51200, 64000, 80000, 102400
  ];

  // Helper function to get EV for time of day
  const getEvForTimeOfDay = (time) => {
    const evValues = {
      dawn: -3,
      sunrise: -1,
      midday: 12,
      sunset: -1,
      dusk: -3,
      night: -12,
    };
    return evValues[time] || 12;
  };

  // Helper function to format shutter speed
  const formatShutterSpeed = (shutterSpeed) => {
    if (shutterSpeed >= 1) {
      return `${shutterSpeed}"`;
    } else {
      return `1/${Math.round(1 / shutterSpeed)}s`;
    }
  };

  // Helper function to find the closest index in an array
  const findClosestIndex = (array, target) => {
    let closestIndex = 0;
    let minDiff = Number.POSITIVE_INFINITY;

    for (let i = 0; i < array.length; i++) {
      const diff = Math.abs(array[i] - target);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    }

    return closestIndex;
  };

  // Helper function to calculate stops difference between apertures
  const getApertureStopsDifference = (aperture1, aperture2) => {
    return 2 * Math.log2(aperture2 / aperture1);
  };

  // Helper function to calculate stops difference between shutter speeds
  const getShutterStopsDifference = (shutter1, shutter2) => {
    return Math.log2(shutter2 / shutter1);
  };

  // Helper function to calculate stops difference between ISO values
  const getIsoStopsDifference = (iso1, iso2) => {
    return Math.log2(iso2 / iso1);
  };

  // Helper function for log base 2
  const log2 = (x) => Math.log(x) / Math.log(2);

  // Component for the header
  function Header() {
    return React.createElement('header', { className: 'bg-white shadow-sm' },
      React.createElement('div', { className: 'container mx-auto px-4 py-4 flex items-center justify-between' },
        React.createElement('div', { className: 'flex items-center' },
          React.createElement('div', null,
            React.createElement('h1', { className: 'text-2xl font-bold text-gray-800' }, 'Outdoor Photography Exposure Calculator'),
            React.createElement('p', { className: 'text-gray-600' },
              'Visualise and calculate exposure settings for your outdoor photography.',
              React.createElement('br', null),
              React.createElement('span', { className: 'text-xs text-gray-500' },
                'For educational purposes only - real life light and situations may vary'
              )
            )
          )
        ),
        React.createElement('div', { className: 'text-right' },
          React.createElement('div', { className: 'text-sm font-semibold text-green-600' }, 'Version 1.1s'),
          React.createElement('div', { className: 'text-xs text-gray-500' }, 'April 3, 2025')
        )
      )
    );
  }

  // Component for scene selector
  function SceneSelector({ sceneType, timeOfDay, onSceneTypeChange, onTimeOfDayChange }) {
    const timeOptions = ["dawn", "sunrise", "midday", "sunset", "dusk", "night"];

    return React.createElement('div', { className: 'space-y-4' },
      React.createElement('div', null,
        React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Scene Type'),
        React.createElement('select', { 
          className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500',
          value: sceneType, 
          onChange: (e) => onSceneTypeChange(e.target.value) 
        },
          React.createElement('option', { value: 'landscape' }, 'Landscape'),
          React.createElement('option', { value: 'cityscape' }, 'Cityscape'),
          React.createElement('option', { value: 'forest' }, 'Forest'),
          React.createElement('option', { value: 'portrait' }, 'Portrait'),
          React.createElement('option', { value: 'wildlife' }, 'Wildlife'),
          React.createElement('option', { value: 'sports' }, 'Sports')
        )
      ),
      React.createElement('div', null,
        React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Time of Day'),
        React.createElement('select', { 
          className: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500',
          value: timeOfDay, 
          onChange: (e) => onTimeOfDayChange(e.target.value) 
        },
          timeOptions.map((time) => (
            React.createElement('option', { key: time, value: time },
              time.charAt(0).toUpperCase() + time.slice(1)
            )
          ))
        )
      )
    );
  }

  // Component for photography tips
  function PhotographyTips({ setting, value }) {
    const getTip = () => {
      if (setting === "iso") {
        if (value <= 200) {
          return "Low ISO: Best for bright conditions. Produces clean images with minimal noise.";
        } else if (value <= 800) {
          return "Medium ISO: Good for normal lighting. Balanced between noise and sensitivity.";
        } else if (value <= 3200) {
          return "High ISO: Use in low light. May introduce noise but allows faster shutter speeds.";
        } else {
          return "Very high ISO: For extremely low light. Will introduce significant noise but enables shooting in near darkness.";
        }
      } else if (setting === "aperture") {
        if (value <= 2.8) {
          return "Wide aperture: Creates shallow depth of field. Great for portraits and isolating subjects.";
        } else if (value <= 8) {
          return "Medium aperture: Good all-around choice. Balances depth of field and sharpness.";
        } else if (value <= 16) {
          return "Narrow aperture: Creates deep depth of field. Ideal for landscapes where everything should be in focus.";
        } else {
          return "Very narrow aperture: Maximum depth of field. Be aware of diffraction which may reduce overall sharpness.";
        }
      } else if (setting === "shutter") {
        if (value <= 60) {
          return "Slow shutter: Captures motion blur. Good for creative effects like flowing water or light trails.";
        } else if (value <= 500) {
          return "Medium shutter: Good all-around choice for most situations. Freezes casual movement.";
        } else {
          return "Fast shutter: Freezes fast action. Ideal for sports, wildlife, and capturing split-second moments.";
        }
      }
      return "";
    };

    return React.createElement('div', { className: 'mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-md' }, getTip());
  }

  // Main ExposureCalculator component
  function ExposureCalculator() {
    // Scene settings
    const [sceneType, setSceneType] = useState("landscape");
    const [timeOfDay, setTimeOfDay] = useState("midday");

    // Camera settings
    const [apertureIndex, setApertureIndex] = useState(12); // f/5.6
    const [shutterSpeedIndex, setShutterSpeedIndex] = useState(48); // 1/2000s
    const [isoIndex, setIsoIndex] = useState(3); // ISO 100
    const [autoIso, setAutoIso] = useState(false);

    // Derived camera settings
    const aperture = standardApertures[apertureIndex];
    const shutterSpeed = standardShutterSpeeds[shutterSpeedIndex];
    const iso = standardIsoValues[isoIndex];

    // Exposure mode
    const [exposureMode, setExposureMode] = useState("aperture"); // aperture, shutter, manual

    // Calculated exposure value
    const [ev, setEv] = useState(12); // Default to midday EV
    const [exposureCorrect, setExposureCorrect] = useState(true);

    // Debug mode
    const [debugMode, setDebugMode] = useState(false);

    // Calculate the actual EV from camera settings
    const calculateActualEv = useCallback((apertureValue, shutterValue, isoValue) => {
      const OFFSET = -3.94;
      return log2((apertureValue * apertureValue) / shutterValue) + log2(100 / isoValue) + OFFSET;
    }, []);

    // Effect to handle time of day changes
    useEffect(() => {
      // Set the EV based on the time of day
      const newEv = getEvForTimeOfDay(timeOfDay);
      setEv(newEv);
    }, [timeOfDay]);

    // Calculate exposure correctness
    useEffect(() => {
      // Calculate the actual EV from current camera settings
      const actualEv = calculateActualEv(aperture, shutterSpeed, iso);

      // Check if current settings match the scene's required EV
      const evDifference = actualEv - ev;
      setExposureCorrect(Math.abs(evDifference) < 0.5);
    }, [aperture, shutterSpeed, iso, ev, calculateActualEv]);

    // Custom handler for scene type and time of day changes
    const handleSceneTypeChange = (value) => {
      setSceneType(value);
    };

    const handleTimeOfDayChange = (value) => {
      setTimeOfDay(value);
    };

    // Toggle debug mode
    const toggleDebugMode = () => {
      setDebugMode(!debugMode);
    };

    // Format the current shutter speed for display
    const displayShutterSpeed = formatShutterSpeed(shutterSpeed);

    // Calculate the actual EV from current camera settings
    const calculatedEv = calculateActualEv(aperture, shutterSpeed, iso);

    // For exposure tips, we want ev - calculatedEv
    const exposureDifference = ev - calculatedEv;

    // Handle exposure mode changes
    const handleExposureModeChange = (value) => {
      setExposureMode(value);
    };

    return React.createElement('div', { className: 'min-h-screen bg-gray-50' },
      React.createElement(Header, null),
      React.createElement('main', { className: 'container mx-auto px-4 py-8' },
        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-6' },
          // Left Column - Scene Settings and Exposure Controls
          React.createElement('div', { className: 'space-y-6' },
            // Scene Settings
            React.createElement('div', { className: 'bg-white p-6 rounded-lg shadow-sm' },
              React.createElement('h2', { className: 'text-xl font-bold mb-4' }, 'Scene Settings'),
              React.createElement('div', { className: 'space-y-4' },
                React.createElement(SceneSelector, {
                  sceneType: sceneType,
                  timeOfDay: timeOfDay,
                  onSceneTypeChange: handleSceneTypeChange,
                  onTimeOfDayChange: handleTimeOfDayChange
                })
              )
            ),
            // Exposure Controls
            React.createElement('div', { className: 'bg-white p-6 rounded-lg shadow-sm' },
              React.createElement('div', { className: 'flex justify-between items-center mb-4' },
                React.createElement('h2', { className: 'text-xl font-bold' }, 'Exposure Controls'),
                React.createElement('div', { className: 'flex border rounded-md overflow-hidden' },
                  React.createElement('button', { 
                    className: `px-3 py-1 ${exposureMode === 'aperture' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`,
                    onClick: () => handleExposureModeChange('aperture')
                  }, 'A/AV'),
                  React.createElement('button', { 
                    className: `px-3 py-1 ${exposureMode === 'shutter' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`,
                    onClick: () => handleExposureModeChange('shutter')
                  }, 'S/TV'),
                  React.createElement('button', { 
                    className: `px-3 py-1 ${exposureMode === 'manual' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`,
                    onClick: () => handleExposureModeChange('manual')
                  }, 'M')
                )
              ),
              React.createElement('div', { className: 'space-y-6' },
                // Aperture Setting
                React.createElement('div', { className: 'space-y-2' },
                  React.createElement('div', { className: 'flex justify-between' },
                    React.createElement('label', { 
                      className: `font-medium ${
                        exposureMode === "aperture"
                          ? "text-green-600"
                          : exposureMode === "shutter"
                            ? "text-red-500"
                            : "text-blue-600"
                      }`
                    }, 'Aperture (f-stop/depth of field)'),
                    React.createElement('div', { className: 'flex items-center' },
                      React.createElement('span', { className: 'mr-2' }, `f/${aperture}`)
                    )
                  ),
                  React.createElement('div', { className: 'flex items-center text-xs font-medium text-gray-600 mb-1' },
                    React.createElement('span', null, 'Wide (f/1.4)'),
                    React.createElement('div', { className: 'flex-1' }),
                    React.createElement('span', null, 'Narrow (f/32)')
                  ),
                  React.createElement('input', { 
                    type: 'range',
                    min: 0,
                    max: standardApertures.length - 1,
                    value: apertureIndex,
                    onChange: (e) => setApertureIndex(parseInt(e.target.value)),
                    disabled: exposureMode === "shutter",
                    className: `w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${exposureMode === "shutter" ? "opacity-50" : ""}`
                  }),
                  React.createElement('div', { className: 'mt-3 p-3 bg-gray-100 border-l-4 border-blue-500 rounded-md' },
                    React.createElement(PhotographyTips, { setting: "aperture", value: aperture })
                  )
                ),
                // Shutter Speed Setting
                React.createElement('div', { className: 'space-y-2' },
                  React.createElement('div', { className: 'flex justify-between' },
                    React.createElement('label', { 
                      className: `font-medium ${
                        exposureMode === "shutter"
                          ? "text-green-600"
                          : exposureMode === "aperture"
                            ? "text-red-500"
                            : "text-blue-600"
                      }`
                    }, 'Shutter Speed (movement)'),
                    React.createElement('div', { className: 'flex items-center' },
                      React.createElement('span', { className: 'mr-2' }, displayShutterSpeed)
                    )
                  ),
                  React.createElement('div', { className: 'flex items-center text-xs font-medium text-gray-600 mb-1' },
                    React.createElement('span', null, 'Slow (30") - Blur Motion'),
                    React.createElement('div', { className: 'flex-1' }),
                    React.createElement('span', null, 'Fast (1/8000) - Freeze Motion')
                  ),
                  React.createElement('input', { 
                    type: 'range',
                    min: 0,
                    max: standardShutterSpeeds.length - 1,
                    value: shutterSpeedIndex,
                    onChange: (e) => setShutterSpeedIndex(parseInt(e.target.value)),
                    disabled: exposureMode === "aperture",
                    className: `w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${exposureMode === "aperture" ? "opacity-50" : ""}`
                  }),
                  React.createElement('div', { className: 'mt-3 p-3 bg-gray-100 border-l-4 border-green-500 rounded-md' },
                    React.createElement(PhotographyTips, { setting: "shutter", value: shutterSpeed })
                  )
                ),
                // ISO Setting
                React.createElement('div', { className: 'space-y-2' },
                  React.createElement('div', { className: 'flex justify-between items-center' },
                    React.createElement('label', { 
                      className: `font-medium ${
                        autoIso ? "text-red-500" : exposureMode === "manual" ? "text-blue-600" : "text-orange-500"
                      }`
                    }, 'ISO (grain/exposure time)'),
                    React.createElement('div', { className: 'flex items-center gap-2' },
                      React.createElement('span', { 
                        className: `${autoIso ? "text-red-500" : "text-orange-500"}`
                      }, iso),
                      React.createElement('div', { className: 'flex items-center space-x-2' },
                        React.createElement('label', { className: 'relative inline-flex items-center cursor-pointer' },
                          React.createElement('input', { 
                            type: 'checkbox',
                            checked: autoIso,
                            onChange: () => setAutoIso(!autoIso),
                            className: 'sr-only peer'
                          }),
                          React.createElement('div', { 
                            className: `w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer ${autoIso ? 'peer-checked:bg-blue-600' : ''} peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all`
                          }),
                          React.createElement('span', { className: 'ml-3 text-xs text-gray-700' }, 'Auto')
                        )
                      )
                    )
                  ),
                  React.createElement('div', { className: 'flex items-center text-xs font-medium text-gray-600 mb-1' },
                    React.createElement('span', null, 'Low (50) / Low Noise'),
                    React.createElement('div', { className: 'flex-1' }),
                    React.createElement('span', null, 'High (102400) / High Noise')
                  ),
                  React.createElement('input', { 
                    type: 'range',
                    min: 0,
                    max: standardIsoValues.length - 1,
                    value: isoIndex,
                    onChange: (e) => setIsoIndex(parseInt(e.target.value)),
                    disabled: autoIso,
                    className: `w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${autoIso ? "opacity-50" : ""}`
                  }),
                  React.createElement('div', { className: 'mt-3 p-3 bg-gray-100 border-l-4 border-amber-500 rounded-md' },
                    React.createElement(PhotographyTips, { setting: "iso", value: iso })
                  )
                )
              )
            )
          ),
          // Right Column - Scene Preview and Exposure Information
          React.createElement('div', { className: 'md:col-span-2 space-y-6' },
            // Scene Preview
            React.createElement('div', { className: 'bg-white p-6 rounded-lg shadow-sm' },
              React.createElement('div', { className: 'space-y-4' },
                React.createElement('div', { className: 'flex justify-between items-center' },
                  React.createElement('h3', { className: 'text-lg font-medium' }, 'Scene Preview')
                ),
                React.createElement('div', { className: 'relative aspect-video bg-gray-200 rounded-lg overflow-hidden' },
                  React.createElement('img', {
                    src: sceneImageUrls[sceneType]?.[timeOfDay] || '',
                    alt: `${sceneType} at ${timeOfDay}`,
                    className: 'w-full h-full object-cover',
                    style: !exposureCorrect && exposureDifference > 0
                      ? { filter: `brightness(${Math.min(2, 1 + exposureDifference * 0.5)})` }
                      : !exposureCorrect && exposureDifference < 0
                        ? { filter: `brightness(${Math.max(0.2, 1 + exposureDifference * 0.5)})` }
                        : {}
                  }),
                  !exposureCorrect && React.createElement('div', { 
                    className: 'absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 text-sm'
                  },
                    exposureDifference < 0
                      ? `Underexposed by ${Math.abs(exposureDifference).toFixed(1)} stops`
                      : `Overexposed by ${exposureDifference.toFixed(1)} stops`
                  )
                ),
                React.createElement('div', { className: 'text-sm text-gray-600 mt-2' },
                  React.createElement('p', null,
                    React.createElement('strong', null, 'Scene:'),
                    ' ',
                    sceneType.charAt(0).toUpperCase() + sceneType.slice(1),
                    ' at ',
                    timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)
                  )
                )
              )
            ),
            // Exposure Information
            React.createElement('div', { className: 'bg-white p-6 rounded-lg shadow-sm' },
              React.createElement('h3', { className: 'text-lg font-medium mb-4' }, 'Exposure Information'),
              React.createElement('div', { className: 'space-y-4' },
                React.createElement('div', { className: 'p-3 bg-gray-100 rounded-md' },
                  React.createElement('p', { className: 'font-medium' }, 'Current Settings:'),
                  React.createElement('ul', { className: 'mt-2 space-y-1' },
                    React.createElement('li', null, 
                      React.createElement('strong', null, 'Aperture:'), 
                      ' f/', aperture
                    ),
                    React.createElement('li', null, 
                      React.createElement('strong', null, 'Shutter Speed:'), 
                      ' ', displayShutterSpeed
                    ),
                    React.createElement('li', null, 
                      React.createElement('strong', null, 'ISO:'), 
                      ' ', iso
                    ),
                    React.createElement('li', null, 
                      React.createElement('strong', null, 'Exposure Mode:'), 
                      ' ', exposureMode.charAt(0).toUpperCase() + exposureMode.slice(1), ' Priority'
                    )
                  )
                ),
                React.createElement('div', { 
                  className: `p-3 rounded-md ${exposureCorrect ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'}`
                },
                  exposureCorrect 
                    ? React.createElement('p', { className: 'font-medium text-green-700' }, 'Correct Exposure')
                    : React.createElement('p', { className: 'font-medium text-red-700' },
                        exposureDifference < 0
                          ? `Underexposed by ${Math.abs(exposureDifference).toFixed(1)} stops`
                          : `Overexposed by ${exposureDifference.toFixed(1)} stops`
                      ),
                  React.createElement('p', { className: 'mt-1 text-sm' },
                    exposureCorrect
                      ? 'Your current settings provide a well-balanced exposure for this scene.'
                      : exposureDifference < 0
                        ? 'Your image will be too dark. Consider using a wider aperture, slower shutter speed, or higher ISO.'
                        : 'Your image will be too bright. Consider using a smaller aperture, faster shutter speed, or lower ISO.'
                  )
                )
              )
            )
          )
        )
      ),
      React.createElement('footer', { className: 'bg-white border-t py-6 mt-8' },
        React.createElement('div', { className: 'container mx-auto px-4' },
          React.createElement('div', { className: 'flex flex-col md:flex-row justify-between items-center' },
            React.createElement('div', { className: 'mb-4 md:mb-0' },
              React.createElement('p', { className: 'text-gray-600' }, 
                '© ', new Date().getFullYear(), ' Alan Ranger Photography. All rights reserved.'
              ),
              React.createElement('p', { className: 'text-gray-500 text-sm mt-1' },
                'This calculator is designed to help photographers understand exposure settings.'
              )
            ),
            React.createElement('div', { className: 'flex items-center' },
              React.createElement('button', {
                onClick: toggleDebugMode,
                className: 'flex items-center text-blue-600 hover:text-blue-800 font-medium'
              },
                debugMode ? 'Hide Debug Info' : 'Show Debug Info'
              )
            )
          )
        )
      )
    );
  }

  // Render the calculator
  const rootElement = document.getElementById('root');
  ReactDOM.render(React.createElement(ExposureCalculator), rootElement);
});