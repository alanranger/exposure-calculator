<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Outdoor Photography Exposure Calculator</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
      <header>
          <div class="header-content">
              <div class="logo-title">
                  <h1>Outdoor Photography Exposure Calculator</h1>
                  <p>Visualise and calculate exposure settings for your outdoor photography.</p>
                  <p class="small-text">For educational purposes only - real life light and situations may vary</p>
              </div>
              <div class="version">
                  <div class="version-number">Version 1.1s</div>
                  <div class="version-date">April 3, 2025</div>
              </div>
          </div>
      </header>

      <main class="grid">
          <div class="left-column">
              <div class="card">
                  <div class="card-content">
                      <h2>Scene Settings</h2>
                      <div class="form-group">
                          <label for="scene-type">Scene Type</label>
                          <select id="scene-type">
                              <option value="landscape">Landscape</option>
                              <option value="cityscape">Cityscape</option>
                              <option value="forest">Forest</option>
                              <option value="portrait">Portrait</option>
                              <option value="wildlife">Wildlife</option>
                              <option value="sports">Sports</option>
                          </select>
                      </div>
                      <div class="form-group">
                          <label for="time-of-day">Time of Day</label>
                          <select id="time-of-day">
                              <option value="dawn">Dawn</option>
                              <option value="sunrise">Sunrise</option>
                              <option value="midday" selected>Midday</option>
                              <option value="sunset">Sunset</option>
                              <option value="dusk">Dusk</option>
                              <option value="night">Night</option>
                          </select>
                      </div>
                  </div>
              </div>

              <div class="card">
                  <div class="card-content">
                      <div class="card-header">
                          <h2>Exposure Controls</h2>
                          <div class="exposure-mode-tabs">
                              <button class="tab-trigger active" data-mode="aperture" id="aperture-priority">A/AV</button>
                              <button class="tab-trigger" data-mode="shutter" id="shutter-priority">S/TV</button>
                              <button class="tab-trigger" data-mode="manual" id="manual-mode">M</button>
                          </div>
                      </div>

                      <div class="control-group">
                          <div class="control-header">
                              <div id="aperture-label" class="control-label">Aperture (f-stop/depth of field)</div>
                              <div class="control-value">
                                  <span id="aperture-value">f/5.6</span>
                                  <span id="aperture-ev-indicator" class="ev-indicator"></span>
                              </div>
                          </div>
                          <div class="slider-labels">
                              <span>Wide (f/1.4)</span>
                              <span>Narrow (f/32)</span>
                          </div>
                          <input type="range" id="aperture-slider" class="slider" min="0" max="27" value="12">
                          <div id="aperture-tips" class="tips">
                              Medium aperture: Good all-around choice. Balances depth of field and sharpness.
                          </div>
                      </div>

                      <div class="control-group">
                          <div class="control-header">
                              <div id="shutter-label" class="control-label">Shutter Speed (movement)</div>
                              <div class="control-value">
                                  <span id="shutter-value">1/2000s</span>
                                  <span id="shutter-ev-indicator" class="ev-indicator"></span>
                              </div>
                          </div>
                          <div class="slider-labels">
                              <span>Slow (30") - Blur Motion</span>
                              <span>Fast (1/8000) - Freeze Motion</span>
                          </div>
                          <input type="range" id="shutter-slider" class="slider" min="0" max="54" value="48">
                          <div id="shutter-tips" class="tips">
                              Fast shutter: Freezes fast action. Ideal for sports, wildlife, and capturing split-second moments.
                          </div>
                      </div>

                      <div class="control-group">
                          <div class="control-header">
                              <div id="iso-label" class="control-label">ISO (grain/exposure time)</div>
                              <div class="control-value">
                                  <span id="iso-value">100</span>
                                  <span id="iso-ev-indicator" class="ev-indicator"></span>
                                  <div class="auto-iso">
                                      <input type="checkbox" id="auto-iso">
                                      <label for="auto-iso">Auto</label>
                                  </div>
                              </div>
                          </div>
                          <div class="slider-labels">
                              <span>Low (50) / Low Noise</span>
                              <span>High (102400) / High Noise</span>
                          </div>
                          <input type="range" id="iso-slider" class="slider" min="0" max="33" value="3">
                          <div id="iso-tips" class="tips">
                              Low ISO: Best for bright conditions. Produces clean images with minimal noise.
                          </div>
                          <div id="auto-iso-info" class="tips hidden">
                              Auto ISO: Maintaining minimum shutter speed of 1/60s
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <div class="right-column">
              <div class="card">
                  <div class="card-content">
                      <div class="preview-header">
                          <h2>Scene Preview</h2>
                          <div class="preview-mode-tabs">
                              <button class="tab-trigger active" data-preview="normal" id="normal-preview">Normal</button>
                              <button class="tab-trigger" data-preview="dof" id="dof-preview">Depth of Field</button>
                              <button class="tab-trigger" data-preview="motion" id="motion-preview">Motion</button>
                          </div>
                      </div>

                      <div class="scene-preview">
                          <img id="scene-image" src="/placeholder.svg" alt="Scene preview">
                          <div id="scene-loading">Loading scene...</div>
                          <div id="scene-error" class="hidden">Failed to load scene image</div>
                          <div id="exposure-indicator" class="hidden"></div>

                          <div id="dof-overlay" class="hidden">
                              <div id="dof-zone" class="dof-zone"></div>
                              <div id="dof-indicator" class="overlay-indicator">f/5.6 - Medium DoF</div>
                          </div>

                          <div id="motion-overlay" class="hidden">
                              <svg id="motion-lines" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"></svg>
                              <div id="motion-indicator" class="overlay-indicator">1/2000s - Frozen Motion</div>
                          </div>
                      </div>

                      <div id="scene-description" class="scene-description">
                          Landscape at Midday
                      </div>

                      <div id="dof-info" class="preview-info hidden">
                          <p id="dof-explanation">Medium f-number = moderate focus depth</p>
                          <p id="dof-current-setting">Your current setting: <strong>f/5.6</strong> - Medium depth of field</p>
                      </div>

                      <div id="motion-info" class="preview-info hidden">
                          <p id="motion-explanation">Very fast shutter = frozen motion (sharp action)</p>
                          <p id="motion-current-setting">Your current setting: <strong>1/2000s</strong> - Frozen motion</p>
                      </div>

                      <h3>Exposure Meter</h3>
                      <div class="exposure-meter">
                          <div class="meter-scale">
                              <span>-6</span>
                              <span>-5</span>
                              <span>-4</span>
                              <span>-3</span>
                              <span>-2</span>
                              <span>-1</span>
                              <span>0</span>
                              <span>+1</span>
                              <span>+2</span>
                              <span>+3</span>
                              <span>+4</span>
                              <span>+5</span>
                              <span>+6</span>
                          </div>
                          <div class="meter-track">
                              <div class="meter-center-line"></div>
                              <div id="exposure-meter-needle" class="meter-needle"></div>
                          </div>
                          <div id="exposure-meter-status" class="meter-status text-green-600">Correct Exposure</div>
                      </div>

                      <h3>Histogram</h3>
                      <div id="histogram-container" class="histogram"></div>
                      <div class="histogram-labels">
                          <span class="shadows">Shadows (Underexposed)</span>
                          <span>Mid-tones</span>
                          <span class="highlights">Highlights (Overexposed)</span>
                      </div>

                      <div class="exposure-slider-visualization">
                        <h3>Exposure Adjustments</h3>
                        <div class="slider-visualization">
                          <div class="slider-row">
                            <div class="slider-label">Aperture:</div>
                            <div class="slider-track">
                              <div class="slider-center-line"></div>
                              <div id="aperture-slider-indicator" class="slider-indicator"></div>
                            </div>
                            <div id="aperture-slider-value" class="slider-value">0.0 EV</div>
                          </div>
                          <div class="slider-row">
                            <div class="slider-label">Shutter:</div>
                            <div class="slider-track">
                              <div class="slider-center-line"></div>
                              <div id="shutter-slider-indicator" class="slider-indicator"></div>
                            </div>
                            <div id="shutter-slider-value" class="slider-value">0.0 EV</div>
                          </div>
                          <div class="slider-row">
                            <div class="slider-label">ISO:</div>
                            <div class="slider-track">
                              <div class="slider-center-line"></div>
                              <div id="iso-slider-indicator" class="slider-indicator"></div>
                            </div>
                            <div id="iso-slider-value" class="slider-value">0.0 EV</div>
                          </div>
                        </div>
                        <div class="slider-explanation">
                          <p id="exposure-mode-explanation">In Aperture Priority mode, changing aperture or ISO will automatically adjust shutter speed to maintain exposure.</p>
                        </div>
                        <div class="total-exposure">
                          <div class="total-exposure-label">Total Exposure Adjustment:</div>
                          <div id="total-exposure-value" class="total-exposure-value">0.0 EV</div>
                        </div>
                        <div id="total-exposure-description" class="total-exposure-description">Correct exposure</div>
                      </div>

                      <div id="exposure-tips-correct" class="tips">
                          <h4 class="tips-title">Correct Exposure</h4>
                          <p>Your current settings provide a well-balanced exposure for this scene.</p>
                      </div>

                      <div id="exposure-tips-incorrect" class="tips hidden">
                          <h4 id="exposure-tips-title" class="tips-title">Underexposed by 2.0 stops</h4>
                          <p id="exposure-tips-description">Your image is too dark. Consider these adjustments:</p>
                          <ul id="exposure-tips-suggestions">
                              <li>Increase ISO to boost sensitivity (allows faster shutter speeds but introduces more noise)</li>
                              <li>Use slower shutter speed (lower number like 1/30 instead of 1/125)</li>
                              <li>Use wider aperture (lower f-number like f/2.8 instead of f/8) to let in more light</li>
                          </ul>
                      </div>

                      <div id="exposure-tips-bulb" class="tips hidden">
                          <h4 class="tips-title">Bulb Mode Required</h4>
                          <p>This scene requires a very long exposure time of <span id="bulb-exposure-time">30s</span>, which exceeds standard shutter speeds.</p>
                          <p>Use Bulb mode on your camera and a remote trigger to keep the shutter open for the required time.</p>
                      </div>

                      <div id="ev-table-container" class="hidden">
                          <div class="ev-table-wrapper">
                              <table class="ev-table">
                                  <thead>
                                      <tr>
                                          <th>Time of Day</th>
                                          <th>EV</th>
                                          <th>Exposure Time (f/5.6, ISO 100)</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      <tr>
                                          <td>Night</td>
                                          <td>-12</td>
                                          <td>68m 16s</td>
                                      </tr>
                                      <tr>
                                          <td>Dawn/Dusk</td>
                                          <td>-3</td>
                                          <td>8s</td>
                                      </tr>
                                      <tr>
                                          <td>Sunrise/Sunset</td>
                                          <td>-1</td>
                                          <td>2s</td>
                                      </tr>
                                      <tr>
                                          <td>Midday</td>
                                          <td>12</td>
                                          <td>1/2000s</td>
                                      </tr>
                                  </tbody>
                              </table>
                          </div>
                          <p class="table-note">Note: These values are calculated for f/5.6 aperture and ISO 100. Adjusting either setting will change the required exposure time.</p>
                      </div>
                  </div>
              </div>
          </div>
      </main>

      <div id="debug-container" class="hidden">
          <div class="card">
              <div class="card-content">
                  <h2>Debug Information</h2>
                  <div class="debug-grid">
                      <div class="debug-section">
                          <h3>Scene Information</h3>
                          <ul>
                              <li>Scene Type: <span id="debug-scene-type">landscape</span></li>
                              <li>Time of Day: <span id="debug-time-of-day">midday</span></li>
                              <li>Scene EV: <span id="debug-scene-ev">12</span></li>
                              <li>Reference Exposure: <span id="debug-reference-exposure">1/2000s</span></li>
                          </ul>
                      </div>
                      <div class="debug-section">
                          <h3>Camera Settings</h3>
                          <ul>
                              <li>ISO: <span id="debug-iso">100</span> <span id="debug-auto-iso" style="display: none;">(Auto)</span></li>
                              <li>Aperture: f/<span id="debug-aperture">5.6</span></li>
                              <li>Shutter Speed: <span id="debug-shutter-speed">1/2000s</span></li>
                              <li>Required Exposure: <span id="debug-required-exposure">1/2000s</span></li>
                          </ul>
                      </div>
                      <div class="debug-section">
                          <h3>Exposure Calculations</h3>
                          <ul>
                              <li>Exposure Mode: <span id="debug-exposure-mode">Aperture Priority</span></li>
                              <li>Calculated EV: <span id="debug-calculated-ev">12.00</span></li>
                              <li>Exposure Difference: <span id="debug-exposure-difference">0.00</span> stops</li>
                          </ul>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <footer>
          <div class="footer-content">
              <div class="footer-text">
                  <p>&copy; <span id="current-year">2023</span> Alan Ranger Photography</p>
                  <p class="footer-note">This calculator is for educational purposes only.</p>
              </div>
              <button id="debug-toggle-footer" class="footer-button">
                  Show Debug Info
              </button>
          </div>
      </footer>
  </div>
  <script src="script.js"></script>
</body>
</html>

