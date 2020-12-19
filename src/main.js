const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
	app.quit();
}

const createWindow = () => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 1280,
		height: 720,
		minWidth: 960,
		minHeight: 540,
		frame: false,
		title: "Minecraft Pack Studio",
		icon: "./ico.png",
		show: true,
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true
		}
	});

	// and load the index.html of the app.
	mainWindow.loadFile(path.join(__dirname, 'index.html'));

	// Open the DevTools.
	mainWindow.webContents.openDevTools();

	exports.minimize = () => mainWindow.minimize();
	exports.maximize = () => {
        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
        } else {
            mainWindow.maximize();
        }
	};
	exports.is_maximized = () => { return mainWindow.isMaximized(); }
	exports.userdata = () => { return app.getPath("userData"); }

	mainWindow.on('maximize', () => { mainWindow.webContents.send('maximize_reload', true); });
    mainWindow.on('unmaximize', () => { mainWindow.webContents.send('maximize_reload', false); });

    mainWindow.on('focus', () => { mainWindow.webContents.send('focus', true); });
    mainWindow.on('blur', () => { mainWindow.webContents.send('focus', false); });

    mainWindow.on('resize', () => { mainWindow.webContents.send('resize'); });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
