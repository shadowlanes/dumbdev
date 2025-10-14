// Global state
let currentImage = null;

// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadCard = document.getElementById('uploadCard');
const previewCard = document.getElementById('previewCard');
const previewImage = document.getElementById('previewImage');
const removeImageBtn = document.getElementById('removeImage');
const uploadControlsWrapper = document.getElementById('uploadControlsWrapper');
const controls = document.getElementById('controls');
const results = document.getElementById('results');
const loading = document.getElementById('loading');
const extractBtn = document.getElementById('extractBtn');
const qualitySlider = document.getElementById('qualitySlider');
const colorCountSlider = document.getElementById('colorCountSlider');
const qualityValue = document.getElementById('qualityValue');
const colorCountValue = document.getElementById('colorCountValue');
const paletteGrid = document.getElementById('paletteGrid');
const exportBtn = document.getElementById('exportBtn');
const toast = document.getElementById('toast');

// Upload area click
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

// File input change
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
});

// Drag and drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleFile(file);
    } else {
        showToast('Please drop a valid image file');
    }
});

// Handle file
function handleFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        currentImage = e.target.result;
        previewImage.src = currentImage;
        
        // Remove centered class and trigger slide animation
        uploadControlsWrapper.classList.remove('centered');
        uploadControlsWrapper.classList.add('slide-left');
        
        // Show preview and controls with animation
        uploadCard.style.display = 'none';
        previewCard.style.display = 'block';
        
        // Show controls after a short delay for smooth animation
        setTimeout(() => {
            controls.style.display = 'block';
            setTimeout(() => {
                controls.classList.add('show');
            }, 50);
        }, 300);
        
        results.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

// Remove image
removeImageBtn.addEventListener('click', () => {
    currentImage = null;
    previewImage.src = '';
    fileInput.value = '';
    
    // Hide controls with animation
    controls.classList.remove('show');
    
    // Reset to centered state after controls fade out
    setTimeout(() => {
        controls.style.display = 'none';
        uploadCard.style.display = 'block';
        previewCard.style.display = 'none';
        results.style.display = 'none';
        
        // Re-center the wrapper
        uploadControlsWrapper.classList.remove('slide-left');
        uploadControlsWrapper.classList.add('centered');
    }, 300);
});

// Slider updates
qualitySlider.addEventListener('input', (e) => {
    qualityValue.textContent = e.target.value;
});

colorCountSlider.addEventListener('input', (e) => {
    colorCountValue.textContent = e.target.value;
});

// Extract colors
extractBtn.addEventListener('click', async () => {
    if (!currentImage) return;

    const quality = parseInt(qualitySlider.value);
    const colorCount = parseInt(colorCountSlider.value);

    // Show loading
    loading.style.display = 'flex';
    results.style.display = 'none';

    try {
        // Create Vibrant instance with custom color count and quality
        const vibrant = new Vibrant(previewImage, {
            colorCount: colorCount,
            quality: quality
        });

        // Extract color palette
        const palette = await vibrant.getPalette();

        // Define all 6 swatch types
        const swatchOrder = ['Vibrant', 'DarkVibrant', 'LightVibrant', 'Muted', 'DarkMuted', 'LightMuted'];
        
        // Extract all available colors (always show all 6)
        const extractedColors = [];
        for (const swatchName of swatchOrder) {
            if (palette[swatchName]) {
                extractedColors.push({
                    name: swatchName,
                    hex: palette[swatchName].getHex(),
                    rgb: palette[swatchName].getRgb(),
                    population: palette[swatchName].getPopulation()
                });
            }
        }

        // Display results
        displayResults(extractedColors);

        // Hide loading
        loading.style.display = 'none';
        results.style.display = 'block';

        // Smooth scroll to bottom after a short delay to allow results to render
        setTimeout(() => {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        }, 100);

        showToast('Colors extracted successfully!');
    } catch (error) {
        loading.style.display = 'none';
        showToast('Error extracting colors. Please try again.');
        console.error(error);
    }
});

// Display results
function displayResults(colors) {
    // Clear previous results
    paletteGrid.innerHTML = '';

    // Display each color with staggered animation
    colors.forEach((color, index) => {
        const hex = color.hex;
        const rgb = `rgb(${Math.round(color.rgb[0])}, ${Math.round(color.rgb[1])}, ${Math.round(color.rgb[2])})`;
        const colorName = color.name;

        const colorItem = document.createElement('div');
        colorItem.className = 'color-item';
        colorItem.style.animationDelay = `${index * 0.1}s`;

        colorItem.innerHTML = `
            <div class="color-swatch" style="background-color: ${hex};" data-color="${hex}">
                <div class="color-name">${colorName}</div>
            </div>
            <div class="color-info">
                <div class="color-code" data-hex="${hex}">${hex}</div>
                <div class="color-rgb" data-rgb="${rgb}">${rgb}</div>
            </div>
        `;

        // Add click to copy for swatch (hex)
        const swatch = colorItem.querySelector('.color-swatch');
        swatch.addEventListener('click', () => {
            copyToClipboard(hex);
        });

        // Add click to copy for hex code
        const hexCode = colorItem.querySelector('.color-code');
        hexCode.addEventListener('click', () => {
            copyToClipboard(hex);
        });

        // Add click to copy for RGB code
        const rgbCode = colorItem.querySelector('.color-rgb');
        rgbCode.addEventListener('click', () => {
            copyToClipboard(rgb);
        });

        paletteGrid.appendChild(colorItem);
    });
}

// Export palette
exportBtn.addEventListener('click', () => {
    const colors = Array.from(document.querySelectorAll('.color-swatch')).map(
        swatch => swatch.dataset.color
    );
    
    const data = {
        palette: colors,
        timestamp: new Date().toISOString()
    };

    // Create and download JSON file
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `color-palette-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Palette exported successfully!');
});

// Utility functions
function rgbToHex(rgb) {
    const r = rgb[0].toString(16).padStart(2, '0');
    const g = rgb[1].toString(16).padStart(2, '0');
    const b = rgb[2].toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied ${text} to clipboard!`);
    }).catch(() => {
        showToast('Failed to copy to clipboard');
    });
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

