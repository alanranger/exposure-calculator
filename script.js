// Find the updateSceneImage function and modify the image loading part:

// Update scene image
function updateSceneImage() {
    if (!sceneImage) return;
    
    // Show loading state
    if (sceneLoading) sceneLoading.classList.remove('hidden');
    if (sceneError) sceneError.classList.add('hidden');
    
    // Get the image URL
    const imageUrl = sceneImageUrls[sceneType]?.[timeOfDay];
    
    if (!imageUrl) {
        // Handle missing image
        if (sceneLoading) sceneLoading.classList.add('hidden');
        if (sceneError) sceneError.classList.remove('hidden');
        return;
    }
    
    // Create a new image object to preload
    const img = new Image();
    
    img.onload = function() {
        // Once preloaded successfully, update the actual image
        sceneImage.src = imageUrl;
        if (sceneLoading) sceneLoading.classList.add('hidden');
        
        // Update scene description
        if (sceneDescription) {
            sceneDescription.textContent = `${sceneType.charAt(0).toUpperCase() + sceneType.slice(1)} at ${timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}`;
        }
        
        // Update visualizations if active
        if (previewMode === 'dof') {
            updateDofVisualization();
        } else if (previewMode === 'motion') {
            updateMotionVisualization();
        }
        
        // Update histogram
        updateHistogram();
    };
    
    img.onerror = function() {
        if (sceneLoading) sceneLoading.classList.add('hidden');
        if (sceneError) sceneError.classList.remove('hidden');
        console.error(`Failed to load image: ${imageUrl}`);
    };
    
    // Start loading the image
    img.src = imageUrl;
}