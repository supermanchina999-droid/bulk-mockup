// install.jsx
// Bulk Mockup - Installation Script
#target photoshop

var SCRIPT_NAME = "Bulk Mockup.jsx";
var SOURCE_FILE = new File($.fileName).parent + "/bulk-mockup.jsx";

function getPhotoshopScriptsFolder() {
    var versions = ["2024", "2023", "2022", "2021", "2020"];
    var basePaths = [
        Folder.appData + "/Adobe/Adobe Photoshop ",
        "/Applications/Adobe Photoshop ",
        "C:/Program Files/Adobe/Adobe Photoshop "
    ];
    for (var i = 0; i < basePaths.length; i++) {
        for (var j = 0; j < versions.length; j++) {
            var folder = new Folder(basePaths[i] + versions[j] + "/Presets/Scripts");
            if (folder.exists) return folder;
        }
    }
    return Folder.selectDialog("Select Photoshop Scripts folder (Presets/Scripts)");
}

function install() {
    var scriptsFolder = getPhotoshopScriptsFolder();
    if (!scriptsFolder) {
        alert("Could not find Photoshop Scripts folder. Please install manually:\n\n1. Open Photoshop\n2. Go to File > Scripts > Browse\n3. Select bulk-mockup.jsx");
        return;
    }
    var sourceFile = new File(SOURCE_FILE);
    if (!sourceFile.exists) {
        alert("Source file not found: " + SOURCE_FILE);
        return;
    }
    var destFile = new File(scriptsFolder + "/" + SCRIPT_NAME);
    sourceFile.copy(destFile);
    if (destFile.exists) {
        alert("Installed successfully!\n\nRestart Photoshop, then go to:\nFile > Scripts > Bulk Mockup");
    } else {
        alert("Installation failed. Please install manually.");
    }
}

install();