// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Reference settings for midday
    const REFERENCE_APERTURE = 5.6;
    const REFERENCE_ISO = 100;
    const REFERENCE_SHUTTER_SPEED = 1 / 2000;
    const REFERENCE_EV = 15;

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

    // State variables
    let sceneType = 'landscape';
    let timeOfDay = 'midday';
    let apertureIndex = 12; // f/5.6
    let shutterSpeedIndex = 48; // 1/2000s
    let isoIndex = 3; // ISO 100
    let autoIso = false;
    let exposureMode = 'aperture'; // aperture, shutter, manual
    let ev = 15; // Default to midday EV
    let exposureCorrect = true;
    let bulbMode = false;
    let bulbExposureTime = '';
    let debugMode = false;
    let previewMode = 'normal'; // normal, dof, motion
    let userChangedAperture = false;
    let userChangedShutter = false;
    let userChangedIso = false;
    let isUpdating = false;
    let initialized = false;

    // EV differences
    let apertureEvDiff = 0;
    let shutterEvDiff = 0;
    let isoEvDiff = 0;

    // Previous values for EV stop indicators
    let prevAperture = standardApertures[apertureIndex];
    let prevShutterSpeed = standardShutterSpeeds[shutterSpeedIndex];
    let prevIso = standardIsoValues[isoIndex];

    // DOM elements
    const sceneTypeSelect = document.getElementById('scene-type');
    const timeOfDaySelect = document.getElementById('time-of-day');
    const apertureSlider = document.getElementById('aperture-slider');
    const shutterSlider = document.getElementById('shutter-slider');
    const isoSlider = document.getElementById('iso-slider');
    const autoIsoCheckbox = document.getElementById('auto-iso');
    const apertureValue = document.getElementById('aperture-value');
    const shutterValue = document.getElementById('shutter-value');
    const isoValue = document.getElementById('iso-value');
    const sceneImage = document.getElementById('scene-image');
    const sceneLoading = document.getElementById('scene-loading');
    const sceneError = document.getElementById('scene-error');
    const exposureMeterNeedle = document.getElementById('exposure-meter-needle');
    const exposureMeterStatus = document.getElementById('exposure-meter-status');
    const exposureIndicator = document.getElementById('exposure-indicator');
    const histogramContainer = document.getElementById('histogram-container');
    const exposureTipsCorrect = document.getElementById('exposure-tips-correct');
    const exposureTipsIncorrect = document.getElementById('exposure-tips-incorrect');
    const exposureTipsBulb = document.getElementById('exposure-tips-bulb');
    const exposureTipsTitle = document.getElementById('exposure-tips-title');
    const exposureTipsDescription = document.getElementById('exposure-tips-description');
    const exposureTipsSuggestions = document.getElementById('exposure-tips-suggestions');
    const bulbExposureTimeSpan = document.getElementById('bulb-exposure-time');
    const triangleGuideToggle = document.getElementById('triangle-guide-toggle');
    const triangleGuideContainer = document.getElementById('triangle-guide-container');
    const evTableToggle = document.getElementById('ev-table-toggle');
    const evTableContainer = document.getElementById('ev-table-container');
    const debugToggle = document.getElementById('debug-toggle');
    const debugContainer = document.getElementById('debug-container');
    const apertureTips = document.getElementById('aperture-tips');
    const shutterTips = document.getElementById('shutter-tips');
    const isoTips = document.getElementById('iso-tips');
    const autoIsoInfo = document.getElementById('auto-iso-info');
    const sceneDescription = document.getElementById('scene-description');
    const dofOverlay = document.getElementById('dof-overlay');
    const motionOverlay = document.getElementById('motion-overlay');
    const dofInfo = document.getElementById('dof-info');
    const motionInfo = document.getElementById('motion-info');
    const dofZone = document.getElementById('dof-zone');
    const dofIndicator = document.getElementById('dof-indicator');
    const dofExplanation = document.getElementById('dof-explanation');
    const motionLines = document.getElementById('motion-lines');
    const motionIndicator = document.getElementById('motion-indicator');
    const motionExplanation = document.getElementById('motion-explanation');
    const dofCurrentSetting = document.getElementById('dof-current-setting');
    const motionCurrentSetting = document.getElementById('motion-current-setting');
    const apertureSliderDot = document.getElementById('aperture-slider-dot');
    const shutterSliderDot = document.getElementById('shutter-slider-dot');
    const isoSliderDot = document.getElementById('iso-slider-dot');
    const apertureEvDisplay = document.getElementById('aperture-ev-display');
    const shutterEvDisplay = document.getElementById('shutter-ev-display');
    const isoEvDisplay = document.getElementById('iso-ev-display');
    const totalExposureAdjustment = document.getElementById('total-exposure-adjustment');
    const exposureAdjustmentDescription = document.getElementById('exposure-adjustment-description');
    const exposureModeExplanation = document.getElementById('exposure-mode-explanation');
    const apertureEvIndicator = document.getElementById('aperture-ev-indicator');
    const shutterEvIndicator = document.getElementById('shutter-ev-indicator');
    const isoEvIndicator = document.getElementById('iso-ev-indicator');
    const apertureLabel = document.getElementById('aperture-label');
    const shutterLabel = document.getElementById('shutter-label');
    const isoLabel = document.getElementById('iso-label');
    const apertureIcon = document.getElementById('aperture-icon');
    const shutterIcon = document.getElementById('shutter-icon');
    const currentSettingsDescription = document.getElementById('current-settings-description');
    const equivalentSettings = document.getElementById('equivalent-settings');
    const debugSceneType = document.getElementById('debug-scene-type');
    const debugTimeOfDay = document.getElementById('debug-time-of-day');
    const debugSceneEv = document.getElementById('debug-scene-ev');
    const debugReferenceExposure = document.getElementById('debug-reference-exposure');
    const debugIso = document.getElementById('debug-iso');
    const debugAutoIso = document.getElementById('debug-auto-iso');
    const debugAperture = document.getElementById('debug-aperture');
    const debugShutterSpeed = document.getElementById('debug-shutter-speed');
    const debugRequiredExposure = document.getElementById('debug-required-exposure');
    const debugExposureMode = document.getElementById('debug-exposure-mode');
    const debugCalculatedEv = document.getElementById('debug-calculated-ev');
    const debugExposureDifference = document.getElementById('debug-exposure-difference');
    const currentYear = document.getElementById('current-year');
    const currentDate = document.getElementById('current-date');

    // Set current year
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
    
    // Set current date
    if (currentDate) {
        const now = new Date();
        currentDate.textContent = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }

    // Helper function to get EV for time of day
    function getEvForTimeOfDay(time) {
        const evValues = {
            dawn: 9,
            sunrise: 11,
            midday: 15,
            sunset: 11,
            dusk: 9,
            night: 0
        };
        return evValues[time] || 15;
    }

    // Helper function to format shutter speed
    function formatShutterSpeed(shutterSpeed) {
        if (shutterSpeed >= 1) {
            return `${shutterSpeed}"`;
        } else {
            return `1/${Math.round(1 / shutterSpeed)}s`;
        }
    }

    // Helper function to find the closest index in an array
    function findClosestIndex(array, target) {
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
    }

    // Helper function to calculate stops difference between apertures
    function getApertureStopsDifference(aperture1, aperture2) {
        // Each full stop is a factor of √2 in f-number
        // So the number of stops is log2((f2/f1)²) = 2 * log2(f2/f1)
        return 2 * Math.log2(aperture2 / aperture1);
    }

    // Helper function to calculate stops difference between shutter speeds
    function getShutterStopsDifference(shutter1, shutter2) {
        // Each full stop is a factor of 2 in exposure time
        // So the number of stops is log2(t2/t1)
        return Math.log2(shutter2 / shutter1);
    }

    // Helper function to calculate stops difference between ISO values
    function getIsoStopsDifference(iso1, iso2) {
        // Each full stop is a factor of 2 in ISO
        // So the number of stops is log2(iso2/iso1)
        return Math.log2(iso2 / iso1);
    }

    // Helper function for log base 2
    function log2(x) {
        return Math.log(x) / Math.log(2);
    }

    // Calculate the required shutter speed for correct exposure based on EV stops
    function calculateRequiredShutterSpeed(apertureValue, evValue, isoValue) {
        // For midday reference (EV 15):
        // - f/5.6, ISO 100 should give 1/2000s

        // Start with the reference shutter speed
        let requiredShutter = REFERENCE_SHUTTER_SPEED;

        // Calculate stops difference from reference aperture
        // Aperture: +1 stop (smaller aperture) means half the light, so shutter needs to be 2x slower
        const apertureStopsDiff = getApertureStopsDifference(REFERENCE_APERTURE, apertureValue);

        // Calculate stops difference from reference ISO
        // ISO: +1 stop (higher ISO) means double the sensitivity, so shutter can be 2x faster
        const isoStopsDiff = getIsoStopsDifference(REFERENCE_ISO, isoValue);

        // Calculate stops difference from reference EV
        // EV: +1 stop (brighter scene) means half the exposure time needed
        const evStopsDiff = evValue - REFERENCE_EV;

        // Adjust shutter speed based on all factors
        // For aperture: positive stops (smaller aperture) means slower shutter (multiply by 2^stops)
        // For ISO: positive stops (higher ISO) means faster shutter (divide by 2^stops)
        // For EV: positive stops (brighter scene) means faster shutter (divide by 2^stops)
        requiredShutter =
            (requiredShutter * Math.pow(2, apertureStopsDiff)) / Math.pow(2, isoStopsDiff) / Math.pow(2, evStopsDiff);

        return requiredShutter;
    }

    // Calculate the required aperture for correct exposure
    function calculateRequiredAperture(shutterValue, evValue, isoValue) {
        // Start with reference aperture
        let requiredAperture = REFERENCE_APERTURE;

        // Calculate stops difference from reference shutter speed
        // Shutter: +1 stop (slower shutter) means double the light, so aperture can be 1 stop smaller
        const shutterStopsDiff = getShutterStopsDifference(REFERENCE_SHUTTER_SPEED, shutterValue);

        // Calculate stops difference from reference ISO
        // ISO: +1 stop (higher ISO) means double the sensitivity, so aperture can be 1 stop smaller
        const isoStopsDiff = getIsoStopsDifference(REFERENCE_ISO, isoValue);

        // Calculate stops difference from reference EV
        // EV: +1 stop (brighter scene) means aperture can be 1 stop smaller
        const evStopsDiff = evValue - REFERENCE_EV;

        // Adjust aperture based on all factors
        // For each stop of shutter, ISO, or EV, adjust aperture by √2 (one stop)
        const totalStopsDiff = shutterStopsDiff + isoStopsDiff + evStopsDiff;
        requiredAperture = requiredAperture * Math.pow(Math.sqrt(2), totalStopsDiff);

        return requiredAperture;
    }

    // Calculate the required ISO for correct exposure in manual mode
    function calculateRequiredIsoForManual(apertureValue, shutterValue, evValue) {
        // Start with reference ISO
        let requiredIso = REFERENCE_ISO;

        // Calculate stops difference from reference aperture
        // Aperture: +1 stop (smaller aperture) means half the light, so ISO needs to be 2x higher
        const apertureStopsDiff = getApertureStopsDifference(REFERENCE_APERTURE, apertureValue);

        // Calculate stops difference from reference shutter speed
        // Shutter: +1 stop (slower shutter) means double the light, so ISO can be 1 stop lower
        const shutterStopsDiff = getShutterStopsDifference(REFERENCE_SHUTTER_SPEED, shutterValue);

        // Calculate stops difference from reference EV
        // EV: +1 stop (brighter scene) means ISO can be 1 stop lower
        const evStopsDiff = evValue - REFERENCE_EV;

        // Adjust ISO based on all factors
        // For aperture: positive stops (smaller aperture) means higher ISO (multiply by 2^stops)
        // For shutter: positive stops (slower shutter) means lower ISO (divide by 2^stops)
        // For EV: positive stops (brighter scene) means lower ISO (divide by 2^stops)
        requiredIso =
            (requiredIso * Math.pow(2, apertureStopsDiff)) / Math.pow(2, shutterStopsDiff) / Math.pow(2, evStopsDiff);

        // Limit to available ISO range
        requiredIso = Math.max(standardIsoValues[0], Math.min(MAX_AUTO_ISO, requiredIso));

        return requiredIso;
    }

    // Calculate the actual EV from camera settings
    function calculateActualEv(apertureValue, shutterValue, isoValue) {
        // The standard formula for EV at ISO 100 is:
        // EV100 = log2((aperture²) / shutter)
        // To adjust for ISO: EV = EV100 + log2(ISO/100)

        const EV100 = log2((apertureValue * apertureValue) / shutterValue);
        const EV = EV100 + log2(100 / isoValue);

        return EV;
    }

    // Calculate EV differences from reference settings
    function calculateEvDifferences(currentAperture, currentShutter, currentIso) {
        // Calculate aperture EV difference from reference
        // Higher f-number = less light = positive EV
        const apertureDiff = getApertureStopsDifference(REFERENCE_APERTURE, currentAperture);

        // Calculate shutter EV difference from reference
        // Faster shutter (lower value) = less light = positive EV
        const shutterDiff = getShutterStopsDifference(REFERENCE_SHUTTER_SPEED, currentShutter);

        // Calculate ISO EV difference from reference
        // Higher ISO = more sensitivity = negative EV (for exposure calculation)
        // But we'll invert this in the UI display
        const isoDiff = getIsoStopsDifference(REFERENCE_ISO, currentIso);

        return { apertureDiff, shutterDiff, isoDiff };
    }

    // Calculate the required ISO for auto ISO mode in aperture priority
    function calculateRequiredIsoForAutoIso(apertureValue, evValue) {
        // We want to find the ISO that gives us a shutter speed of 1/60s
        // Start with the reference ISO
        let requiredIso = REFERENCE_ISO;

        // Calculate the shutter speed we would get with the reference ISO
        const shutterWithReferenceIso = calculateRequiredShutterSpeed(apertureValue, evValue, requiredIso);

        // If the shutter speed is already faster than 1/60s, we don't need to increase ISO
        if (shutterWithReferenceIso <= MIN_SHUTTER_SPEED) {
            return requiredIso;
        }

        // Calculate how many stops we need to increase ISO to get to 1/60s
        // Shutter speed and ISO have a reciprocal relationship: doubling ISO halves shutter speed
        const stopsNeeded = Math.log2(shutterWithReferenceIso / MIN_SHUTTER_SPEED);

        // Increase ISO by the required number of stops
        requiredIso = requiredIso * Math.pow(2, stopsNeeded);

        // Limit to maximum auto ISO
        requiredIso = Math.min(requiredIso, MAX_AUTO_ISO);

        return requiredIso;
    }

    // Calculate the required ISO for auto ISO mode in shutter priority
    function calculateRequiredIsoForShutterPriority(shutterValue, evValue) {
        // First, calculate the required aperture with base ISO
        const requiredAperture = calculateRequiredAperture(shutterValue, evValue, REFERENCE_ISO);

        // Check if the required aperture is within our available range
        if (
            requiredAperture >= standardApertures[0] &&
            requiredAperture <= standardApertures[standardApertures.length - 1]
        ) {
            // If we can achieve correct exposure with aperture alone, use base ISO
            return REFERENCE_ISO;
        }

        // If required aperture is too small (wider than our widest available)
        if (requiredAperture < standardApertures[0]) {
            // Calculate how many stops we need to increase ISO
            // Each stop of ISO allows the aperture to be √2 times larger (f-number smaller)
            const stopsNeeded = 2 * Math.log2(standardApertures[0] / requiredAperture);

            // Increase ISO by the required number of stops
            let requiredIso = REFERENCE_ISO * Math.pow(2, stopsNeeded);

            // Limit to maximum auto ISO
            requiredIso = Math.min(requiredIso, MAX_AUTO_ISO);

            return requiredIso;
        }

        // If required aperture is too large (narrower than our narrowest available)
        if (requiredAperture > standardApertures[standardApertures.length - 1]) {
            // Calculate how many stops we need to decrease ISO
            // Each stop of ISO allows the aperture to be √2 times smaller (f-number larger)
            const stopsNeeded = 2 * Math.log2(requiredAperture / standardApertures[standardApertures.length - 1]);

            // Decrease ISO by the required number of stops
            let requiredIso = REFERENCE_ISO / Math.pow(2, stopsNeeded);

            // Limit to minimum ISO
            requiredIso = Math.max(standardIsoValues[0], requiredIso);

            return requiredIso;
        }

        // Default fallback
        return REFERENCE_ISO;
    }

    // Update ISO in auto ISO mode for aperture priority
    function updateAutoIso(apertureValue, evValue) {
        // Calculate the required ISO for auto ISO mode
        const requiredIso = calculateRequiredIsoForAutoIso(apertureValue, evValue);

        // Find the closest standard ISO value
        const closestIsoIndex = findClosestIndex(standardIsoValues, requiredIso);

        // Update the ISO index
        isoIndex = closestIsoIndex;
        userChangedIso = true;
        updateIsoDisplay();

        // Calculate the shutter speed with this ISO
        const requiredShutter = calculateRequiredShutterSpeed(apertureValue, evValue, standardIsoValues[closestIsoIndex]);

        // Find the closest standard shutter speed
        const closestShutterIndex = findClosestIndex(standardShutterSpeeds, requiredShutter);

        // Update the shutter speed index
        shutterSpeedIndex = closestShutterIndex;
        userChangedShutter = true;
        updateShutterDisplay();
    }

    // Update aperture and ISO in shutter priority mode with Auto ISO
    function updateShutterPriorityWithAutoIso(shutterValue, evValue) {
        // First, calculate the required aperture with base ISO
        const requiredAperture = calculateRequiredAperture(shutterValue, evValue, REFERENCE_ISO);

        // Find the closest standard aperture
        let closestApertureIndex = findClosestIndex(standardApertures, requiredAperture);

        // Check if we need to adjust ISO
        let require  requiredAperture);

        // Check if we need to adjust ISO
        let requiredIso = REFERENCE_ISO;
        let needIsoAdjustment = false;

        // If the required aperture is outside our available range
        if (requiredAperture < standardApertures[0]) {
            // We need a wider aperture than available, so use the widest and increase ISO
            closestApertureIndex = 0;
            needIsoAdjustment = true;
        } else if (requiredAperture > standardApertures[standardApertures.length - 1]) {
            // We need a narrower aperture than available, so use the narrowest and decrease ISO
            closestApertureIndex = standardApertures.length - 1;
            needIsoAdjustment = true;
        }

        // Update the aperture index
        apertureIndex = closestApertureIndex;
        userChangedAperture = true;
        updateApertureDisplay();

        // If we need to adjust ISO
        if (needIsoAdjustment || autoIso) {
            // Calculate the required ISO for this shutter speed and aperture
            requiredIso = calculateRequiredIsoForShutterPriority(shutterValue, evValue);

            // Find the closest standard ISO value
            const closestIsoIndex = findClosestIndex(standardIsoValues, requiredIso);

            // Update the ISO index
            isoIndex = closestIsoIndex;
            userChangedIso = true;
            updateIsoDisplay();
        }
    }

    // Update ISO in manual mode with Auto ISO
    function updateManualWithAutoIso(apertureValue, shutterValue, evValue) {
        // Calculate the required ISO for manual mode with auto ISO
        const requiredIso = calculateRequiredIsoForManual(apertureValue, shutterValue, evValue);

        // Find the closest standard ISO value
        const closestIsoIndex = findClosestIndex(standardIsoValues, requiredIso);

        // Update the ISO index
        isoIndex = closestIsoIndex;
        userChangedIso = true;
        updateIsoDisplay();
    }

    // Initialize settings based on time of day
    function initializeSettingsForTimeOfDay(time) {
        const sceneEv = getEvForTimeOfDay(time);
        ev = sceneEv; // Update the global EV value

        // Keep aperture at f/5.6 and ISO at 100 as reference
        apertureIndex = 12; // f/5.6
        isoIndex = 3; // ISO 100

        // Calculate the required shutter speed for this EV
        const requiredShutter = calculateRequiredShutterSpeed(REFERENCE_APERTURE, sceneEv, REFERENCE_ISO);

        // Find the closest standard shutter speed
        const closestIndex = findClosestIndex(standardShutterSpeeds, requiredShutter);
        shutterSpeedIndex = closestIndex;

        // Reset user change flags
        userChangedAperture = false;
        userChangedShutter = false;
        userChangedIso = false;

        // Update displays
        updateApertureDisplay();
        updateShutterDisplay();
        updateIsoDisplay();
    }

    // Update aperture display
    function updateApertureDisplay() {
        const aperture = standardApertures[apertureIndex];
        apertureValue.textContent = `f/${aperture}`;
        apertureSlider.value = apertureIndex;
        
        // Update aperture tips
        updatePhotographyTips('aperture', aperture);
        
        // Update debug info
        if (debugMode) {
            debugAperture.textContent = aperture;
        }
        
        // Update DOF visualization if active
        if (previewMode === 'dof') {
            updateDofVisualization();
        }
        
        // Update EV differences
        updateEvDifferences();
    }

    // Update shutter display
    function updateShutterDisplay() {
        const shutter = standardShutterSpeeds[shutterSpeedIndex];
        shutterValue.textContent = formatShutterSpeed(shutter);
        shutterSlider.value = shutterSpeedIndex;
        
        // Update shutter tips
        updatePhotographyTips('shutter', shutter);
        
        // Update debug info
        if (debugMode) {
            debugShutterSpeed.textContent = formatShutterSpeed(shutter);
        }
        
        // Update motion visualization if active
        if (previewMode === 'motion') {
            updateMotionVisualization();
        }
        
        // Update EV differences
        updateEvDifferences();
    }

    // Update ISO display
    function updateIsoDisplay() {
        const iso = standardIsoValues[isoIndex];
        isoValue.textContent = iso;
        isoSlider.value = isoIndex;
        
        // Update ISO tips
        updatePhotographyTips('iso', iso);
        
        // Update debug info
        if (debugMode) {
            debugIso.textContent = iso;
            debugAutoIso.style.display = autoIso ? 'inline' : 'none';
        }
        
        // Update Auto ISO info
        updateAutoIsoInfo();
        
        // Update EV differences
        updateEvDifferences();
    }

    // Update Auto ISO info
    function updateAutoIsoInfo() {
        if (autoIso) {
            autoIsoInfo.classList.remove('hidden');
            if (exposureMode === 'aperture') {
                autoIsoInfo.textContent = 'Auto ISO: Maintaining minimum shutter speed of 1/60s';
            } else if (exposureMode === 'shutter') {
                autoIsoInfo.textContent = 'Auto ISO: Adjusting ISO when aperture range is insufficient';
            } else if (exposureMode === 'manual') {
                autoIsoInfo.textContent = 'Auto ISO: Automatically adjusting ISO to achieve correct exposure';
            }
        } else {
            autoIsoInfo.classList.add('hidden');
        }
    }

    // Update photography tips
    function updatePhotographyTips(setting, value) {
        let tip = '';
        
        if (setting === 'iso') {
            if (value <= 200) {
                tip = 'Low ISO: Best for bright conditions. Produces clean images with minimal noise.';
            } else if (value <= 800) {
                tip = 'Medium ISO: Good for normal lighting. Balanced between noise and sensitivity.';
            } else if (value <= 3200) {
                tip = 'High ISO: Use in low light. May introduce noise but allows faster shutter speeds.';
            } else {
                tip = 'Very high ISO: For extremely low light. Will introduce significant noise but enables shooting in near darkness.';
            }
            isoTips.textContent = tip;
        } else if (setting === 'aperture') {
            if (value <= 2.8) {
                tip = 'Wide aperture: Creates shallow depth of field. Great for portraits and isolating subjects.';
            } else if (value <= 8) {
                tip = 'Medium aperture: Good all-around choice. Balances depth of field and sharpness.';
            } else if (value <= 16) {
                tip = 'Narrow aperture: Creates deep depth of field. Ideal for landscapes where everything should be in focus.';
            } else {
                tip = 'Very narrow aperture: Maximum depth of field. Be aware of diffraction which may reduce overall sharpness.';
            }
            apertureTips.textContent = tip;
        } else if (setting === 'shutter') {
            if (value >= 1/60) {
                tip = 'Slow shutter: Captures motion blur. Good for creative effects like flowing water or light trails.';
            } else if (value >= 1/500) {
                tip = 'Medium shutter: Good all-around choice for most situations. Freezes casual movement.';
            } else {
                tip = 'Fast shutter: Freezes fast action. Ideal for sports, wildlife, and capturing split-second moments.';
            }
            shutterTips.textContent = tip;
        }
    }

    // Update scene image
    function updateSceneImage() {
        // Show loading state
        sceneLoading.classList.remove('hidden');
        sceneError.classList.add('hidden');
        
        // Get the image URL
        const imageUrl = sceneImageUrls[sceneType]?.[timeOfDay];
        
        if (!imageUrl) {
            // Handle missing image
            sceneLoading.classList.add('hidden');
            sceneError.classList.remove('hidden');
            return;
        }
        
        // Load the image
        sceneImage.src = imageUrl;
        sceneImage.onload = function() {
            sceneLoading.classList.add('hidden');
            
            // Update scene description
            sceneDescription.textContent = `${sceneType.charAt(0).toUpperCase() + sceneType.slice(1)} at ${timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}`;
            
            // Update visualizations if active
            if (previewMode === 'dof') {
                updateDofVisualization();
            } else if (previewMode === 'motion') {
                updateMotionVisualization();
            }
            
            // Update histogram
            updateHistogram();
        };
        
        sceneImage.onerror = function() {
            sceneLoading.classList.add('hidden');
            sceneError.classList.remove('hidden');
        };
    }

    // Update DOF visualization
    function updateDofVisualization() {
        const aperture = standardApertures[apertureIndex];
        
        // Get aperture category
        let dofCategory;
        if (aperture <= 2.8) {
            dofCategory = 'shallow';
            dofZone.style.height = '25%';
            dofExplanation.textContent = 'Small f-number = shallow focus (subject sharp, background blurred)';
        } else if (aperture <= 8) {
            dofCategory = 'medium';
            dofZone.style.height = '50%';
            dofExplanation.textContent = 'Medium f-number = moderate focus depth';
        } else {
            dofCategory = 'deep';
            dofZone.style.height = '83.333%';
            dofExplanation.textContent = 'Large f-number = deep focus (everything sharp)';
        }
        
        // Update DOF indicator
        dofIndicator.textContent = `f/${aperture} - ${dofCategory.charAt(0).toUpperCase() + dofCategory.slice(1)} DoF`;
        
        // Update DOF current setting
        dofCurrentSetting.innerHTML = `Your current setting: <strong>f/${aperture}</strong> - ${dofCategory.charAt(0).toUpperCase() + dofCategory.slice(1)} depth of field`;
    }

    // Update motion visualization
    function updateMotionVisualization() {
        const shutterSpeed = standardShutterSpeeds[shutterSpeedIndex];
        
        // Get shutter category
        let motionCategory;
        if (shutterSpeed >= 1/15) {
            motionCategory = 'very-slow';
            motionExplanation.textContent = 'Slow shutter = long motion streaks (creative blur)';
        } else if (shutterSpeed >= 1/60) {
            motionCategory = 'slow';
            motionExplanation.textContent = 'Medium shutter = some motion blur';
        } else if (shutterSpeed >= 1/250) {
            motionCategory = 'medium';
            motionExplanation.textContent = 'Fast shutter = minimal motion blur';
        } else {
            motionCategory = 'fast';
            motionExplanation.textContent = 'Very fast shutter = frozen motion (sharp action)';
        }
        
        // Update motion indicator
        motionIndicator.textContent = `${formatShutterSpeed(shutterSpeed)} - ${motionCategory === 'very-slow' ? 'Significant Motion Blur' : motionCategory === 'slow' ? 'Moderate Motion Blur' : motionCategory === 'medium' ? 'Slight Motion Blur' : 'Frozen Motion'}`;
        
        // Update motion current setting
        motionCurrentSetting.innerHTML = `Your current setting: <strong>${formatShutterSpeed(shutterSpeed)}</strong> - ${motionCategory === 'very-slow' ? 'Significant motion blur' : motionCategory === 'slow' ? 'Moderate motion blur' : motionCategory === 'medium' ? 'Slight motion blur' : 'Frozen motion'}`;
        
        // Update motion lines
        motionLines.innerHTML = '';
        
        if (motionCategory === 'very-slow') {
            // Long motion streaks for very slow shutter
            for (let i = 0; i < 15; i++) {
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', 10 + i * 5);
                line.setAttribute('y1', 10);
                line.setAttribute('x2', 30 + i * 5);
                line.setAttribute('y2', 90);
                line.setAttribute('stroke', 'red');
                line.setAttribute('stroke-width', '0.8');
                line.setAttribute('stroke-opacity', '0.8');
                motionLines.appendChild(line);
            }
        } else if (motionCategory === 'slow') {
            // Medium motion streaks for slow shutter
            for (let i = 0; i < 10; i++) {
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', 20 + i * 6);
                line.setAttribute('y1', 20);
                line.setAttribute('x2', 30 + i * 6);
                line.setAttribute('y2', 80);
                line.setAttribute('stroke', 'red');
                line.setAttribute('stroke-width', '0.8');
                line.setAttribute('stroke-opacity', '0.8');
                motionLines.appendChild(line);
            }
        } else if (motionCategory === 'medium') {
            // Short motion streaks for medium shutter
            for (let i = 0; i < 8; i++) {
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', 30 + i * 5);
                line.setAttribute('y1', 30);
                line.setAttribute('x2', 35 + i * 5);
                line.setAttribute('y2', 70);
                line.setAttribute('stroke', 'red');
                line.setAttribute('stroke-width', '0.8');
                line.setAttribute('stroke-opacity', '0.8');
                motionLines.appendChild(line);
            }
        }
        // No motion streaks for fast shutter
    }

    // Update histogram
    function updateHistogram() {
        // Clear existing histogram
        histogramContainer.innerHTML = '';
        
        // Generate histogram data based on scene type and time of day
        // Using a deterministic approach instead of random values
        const data = Array(32).fill(0);
        
        // Create a seed value from the scene type and time of day to ensure consistency
        const seed = `${sceneType}-${timeOfDay}`.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        
        // Deterministic "random" function based on the seed
        const seededRandom = (index) => {
            const value = Math.sin(seed + index) * 10000;
            return Math.abs(value - Math.floor(value));
        };
        
        if (sceneType === 'landscape') {
            // Landscape scenes tend to have more mid to high values
            for (let i = 0; i < data.length; i++) {
                if (i < 8) {
                    data[i] = 10 + seededRandom(i) * 20;
                } else if (i < 16) {
                    data[i] = 20 + seededRandom(i) * 40;
                } else if (i < 24) {
                    data[i] = 40 + seededRandom(i) * 40;
                } else {
                    data[i] = 20 + seededRandom(i) * 30;
                }
            }
        } else if (timeOfDay === 'night') {
            // Night scenes tend to have more low values
            for (let i = 0; i < data.length; i++) {
                if (i < 12) {
                    data[i] = 40 + seededRandom(i) * 40;
                } else if (i < 20) {
                    data[i] = 20 + seededRandom(i) * 30;
                } else {
                    data[i] = 5 + seededRandom(i) * 10;
                }
            }
        } else if (sceneType === 'forest') {
            // Forest scenes tend to have more mid to low values
            for (let i = 0; i < data.length; i++) {
                if (i < 12) {
                    data[i] = 20 + seededRandom(i) * 40;
                } else if (i < 24) {
                    data[i] = 30 + seededRandom(i) * 30;
                } else {
                    data[i] = 10 + seededRandom(i) * 20;
                }
            }
        } else {
            // Default for other scene types
            for (let i = 0; i < data.length; i++) {
                data[i] = 10 + seededRandom(i) * 40;
            }
        }
        
        // If exposure is incorrect, shift the histogram
        if (!exposureCorrect) {
            // For underexposure (negative difference), shift left (data pushed to shadows/left side)
            // For overexposure (positive difference), shift right (data pushed to highlights/right side)
            
            // Get a shift value based on the exposure difference
            // Limit the shift to a reasonable range (max 8 pixels, which is 1/4 of the histogram width)
            let shift = 0;
            
            const aperture = standardApertures[apertureIndex];
            const shutter = standardShutterSpeeds[shutterSpeedIndex];
            const iso = standardIsoValues[isoIndex];
            const calculatedEv = calculateActualEv(aperture, shutter, iso);
            const exposureDifference = ev - calculatedEv;
            
            if (exposureDifference < 0) {
                // Underexposed - shift left
                shift = -Math.min(8, Math.round(Math.abs(exposureDifference) * 2));
            } else if (exposureDifference > 0) {
                // Overexposed - shift right
                shift = Math.min(8, Math.round(Math.abs(exposureDifference) * 2));
            }
            
            if (shift > 0) {
                // Shift right (overexposed)
                for (let i = data.length - 1; i >= shift; i--) {
                    data[i] = data[i - shift];
                }
                for (let i = 0; i < shift; i++) {
                    data[i] = 0;
                }
            } else if (shift < 0) {
                // Shift left (underexposed)
                const absShift = Math.abs(shift);
                for (let i = 0; i < data.length - absShift; i++) {
                    data[i] = data[i + absShift];
                }
                for (let i = data.length - absShift; i < data.length; i++) {
                    data[i] = 0;
                }
            }
        }
        
        // Find the maximum value for scaling
        const maxValue = Math.max(...data);
        
        // Create histogram bars
        for (let i = 0; i < data.length; i++) {
            const barContainer = document.createElement('div');
            barContainer.className = 'histogram-bar';
            
            // Determine the color based on the position in the histogram
            // Left side (shadows) = blue, Right side (highlights) = red
            let barColor = 'bg-gray-700'; // Default for midtones
            
            if (i < 8) {
                barColor = 'bg-blue-700'; // Shadows (left side)
            } else if (i >= 24) {
                barColor = 'bg-red-700'; // Highlights (right side)
            }
            
            const bar = document.createElement('div');
            bar.className = `w-full ${barColor}`;
            bar.style.height = `${(data[i] / maxValue) * 100}%`;
            
            barContainer.appendChild(bar);
            histogramContainer.appendChild(barContainer);
        }
    }

    // Update exposure meter
    function updateExposureMeter() {
        const aperture = standardApertures[apertureIndex];
        const shutter = standardShutterSpeeds[shutterSpeedIndex];
        const iso = standardIsoValues[isoIndex];
        
        // Calculate the actual EV from current camera settings
        const calculatedEv = calculateActualEv(aperture, shutter, iso);
        
        // Calculate the difference between the calculated EV and scene EV
        // If calculatedEv < ev, we're underexposed (too dark, need more light) -> negative value
        // If calculatedEv > ev, we're overexposed (too bright, need less light) -> positive value
        const evDifference = ev - calculatedEv;
        
        // Determine the position of the needle on the meter
        // We'll use a range of -6 to +6 stops
        const needlePosition = Math.max(-6, Math.min(6, evDifference));
        const needlePercentage = ((needlePosition + 6) / 12) * 100;
        
        // Update the needle position
        exposureMeterNeedle.style.left = `${needlePercentage}%`;
        
        // Update the exposure status
        exposureCorrect = Math.abs(evDifference) < 0.5;
        
        if (exposureCorrect) {
            exposureMeterStatus.textContent = 'Correct Exposure';
            exposureMeterStatus.className = 'text-green-600 font-medium';
            exposureIndicator.classList.add('hidden');
            sceneImage.style.filter = 'brightness(1)';
        } else {
            exposureMeterStatus.textContent = `${evDifference < 0 ? 'Underexposed' : 'Overexposed'} (${evDifference < 0 ? '' : '+'}${Math.abs(evDifference).toFixed(1)} stops)`;
            exposureMeterStatus.className = 'text-red-600 font-medium';
            
            // Update exposure indicator on the image
            exposureIndicator.textContent = `${evDifference < 0 ? 'Underexposed' : 'Overexposed'} by ${Math.abs(evDifference).toFixed(1)} stops`;
            exposureIndicator.classList.remove('hidden');
            
            // Apply visual effect to the image
            if (evDifference < 0) {
                // Underexposed (negative difference)
                // Convert stops to brightness percentage (0.5^stops * 100)
                const brightnessPercent = Math.pow(0.5, Math.abs(evDifference));
                sceneImage.style.filter = `brightness(${brightnessPercent})`;
            } else {
                // Overexposed (positive difference)
                // For overexposure, we use 2^stops
                const brightnessPercent = Math.pow(2, evDifference);
                sceneImage.style.filter = `brightness(${Math.min(2, brightnessPercent)})`;
            }
        }
        
        // Update exposure tips
        updateExposureTips(evDifference);
        
        // Update debug info
        if (debugMode) {
            debugCalculatedEv.textContent = calculatedEv.toFixed(2);
            debugExposureDifference.textContent = evDifference.toFixed(2);
        }
    }

    // Update exposure tips
    function updateExposureTips(exposureDifference) {
        const aperture = standardApertures[apertureIndex];
        const shutter = standardShutterSpeeds[shutterSpeedIndex];
        
        // Calculate the required shutter speed for correct exposure
        const requiredShutterValue = calculateRequiredShutterSpeed(aperture, ev, standardIsoValues[isoIndex]);
        
        // Check if we need bulb mode (required shutter speed > 30s)
        if (requiredShutterValue > 30) {
            bulbMode = true;
            
            // Format the time
            if (requiredShutterValue > 60) {
                const minutes = Math.floor(requiredShutterValue / 60);
                const seconds = Math.round(requiredShutterValue % 60);
                bulbExposureTime = `${minutes}m ${seconds}s`;
            } else {
                bulbExposureTime = `${Math.round(requiredShutterValue)}s`;
            }
            
            // Update bulb exposure time display
            bulbExposureTimeSpan.textContent = bulbExposureTime;
            
            // Show bulb mode tips
            exposureTipsCorrect.classList.add('hidden');
            exposureTipsIncorrect.classList.add('hidden');
            exposureTipsBulb.classList.remove('hidden');
            
            // Update debug info
            if (debugMode) {
                debugRequiredExposure.textContent = bulbExposureTime;
            }
            return;
        }
        
        // If exposureCorrect and not bulb mode, show correct exposure tips
        if (exposureCorrect && !bulbMode) {
            exposureTipsCorrect.classList.remove('hidden');
            exposureTipsIncorrect.classList.add('hidden');
            exposureTipsBulb.classList.add('hidden');
            
            // Update debug info
            if (debugMode) {
                debugRequiredExposure.textContent = formatShutterSpeed(shutter);
            }
            
            return;
        }
        
        // If not correct exposure and not bulb mode, show incorrect exposure tips
        if (!exposureCorrect && !bulbMode) {
            exposureTipsCorrect.classList.add('hidden');
            exposureTipsIncorrect.classList.remove('hidden');
            exposureTipsBulb.classList.add('hidden');
            
            // If exposureDifference is negative, we're underexposed (too dark, need more light)
            // If exposureDifference is positive, we're overexposed (too bright, need less light)
            const isUnderexposed = exposureDifference < 0;
            const stopsDifference = Math.abs(exposureDifference).toFixed(1);
            
            // Update title
            exposureTipsTitle.textContent = isUnderexposed ? `Underexposed by ${stopsDifference} stops` : `Overexposed by ${stopsDifference} stops`;
            
            // Update description
            exposureTipsDescription.textContent = isUnderexposed ? 'Your image is too dark. Consider these adjustments:' : 'Your image is too bright. Consider these adjustments:';
            
            // Clear existing suggestions
            exposureTipsSuggestions.innerHTML = '';
            
            // Determine which settings can be adjusted based on exposure mode
            const suggestions = [];
            
            if (isUnderexposed) {
                // Underexposure suggestions - need MORE light
                if (exposureMode === 'manual') {
                    if (!autoIso)
                        suggestions.push('Increase ISO to boost sensitivity (allows faster shutter speeds but introduces more noise)');
                    suggestions.push('Use slower shutter speed (lower number like 1/30 instead of 1/125)');
                    suggestions.push('Use wider aperture (lower f-number like f/2.8 instead of f/8) to let in more light');
                } else if (exposureMode === 'aperture') {
                    if (!autoIso) {
                        suggestions.push('Increase ISO to boost sensitivity (allows faster shutter speeds but introduces more noise)');
                    } else {
                        suggestions.push('Your camera is using Auto ISO to maintain proper exposure');
                    }
                    suggestions.push('Consider using a wider aperture (lower f-number) if available');
                } else if (exposureMode === 'shutter') {
                    if (!autoIso) {
                        suggestions.push('Increase ISO to boost sensitivity (allows wider aperture range but introduces more noise)');
                    } else {
                        suggestions.push('Your camera is using Auto ISO to maintain proper exposure');
                    }
                }
            } else {
                // Overexposure suggestions - need LESS light
                if (exposureMode === 'manual') {
                    if (!autoIso) suggestions.push('Decrease ISO to reduce sensitivity (reduces noise)');
                    suggestions.push('Use faster shutter speed (higher number like 1/250 instead of 1/60)');
                    suggestions.push('Use smaller aperture (higher f-number like f/11 instead of f/5.6)');
                } else if (exposureMode === 'aperture') {
                    if (!autoIso) {
                        suggestions.push('Decrease ISO to reduce sensitivity (improves image quality)');
                    } else {
                        suggestions.push('Your camera is using Auto ISO to maintain proper exposure');
                    }
                    suggestions.push('Consider using a smaller aperture (higher f-number) if available');
                } else if (exposureMode === 'shutter') {
                    if (!autoIso) {
                        suggestions.push('Decrease ISO to reduce sensitivity (improves image quality)');
                    } else {
                        suggestions.push('Your camera is using Auto ISO to maintain proper exposure');
                    }
                }
            }
            
            if (autoIso) {
                suggestions.push('Auto ISO is enabled: Your camera is adjusting ISO automatically to help correct exposure');
            }
            
            // Add information about Auto ISO behavior in the tips component
            if (autoIso && exposureMode === 'aperture') {
                suggestions.push('Auto ISO is maintaining a minimum shutter speed of 1/60s, adjusting ISO as needed');
                suggestions.push('The camera will use the lowest possible ISO to achieve this shutter speed');
            }
            
            // Add suggestions to the list
            suggestions.forEach(suggestion => {
                const li = document.createElement('li');
                li.textContent = suggestion;
                exposureTipsSuggestions.appendChild(li);
            });
            
            // Update debug info
            if (debugMode) {
                debugRequiredExposure.textContent = formatShutterSpeed(requiredShutterValue);
            }
        }
    }

    // Update EV differences
    function updateEvDifferences() {
        const aperture = standardApertures[apertureIndex];
        const shutter = standardShutterSpeeds[shutterSpeedIndex];
        const iso = standardIsoValues[isoIndex];
        
        // Calculate EV differences from reference settings
        const { apertureDiff, shutterDiff, isoDiff } = calculateEvDifferences(aperture, shutter, iso);
        
        // Update the EV differences
        apertureEvDiff = apertureDiff;
        shutterEvDiff = shutterDiff;
        isoEvDiff = isoDiff;
        
        // Update EV stop indicators
        updateEvStopIndicators();
        
        // Update exposure slider visualization
        updateExposureSliderVisualization();
        
        // Update previous values
        prevAperture = aperture;
        prevShutterSpeed = shutter;
        prevIso = iso;
    }

    // Update EV stop indicators
    function updateEvStopIndicators() {
        // Only show indicators when there's a user change
        if (userChangedAperture  {
        // Only show indicators when there's a user change
        if (userChangedAperture) {
            const displayEvDiff = apertureEvDiff;
            const formattedEvDiff = displayEvDiff === 0 ? '0.0 stops' : `${displayEvDiff > 0 ? '+' : ''}${displayEvDiff.toFixed(1)} stops`;
            const colorClass = displayEvDiff > 0 ? 'text-red-500' : displayEvDiff < 0 ? 'text-green-500' : 'text-gray-500';
            
            apertureEvIndicator.innerHTML = `<span class="font-medium ${colorClass}">${formattedEvDiff}</span>`;
        } else {
            apertureEvIndicator.innerHTML = '';
        }
        
        if (userChangedShutter) {
            // Adjust the displayed EV difference based on exposure mode
            let displayEvDiff = shutterEvDiff;
            
            // In aperture priority mode, shutter speed compensates for aperture changes
            if (exposureMode === 'aperture') {
                // The shutter speed should show the opposite of the aperture change
                displayEvDiff = -apertureEvDiff;
            }
            
            const formattedEvDiff = displayEvDiff === 0 ? '0.0 stops' : `${displayEvDiff > 0 ? '+' : ''}${displayEvDiff.toFixed(1)} stops`;
            const colorClass = displayEvDiff > 0 ? 'text-red-500' : displayEvDiff < 0 ? 'text-green-500' : 'text-gray-500';
            
            shutterEvIndicator.innerHTML = `<span class="font-medium ${colorClass}">${formattedEvDiff}</span>`;
        } else {
            shutterEvIndicator.innerHTML = '';
        }
        
        if (userChangedIso) {
            // For ISO, we need to invert the sign for display purposes
            // Higher ISO means more sensitivity (positive effect on exposure)
            // But in our EV calculation, higher ISO gives positive EV difference
            const displayEvDiff = -isoEvDiff;
            
            const formattedEvDiff = displayEvDiff === 0 ? '0.0 stops' : `${displayEvDiff > 0 ? '+' : ''}${displayEvDiff.toFixed(1)} stops`;
            const colorClass = displayEvDiff > 0 ? 'text-red-500' : displayEvDiff < 0 ? 'text-green-500' : 'text-gray-500';
            
            isoEvIndicator.innerHTML = `<span class="font-medium ${colorClass}">${formattedEvDiff}</span>`;
        } else {
            isoEvIndicator.innerHTML = '';
        }
    }

    // Update exposure slider visualization
    function updateExposureSliderVisualization() {
        // Calculate display values directly from props
        // In priority modes, we need to show the compensating relationship
        let displayApertureEvDiff = apertureEvDiff;
        let displayShutterEvDiff = shutterEvDiff;
        // Invert ISO EV diff for display - higher ISO means more light (positive effect on exposure)
        const displayIsoEvDiff = -isoEvDiff;
        
        // In aperture priority mode:
        if (exposureMode === 'aperture') {
            // The shutter speed should show the opposite of BOTH aperture AND ISO changes
            displayShutterEvDiff = -(apertureEvDiff - isoEvDiff);
        }
        // In shutter priority mode:
        else if (exposureMode === 'shutter') {
            // The aperture should show the opposite of BOTH shutter AND ISO changes
            displayApertureEvDiff = -(shutterEvDiff - isoEvDiff);
        }
        
        // Format EV differences for display
        const apertureEvDisplayText = formatEvDiff(displayApertureEvDiff);
        const shutterEvDisplayText = formatEvDiff(displayShutterEvDiff);
        const isoEvDisplayText = formatEvDiff(displayIsoEvDiff);
        
        // Calculate slider positions
        const aperturePosition = getSliderPosition(displayApertureEvDiff);
        const shutterPosition = getSliderPosition(displayShutterEvDiff);
        const isoPosition = getSliderPosition(displayIsoEvDiff);
        
        // Update slider dot positions
        apertureSliderDot.style.left = `${aperturePosition}%`;
        shutterSliderDot.style.left = `${shutterPosition}%`;
        isoSliderDot.style.left = `${isoPosition}%`;
        
        // Update EV displays
        apertureEvDisplay.textContent = apertureEvDisplayText;
        apertureEvDisplay.className = `ml-2 text-sm font-medium ${apertureEvDisplayText.includes('+') ? 'text-red-500' : apertureEvDisplayText.includes('-') ? 'text-green-500' : 'text-gray-500'}`;
        
        shutterEvDisplay.textContent = shutterEvDisplayText;
        shutterEvDisplay.className = `ml-2 text-sm font-medium ${shutterEvDisplayText.includes('+') ? 'text-red-500' : shutterEvDisplayText.includes('-') ? 'text-green-500' : 'text-gray-500'}`;
        
        isoEvDisplay.textContent = isoEvDisplayText;
        isoEvDisplay.className = `ml-2 text-sm font-medium ${isoEvDisplayText.includes('+') ? 'text-red-500' : isoEvDisplayText.includes('-') ? 'text-green-500' : 'text-gray-500'}`;
        
        // Calculate total EV adjustment based on exposure mode
        let totalEvAdjustment = 0;
        
        if (exposureMode === 'manual') {
            // In manual mode, all three factors contribute to the total adjustment
            totalEvAdjustment = apertureEvDiff + shutterEvDiff - isoEvDiff;
        } else {
            // In aperture or shutter priority modes, the camera automatically compensates
            // So the total should be 0 if the camera is perfectly compensating
            totalEvAdjustment = 0;
        }
        
        // Update total exposure adjustment
        totalExposureAdjustment.textContent = `${Math.abs(totalEvAdjustment) < 0.1 ? '0.0' : `${totalEvAdjustment > 0 ? '+' : ''}${totalEvAdjustment.toFixed(1)}`} EV`;
        totalExposureAdjustment.className = `text-sm font-bold ${Math.abs(totalEvAdjustment) < 0.1 ? 'text-gray-500' : totalEvAdjustment > 0 ? 'text-red-500' : 'text-green-500'}`;
        
        // Update exposure adjustment description
        exposureAdjustmentDescription.textContent = Math.abs(totalEvAdjustment) < 0.1 ? 'Correct exposure' : totalEvAdjustment > 0 ? 'Overexposed: Image will be brighter than ideal' : 'Underexposed: Image will be darker than ideal';
        
        // Update exposure mode explanation
        if (exposureMode === 'aperture') {
            exposureModeExplanation.textContent = 'In Aperture Priority mode, changing aperture or ISO will automatically adjust shutter speed to maintain exposure.';
        } else if (exposureMode === 'shutter') {
            exposureModeExplanation.textContent = 'In Shutter Priority mode, changing shutter speed or ISO will automatically adjust aperture to maintain exposure.';
        } else {
            exposureModeExplanation.textContent = 'In Manual mode, you must balance all three settings yourself to achieve proper exposure.';
        }
        
        // Update equivalent settings
        updateEquivalentSettings();
    }

    // Format EV differences for display
    function formatEvDiff(diff) {
        return `${diff > 0 ? '+' : diff < 0 ? '-' : ''}${Math.abs(diff).toFixed(1)} EV`;
    }

    // Calculate slider positions based on EV differences
    function getSliderPosition(evDiff) {
        // Limit to +/- 3 stops for display purposes
        const limitedDiff = Math.max(-3, Math.min(3, evDiff));
        // Use 15% per stop to make the movement more noticeable
        return 50 + limitedDiff * 15;
    }

    // Update equivalent settings
    function updateEquivalentSettings() {
        const aperture = standardApertures[apertureIndex];
        const shutter = standardShutterSpeeds[shutterSpeedIndex];
        const iso = standardIsoValues[isoIndex];
        
        // Update current settings description
        currentSettingsDescription.textContent = `Your current settings (f/${aperture}, ${formatShutterSpeed(shutter)}, ISO ${iso}) can be balanced in different ways.`;
        
        // Calculate equivalent settings examples
        const settings = [];
        
        // Example 1: Increase aperture by 1 stop, decrease shutter by 1 stop
        const aperture1 = aperture * Math.sqrt(2);
        const shutter1 = shutter * 2;
        
        // Example 2: Decrease ISO by 2 stops, increase shutter by 2 stops
        const iso2 = iso / 4;
        const shutter2 = shutter / 4;
        
        // Example 3: Increase ISO by 1 stop, decrease aperture by 1 stop
        const iso3 = iso * 2;
        const aperture3 = aperture / Math.sqrt(2);
        
        // Format the settings for display
        settings.push(`f/${aperture1.toFixed(1)}, ${formatShutterSpeed(shutter1)}, ISO ${iso}`);
        settings.push(`f/${aperture}, ${formatShutterSpeed(shutter2)}, ISO ${iso2}`);
        settings.push(`f/${aperture3.toFixed(1)}, ${formatShutterSpeed(shutter)}, ISO ${iso3}`);
        
        // Update equivalent settings list
        equivalentSettings.innerHTML = '';
        settings.forEach(setting => {
            const li = document.createElement('li');
            li.textContent = setting;
            equivalentSettings.appendChild(li);
        });
    }

    // Update debug info
    function updateDebugInfo() {
        if (!debugMode) return;
        
        const aperture = standardApertures[apertureIndex];
        const shutter = standardShutterSpeeds[shutterSpeedIndex];
        const iso = standardIsoValues[isoIndex];
        
        debugSceneType.textContent = sceneType;
        debugTimeOfDay.textContent = timeOfDay;
        debugSceneEv.textContent = ev;
        
        // Get the reference exposure time for the current time of day
        const getReferenceExposureTime = (timeOfDay) => {
            switch (timeOfDay) {
                case 'night':
                    return '68m 16s';
                case 'dawn':
                case 'dusk':
                    return '8s';
                case 'sunrise':
                case 'sunset':
                    return '2s';
                case 'midday':
                    return '1/2000s';
                default:
                    return 'Unknown';
            }
        };
        
        debugReferenceExposure.textContent = getReferenceExposureTime(timeOfDay);
        
        debugIso.textContent = iso;
        debugAutoIso.style.display = autoIso ? 'inline' : 'none';
        
        debugAperture.textContent = aperture;
        debugShutterSpeed.textContent = formatShutterSpeed(shutter);
        
        // Calculate the required shutter speed for correct exposure
        const requiredShutterValue = calculateRequiredShutterSpeed(aperture, ev, iso);
        
        // Format the required exposure time
        const formatRequiredExposureTime = (seconds) => {
            if (seconds >= 60) {
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = Math.round(seconds % 60);
                return `${minutes}m ${remainingSeconds}s`;
            } else if (seconds >= 1) {
                return `${Math.round(seconds)}s`;
            } else {
                return `1/${Math.round(1 / seconds)}s`;
            }
        };
        
        debugRequiredExposure.textContent = formatRequiredExposureTime(requiredShutterValue);
        
        debugExposureMode.textContent = `${exposureMode.charAt(0).toUpperCase() + exposureMode.slice(1)} Priority`;
        
        // Calculate the actual EV from current camera settings
        const calculatedEv = calculateActualEv(aperture, shutter, iso);
        debugCalculatedEv.textContent = calculatedEv.toFixed(2);
        
        // Calculate the difference between the calculated EV and scene EV
        const evDifference = ev - calculatedEv;
        debugExposureDifference.textContent = evDifference.toFixed(2);
    }

    // Initialize the application
    function initialize() {
        // Set the initial EV based on time of day
        ev = getEvForTimeOfDay(timeOfDay);
        
        // Calculate appropriate initial settings based on time of day
        initializeSettingsForTimeOfDay(timeOfDay);
        
        // Update displays
        updateApertureDisplay();
        updateShutterDisplay();
        updateIsoDisplay();
        
        // Update scene image
        updateSceneImage();
        
        // Update exposure meter
        updateExposureMeter();
        
        // Update histogram
        updateHistogram();
        
        // Update debug info
        updateDebugInfo();
        
        // Set initialized flag
        initialized = true;
    }

    // Event listeners

    // Scene type change
    sceneTypeSelect.addEventListener('change', function() {
        sceneType = this.value;
        updateSceneImage();
        updateHistogram();
    });

    // Time of day change
    timeOfDaySelect.addEventListener('change', function() {
        timeOfDay = this.value;
        
        // Set the EV based on the time of day
        ev = getEvForTimeOfDay(timeOfDay);
        
        // Reset user change flags
        userChangedAperture = false;
        userChangedShutter = false;
        userChangedIso = false;
        
        // Update settings based on new time of day
        if (exposureMode === 'aperture') {
            if (autoIso) {
                // In aperture priority with auto ISO, calculate the appropriate ISO and shutter speed
                updateAutoIso(standardApertures[apertureIndex], ev);
            } else {
                // In aperture priority without auto ISO, adjust shutter speed
                const requiredShutterValue = calculateRequiredShutterSpeed(standardApertures[apertureIndex], ev, standardIsoValues[isoIndex]);
                const closestIndex = findClosestIndex(standardShutterSpeeds, requiredShutterValue);
                shutterSpeedIndex = closestIndex;
                updateShutterDisplay();
            }
        } else if (exposureMode === 'shutter') {
            if (autoIso) {
                // In shutter priority with auto ISO, adjust aperture and ISO as needed
                updateShutterPriorityWithAutoIso(standardShutterSpeeds[shutterSpeedIndex], ev);
            } else {
                // In shutter priority without auto ISO, adjust aperture
                const requiredAperture = calculateRequiredAperture(standardShutterSpeeds[shutterSpeedIndex], ev, standardIsoValues[isoIndex]);
                const closestIndex = findClosestIndex(standardApertures, requiredAperture);
                apertureIndex = closestIndex;
                updateApertureDisplay();
            }
        } else if (exposureMode === 'manual') {
            if (autoIso) {
                // In manual mode with auto ISO, adjust ISO to match the scene EV
                updateManualWithAutoIso(standardApertures[apertureIndex], standardShutterSpeeds[shutterSpeedIndex], ev);
            }
            // In manual mode without auto ISO, just update the exposure correctness
        }
        
        // Update scene image
        updateSceneImage();
        
        // Update exposure meter
        updateExposureMeter();
        
        // Update histogram
        updateHistogram();
        
        // Update debug info
        updateDebugInfo();
    });

    // Aperture slider change
    apertureSlider.addEventListener('input', function() {
        if (exposureMode !== 'shutter') {
            const newApertureIndex = parseInt(this.value);
            apertureIndex = newApertureIndex;
            userChangedAperture = true;
            updateApertureDisplay();
            
            // In aperture priority mode, adjust shutter speed
            if (exposureMode === 'aperture') {
                if (autoIso) {
                    // With Auto ISO, adjust both shutter speed and ISO as needed
                    updateAutoIso(standardApertures[apertureIndex], ev);
                } else {
                    // Without Auto ISO, just adjust shutter speed
                    const requiredShutterValue = calculateRequiredShutterSpeed(standardApertures[apertureIndex], ev, standardIsoValues[isoIndex]);
                    const closestIndex = findClosestIndex(standardShutterSpeeds, requiredShutterValue);
                    shutterSpeedIndex = closestIndex;
                    updateShutterDisplay();
                }
            } else if (exposureMode === 'manual' && autoIso) {
                // In manual mode with auto ISO, adjust ISO when aperture changes
                updateManualWithAutoIso(standardApertures[apertureIndex], standardShutterSpeeds[shutterSpeedIndex], ev);
            }
            
            // Update exposure meter
            updateExposureMeter();
            
            // Update histogram
            updateHistogram();
            
            // Update debug info
            updateDebugInfo();
        }
    });

    // Shutter slider change
    shutterSlider.addEventListener('input', function() {
        if (exposureMode !== 'aperture') {
            const newShutterIndex = parseInt(this.value);
            shutterSpeedIndex = newShutterIndex;
            userChangedShutter = true;
            updateShutterDisplay();
            
            // In shutter priority mode, adjust aperture
            if (exposureMode === 'shutter') {
                if (autoIso) {
                    // With Auto ISO, adjust both aperture and ISO as needed
                    updateShutterPriorityWithAutoIso(standardShutterSpeeds[shutterSpeedIndex], ev);
                } else {
                    // Without Auto ISO, just adjust aperture
                    const requiredAperture = calculateRequiredAperture(standardShutterSpeeds[shutterSpeedIndex], ev, standardIsoValues[isoIndex]);
                    const closestIndex = findClosestIndex(standardApertures, requiredAperture);
                    apertureIndex = closestIndex;
                    updateApertureDisplay();
                }
            } else if (exposureMode === 'manual' && autoIso) {
                // In manual mode with auto ISO, adjust ISO when shutter speed changes
                updateManualWithAutoIso(standardApertures[apertureIndex], standardShutterSpeeds[shutterSpeedIndex], ev);
            }
            
            // Update exposure meter
            updateExposureMeter();
            
            // Update histogram
            updateHistogram();
            
            // Update debug info
            updateDebugInfo();
        }
    });

    // ISO slider change
    isoSlider.addEventListener('input', function() {
        if (!autoIso) {
            const newIsoIndex = parseInt(this.value);
            const newIso = standardIsoValues[newIsoIndex];
            const oldIso = standardIsoValues[isoIndex];
            
            // Update the ISO index
            isoIndex = newIsoIndex;
            userChangedIso = true;
            updateIsoDisplay();
            
            // In aperture priority mode, adjust shutter speed when ISO changes
            if (exposureMode === 'aperture') {
                // Calculate the ISO change in stops
                const isoStopsDiff = getIsoStopsDifference(oldIso, newIso);
                
                // Get the current shutter speed
                const currentShutter = standardShutterSpeeds[shutterSpeedIndex];
                
                // Calculate the new shutter speed based on ISO change
                // If ISO increases by 1 stop, shutter speed should be 1 stop faster
                const newShutterValue = currentShutter / Math.pow(2, isoStopsDiff);
                
                // Find the closest standard shutter speed
                const newShutterIndex = findClosestIndex(standardShutterSpeeds, newShutterValue);
                
                // Update the shutter speed index
                shutterSpeedIndex = newShutterIndex;
                updateShutterDisplay();
            }
            // In shutter priority mode, adjust aperture when ISO changes
            else if (exposureMode === 'shutter') {
                // Calculate the ISO change in stops
                const isoStopsDiff = getIsoStopsDifference(oldIso, newIso);
                
                // Get the current aperture
                const currentAperture = standardApertures[apertureIndex];
                
                // Calculate the new aperture based on ISO change
                // If ISO increases by 1 stop, aperture should be 1 stop smaller (higher f-number)
                const newApertureValue = currentAperture * Math.pow(Math.sqrt(2), isoStopsDiff);
                
                // Find the closest standard aperture
                const newApertureIndex = findClosestIndex(standardApertures, newApertureValue);
                
                // Update the aperture index
                apertureIndex = newApertureIndex;
                updateApertureDisplay();
            }
            
            // Update exposure meter
            updateExposureMeter();
            
            // Update histogram
            updateHistogram();
            
            // Update debug info
            updateDebugInfo();
        }
    });

    // Auto ISO toggle
    autoIsoCheckbox.addEventListener('change', function() {
        autoIso = this.checked;
        
        // Update ISO label and slider
        if (autoIso) {
            isoLabel.className = 'font-medium text-red-500';
            isoSlider.disabled = true;
            isoSlider.classList.add('opacity-50');
        } else {
            isoLabel.className = 'font-medium text-orange-500';
            isoSlider.disabled = false;
            isoSlider.classList.remove('opacity-50');
        }
        
        // Update Auto ISO info
        updateAutoIsoInfo();
        
        if (autoIso) {
            // When enabling Auto ISO, calculate the appropriate ISO based on current settings
            if (exposureMode === 'aperture') {
                updateAutoIso(standardApertures[apertureIndex], ev);
            } else if (exposureMode === 'shutter') {
                updateShutterPriorityWithAutoIso(standardShutterSpeeds[shutterSpeedIndex], ev);
            } else if (exposureMode === 'manual') {
                updateManualWithAutoIso(standardApertures[apertureIndex], standardShutterSpeeds[shutterSpeedIndex], ev);
            }
        }
        
        // Update exposure meter
        updateExposureMeter();
        
        // Update histogram
        updateHistogram();
        
        // Update debug info
        updateDebugInfo();
    });

    // Exposure mode tabs
    document.querySelectorAll('.exposure-mode-tabs .tab-trigger').forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            document.querySelectorAll('.exposure-mode-tabs .tab-trigger').forEach(t => {
                t.classList.remove('active');
            });
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Get the exposure mode
            const mode = this.dataset.mode;
            
            // Update exposure mode
            exposureMode = mode;
            
            // Reset user change flags
            userChangedAperture = false;
            userChangedShutter = false;
            userChangedIso = false;
            
            // Update labels and icons based on exposure mode
            if (exposureMode === 'aperture') {
                apertureLabel.className = 'font-medium text-green-600';
                shutterLabel.className = 'font-medium text-red-500';
                isoLabel.className = autoIso ? 'font-medium text-red-500' : 'font-medium text-orange-500';
                
                apertureIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-500"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>';
                shutterIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500"><path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"></path><path d="M12 1v2"></path><path d="M12 21v2"></path><path d="M4.22 4.22l1.42 1.42"></path><path d="M18.36 18.36l1.42 1.42"></path><path d="M1 12h2"></path><path d="M21 12h2"></path><path d="M4.22 19.78l1.42-1.42"></path><path d="M18.36 5.64l1.42-1.42"></path></svg>';
                
                // Enable aperture slider, disable shutter slider
                apertureSlider.disabled = false;
                apertureSlider.classList.remove('opacity-50');
                shutterSlider.disabled = true;
                shutterSlider.classList.add('opacity-50');
            } else if (exposureMode === 'shutter') {
                apertureLabel.className = 'font-medium text-red-500';
                shutterLabel.className = 'font-medium text-green-600';
                isoLabel.className = autoIso ? 'font-medium text-red-500' : 'font-medium text-orange-500';
                
                apertureIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500"><path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"></path><path d="M12 1v2"></path><path d="M12 21v2"></path><path d="M4.22 4.22l1.42 1.42"></path><path d="M18.36 18.36l1.42 1.42"></path><path d="M1 12h2"></path><path d="M21 12h2"></path><path d="M4.22 19.78l1.42-1.42"></path><path d="M18.36 5.64l1.42-1.42"></path></svg>';
                shutterIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-500"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>';
                
                // Enable shutter slider, disable aperture slider
                apertureSlider.disabled = true;
                apertureSlider.classList.add('opacity-50');
                shutterSlider.disabled = false;
                shutterSlider.classList.remove('opacity-50');
            } else {
                apertureLabel.className = 'font-medium text-blue-600';
                shutterLabel.className = 'font-medium text-blue-600';
                isoLabel.className = autoIso ? 'font-medium text-red-500' : 'font-medium text-orange-500';
                
                apertureIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>';
                shutterIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>';
                
                // Enable both sliders
                apertureSlider.disabled = false;
                apertureSlider.classList.remove('opacity-50');
                shutterSlider.disabled = false;
                shutterSlider.classList.remove('opacity-50');
            }
            
            // If auto ISO is enabled, update settings based on the new mode
            if (autoIso) {
                if (exposureMode === 'aperture') {
                    updateAutoIso(standardApertures[apertureIndex], ev);
                } else if (exposureMode === 'shutter') {
                    updateShutterPriorityWithAutoIso(standardShutterSpeeds[shutterSpeedIndex], ev);
                } else if (exposureMode === 'manual') {
                    updateManualWithAutoIso(standardApertures[apertureIndex], standardShutterSpeeds[shutterSpeedIndex], ev);
                }
            }
            
            // Update Auto ISO info
            updateAutoIsoInfo();
            
            // Update exposure meter
            updateExposureMeter();
            
            // Update histogram
            updateHistogram();
            
            // Update debug info
            updateDebugInfo();
        });
    });

    // Preview mode tabs
    document.querySelectorAll('.preview-mode-tabs .tab-trigger').forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            document.querySelectorAll('.preview-mode-tabs .tab-trigger').forEach(t => {
                t.classList.remove('active');
            });
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Get the preview mode
            const mode = this.dataset.mode;
            
            // Update preview mode
            previewMode = mode;
            
            // Hide all overlays and info
            dofOverlay.classList.add('hidden');
            motionOverlay.classList.add('hidden');
            dofInfo.classList.add('hidden');
            motionInfo.classList.add('hidden');
            
            // Show the selected overlay and info
            if (previewMode === 'dof') {
                dofOverlay.classList.remove('hidden');
                dofInfo.classList.remove('hidden');
                updateDofVisualization();
            } else if (previewMode === 'motion') {
                motionOverlay.classList.remove('hidden');
                motionInfo.classList.remove('hidden');
                updateMotionVisualization();
            }
        });
    });

    // Exposure triangle guide tabs
    document.querySelectorAll('.exposure-guide-tabs .tab-trigger').forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            document.querySelectorAll('.exposure-guide-tabs .tab-trigger').forEach(t => {
                t.classList.remove('active');
            });
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Get the tab ID
            const tabId = this.dataset.tab;
            
            // Hide all tab content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.add('hidden');
            });
            
            // Show the selected tab content
            document.getElementById(`${tabId}-tab`).classList.remove('hidden');
        });
    });

    // Triangle guide toggle
    triangleGuideToggle.addEventListener('click', function() {
        const isVisible = !triangleGuideContainer.classList.contains('hidden');
        
        if (isVisible) {
            triangleGuideContainer.classList.add('hidden');
            this.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-1"><polyline points="6 9 12 15 18 9"></polyline></svg> Show Exposure Triangle Guide';
        } else {
            triangleGuideContainer.classList.remove('hidden');
            this.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-1"><polyline points="18 15 12 9 6 15"></polyline></svg> Hide Exposure Triangle Guide';
        }
    });

    // EV table toggle
    evTableToggle.addEventListener('click', function() {
        const isVisible = !evTableContainer.classList.contains('hidden');
        
        if (isVisible) {
            evTableContainer.classList.add('hidden');
            this.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-1"><polyline points="6 9 12 15 18 9"></polyline></svg> Show EV Reference Table';
        } else {
            evTableContainer.classList.remove('hidden');
            this.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-1"><polyline points="18 15 12 9 6 15"></polyline></svg> Hide EV Reference Table';
        }
    });

    // Debug toggle
    debugToggle.addEventListener('click', function() {
        debugMode = !debugMode;
        
        if (debugMode) {
            debugContainer.classList.remove('hidden');
            this.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-1"><polyline points="18 15 12 9 6 15"></polyline></svg> Hide Debug Info';
            updateDebugInfo();
        } else {
            debugContainer.classList.add('hidden');
            this.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-1"><polyline points="6 9 12 15 18 9"></polyline></svg> Show Debug Info';
        }
    });

    // Initialize the application
    initialize();
});