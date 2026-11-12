# Bulk Mockup Usage Guide

## Installation

### Method 1: Auto Install
1. Download src/bulk-mockup.jsx and scripts/install.jsx
2. Place both files in same folder
3. In Photoshop: File -> Scripts -> Browse -> select install.jsx
4. Restart Photoshop

### Method 2: Manual Install
1. Open Photoshop installation directory
2. Find Presets/Scripts folder
3. Copy bulk-mockup.jsx to that folder
4. Restart Photoshop

## Usage

### Basic Flow
1. Prepare Mockup Template - Create/open a mockup PSD with Smart Object layers
2. Prepare Design Images - Put all design images in a folder (PNG, JPG, PSD, TIF)
3. Run Bulk Mockup - Photoshop -> File -> Scripts -> Bulk Mockup
4. Get Results - All mockups exported to Output Folder as design_name_mockup.png

## FAQ

Q: Script can't find Smart Object
A: Ensure PSD has Smart Object layers. Right-click layer -> Convert to Smart Object

Q: Export quality poor
A: Use PNG format. JPEG compression may lose quality.

Q: Processing slow
A: Normal. Each mockup needs to open Smart Object, replace image, save, export. 100 images ~ 5-10 minutes.

## System Requirements
- Adobe Photoshop CC 2020+
- Windows or macOS
- 8GB+ RAM (16GB+ recommended for large batches)