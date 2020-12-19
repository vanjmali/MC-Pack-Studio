const { remote, ipcRenderer } = require('electron');
const mainProcess = remote.require('./main.js');
const fs = require('fs-extra');

window.onload = function() {
    document.getElementById('main_loader').style.display = "none";
}

function win_close() {
    console.log("Quiting program...")
    window.close();
}

function win_minimize() { mainProcess.minimize(); }

function win_maximize() { mainProcess.maximize(); }

ipcRenderer.on('maximize_reload', (event, is_maximize) => {
    if (is_maximize) {
        document.documentElement.style.setProperty('--title-height', '30px');
    } else {
        document.documentElement.style.setProperty('--title-height', '40px');
    }
});