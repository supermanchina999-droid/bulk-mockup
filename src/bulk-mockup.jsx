// bulk-mockup.jsx
// Bulk Mockup - Batch Smart Object Replacement for Photoshop
// Author: Solo Founder
// License: MIT

#target photoshop

var CONFIG = {
    version: "1.0.0",
    exportFormat: "PNG",
    exportQuality: 100,
    outputSuffix: "_mockup",
    flattenOutput: true,
    closeAfterExport: false
};

function log(msg) { $.writeln("[BulkMockup] " + msg); }
function showError(msg) { alert("Bulk Mockup Error:\n" + msg); }

function getFiles(folder, extensions) {
    var files = [];
    var allFiles = folder.getFiles();
    for (var i = 0; i < allFiles.length; i++) {
        var file = allFiles[i];
        if (file instanceof File) {
            var ext = file.name.split(".").pop().toLowerCase();
            if (extensions.indexOf(ext) !== -1) files.push(file);
        }
    }
    return files;
}

function sanitizeFilename(name) {
    return name.replace(/[<>:"\/\\|?*]/g, "_");
}

function isSmartObject(layer) {
    try {
        var ref = new ActionReference();
        ref.putIdentifier(charIDToTypeID("Lyr "), layer.id);
        var desc = executeActionGet(ref);
        var layerKind = desc.getInteger(stringIDToTypeID("layerKind"));
        return layerKind === 5;
    } catch (e) { return false; }
}

function findSmartObjects(doc) {
    var smartObjects = [];
    function traverse(layers, path) {
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            if (layer.typename === "ArtLayer") {
                if (isSmartObject(layer)) {
                    smartObjects.push({ layer: layer, name: layer.name, path: path + "/" + layer.name });
                }
            } else if (layer.typename === "LayerSet") {
                traverse(layer.layers, path + "/" + layer.name);
            }
        }
    }
    traverse(doc.layers, "");
    return smartObjects;
}

function replaceSmartObjectContent(smartObjectLayer, newImageFile) {
    app.activeDocument.activeLayer = smartObjectLayer;
    var idplacedLayerEditContents = stringIDToTypeID("placedLayerEditContents");
    executeAction(idplacedLayerEditContents, undefined, DialogModes.NO);
    var smartDoc = app.activeDocument;
    try {
        var idplaceEvent = charIDToTypeID("Plce");
        var desc = new ActionDescriptor();
        desc.putPath(charIDToTypeID("null"), newImageFile);
        desc.putEnumerated(charIDToTypeID("FTcs"), charIDToTypeID("QCSt"), charIDToTypeID("Qcsa"));
        executeAction(idplaceEvent, desc, DialogModes.NO);
        if (smartDoc.layers.length > 1) {
            smartDoc.layers[smartDoc.layers.length - 1].remove();
        }
        smartDoc.save();
        smartDoc.close(SaveOptions.DONOTSAVECHANGES);
    } catch (e) {
        smartDoc.close(SaveOptions.DONOTSAVECHANGES);
        throw e;
    }
    return true;
}

function exportDocument(doc, outputPath, format) {
    var file = new File(outputPath);
    if (format === "PNG") {
        var pngOpts = new PNGSaveOptions();
        pngOpts.compression = 9;
        pngOpts.interlaced = false;
        doc.saveAs(file, pngOpts, true, Extension.LOWERCASE);
    } else if (format === "JPEG") {
        var jpegOpts = new JPEGSaveOptions();
        jpegOpts.quality = CONFIG.exportQuality;
        jpegOpts.embedColorProfile = true;
        jpegOpts.formatOptions = FormatOptions.STANDARDBASELINE;
        doc.saveAs(file, jpegOpts, true, Extension.LOWERCASE);
    }
    return file;
}

function processMockup(templateFile, designFiles, outputFolder, smartObjectIndex) {
    var results = { success: 0, failed: 0, errors: [] };
    var doc = app.open(templateFile);
    var smartObjects = findSmartObjects(doc);
    if (smartObjects.length === 0) {
        doc.close(SaveOptions.DONOTSAVECHANGES);
        throw new Error("No Smart Objects found in template: " + templateFile.name);
    }
    if (smartObjectIndex >= smartObjects.length) smartObjectIndex = 0;
    var targetSO = smartObjects[smartObjectIndex];
    log("Found " + smartObjects.length + " Smart Objects. Using: " + targetSO.name);
    for (var i = 0; i < designFiles.length; i++) {
        var designFile = designFiles[i];
        var designName = designFile.name.replace(/\.[^\.]+$/, "");
        try {
            replaceSmartObjectContent(targetSO.layer, designFile);
            var outputName = sanitizeFilename(designName + CONFIG.outputSuffix);
            var outputPath = outputFolder + "/" + outputName + "." + CONFIG.exportFormat.toLowerCase();
            exportDocument(doc, outputPath, CONFIG.exportFormat);
            results.success++;
            log("Processed: " + designFile.name + " -> " + outputName);
        } catch (e) {
            results.failed++;
            results.errors.push(designFile.name + ": " + e.message);
            log("Failed: " + designFile.name + " - " + e.message);
        }
    }
    if (CONFIG.closeAfterExport) {
        doc.close(SaveOptions.DONOTSAVECHANGES);
    }
    return results;
}

function showUI() {
    var dialog = new Window("dialog", "Bulk Mockup v" + CONFIG.version);
    dialog.orientation = "column";
    dialog.alignChildren = "left";
    dialog.preferredSize.width = 400;
    var templateGroup = dialog.add("group");
    templateGroup.add("statictext", undefined, "Mockup Template (PSD):");
    var templatePath = templateGroup.add("edittext", undefined, "");
    templatePath.preferredSize.width = 250;
    var templateBtn = templateGroup.add("button", undefined, "Browse...");
    var designGroup = dialog.add("group");
    designGroup.add("statictext", undefined, "Design Images Folder:");
    var designPath = designGroup.add("edittext", undefined, "");
    designPath.preferredSize.width = 250;
    var designBtn = designGroup.add("button", undefined, "Browse...");
    var outputGroup = dialog.add("group");
    outputGroup.add("statictext", undefined, "Output Folder:");
    var outputPath = outputGroup.add("edittext", undefined, "");
    outputPath.preferredSize.width = 250;
    var outputBtn = outputGroup.add("button", undefined, "Browse...");
    var formatGroup = dialog.add("group");
    formatGroup.add("statictext", undefined, "Export Format:");
    var formatDropdown = formatGroup.add("dropdownlist", undefined, ["PNG", "JPEG"]);
    formatDropdown.selection = 0;
    var btnGroup = dialog.add("group");
    btnGroup.alignment = "right";
    var cancelBtn = btnGroup.add("button", undefined, "Cancel", {name: "cancel"});
    var runBtn = btnGroup.add("button", undefined, "Run", {name: "ok"});
    templateBtn.onClick = function() {
        var file = File.openDialog("Select mockup template PSD", "Photoshop:*.psd");
        if (file) templatePath.text = file.fsName;
    };
    designBtn.onClick = function() {
        var folder = Folder.selectDialog("Select design images folder");
        if (folder) designPath.text = folder.fsName;
    };
    outputBtn.onClick = function() {
        var folder = Folder.selectDialog("Select output folder");
        if (folder) outputPath.text = folder.fsName;
    };
    runBtn.onClick = function() {
        if (!templatePath.text || !designPath.text || !outputPath.text) {
            alert("Please select all folders/files");
            return;
        }
        dialog.close(1);
    };
    if (dialog.show() === 1) {
        var templateFile = new File(templatePath.text);
        var designFolder = new Folder(designPath.text);
        var outputFolder = outputPath.text;
        CONFIG.exportFormat = formatDropdown.selection.text;
        var designFiles = getFiles(designFolder, ["png", "jpg", "jpeg", "psd", "tif", "tiff"]);
        if (designFiles.length === 0) {
            showError("No design images found in selected folder");
            return;
        }
        var confirm = confirm("Process " + designFiles.length + " designs with template " + templateFile.name + "?");
        if (!confirm) return;
        try {
            var results = processMockup(templateFile, designFiles, outputFolder, 0);
            alert("Done!\n\nSuccess: " + results.success + "\nFailed: " + results.failed +
                  (results.errors.length > 0 ? "\n\nErrors:\n" + results.errors.join("\n") : ""));
        } catch (e) {
            showError(e.message);
        }
    }
}

showUI();