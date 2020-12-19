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

ipcRenderer.on('focus', (event, focused) => {
	if (focused) {
		document.getElementById('title_bar').style.backgroundColor = "var(--title-color)"
	} else {
		document.getElementById('title_bar').style.backgroundColor = "var(--title-color-unfocused)"
	}
});

ipcRenderer.on('maximize_reload', (event, is_maximize) => {
    if (is_maximize) {
        document.documentElement.style.setProperty('--title-height', '30px');
    } else {
        document.documentElement.style.setProperty('--title-height', '40px');
    }
});

function insert_tab(html_data, index) {
    var imported_html = false;
    var tabs = document.getElementById('tabs');
    var output = "";
    for (var i = 0; i < tabs.getElementsByClassName('tab').length; i++) {
        if (i == index) {
            output = output + html_data;
            imported_html = true;
        }
        output = output + tabs.getElementsByClassName('tab')[i].outerHTML;
    }
    if (!imported_html) output = output + html_data;
    tabs.innerHTML = output + document.getElementById('add').outerHTML;
    tabs.getElementsByClassName('tab')[index].style.width = "0px";
    setTimeout(function() { tab_animation(index) }, 1);
}

function tab_animation(index) {
    var tabs = document.getElementById('tabs');
    tabs.getElementsByClassName('tab')[index].style.width = "";
}

// Resizes tabs and shows selected tab to make them more user-friendly
function refresh() {
    var tabs = document.getElementById('tabs');
    var button_display;
    if (tabs.getElementsByClassName('tab').length > 1 && tabs.getElementsByClassName('tab')[1].clientWidth < 100) button_display = "none";
    else button_display = "";
    for (var i = 0; i < tabs.getElementsByClassName('tab').length; i++) {
        // Hide close button if width too low for tabs (skips built-in Search tab)
        if (i > 0) tabs.getElementsByClassName('tab')[i].getElementsByTagName('button')[0].style.display = button_display;
        // Selected
        tabs.getElementsByClassName('tab')[i].classList.remove('selected');
        if (i == tab_select) {
            tabs.getElementsByClassName('tab')[i].classList.add('selected');
        }
    }
}