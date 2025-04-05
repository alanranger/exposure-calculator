// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded - initializing exposure calculator")

  // Reference settings for midday
  const REFERENCE_APERTURE = 5.6
  const REFERENCE_ISO = 100
  const REFERENCE_SHUTTER_SPEED = 1 / 2000
  const REFERENCE_EV = 12

  // Auto ISO settings
  const MIN_SHUTTER_SPEED = 1 / 60 // Minimum shutter speed for auto ISO
  const MAX_AUTO_ISO = 102400 // Maximum ISO for auto ISO

  // Standard photographic stops with 1/3 increments
  const standardApertures = [
    1.4, 1.6, 1.8, 2, 2.2, 2.5, 2.8, 3.2, 3.5, 4, 4.5, 5.0, 5.6, 6.3, 7.1, 8, 9, 10, 11, 13, 14, 16, 18, 20, 22, 25, 29,
    32,
  ]

  // Shutter speeds in seconds (1/x for most values)
  // Order from slowest (30") to fastest (1/8000)
  const standardShutterSpeeds = [
    30,
    25,
    20,
    15,
    13,
    10,
    8,
    6,
    5,
    4,
    3.2,
    2.5,
    2,
    1.6,
    1.3,
    1,
    0.8,
    0.6,
    0.5,
    0.4,
    0.3,
    1 / 4,
    1 / 5,
    1 / 6,
    1 / 8,
    1 / 10,
    1 / 13,
    1 / 15,
    1 / 20,
    1 / 25,
    1 / 30,
    1 / 40,
    1 / 50,
    1 / 60,
    1 / 80,
    1 / 100,
    1 / 125,
    1 / 160,
    1 / 200,
    1 / 250,
    1 / 320,
    1 / 400,
    1 / 500,
    1 / 640,
    1 / 800,
    1 / 1000,
    1 / 1250,
    1 / 1600,
    1 / 2000,
    1 / 2500,
    1 / 3200,
    1 / 4000,
    1 / 5000,
    1 / 6400,
    1 / 8000,
  ]

  // ISO values with 1/3 increments
  const standardIsoValues = [
    50, 64, 80, 100, 125, 160, 200, 250, 320, 400, 500, 640, 800, 1000, 1250, 1600, 2000, 2500, 3200, 4000, 5000, 6400,
    8000, 10000, 12800, 16000, 20000, 25600, 32000, 40000, 51200, 64000, 80000, 102400,
  ]

  // Scene image URLs
  const sceneImageUrls = {
    landscape: {
      dawn: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&h=450&fit=crop&q=80",
      sunrise: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&h=450&fit=crop&q=80",
      midday: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=450&fit=crop&q=80",
      sunset: "https://images.unsplash.com/photo-1472120435266-53107fd0c44a?w=800&h=450&fit=crop&q=80",
      dusk: "https://images.unsplash.com/photo-1490682143684-14369e18dce8?w=800&h=450&fit=crop&q=80",
      night: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=800&h=450&fit=crop&q=80",
    },
    cityscape: {
      dawn: "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800&h=450&fit=crop&q=80",
      sunrise: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=450&fit=crop&q=80",
      midday: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=450&fit=crop&q=80",
      sunset: "https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=800&h=450&fit=crop&q=80",
      dusk: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&h=450&fit=crop&q=80",
      night: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&h=450&fit=crop&q=80",
    },
    forest: {
      dawn: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&h=450&fit=crop&q=80",
      sunrise: "https://images.unsplash.com/photo-1511497584788-876760111969?w=800&h=450&fit=crop&q=80",
      midday: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&h=450&fit=crop&q=80",
      sunset: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&h=450&fit=crop&q=80",
      dusk: "https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?w=800&h=450&fit=crop&q=80",
      night: "https://images.unsplash.com/photo-1516214104703-d870798883c5?w=800&h=450&fit=crop&q=80",
    },
    portrait: {
      dawn: "https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=800&h=450&fit=crop&q=80",
      sunrise: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=450&fit=crop&q=80",
      midday: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=450&fit=crop&q=80",
      sunset: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop&q=80",
      dusk: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=800&h=450&fit=crop&q=80",
      night: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=450&fit=crop&q=80",
    },
    wildlife: {
      dawn: "https://images.unsplash.com/photo-1484406566174-9da000fda645?w=800&h=450&fit=crop&q=80",
      sunrise: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&h=450&fit=crop&q=80",
      midday: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=800&h=450&fit=crop&q=80",
      sunset: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&h=450&fit=crop&q=80",
      dusk: "https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?w=800&h=450&fit=crop&q=80",
      night: "https://images.unsplash.com/photo-1566159196870-56191d4c2971?w=800&h=450&fit=crop&q=80",
    },
    sports: {
      dawn: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&h=450&fit=crop&q=80",
      sunrise: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=450&fit=crop&q=80",
      midday: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=450&fit=crop&q=80",
      sunset: "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=800&h=450&fit=crop&q=80",
      dusk: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=800&h=450&fit=crop&q=80",
      night: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=450&fit=crop&q=80",
    },
  }

  // State variables
  let sceneType = "landscape"
  let timeOfDay = "midday"
  let apertureIndex = 12 // f/5.6
  let shutterSpeedIndex = 48 // 1/2000s
  let isoIndex = 3 // ISO 100
  let autoIso = false
  let exposureMode = "aperture" // aperture, shutter, manual
  let ev = 12 // Default to midday EV
  let exposureCorrect = true
  const bulbMode = false
  const bulbExposureTime = ""
  let debugMode = false
  let previewMode = "normal" // normal, dof, motion
  let userChangedAperture = false
  let userChangedShutter = false
  let userChangedIso = false
  const isUpdating = false
  let initialized = false
  let sceneImage

  // EV differences
  let apertureEvDiff = 0
  let shutterEvDiff = 0
  let isoEvDiff = 0

  // Previous values for EV stop indicators
  const prevAperture = standardApertures[apertureIndex]
  const prevShutterSpeed = standardShutterSpeeds[shutterSpeedIndex]
  const prevIso = standardIsoValues[isoIndex]

  // Get DOM elements
  const sceneTypeSelect = document.getElementById("scene-type")
  const timeOfDaySelect = document.getElementById("time-of-day")
  const apertureSlider = document.getElementById("aperture-slider")
  const shutterSlider = document.getElementById("shutter-slider")
  const isoSlider = document.getElementById("iso-slider")
  const autoIsoCheckbox = document.getElementById("auto-iso")
  const apertureValue = document.getElementById("aperture-value")
  const shutterValue = document.getElementById("shutter-value")
  const isoValue = document.getElementById("iso-value")
  sceneImage = document.getElementById("scene-image")
  const sceneLoading = document.getElementById("scene-loading")
  const sceneError = document.getElementById("scene-error")
  const exposureMeterNeedle = document.getElementById("exposure-meter-needle")
  const exposureMeterStatus = document.getElementById("exposure-meter-status")
  const exposureIndicator = document.getElementById("exposure-indicator")
  const histogramContainer = document.getElementById("histogram-container")
  const exposureTipsCorrect = document.getElementById("exposure-tips-correct")
  const exposureTipsIncorrect = document.getElementById("exposure-tips-incorrect")
  const exposureTipsBulb = document.getElementById("exposure-tips-bulb")
  const exposureTipsTitle = document.getElementById("exposure-tips-title")
  const exposureTipsDescription = document.getElementById("exposure-tips-description")
  const exposureTipsSuggestions = document.getElementById("exposure-tips-suggestions")
  const bulbExposureTimeSpan = document.getElementById("bulb-exposure-time")
  const triangleGuideToggle = document.getElementById("triangle-guide-toggle")
  const triangleGuideContainer = document.getElementById("triangle-guide-container")
  const evTableToggle = document.getElementById("ev-table-toggle")
  const evTableContainer = document.getElementById("ev-table-container")
  const debugToggleFooter = document.getElementById("debug-toggle-footer")
  const debugContainer = document.getElementById("debug-container")
  const apertureTips = document.getElementById("aperture-tips")
  const shutterTips = document.getElementById("shutter-tips")
  const isoTips = document.getElementById("iso-tips")
  const autoIsoInfo = document.getElementById("auto-iso-info")
  const sceneDescription = document.getElementById("scene-description")
  const dofOverlay = document.getElementById("dof-overlay")
  const motionOverlay = document.getElementById("motion-overlay")
  const dofInfo = document.getElementById("dof-info")
  const motionInfo = document.getElementById("motion-info")
  const dofZone = document.getElementById("dof-zone")
  const dofIndicator = document.getElementById("dof-indicator")
  const dofExplanation = document.getElementById("dof-explanation")
  const motionLines = document.getElementById("motion-lines")
  const motionIndicator = document.getElementById("motion-indicator")
  const motionExplanation = document.getElementById("motion-explanation")
  const dofCurrentSetting = document.getElementById("dof-current-setting")
  const motionCurrentSetting = document.getElementById("motion-current-setting")
  const currentYear = document.getElementById("current-year")

  // Debug function
  function debugLog(message) {
    if (debugMode) {
      console.log(`DEBUG: ${message}`)
    }
  }

  // Debug function to log exposure calculations
  function debugExposureCalculation() {
    if (!debugMode) return

    const aperture = standardApertures[apertureIndex]
    const shutter = standardShutterSpeeds[shutterSpeedIndex]
    const iso = standardIsoValues[isoIndex]

    const calculatedEv = calculateActualEv(aperture, shutter, iso)
    const evDifference = ev - calculatedEv

    // Get setting status based on exposure mode
    const getSettingStatus = (setting) => {
      if (exposureMode === "aperture") {
        if (setting === "aperture" || (setting === "iso" && !autoIso)) return "User Selected"
        if (setting === "shutter") return "Auto Calculated"
        if (setting === "iso" && autoIso) return "Auto ISO"
      } else if (exposureMode === "shutter") {
        if (setting === "shutter" || (setting === "iso" && !autoIso)) return "User Selected"
        if (setting === "aperture") return "Auto Calculated"
        if (setting === "iso" && autoIso) return "Auto ISO"
      } else {
        // manual
        if (setting === "iso" && autoIso) return "Auto ISO"
        return "User Selected"
      }
      return ""
    }

    console.log("Exposure Calculation Debug:", {
      sceneType,
      timeOfDay,
      sceneEv: ev,
      exposureMode,
      aperture: {
        value: aperture,
        status: getSettingStatus("aperture"),
        evDiff: apertureEvDiff,
        userChanged: userChangedAperture,
      },
      shutter: {
        value: shutter,
        formatted: formatShutterSpeed(shutter),
        status: getSettingStatus("shutter"),
        evDiff: shutterEvDiff,
        userChanged: userChangedShutter,
      },
      iso: {
        value: iso,
        status: getSettingStatus("iso"),
        evDiff: -isoEvDiff, // Invert for display
        userChanged: userChangedIso,
        auto: autoIso,
      },
      calculatedEv,
      evDifference,
      exposureCorrect: Math.abs(evDifference) < 0.5,
      exposureStatus: evDifference < 0 ? "Underexposed" : evDifference > 0 ? "Overexposed" : "Correct",
    })
  }

  // Check critical elements
  function checkCriticalElements() {
    debugLog("Checking critical elements")
    const criticalElements = [
      { name: "sceneTypeSelect", element: sceneTypeSelect },
      { name: "timeOfDaySelect", element: timeOfDaySelect },
      { name: "apertureSlider", element: apertureSlider },
      { name: "shutterSlider", element: shutterSlider },
      { name: "isoSlider", element: isoSlider },
      { name: "sceneImage", element: sceneImage },
    ]

    criticalElements.forEach((item) => {
      if (!item.element) {
        console.error(`Critical element missing: ${item.name}`)
      }
    })
  }

  // Check if we have any critical elements before proceeding
  checkCriticalElements()

  // Set current year
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear()
  }

  // Helper function to get EV for time of day - corrected to match the EV reference table
  function getEvForTimeOfDay(time) {
    const evValues = {
      dawn: -3,
      sunrise: -1,
      midday: 12,
      sunset: -1,
      dusk: -3,
      night: -12,
    }
    return evValues[time] || 12
  }

  // Helper function to format shutter speed
  function formatShutterSpeed(shutterSpeed) {
    if (shutterSpeed >= 1) {
      return `${shutterSpeed}"`
    } else {
      return `1/${Math.round(1 / shutterSpeed)}s`
    }
  }

  // Helper function to find the closest index in an array
  function findClosestIndex(array, target) {
    let closestIndex = 0
    let minDiff = Number.POSITIVE_INFINITY

    for (let i = 0; i < array.length; i++) {
      const diff = Math.abs(array[i] - target)
      if (diff < minDiff) {
        minDiff = diff
        closestIndex = i
      }
    }

    return closestIndex
  }

  // Helper function to calculate stops difference between apertures
  function getApertureStopsDifference(aperture1, aperture2) {
    // Each full stop is a factor of √2 in f-number
    // So the number of stops is log2((f2/f1)²) = 2 * log2(f2/f1)
    return 2 * Math.log2(aperture2 / aperture1)
  }

  // Helper function to calculate stops difference between shutter speeds
  function getShutterStopsDifference(shutter1, shutter2) {
    // Each full stop is a factor of 2 in exposure time
    // So the number of stops is log2(t2/t1)
    return Math.log2(shutter2 / shutter1)
  }

  // Helper function to calculate stops difference between ISO values
  function getIsoStopsDifference(iso1, iso2) {
    // Each full stop is a factor of 2 in ISO
    // So the number of stops is log2(iso2/iso1)
    return Math.log2(iso2 / iso1)
  }

  // Helper function for log base 2
  function log2(x) {
    return Math.log(x) / Math.log(2)
  }

  // Calculate the required shutter speed for correct exposure based on EV stops
  function calculateRequiredShutterSpeed(apertureValue, evValue, isoValue) {
    // For midday reference (EV 12):
    // - f/5.6, ISO 100 should give 1/2000s

    // Start with the reference shutter speed
    let requiredShutter = REFERENCE_SHUTTER_SPEED

    // Calculate stops difference from reference aperture
    // Aperture: +1 stop (smaller aperture) means half the light, so shutter needs to be 2x slower
    const apertureStopsDiff = getApertureStopsDifference(REFERENCE_APERTURE, apertureValue)

    // Calculate stops difference from reference ISO
    // ISO: +1 stop (higher ISO) means double the sensitivity, so shutter can be 2x faster
    const isoStopsDiff = getIsoStopsDifference(REFERENCE_ISO, isoValue)

    // Calculate stops difference from reference EV
    // EV: +1 stop (brighter scene) means half the exposure time needed
    const evStopsDiff = evValue - REFERENCE_EV

    // Adjust shutter speed based on all factors
    // For aperture: positive stops (smaller aperture) means slower shutter (multiply by 2^stops)
    // For ISO: positive stops (higher ISO) means faster shutter (divide by 2^stops)
    // For EV: positive stops (brighter scene) means faster shutter (divide by 2^stops)
    requiredShutter =
      (requiredShutter * Math.pow(2, apertureStopsDiff)) / (Math.pow(2, isoStopsDiff) * Math.pow(2, evStopsDiff))

    return requiredShutter
  }

  // Calculate the required aperture for correct exposure
  function calculateRequiredAperture(shutterValue, evValue, isoValue) {
    // Start with reference aperture
    let requiredAperture = REFERENCE_APERTURE

    // Calculate stops difference from reference shutter speed
    // Shutter: +1 stop (slower shutter) means double the light, so aperture can be 1 stop smaller
    const shutterStopsDiff = getShutterStopsDifference(REFERENCE_SHUTTER_SPEED, shutterValue)

    // Calculate stops difference from reference ISO
    // ISO: +1 stop (higher ISO) means double the sensitivity, so aperture can be 1 stop smaller
    const isoStopsDiff = getIsoStopsDifference(REFERENCE_ISO, isoValue)

    // Calculate stops difference from reference EV
    // EV: +1 stop (brighter scene) means aperture can be 1 stop smaller
    const evStopsDiff = evValue - REFERENCE_EV

    // Adjust aperture based on all factors
    // For each stop of shutter, ISO, or EV, adjust aperture by √2 (one stop)
    const totalStopsDiff = shutterStopsDiff + isoStopsDiff + evStopsDiff
    requiredAperture = requiredAperture * Math.pow(Math.sqrt(2), totalStopsDiff)

    return requiredAperture
  }

  function calculateRequiredIsoForManual(apertureValue, shutterValue, evValue) {
    // Start with reference ISO
    let requiredIso = REFERENCE_ISO

    // Calculate stops difference from reference aperture
    // Aperture: +1 stop (smaller aperture) means half the light, so ISO needs to be 2x higher
    const apertureStopsDiff = getApertureStopsDifference(REFERENCE_APERTURE, apertureValue)

    // Calculate stops difference from reference shutter speed
    // Shutter: +1 stop (slower shutter) means double the light, so ISO can be 1 stop lower
    const shutterStopsDiff = getShutterStopsDifference(REFERENCE_SHUTTER_SPEED, shutterValue)

    // Calculate stops difference from reference EV
    // EV: +1 stop (brighter scene) means ISO can be 1 stop lower
    const evStopsDiff = evValue - REFERENCE_EV

    // Adjust ISO based on all factors
    // For aperture: positive stops (smaller aperture) means higher ISO (multiply by 2^stops)
    // For shutter: positive stops (slower shutter) means lower ISO (divide by 2^stops)
    // For EV: positive stops (brighter scene) means lower ISO (divide by 2^stops)
    requiredIso =
      (requiredIso * Math.pow(2, apertureStopsDiff)) / (Math.pow(2, shutterStopsDiff) * Math.pow(2, evStopsDiff))

    // Limit to available ISO range
    requiredIso = Math.max(standardIsoValues[0], Math.min(MAX_AUTO_ISO, requiredIso))

    return requiredIso
  }

  // Calculate the actual EV from camera settings
  function calculateActualEv(apertureValue, shutterValue, isoValue) {
    // The standard formula for EV at ISO 100 is:
    // EV100 = log2((aperture²) / shutter)
    // To adjust for ISO: EV = EV100 + log2(ISO/100)

    // Our reference point (f/5.6, 1/2000s, ISO 100) should give EV 12
    // But the standard formula gives EV 15.94 for these settings
    // So we need an offset of -3.94 to align with our scale
    const OFFSET = -3.94

    return log2((apertureValue * apertureValue) / shutterValue) + log2(100 / isoValue) + OFFSET
  }

  // Calculate EV differences from reference settings
  function calculateEvDifferences(currentAperture, currentShutter, currentIso) {
    // Calculate aperture EV difference from reference
    // Higher f-number = less light = positive EV
    const apertureDiff = getApertureStopsDifference(REFERENCE_APERTURE, currentAperture)

    // Calculate shutter EV difference from reference
    // Faster shutter (lower value) = less light = positive EV
    const shutterDiff = getShutterStopsDifference(REFERENCE_SHUTTER_SPEED, currentShutter)

    // Calculate ISO EV difference from reference
    // Higher ISO = more sensitivity = negative EV (for exposure calculation)
    // But we'll invert this in the UI display
    const isoDiff = getIsoStopsDifference(REFERENCE_ISO, currentIso)

    return { apertureDiff, shutterDiff, isoDiff }
  }

  // Calculate the required ISO for auto ISO mode in aperture priority
  function calculateRequiredIsoForAutoIso(apertureValue, evValue) {
    // We want to find the ISO that gives us a shutter speed of 1/60s
    // Start with the reference ISO
    let requiredIso = REFERENCE_ISO

    // Calculate the shutter speed we would get with the reference ISO
    const shutterWithReferenceIso = calculateRequiredShutterSpeed(apertureValue, evValue, requiredIso)

    // If the shutter speed is already faster than 1/60s, we don't need to increase ISO
    if (shutterWithReferenceIso <= MIN_SHUTTER_SPEED) {
      return requiredIso
    }

    // Calculate how many stops we need to increase ISO to get to 1/60s
    // Shutter speed and ISO have a reciprocal relationship: doubling ISO halves shutter speed
    const stopsNeeded = Math.log2(shutterWithReferenceIso / MIN_SHUTTER_SPEED)

    // Increase ISO by the required number of stops
    requiredIso = requiredIso * Math.pow(2, stopsNeeded)

    // Limit to maximum auto ISO
    requiredIso = Math.min(requiredIso, MAX_AUTO_ISO)

    return requiredIso
  }

  // Calculate the required ISO for auto ISO mode in shutter priority
  function calculateRequiredIsoForShutterPriority(shutterValue, evValue) {
    // First, calculate the required aperture with base ISO
    const requiredAperture = calculateRequiredAperture(shutterValue, evValue, REFERENCE_ISO)

    // Check if the required aperture is within our available range
    if (
      requiredAperture >= standardApertures[0] &&
      requiredAperture <= standardApertures[standardApertures.length - 1]
    ) {
      // If we can achieve correct exposure with aperture alone, use base ISO
      return REFERENCE_ISO
    }

    // If required aperture is too small (wider than our widest available)
    if (requiredAperture < standardApertures[0]) {
      // Calculate how many stops we need to increase ISO
      // Each stop of ISO allows the aperture to be √2 times larger (f-number smaller)
      const stopsNeeded = 2 * Math.log2(standardApertures[0] / requiredAperture)

      // Increase ISO by the required number of stops
      let requiredIso = REFERENCE_ISO * Math.pow(2, stopsNeeded)

      // Limit to maximum auto ISO
      requiredIso = Math.min(requiredIso, MAX_AUTO_ISO)

      return requiredIso
    }

    // If required aperture is too large (narrower than our narrowest available)
    if (requiredAperture > standardApertures[standardApertures.length - 1]) {
      // Calculate how many stops we need to decrease ISO
      // Each stop of ISO allows the aperture to be √2 times smaller (f-number larger)
      const stopsNeeded = 2 * Math.log2(requiredAperture / standardApertures[standardApertures.length - 1])

      // Decrease ISO by the required number of stops
      let requiredIso = REFERENCE_ISO / Math.pow(2, stopsNeeded)

      // Limit to minimum ISO
      requiredIso = Math.max(standardIsoValues[0], requiredIso)

      return requiredIso
    }

    // Default fallback
    return REFERENCE_ISO
  }

  // Update ISO in manual mode with Auto ISO
  function updateManualWithAutoIso(apertureValue, shutterValue, evValue) {
    // Calculate the required ISO for manual mode with auto ISO
    const requiredIso = calculateRequiredIsoForManual(apertureValue, shutterValue, evValue)

    // Find the closest standard ISO value
    const closestIsoIndex = findClosestIndex(standardIsoValues, requiredIso)

    // Update the ISO index
    isoIndex = closestIsoIndex
    userChangedIso = true

    // Update ISO display
    updateIsoDisplay()
  }

  // Initialize settings based on time of day
  function initializeSettingsForTimeOfDay(time) {
    const sceneEv = getEvForTimeOfDay(time)
    ev = sceneEv // Update the global EV value

    // Keep aperture at f/5.6 and ISO at 100 as reference
    apertureIndex = 12 // f/5.6
    isoIndex = 3 // ISO 100

    // Calculate the required shutter speed for this EV
    const requiredShutter = calculateRequiredShutterSpeed(REFERENCE_APERTURE, sceneEv, REFERENCE_ISO)

    // Find the closest standard shutter speed
    const closestIndex = findClosestIndex(standardShutterSpeeds, requiredShutter)
    shutterSpeedIndex = closestIndex

    // Reset user change flags
    userChangedAperture = false
    userChangedShutter = false
    userChangedIso = false

    // Update displays
    updateApertureDisplay()
    updateShutterDisplay()
    updateIsoDisplay()
  }

  // Update aperture display
  function updateApertureDisplay() {
    if (!apertureValue) return

    const aperture = standardApertures[apertureIndex]
    apertureValue.textContent = `f/${aperture}`
    if (apertureSlider) apertureSlider.value = apertureIndex

    // Update aperture tips
    updatePhotographyTips("aperture", aperture)

    // Update DOF visualization if active
    if (previewMode === "dof") {
      updateDofVisualization()
    }

    // Update EV differences
    updateEvDifferences()
  }

  // Update shutter display
  function updateShutterDisplay() {
    if (!shutterValue) return

    const shutter = standardShutterSpeeds[shutterSpeedIndex]
    shutterValue.textContent = formatShutterSpeed(shutter)
    if (shutterSlider) shutterSlider.value = shutterSpeedIndex

    // Update shutter tips
    updatePhotographyTips("shutter", shutter)

    // Update motion visualization if active
    if (previewMode === "motion") {
      updateMotionVisualization()
    }

    // Update EV differences
    updateEvDifferences()
  }

  // Update ISO display
  function updateIsoDisplay() {
    if (!isoValue) return

    const iso = standardIsoValues[isoIndex]
    isoValue.textContent = iso
    if (isoSlider) isoSlider.value = isoIndex

    // Update ISO tips
    updatePhotographyTips("iso", iso)

    // Update Auto ISO info
    updateAutoIsoInfo()

    // Update EV differences
    updateEvDifferences()
  }

  // Update Auto ISO info
  function updateAutoIsoInfo() {
    if (!autoIsoInfo) return

    if (autoIso) {
      autoIsoInfo.classList.remove("hidden")
      if (exposureMode === "aperture") {
        autoIsoInfo.textContent = "Auto ISO: Maintaining minimum shutter speed of 1/60s"
      } else if (exposureMode === "shutter") {
        autoIsoInfo.textContent = "Auto ISO: Adjusting ISO when aperture range is insufficient"
      } else if (exposureMode === "manual") {
        autoIsoInfo.textContent = "Auto ISO: Automatically adjusting ISO to achieve correct exposure"
      }
    } else {
      autoIsoInfo.classList.add("hidden")
    }
  }

  // Update photography tips
  function updatePhotographyTips(setting, value) {
    let tip = ""

    if (setting === "iso" && isoTips) {
      if (value <= 200) {
        tip = "Low ISO: Best for bright conditions. Produces clean images with minimal noise."
      } else if (value <= 800) {
        tip = "Medium ISO: Good for normal lighting. Balanced between noise and sensitivity."
      } else if (value <= 3200) {
        tip = "High ISO: Use in low light. May introduce noise but allows faster shutter speeds."
      } else {
        tip =
          "Very high ISO: For extremely low light. Will introduce significant noise but enables shooting in near darkness."
      }
      isoTips.textContent = tip
    } else if (setting === "aperture" && apertureTips) {
      if (value <= 2.8) {
        tip = "Wide aperture: Creates shallow depth of field. Great for portraits and isolating subjects."
      } else if (value <= 8) {
        tip = "Medium aperture: Good all-around choice. Balances depth of field and sharpness."
      } else if (value <= 16) {
        tip = "Narrow aperture: Creates deep depth of field. Ideal for landscapes where everything should be in focus."
      } else {
        tip =
          "Very narrow aperture: Maximum depth of field. Be aware of diffraction which may reduce overall sharpness."
      }
      apertureTips.textContent = tip
    } else if (setting === "shutter" && shutterTips) {
      if (value >= 1 / 60) {
        tip = "Slow shutter: Captures motion blur. Good for creative effects like flowing water or light trails."
      } else if (value >= 1 / 500) {
        tip = "Medium shutter: Good all-around choice for most situations. Freezes casual movement."
      } else {
        tip = "Fast shutter: Freezes fast action. Ideal for sports, wildlife, and capturing split-second moments."
      }
      shutterTips.textContent = tip
    }
  }

  // Update scene image
  function updateSceneImage() {
    console.log("Updating scene image for:", sceneType, timeOfDay)

    if (!sceneImage) {
      console.error("Scene image element not found")
      return
    }

    // Show loading state
    if (sceneLoading) {
      sceneLoading.classList.remove("hidden")
    }

    if (sceneError) {
      sceneError.classList.add("hidden")
    }

    // Get the image URL
    const imageUrl = sceneImageUrls[sceneType]?.[timeOfDay]
    console.log("Image URL:", imageUrl)

    if (!imageUrl) {
      // Handle missing image
      console.error("No image URL found for", sceneType, timeOfDay)
      if (sceneLoading) sceneLoading.classList.add("hidden")
      if (sceneError) sceneError.classList.remove("hidden")
      return
    }

    // Create a new image object to preload
    const img = new Image()

    // Set crossOrigin to allow processing images from external domains
    img.crossOrigin = "anonymous"

    img.onload = () => {
      console.log("Image loaded successfully:", imageUrl)
      // Once preloaded successfully, update the actual image
      sceneImage.src = imageUrl
      sceneImage.crossOrigin = "anonymous"
      if (sceneLoading) sceneLoading.classList.add("hidden")

      // Update scene description
      if (sceneDescription) {
        sceneDescription.textContent = `${sceneType.charAt(0).toUpperCase() + sceneType.slice(1)} at ${timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}`
      }

      // Update visualizations if active
      if (previewMode === "dof") {
        updateDofVisualization()
      } else if (previewMode === "motion") {
        updateMotionVisualization()
      }

      // Update histogram
      updateHistogram()
    }

    img.onerror = () => {
      console.error(`Failed to load image: ${imageUrl}`)
      if (sceneLoading) sceneLoading.classList.add("hidden")
      if (sceneError) sceneError.classList.remove("hidden")

      // Try to load a fallback image
      sceneImage.src = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=450&fit=crop&q=80"
      sceneImage.crossOrigin = "anonymous"
    }

    // Start loading the image
    console.log("Starting image load:", imageUrl)
    img.src = imageUrl
  }

  // Update DOF visualization
  function updateDofVisualization() {
    if (!dofZone || !dofIndicator || !dofExplanation || !dofCurrentSetting) return

    const aperture = standardApertures[apertureIndex]

    // Get aperture category
    let dofCategory
    if (aperture <= 2.8) {
      dofCategory = "shallow"
      dofZone.style.height = "25%"
      dofExplanation.textContent = "Small f-number = shallow focus (subject sharp, background blurred)"
    } else if (aperture <= 8) {
      dofCategory = "medium"
      dofZone.style.height = "50%"
      dofExplanation.textContent = "Medium f-number = moderate focus depth"
    } else {
      dofCategory = "deep"
      dofZone.style.height = "83.333%"
      dofExplanation.textContent = "Large f-number = deep focus (everything sharp)"
    }

    // Update DOF indicator
    dofIndicator.textContent = `f/${aperture} - ${dofCategory.charAt(0).toUpperCase() + dofCategory.slice(1)} DoF`

    // Update DOF current setting
    dofCurrentSetting.innerHTML = `Your current setting: <strong>f/${aperture}</strong> - ${dofCategory.charAt(0).toUpperCase() + dofCategory.slice(1)} depth of field`
  }

  // Update motion visualization
  function updateMotionVisualization() {
    console.log("Updating motion visualization")
    if (!motionLines) {
      console.error("Motion lines element not found!")
      return
    }

    // Make sure the motion overlay is visible
    if (motionOverlay) {
      motionOverlay.classList.remove("hidden")
    }

    const shutterSpeed = standardShutterSpeeds[shutterSpeedIndex]

    // Get shutter category
    let motionCategory
    if (shutterSpeed >= 1 / 15) {
      motionCategory = "very-slow"
      motionExplanation.textContent = "Slow shutter = long motion streaks (creative blur)"
    } else if (shutterSpeed >= 1 / 60) {
      motionCategory = "slow"
      motionExplanation.textContent = "Medium shutter = some motion blur"
    } else if (shutterSpeed >= 1 / 250) {
      motionCategory = "medium"
      motionExplanation.textContent = "Fast shutter = minimal motion blur"
    } else {
      motionCategory = "fast"
      motionExplanation.textContent = "Very fast shutter = frozen motion (sharp action)"
    }

    // Update motion indicator
    if (motionIndicator) {
      motionIndicator.textContent = `${formatShutterSpeed(shutterSpeed)} - ${
        motionCategory === "very-slow"
          ? "Significant Motion Blur"
          : motionCategory === "slow"
            ? "Moderate Motion Blur"
            : motionCategory === "medium"
              ? "Slight Motion Blur"
              : "Frozen Motion"
      }`
    }

    // Update motion current setting
    if (motionCurrentSetting) {
      motionCurrentSetting.innerHTML = `Your current setting: <strong>${formatShutterSpeed(shutterSpeed)}</strong> - ${
        motionCategory === "very-slow"
          ? "Significant motion blur"
          : motionCategory === "slow"
            ? "Moderate motion blur"
            : motionCategory === "medium"
              ? "Slight motion blur"
              : "Frozen motion"
      }`
    }

    // Clear existing motion lines
    while (motionLines.firstChild) {
      motionLines.removeChild(motionLines.firstChild)
    }

    console.log("Creating motion lines for category:", motionCategory)

    // Create lines based on motion category
    if (motionCategory === "very-slow") {
      // Create 15 long motion streaks across the entire image
      for (let i = 0; i < 15; i++) {
        try {
          const line = document.createElementNS("http://www.w3.org/2000/svg", "line")
          // Distribute lines across the full width and height
          const startX = 10 + i * 5
          const startY = 10 + i * 5
          const endX = 70 + i * 5
          const endY = 90 - i * 3

          line.setAttribute("x1", String(startX))
          line.setAttribute("y1", String(startY))
          line.setAttribute("x2", String(endX))
          line.setAttribute("y2", String(endY))
          line.setAttribute("stroke", "red")
          line.setAttribute("stroke-width", "1.5")
          line.setAttribute("stroke-opacity", "0.8")
          motionLines.appendChild(line)
        } catch (error) {
          console.error("Error creating SVG line:", error)
        }
      }
    } else if (motionCategory === "slow") {
      // Create 10 medium motion streaks
      for (let i = 0; i < 10; i++) {
        try {
          const line = document.createElementNS("http://www.w3.org/2000/svg", "line")
          // Distribute lines across the full width and height
          const startX = 20 + i * 6
          const startY = 20 + i * 4
          const endX = 60 + i * 6
          const endY = 80 - i * 2

          line.setAttribute("x1", String(startX))
          line.setAttribute("y1", String(startY))
          line.setAttribute("x2", String(endX))
          line.setAttribute("y2", String(endY))
          line.setAttribute("stroke", "red")
          line.setAttribute("stroke-width", "1.5")
          line.setAttribute("stroke-opacity", "0.8")
          motionLines.appendChild(line)
        } catch (error) {
          console.error("Error creating SVG line:", error)
        }
      }
    } else if (motionCategory === "medium") {
      // Create 8 short motion streaks
      for (let i = 0; i < 8; i++) {
        try {
          const line = document.createElementNS("http://www.w3.org/2000/svg", "line")
          // Distribute lines across the full width and height
          const startX = 30 + i * 5
          const startY = 30 + i * 3
          const endX = 50 + i * 5
          const endY = 70 - i * 1

          line.setAttribute("x1", String(startX))
          line.setAttribute("y1", String(startY))
          line.setAttribute("x2", String(endX))
          line.setAttribute("y2", String(endY))
          line.setAttribute("stroke", "red")
          line.setAttribute("stroke-width", "1.5")
          line.setAttribute("stroke-opacity", "0.8")
          motionLines.appendChild(line)
        } catch (error) {
          console.error("Error creating SVG line:", error)
        }
      }
    }
  }

  // Update histogram
  function updateHistogram() {
    if (!histogramContainer) return

    // Clear existing histogram
    histogramContainer.innerHTML = ""

    // Generate histogram data based on scene type and time of day
    // Using a deterministic approach instead of random values
    const data = Array(32).fill(0)

    // Create a seed value from the scene type and time of day to ensure consistency
    const seed = `${sceneType}-${timeOfDay}`.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)

    // Deterministic "random" function based on the seed
    const seededRandom = (index) => {
      const value = Math.sin(seed + index) * 10000
      return Math.abs(value - Math.floor(value))
    }

    if (sceneType === "landscape") {
      // Landscape scenes tend to have more mid to high values
      for (let i = 0; i < data.length; i++) {
        if (i < 8) {
          data[i] = 10 + seededRandom(i) * 20
        } else if (i < 16) {
          data[i] = 20 + seededRandom(i) * 40
        } else if (i < 24) {
          data[i] = 40 + seededRandom(i) * 40
        } else {
          data[i] = 20 + seededRandom(i) * 30
        }
      }
    } else if (timeOfDay === "night") {
      // Night scenes tend to have more low values
      for (let i = 0; i < data.length; i++) {
        if (i < 12) {
          data[i] = 40 + seededRandom(i) * 40
        } else if (i < 20) {
          data[i] = 20 + seededRandom(i) * 30
        } else {
          data[i] = 5 + seededRandom(i) * 10
        }
      }
    } else if (sceneType === "forest") {
      // Forest scenes tend to have more mid to low values
      for (let i = 0; i < data.length; i++) {
        if (i < 12) {
          data[i] = 20 + seededRandom(i) * 40
        } else if (i < 24) {
          data[i] = 30 + seededRandom(i) * 30
        } else {
          data[i] = 10 + seededRandom(i) * 20
        }
      }
    } else {
      // Default for other scene types
      for (let i = 0; i < data.length; i++) {
        data[i] = 10 + seededRandom(i) * 40
      }
    }

    // If exposure is incorrect, shift the histogram
    if (!exposureCorrect) {
      // For underexposure (negative difference), shift left (data pushed to shadows/left side)
      // For overexposure (positive difference), shift right (data pushed to highlights/right side)

      // Get a shift value based on the exposure difference
      // Limit the shift to a reasonable range (max 8 pixels, which is 1/4 of the histogram width)
      let shift = 0

      const aperture = standardApertures[apertureIndex]
      const shutter = standardShutterSpeeds[shutterSpeedIndex]
      const iso = standardIsoValues[isoIndex]
      const calculatedEv = calculateActualEv(aperture, shutter, iso)
      const exposureDifference = ev - calculatedEv

      if (exposureDifference < 0) {
        // Underexposed - shift left
        shift = -Math.min(8, Math.round(Math.abs(exposureDifference) * 2))
      } else if (exposureDifference > 0) {
        // Overexposed - shift right
        shift = Math.min(8, Math.round(Math.abs(exposureDifference) * 2))
      }

      if (shift > 0) {
        // Shift right (overexposed)
        for (let i = data.length - 1; i >= shift; i--) {
          data[i] = data[i - shift]
        }
        for (let i = 0; i < shift; i++) {
          data[i] = 0
        }
      } else if (shift < 0) {
        // Shift left (underexposed)
        const absShift = Math.abs(shift)
        for (let i = 0; i < data.length - absShift; i++) {
          data[i] = data[i + absShift]
        }
        for (let i = data.length - absShift; i < data.length; i++) {
          data[i] = 0
        }
      }
    }

    // Find the maximum value for scaling
    const maxValue = Math.max(...data)

    // Create histogram bars
    for (let i = 0; i < data.length; i++) {
      const barContainer = document.createElement("div")
      barContainer.className = "histogram-bar"

      // Determine the color based on the position in the histogram
      let barColor

      if (i < 8) {
        barColor = "#1d4ed8" // Shadows (left side) - blue
      } else if (i >= 24) {
        barColor = "#b91c1c" // Highlights (right side) - red
      } else {
        barColor = "#374151" // Midtones - gray
      }

      const bar = document.createElement("div")
      bar.className = "histogram-bar-fill"
      bar.style.backgroundColor = barColor
      bar.style.height = `${(data[i] / maxValue) * 100}%`

      barContainer.appendChild(bar)
      histogramContainer.appendChild(barContainer)
    }
  }

  // Initialize the application
  function initialize() {
    console.log("Initializing exposure calculator...")

    // Set current year
    if (currentYear) {
      currentYear.textContent = new Date().getFullYear()
    }

    // Initialize exposure mode
    setExposureMode("aperture")

    // Initialize preview mode
    setPreviewMode("normal")

    // Set initial values for scene type and time of day
    if (sceneTypeSelect) {
      sceneType = sceneTypeSelect.value || "landscape"
    }

    if (timeOfDaySelect) {
      timeOfDay = timeOfDaySelect.value || "midday"
    }

    // Initialize auto ISO to false
    autoIso = false
    if (autoIsoCheckbox) {
      autoIsoCheckbox.checked = false
    }

    // Calculate initial EV based on time of day
    ev = getEvForTimeOfDay(timeOfDay)

    // Initialize settings for the current time of day
    initializeSettingsForTimeOfDay(timeOfDay)

    // Update scene image
    setTimeout(() => {
      updateSceneImage()
      // Update displays
      updateAllDisplays()
      console.log("Initialization complete.")
      initialized = true
    }, 500)
  }

  // Add this function to update the exposure slider visualization
  function updateExposureSliderVisualization() {
    const apertureSliderIndicator = document.getElementById("aperture-slider-indicator")
    const shutterSliderIndicator = document.getElementById("shutter-slider-indicator")
    const isoSliderIndicator = document.getElementById("iso-slider-indicator")
    const apertureSliderValue = document.getElementById("aperture-slider-value")
    const shutterSliderValue = document.getElementById("shutter-slider-value")
    const isoSliderValue = document.getElementById("iso-slider-value")
    const totalExposureValue = document.getElementById("total-exposure-value")
    const totalExposureDescription = document.getElementById("total-exposure-description")
    const exposureModeExplanation = document.getElementById("exposure-mode-explanation")

    if (
      !apertureSliderIndicator ||
      !shutterSliderIndicator ||
      !isoSliderIndicator ||
      !apertureSliderValue ||
      !shutterSliderValue ||
      !isoSliderValue ||
      !totalExposureValue ||
      !totalExposureDescription ||
      !exposureModeExplanation
    ) {
      return
    }

    // Calculate display values based on exposure mode
    let displayApertureEvDiff = apertureEvDiff
    let displayShutterEvDiff = shutterEvDiff
    // Invert ISO EV diff for display - higher ISO means more light (positive effect on exposure)
    const displayIsoEvDiff = -isoEvDiff

    // In aperture priority mode:
    if (exposureMode === "aperture") {
      // The shutter speed should show the opposite of BOTH aperture AND ISO changes
      displayShutterEvDiff = -(apertureEvDiff - isoEvDiff)
      exposureModeExplanation.textContent =
        "In Aperture Priority mode, changing aperture or ISO will automatically adjust shutter speed to maintain exposure."
    }
    // In shutter priority mode:
    else if (exposureMode === "shutter") {
      // The aperture should show the opposite of BOTH shutter AND ISO changes
      displayApertureEvDiff = -(shutterEvDiff - isoEvDiff)
      exposureModeExplanation.textContent =
        "In Shutter Priority mode, changing shutter speed or ISO will automatically adjust aperture to maintain exposure."
    }
    // In manual mode:
    else {
      exposureModeExplanation.textContent =
        "In Manual mode, you must balance all three settings yourself to achieve proper exposure."
    }

    // Calculate slider positions based on EV differences
    // Center position is 50%, each stop is ~15% in either direction
    const getSliderPosition = (evDiff) => {
      // Limit to +/- 3 stops for display purposes
      const limitedDiff = Math.max(-3, Math.min(3, evDiff))
      // Use 15% per stop to make the movement more noticeable
      return 50 + limitedDiff * 15
    }

    // Format EV differences for display
    const formatEvDiff = (diff) => {
      return `${diff > 0 ? "+" : diff < 0 ? "-" : ""}${Math.abs(diff).toFixed(1)} EV`
    }

    // Update slider indicators and values
    apertureSliderIndicator.style.left = `${getSliderPosition(displayApertureEvDiff)}%`
    shutterSliderIndicator.style.left = `${getSliderPosition(displayShutterEvDiff)}%`
    isoSliderIndicator.style.left = `${getSliderPosition(displayIsoEvDiff)}%`

    apertureSliderValue.textContent = formatEvDiff(displayApertureEvDiff)
    shutterSliderValue.textContent = formatEvDiff(displayShutterEvDiff)
    isoSliderValue.textContent = formatEvDiff(displayIsoEvDiff)

    // Set colors based on values
    apertureSliderValue.className =
      "slider-value " + (displayApertureEvDiff > 0 ? "text-red-600" : displayApertureEvDiff < 0 ? "text-green-600" : "")

    shutterSliderValue.className =
      "slider-value " + (displayShutterEvDiff > 0 ? "text-red-600" : displayShutterEvDiff < 0 ? "text-green-600" : "")

    isoSliderValue.className =
      "slider-value " + (displayIsoEvDiff > 0 ? "text-red-600" : displayIsoEvDiff < 0 ? "text-green-600" : "")

    // Set indicator colors based on exposure mode
    if (exposureMode === "aperture") {
      apertureSliderIndicator.style.backgroundColor = "#16a34a" // green
      shutterSliderIndicator.style.backgroundColor = "#ef4444" // red
      isoSliderIndicator.style.backgroundColor = "#f97316" // orange
    } else if (exposureMode === "shutter") {
      apertureSliderIndicator.style.backgroundColor = "#ef4444" // red
      shutterSliderIndicator.style.backgroundColor = "#16a34a" // green
      isoSliderIndicator.style.backgroundColor = "#f97316" // orange
    } else {
      apertureSliderIndicator.style.backgroundColor = "#3b82f6" // blue
      shutterSliderIndicator.style.backgroundColor = "#3b82f6" // blue
      isoSliderIndicator.style.backgroundColor = "#f97316" // orange
    }

    // Calculate total EV adjustment based on exposure mode
    let totalEvAdjustment = 0

    if (exposureMode === "manual") {
      // In manual mode, all three factors contribute to the total adjustment
      totalEvAdjustment = apertureEvDiff + shutterEvDiff - isoEvDiff
    } else {
      // In aperture or shutter priority modes, the camera automatically compensates
      // So the total should be 0 if the camera is perfectly compensating
      totalEvAdjustment = 0
    }

    // Update total exposure value
    totalExposureValue.textContent =
      Math.abs(totalEvAdjustment) < 0.1
        ? "0.0 EV"
        : `${totalEvAdjustment > 0 ? "+" : ""}${totalEvAdjustment.toFixed(1)} EV`

    totalExposureValue.className =
      "total-exposure-value " +
      (Math.abs(totalEvAdjustment) < 0.1 ? "" : totalEvAdjustment > 0 ? "text-red-600" : "text-green-600")

    // Update total exposure description
    totalExposureDescription.textContent =
      Math.abs(totalEvAdjustment) < 0.1
        ? "Correct exposure"
        : totalEvAdjustment > 0
          ? '  < 0.1\
          ? "Correct exposure'
          : totalEvAdjustment > 0
            ? "Overexposed: Image will be brighter than ideal"
            : "Underexposed: Image will be darker than ideal"
  }

  // Add this function to update the EV indicators
  function updateEvIndicators() {
    const apertureEvIndicator = document.getElementById("aperture-ev-indicator")
    const shutterEvIndicator = document.getElementById("shutter-ev-indicator")
    const isoEvIndicator = document.getElementById("iso-ev-indicator")

    if (!apertureEvIndicator || !shutterEvIndicator || !isoEvIndicator) return

    // Calculate display values based on exposure mode
    let displayApertureEvDiff = apertureEvDiff
    let displayShutterEvDiff = shutterEvDiff
    // Invert ISO EV diff for display - higher ISO means more light (positive effect on exposure)
    const displayIsoEvDiff = -isoEvDiff

    // In aperture priority mode:
    if (exposureMode === "aperture") {
      // The shutter speed should show the opposite of BOTH aperture AND ISO changes
      displayShutterEvDiff = -(apertureEvDiff - isoEvDiff)
    }
    // In shutter priority mode:
    else if (exposureMode === "shutter") {
      // The aperture should show the opposite of BOTH shutter AND ISO changes
      displayApertureEvDiff = -(shutterEvDiff - isoEvDiff)
    }

    // Format EV differences for display
    const formatEvDiff = (diff) => {
      return `${diff > 0 ? "+" : diff < 0 ? "-" : ""}${Math.abs(diff).toFixed(1)}`
    }

    // Update the indicators with formatted values and appropriate colors
    if (userChangedAperture) {
      apertureEvIndicator.textContent = `${formatEvDiff(displayApertureEvDiff)} stops`
      apertureEvIndicator.className =
        "ev-indicator " +
        (displayApertureEvDiff > 0 ? "text-red-600" : displayApertureEvDiff < 0 ? "text-green-600" : "text-gray-600")
    } else {
      apertureEvIndicator.textContent = ""
    }

    if (userChangedShutter) {
      shutterEvIndicator.textContent = `${formatEvDiff(displayShutterEvDiff)} stops`
      shutterEvIndicator.className =
        "ev-indicator " +
        (displayShutterEvDiff > 0 ? "text-red-600" : displayShutterEvDiff < 0 ? "text-green-600" : "text-gray-600")
    } else {
      shutterEvIndicator.textContent = ""
    }

    if (userChangedIso) {
      isoEvIndicator.textContent = `${formatEvDiff(displayIsoEvDiff)} stops`
      isoEvIndicator.className =
        "ev-indicator " +
        (displayIsoEvDiff > 0 ? "text-red-600" : displayIsoEvDiff < 0 ? "text-green-600" : "text-gray-600")
    } else {
      isoEvIndicator.textContent = ""
    }
  }

  // Update EV differences
  function updateEvDifferences() {
    const aperture = standardApertures[apertureIndex]
    const shutter = standardShutterSpeeds[shutterSpeedIndex]
    const iso = standardIsoValues[isoIndex]

    // Calculate EV differences from reference settings
    const { apertureDiff, shutterDiff, isoDiff } = calculateEvDifferences(aperture, shutter, iso)

    // Update the EV differences
    apertureEvDiff = apertureDiff
    shutterEvDiff = shutterDiff
    isoEvDiff = isoDiff

    // Update EV indicators
    updateEvIndicators()

    // Update exposure slider visualization
    updateExposureSliderVisualization()

    // Update exposure meter
    updateExposureMeter()
  }

  // Update exposure meter
  function updateExposureMeter() {
    if (!exposureMeterNeedle || !exposureMeterStatus) return

    const aperture = standardApertures[apertureIndex]
    const shutter = standardShutterSpeeds[shutterSpeedIndex]
    const iso = standardIsoValues[isoIndex]

    // Calculate the actual EV from current camera settings
    const calculatedEv = calculateActualEv(aperture, shutter, iso)

    // Calculate the difference between the calculated EV and scene EV
    const evDifference = ev - calculatedEv

    // Determine if the exposure is correct
    exposureCorrect = Math.abs(evDifference) < 0.5

    // Determine the position of the needle on the meter
    // Range from -6 to +6 stops
    const needlePosition = Math.max(-6, Math.min(6, evDifference))
    const needlePercentage = ((needlePosition + 6) / 12) * 100

    // Update the needle position
    exposureMeterNeedle.style.left = `${needlePercentage}%`

    // Update the exposure status text
    if (exposureCorrect) {
      exposureMeterStatus.textContent = "Correct Exposure"
      exposureMeterStatus.className = "meter-status text-green-600"
    } else {
      exposureMeterStatus.textContent = `${evDifference < 0 ? "Underexposed" : "Overexposed"} (${evDifference < 0 ? "" : "+"}${Math.abs(evDifference).toFixed(1)} stops)`
      exposureMeterStatus.className = "meter-status text-red-600"
    }

    // Update exposure indicator on the image if needed
    if (exposureIndicator) {
      if (exposureCorrect) {
        exposureIndicator.classList.add("hidden")
      } else {
        exposureIndicator.textContent = `${evDifference < 0 ? "Underexposed" : "Overexposed"} by ${Math.abs(evDifference).toFixed(1)} stops`
        exposureIndicator.classList.remove("hidden")
      }
    }

    // Apply visual effect to the image based on exposure
    if (sceneImage && !exposureCorrect) {
      if (evDifference < 0) {
        // Underexposed
        const brightnessPercent = Math.pow(0.5, Math.abs(evDifference))
        sceneImage.style.filter = `brightness(${brightnessPercent})`
      } else {
        // Overexposed
        const brightnessPercent = Math.pow(2, evDifference)
        sceneImage.style.filter = `brightness(${Math.min(2, brightnessPercent)})`
      }
    } else if (sceneImage) {
      sceneImage.style.filter = ""
    }

    // Update exposure tips based on exposure correctness
    if (exposureTipsCorrect && exposureTipsIncorrect && exposureTipsTitle && exposureTipsDescription) {
      if (exposureCorrect) {
        exposureTipsCorrect.classList.remove("hidden")
        exposureTipsIncorrect.classList.add("hidden")
      } else if (!bulbMode) {
        exposureTipsCorrect.classList.add("hidden")
        exposureTipsIncorrect.classList.remove("hidden")

        // Set the title and description based on exposure difference
        exposureTipsTitle.textContent = `${evDifference < 0 ? "Underexposed" : "Overexposed"} by ${Math.abs(evDifference).toFixed(1)} stops`
        exposureTipsTitle.className = "tips-title text-red-600 font-bold"

        exposureTipsDescription.textContent =
          evDifference < 0
            ? "Your image is too dark. Consider these adjustments:"
            : "Your image is too bright. Consider these adjustments:"

        // Update suggestions based on under/overexposure
        if (exposureTipsSuggestions) {
          if (evDifference < 0) {
            // Underexposure suggestions
            exposureTipsSuggestions.innerHTML = `
            <li>Increase ISO to boost sensitivity (allows faster shutter speeds but introduces more noise)</li>
            <li>Use slower shutter speed (lower number like 1/30 instead of 1/125)</li>
            <li>Use wider aperture (lower f-number like f/2.8 instead of f/8) to let in more light</li>
          `
          } else {
            // Overexposure suggestions
            exposureTipsSuggestions.innerHTML = `
            <li>Decrease ISO to reduce sensitivity (improves image quality)</li>
            <li>Use faster shutter speed (higher number like 1/250 instead of 1/60)</li>
            <li>Use smaller aperture (higher f-number like f/11 instead of f/5.6)</li>
          `
          }
        }
      }
    }

    // Check if we need bulb mode warning
    const requiredShutter = calculateRequiredShutterSpeed(aperture, ev, iso)
    if (requiredShutter > 30) {
      // Format the time for bulb mode
      let bulbTime = ""
      if (requiredShutter > 60) {
        const minutes = Math.floor(requiredShutter / 60)
        const seconds = Math.round(requiredShutter % 60)
        bulbTime = `${minutes}m ${seconds}s`
      } else {
        bulbTime = `${Math.round(requiredShutter)}s`
      }

      // Update bulb mode UI
      if (exposureTipsBulb && bulbExposureTimeSpan) {
        exposureTipsCorrect.classList.add("hidden")
        exposureTipsIncorrect.classList.add("hidden")
        exposureTipsBulb.classList.remove("hidden")
        bulbExposureTimeSpan.textContent = bulbTime
        bulbExposureTimeSpan.className = "text-red-600 font-bold"

        // Set the bulb warning title and suggestions
        if (exposureTipsTitle) {
          exposureTipsTitle.textContent = "Bulb Mode Required: Exposure time longer than 30 seconds"
          exposureTipsTitle.className = "tips-title text-amber-500 font-bold"
        }
        if (exposureTipsDescription) {
          exposureTipsDescription.textContent = `Recommended exposure time: ${bulbTime}`
          exposureTipsDescription.className = "text-amber-700 mb-2"
        }
        if (exposureTipsSuggestions) {
          exposureTipsSuggestions.innerHTML =
            "<strong>Important:</strong> A sturdy tripod is essential for bulb mode exposures to prevent camera shake. " +
            "Use a remote shutter release or timer to avoid touching the camera during exposure.<br><br>" +
            "<strong>Consider these adjustments to avoid bulb mode:</strong><br>" +
            "• Increase ISO (will introduce more noise)<br>" +
            "• Use a wider aperture (lower f-number)<br>" +
            "• Add additional lighting to the scene if possible"
          exposureTipsSuggestions.className = "text-amber-700"
        }
      }
    } else {
      // Hide bulb mode UI if no longer needed
      if (exposureTipsBulb) {
        exposureTipsBulb.classList.add("hidden")

        // Show correct or incorrect exposure tips based on exposure correctness
        if (exposureCorrect) {
          exposureTipsCorrect.classList.remove("hidden")
          exposureTipsIncorrect.classList.add("hidden")
        } else {
          exposureTipsCorrect.classList.add("hidden")
          exposureTipsIncorrect.classList.remove("hidden")
        }
      }
    }

    // Update histogram to reflect exposure changes
    updateHistogram()

    // Call debug function
    debugExposureCalculation()
  }

  // Update all displays
  function updateAllDisplays() {
    updateApertureDisplay()
    updateShutterDisplay()
    updateIsoDisplay()
    updateEvDifferences() // This will call updateEvIndicators and updateExposureSliderVisualization
    updateExposureMeter()
    updateHistogram()
    updateDebugDisplay() // Add this line

    // Update visualizations based on current preview mode
    if (previewMode === "dof") {
      updateDofVisualization()
    } else if (previewMode === "motion") {
      updateMotionVisualization()
    }
  }

  // Set exposure mode
  function setExposureMode(mode) {
    exposureMode = mode

    // Update tab UI
    document.querySelectorAll(".exposure-mode-tabs .tab-trigger").forEach((tab) => {
      if (tab.dataset.mode === mode) {
        tab.classList.add("active")
      } else {
        tab.classList.remove("active")
      }
    })

    // Enable/disable sliders based on mode
    if (apertureSlider) {
      apertureSlider.disabled = mode === "shutter"
    }

    if (shutterSlider) {
      shutterSlider.disabled = mode === "aperture"
    }

    if (isoSlider) {
      isoSlider.disabled = autoIso
    }

    // Update displays
    updateAllDisplays()
  }

  // Set preview mode
  function setPreviewMode(mode) {
    previewMode = mode

    // Update tab UI
    document.querySelectorAll(".preview-mode-tabs .tab-trigger").forEach((tab) => {
      if (tab.dataset.preview === mode) {
        tab.classList.add("active")
      } else {
        tab.classList.remove("active")
      }
    })

    // Show/hide appropriate overlays
    if (dofOverlay) {
      dofOverlay.classList.toggle("hidden", mode !== "dof")
    }

    if (motionOverlay) {
      motionOverlay.classList.toggle("hidden", mode !== "motion")
    }

    if (dofInfo) {
      dofInfo.classList.toggle("hidden", mode !== "dof")
    }

    if (motionInfo) {
      motionInfo.classList.toggle("hidden", mode !== "motion")
    }

    // Update visualizations if needed
    if (mode === "dof") {
      updateDofVisualization()
    } else if (mode === "motion") {
      updateMotionVisualization()
    }
  }

  // Event Listeners
  if (sceneTypeSelect) {
    sceneTypeSelect.addEventListener("change", function () {
      sceneType = this.value
      updateSceneImage()
      updateExposureMeter()
    })
  }

  if (timeOfDaySelect) {
    timeOfDaySelect.addEventListener("change", function () {
      timeOfDay = this.value
      ev = getEvForTimeOfDay(timeOfDay)
      initializeSettingsForTimeOfDay(timeOfDay)
      updateSceneImage()
      updateExposureMeter()

      // If Auto ISO is enabled, recalculate ISO based on new EV
      if (autoIso) {
        const aperture = standardApertures[apertureIndex]
        const shutter = standardShutterSpeeds[shutterSpeedIndex]

        if (exposureMode === "aperture") {
          updateAutoIso(aperture, ev)
        } else if (exposureMode === "shutter") {
          updateShutterPriorityWithAutoIso(shutter, ev)
        } else if (exposureMode === "manual") {
          updateManualWithAutoIso(aperture, shutter, ev)
        }
      }
    })
  }

  if (apertureSlider) {
    apertureSlider.addEventListener("input", function () {
      apertureIndex = Number.parseInt(this.value)
      userChangedAperture = true
      updateApertureDisplay()

      // In aperture priority mode, adjust shutter speed
      if (exposureMode === "aperture") {
        const aperture = standardApertures[apertureIndex]

        // If Auto ISO is enabled, recalculate ISO based on new aperture
        if (autoIso) {
          const requiredIso = calculateRequiredIsoForAutoIso(aperture, ev)
          const closestIsoIndex = findClosestIndex(standardIsoValues, requiredIso)
          isoIndex = closestIsoIndex
          updateIsoDisplay()

          // Calculate the shutter speed with this ISO
          const requiredShutter = calculateRequiredShutterSpeed(aperture, ev, standardIsoValues[isoIndex])
          const closestShutterIndex = findClosestIndex(standardShutterSpeeds, requiredShutter)
          shutterSpeedIndex = closestShutterIndex
          updateShutterDisplay()
        } else {
          const requiredShutter = calculateRequiredShutterSpeed(aperture, ev, standardIsoValues[isoIndex])
          const closestShutterIndex = findClosestIndex(standardShutterSpeeds, requiredShutter)
          shutterSpeedIndex = closestShutterIndex
          updateShutterDisplay()
        }

        // Check if we need to show bulb mode warning
        const requiredShutter = calculateRequiredShutterSpeed(aperture, ev, standardIsoValues[isoIndex])
        if (requiredShutter > 30 && !autoIso) {
          // Format the time for bulb mode
          let bulbTime = ""
          if (requiredShutter > 60) {
            const minutes = Math.floor(requiredShutter / 60)
            const seconds = Math.round(requiredShutter % 60)
            bulbTime = `${minutes}m ${seconds}s`
          } else {
            bulbTime = `${Math.round(requiredShutter)}s`
          }

          // Update bulb mode UI
          if (exposureTipsBulb && bulbExposureTimeSpan) {
            exposureTipsCorrect.classList.add("hidden")
            exposureTipsIncorrect.classList.add("hidden")
            exposureTipsBulb.classList.remove("hidden")
            bulbExposureTimeSpan.textContent = bulbTime
            bulbExposureTimeSpan.className = "text-red-600 font-bold"

            // Set the bulb warning title and suggestions
            if (exposureTipsTitle) {
              exposureTipsTitle.textContent = "Bulb Mode Required: Exposure time longer than 30 seconds"
              exposureTipsTitle.className = "tips-title text-amber-500 font-bold"
            }
            if (exposureTipsDescription) {
              exposureTipsDescription.textContent = `Recommended exposure time: ${bulbTime}`
              exposureTipsDescription.className = "text-amber-700 mb-2"
            }
            if (exposureTipsSuggestions) {
              exposureTipsSuggestions.innerHTML =
                "<strong>Important:</strong> A sturdy tripod is essential for bulb mode exposures to prevent camera shake. " +
                "Use a remote shutter release or timer to avoid touching the camera during exposure.<br><br>" +
                "<strong>Consider these adjustments to avoid bulb mode:</strong><br>" +
                "• Increase ISO (will introduce more noise)<br>" +
                "• Use a wider aperture (lower f-number)<br>" +
                "• Add additional lighting to the scene if possible"
              exposureTipsSuggestions.className = "text-amber-700"
            }
          }
        } else if (exposureTipsBulb) {
          // Hide bulb mode UI if no longer needed
          exposureTipsBulb.classList.add("hidden")
          exposureTipsCorrect.classList.remove("hidden")
        }
      } else if (exposureMode === "manual" && autoIso) {
        // In manual mode with Auto ISO, adjust ISO
        const aperture = standardApertures[apertureIndex]
        const shutter = standardShutterSpeeds[shutterSpeedIndex]
        updateManualWithAutoIso(aperture, shutter, ev)
      }

      updateExposureMeter()
    })
  }

  if (shutterSlider) {
    shutterSlider.addEventListener("input", function () {
      // Store the previous value for comparison
      const previousIndex = shutterSpeedIndex

      // Update the shutter speed index
      shutterSpeedIndex = Number.parseInt(this.value)
      userChangedShutter = true

      // Log the change for debugging
      console.log(`Shutter slider changed: ${previousIndex} -> ${shutterSpeedIndex}, mode: ${exposureMode}`)

      // Update the display immediately
      updateShutterDisplay()

      // In shutter priority mode, adjust aperture
      if (exposureMode === "shutter") {
        const shutter = standardShutterSpeeds[shutterSpeedIndex]

        // If Auto ISO is enabled, recalculate ISO based on new shutter speed
        if (autoIso) {
          const requiredIso = calculateRequiredIsoForShutterPriority(shutter, ev)
          const closestIsoIndex = findClosestIndex(standardIsoValues, requiredIso)
          isoIndex = closestIsoIndex
          updateIsoDisplay()

          // Calculate the aperture with this ISO
          const requiredAperture = calculateRequiredAperture(shutter, ev, standardIsoValues[isoIndex])
          const closestApertureIndex = findClosestIndex(standardApertures, requiredAperture)
          apertureIndex = closestApertureIndex
          updateApertureDisplay()
        } else {
          const requiredAperture = calculateRequiredAperture(shutter, ev, standardIsoValues[isoIndex])
          const closestApertureIndex = findClosestIndex(standardApertures, requiredAperture)
          apertureIndex = closestApertureIndex
          updateApertureDisplay()
        }
      } else if (exposureMode === "manual" && autoIso) {
        // In manual mode with Auto ISO, adjust ISO
        const aperture = standardApertures[apertureIndex]
        const shutter = standardShutterSpeeds[shutterSpeedIndex]
        updateManualWithAutoIso(aperture, shutter, ev)
      }

      // Update exposure meter and other displays
      updateExposureMeter()
      updateEvDifferences()
    })
  }

  if (isoSlider) {
    isoSlider.addEventListener("input", function () {
      isoIndex = Number.parseInt(this.value)
      userChangedIso = true
      updateIsoDisplay()

      // Adjust other settings based on exposure mode
      if (exposureMode === "aperture") {
        // In aperture priority, adjust shutter speed
        const aperture = standardApertures[apertureIndex]
        const requiredShutter = calculateRequiredShutterSpeed(aperture, ev, standardIsoValues[isoIndex])
        const closestShutterIndex = findClosestIndex(standardShutterSpeeds, requiredShutter)
        shutterSpeedIndex = closestShutterIndex
        updateShutterDisplay()

        // Check if we need to show bulb mode warning
        if (requiredShutter > 30 && !autoIso) {
          // Format the time for bulb mode
          let bulbTime = ""
          if (requiredShutter > 60) {
            const minutes = Math.floor(requiredShutter / 60)
            const seconds = Math.round(requiredShutter % 60)
            bulbTime = `${minutes}m ${seconds}s`
          } else {
            bulbTime = `${Math.round(requiredShutter)}s`
          }

          // Update bulb mode UI
          if (exposureTipsBulb && bulbExposureTimeSpan) {
            exposureTipsCorrect.classList.add("hidden")
            exposureTipsIncorrect.classList.add("hidden")
            exposureTipsBulb.classList.remove("hidden")
            bulbExposureTimeSpan.textContent = bulbTime
            bulbExposureTimeSpan.className = "text-red-600 font-bold"

            // Set the bulb warning title and suggestions
            if (exposureTipsTitle) {
              exposureTipsTitle.textContent = "Bulb Mode Required: Exposure time longer than 30 seconds"
              exposureTipsTitle.className = "tips-title text-amber-500 font-bold"
            }
            if (exposureTipsDescription) {
              exposureTipsDescription.textContent = `Recommended exposure time: ${bulbTime}`
              exposureTipsDescription.className = "text-amber-700 mb-2"
            }
            if (exposureTipsSuggestions) {
              exposureTipsSuggestions.innerHTML =
                "<strong>Important:</strong> A sturdy tripod is essential for bulb mode exposures to prevent camera shake. " +
                "Use a remote shutter release or timer to avoid touching the camera during exposure.<br><br>" +
                "<strong>Consider these adjustments to avoid bulb mode:</strong><br>" +
                "• Increase ISO (will introduce more noise)<br>" +
                "• Use a wider aperture (lower f-number)<br>" +
                "• Add additional lighting to the scene if possible"
              exposureTipsSuggestions.className = "text-amber-700"
            }
          }
        } else if (exposureTipsBulb) {
          // Hide bulb mode UI if no longer needed
          exposureTipsBulb.classList.add("hidden")
          exposureTipsCorrect.classList.remove("hidden")
        }
      } else if (exposureMode === "shutter") {
        // In shutter priority, adjust aperture
        const shutter = standardShutterSpeeds[shutterSpeedIndex]
        const requiredAperture = calculateRequiredAperture(shutter, ev, standardIsoValues[isoIndex])
        const closestApertureIndex = findClosestIndex(standardApertures, requiredAperture)
        apertureIndex = closestApertureIndex
        updateApertureDisplay()
      }

      updateExposureMeter()
    })
  }

  if (autoIsoCheckbox) {
    autoIsoCheckbox.addEventListener("change", function () {
      console.log("Auto ISO checkbox changed:", this.checked)
      autoIso = this.checked

      // Update ISO slider state
      if (isoSlider) {
        isoSlider.disabled = autoIso
        isoSlider.classList.toggle("disabled", autoIso)
      }

      // Make Auto ISO info visible
      if (autoIsoInfo) {
        autoIsoInfo.classList.toggle("hidden", !autoIso)

        if (autoIso) {
          if (exposureMode === "aperture") {
            autoIsoInfo.textContent = "Auto ISO: Maintaining minimum shutter speed of 1/60s"
          } else if (exposureMode === "shutter") {
            autoIsoInfo.textContent = "Auto ISO: Adjusting ISO when aperture range is insufficient"
          } else if (exposureMode === "manual") {
            autoIsoInfo.textContent = "Auto ISO: Automatically adjusting ISO to achieve correct exposure"
          }
        }
      }

      // Update settings based on exposure mode and auto ISO status
      if (autoIso) {
        console.log("Updating settings for Auto ISO mode:", exposureMode)

        // Get current values
        const aperture = standardApertures[apertureIndex]
        const shutter = standardShutterSpeeds[shutterSpeedIndex]

        if (exposureMode === "aperture") {
          const requiredIso = calculateRequiredIsoForAutoIso(aperture, ev)
          const closestIsoIndex = findClosestIndex(standardIsoValues, requiredIso)
          isoIndex = closestIsoIndex
          updateIsoDisplay()

          // Calculate the shutter speed with this ISO
          const requiredShutter = calculateRequiredShutterSpeed(aperture, ev, standardIsoValues[isoIndex])
          const closestShutterIndex = findClosestIndex(standardShutterSpeeds, requiredShutter)
          shutterSpeedIndex = closestShutterIndex
          updateShutterDisplay()
        } else if (exposureMode === "shutter") {
          const requiredIso = calculateRequiredIsoForShutterPriority(shutter, ev)
          const closestIsoIndex = findClosestIndex(standardIsoValues, requiredIso)
          isoIndex = closestIsoIndex
          updateIsoDisplay()

          // Calculate the aperture with this ISO
          const requiredAperture = calculateRequiredAperture(shutter, ev, standardIsoValues[isoIndex])
          const closestApertureIndex = findClosestIndex(standardApertures, requiredAperture)
          apertureIndex = closestApertureIndex
          updateApertureDisplay()
        } else if (exposureMode === "manual") {
          updateManualWithAutoIso(aperture, shutter, ev)
        }

        // Force update displays after auto ISO changes
        updateAllDisplays()
      } else {
        // When disabling Auto ISO, keep the current ISO but update displays
        updateAllDisplays()
      }
    })
  }

  // Exposure mode tab listeners
  document.querySelectorAll(".exposure-mode-tabs .tab-trigger").forEach((tab) => {
    tab.addEventListener("click", function () {
      setExposureMode(this.dataset.mode)
    })
  })

  // Preview mode tab listeners
  document.querySelectorAll(".preview-mode-tabs .tab-trigger").forEach((tab) => {
    tab.addEventListener("click", function () {
      setPreviewMode(this.dataset.preview)
    })
  })

  // Debug toggle
  if (debugToggleFooter) {
    debugToggleFooter.addEventListener("click", function () {
      debugMode = !debugMode
      if (debugContainer) {
        debugContainer.classList.toggle("hidden", !debugMode)
      }
      this.textContent = debugMode ? "Hide Debug Info" : "Show Debug Info"

      // Update debug display when toggling debug mode
      if (debugMode) {
        updateDebugDisplay()
      }
    })
  }

  // Toggle EV table
  if (evTableToggle && evTableContainer) {
    evTableToggle.addEventListener("click", function () {
      const isHidden = evTableContainer.classList.contains("hidden")
      evTableContainer.classList.toggle("hidden")
      this.querySelector(".toggle-icon").textContent = isHidden ? "▼" : "▶"
      this.textContent = isHidden ? "Hide EV Table" : "Show EV Table"
    })
  }

  // Make important functions available globally for debugging
  window.calculateActualEv = calculateActualEv
  window.calculateRequiredShutterSpeed = calculateRequiredShutterSpeed
  window.updateSceneImage = updateSceneImage
  window.updateHistogram = updateHistogram
  window.updateExposureMeter = updateExposureMeter
  window.initialize = initialize
  window.debugLog = debugLog
  window.standardApertures = standardApertures
  window.standardShutterSpeeds = standardShutterSpeeds
  window.standardIsoValues = standardIsoValues
  window.sceneImageUrls = sceneImageUrls

  // Initialize the application
  initialize()

  // Add a fallback initialization to ensure everything loads
  window.addEventListener("load", () => {
    console.log("Window fully loaded - checking if initialization completed")

    // If not initialized after 2 seconds, try again
    setTimeout(() => {
      if (typeof initialized === "undefined" || !initialized) {
        console.log("Forcing initialization")
        if (typeof initialize === "function") {
          initialize()
        }
      }

      // Force update scene image if it's not loaded
      var sceneImg = document.getElementById("scene-image")
      if (sceneImg && (!sceneImg.complete || sceneImg.naturalHeight === 0)) {
        console.log("Forcing scene image update")
        if (typeof updateSceneImage === "function") {
          updateSceneImage()
        }
      }
    }, 2000)
  })

  // Declare the functions
  function updateAutoIso(aperture, ev) {
    const requiredIso = calculateRequiredIsoForAutoIso(aperture, ev)
    const closestIsoIndex = findClosestIndex(standardIsoValues, requiredIso)
    isoIndex = closestIsoIndex
    updateIsoDisplay()

    // Calculate the shutter speed with this ISO
    const requiredShutter = calculateRequiredShutterSpeed(aperture, ev, standardIsoValues[isoIndex])
    const closestShutterIndex = findClosestIndex(standardShutterSpeeds, requiredShutter)
    shutterSpeedIndex = closestShutterIndex
    updateShutterDisplay()
  }

  function updateShutterPriorityWithAutoIso(shutter, ev) {
    const requiredIso = calculateRequiredIsoForShutterPriority(shutter, ev)
    const closestIsoIndex = findClosestIndex(standardIsoValues, requiredIso)
    isoIndex = closestIsoIndex
    updateIsoDisplay()

    // Calculate the aperture with this ISO
    const requiredAperture = calculateRequiredAperture(shutter, ev, standardIsoValues[isoIndex])
    const closestApertureIndex = findClosestIndex(standardApertures, requiredAperture)
    apertureIndex = closestApertureIndex
    updateApertureDisplay()
  }

  // Add this function to update the debug display
  function updateDebugDisplay() {
    if (!debugMode) return

    const aperture = standardApertures[apertureIndex]
    const shutter = standardShutterSpeeds[shutterSpeedIndex]
    const iso = standardIsoValues[isoIndex]
    const calculatedEv = calculateActualEv(aperture, shutter, iso)
    const evDifference = ev - calculatedEv

    // Format EV differences for display
    const formatEvDiff = (diff) => {
      return `${diff > 0 ? "+" : diff < 0 ? "-" : ""}${Math.abs(diff).toFixed(1)}`
    }

    // Determine which settings are user-selected vs auto-calculated
    const getSettingStatus = (setting) => {
      if (exposureMode === "aperture") {
        if (setting === "aperture" || (setting === "iso" && !autoIso)) return "User Selected"
        if (setting === "shutter") return "Auto Calculated"
        if (setting === "iso" && autoIso) return "Auto ISO"
      } else if (exposureMode === "shutter") {
        if (setting === "shutter" || (setting === "iso" && !autoIso)) return "User Selected"
        if (setting === "aperture") return "Auto Calculated"
        if (setting === "iso" && autoIso) return "Auto ISO"
      } else {
        // manual
        if (setting === "iso" && autoIso) return "Auto ISO"
        return "User Selected"
      }
      return ""
    }

    // Update scene information
    document.getElementById("debug-scene-type").textContent = sceneType
    document.getElementById("debug-time-of-day").textContent = timeOfDay
    document.getElementById("debug-scene-ev").textContent = ev
    document.getElementById("debug-reference-exposure").textContent = "1/2000s"

    // Update camera settings
    document.getElementById("debug-exposure-mode").textContent =
      exposureMode.charAt(0).toUpperCase() + exposureMode.slice(1) + " Priority"

    document.getElementById("debug-iso").textContent = iso
    document.getElementById("debug-iso-auto").textContent = autoIso ? "(Auto)" : ""
    document.getElementById("debug-iso-auto").style.display = autoIso ? "inline" : "none"
    document.getElementById("debug-iso-status").textContent = getSettingStatus("iso")
    document.getElementById("debug-iso-diff").textContent = userChangedIso ? `${formatEvDiff(-isoEvDiff)} stops` : ""
    document.getElementById("debug-iso-diff").style.display = userChangedIso ? "inline" : "none"

    document.getElementById("debug-aperture").textContent = aperture
    document.getElementById("debug-aperture-status").textContent = getSettingStatus("aperture")
    document.getElementById("debug-aperture-diff").textContent = userChangedAperture
      ? `${formatEvDiff(apertureEvDiff)} stops`
      : ""
    document.getElementById("debug-aperture-diff").style.display = userChangedAperture ? "inline" : "none"

    document.getElementById("debug-shutter").textContent = formatShutterSpeed(shutter)
    document.getElementById("debug-shutter-status").textContent = getSettingStatus("shutter")
    document.getElementById("debug-shutter-diff").textContent = userChangedShutter
      ? `${formatEvDiff(shutterEvDiff)} stops`
      : ""
    document.getElementById("debug-shutter-diff").style.display = userChangedShutter ? "inline" : "none"

    // Update required exposure time
    const requiredShutter = calculateRequiredShutterSpeed(aperture, ev, iso)
    document.getElementById("debug-required-exposure").textContent = formatShutterSpeed(requiredShutter)

    // Update exposure calculations
    document.getElementById("debug-calculated-ev").textContent = calculatedEv.toFixed(2)
    document.getElementById("debug-exposure-diff").textContent = `${evDifference.toFixed(2)} stops`

    const exposureStatus =
      Math.abs(evDifference) < 0.5 ? "(Correct Exposure)" : evDifference > 0 ? "(Overexposed)" : "(Underexposed)"
    document.getElementById("debug-exposure-status").textContent = exposureStatus

    // Update adjustments
    document.getElementById("debug-aperture-adjustment").textContent = `${formatEvDiff(apertureEvDiff)} stops`
    document.getElementById("debug-shutter-adjustment").textContent = `${formatEvDiff(shutterEvDiff)} stops`
    document.getElementById("debug-iso-adjustment").textContent = `${formatEvDiff(-isoEvDiff)} stops`

    // Show/hide priority indicators
    document.getElementById("debug-aperture-priority").classList.toggle("hidden", exposureMode !== "aperture")
    document.getElementById("debug-shutter-priority").classList.toggle("hidden", exposureMode !== "shutter")
    document.getElementById("debug-iso-auto-indicator").classList.toggle("hidden", !autoIso)
  }

  // Also add the updateDebugDisplay call to the toggle function
  if (debugToggleFooter) {
    debugToggleFooter.addEventListener("click", function () {
      debugMode = !debugMode
      if (debugContainer) {
        debugContainer.classList.toggle("hidden", !debugMode)
      }
      this.textContent = debugMode ? "Hide Debug Info" : "Show Debug Info"

      // Update debug display when toggling debug mode
      if (debugMode) {
        updateDebugDisplay()
      }
    })
  }

  // Add the function to toggle the EV table
  function toggleEvTable() {
    const evTableContainer = document.getElementById("ev-table-container")
    const evTableToggle = document.getElementById("ev-table-toggle")

    if (!evTableContainer || !evTableToggle) return

    const isHidden = evTableContainer.classList.contains("hidden")
    evTableContainer.classList.toggle("hidden")

    const toggleIcon = evTableToggle.querySelector(".toggle-icon")
    if (toggleIcon) {
      toggleIcon.textContent = isHidden ? "▼" : "▶"
    }

    // Update the button text
    const buttonText = evTableToggle.textContent.replace("▶", "").replace("▼", "").trim()
    evTableToggle.textContent = (isHidden ? "▼ " : "▶ ") + buttonText
  }

  // Make sure the toggleEvTable function is available globally
  window.toggleEvTable = toggleEvTable
})

