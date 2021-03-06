import { app, BrowserWindow, Menu } from 'electron';
import contextMenu from 'electron-context-menu';

import { registerHandlers } from "./main/handlers/ipc";
import db from "./main/db";

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

import { protocol } from "electron";

// Allows loading local images
app.whenReady().then(() => {
  protocol.registerFileProtocol('file', (request, callback) => {
	const pathname = request.url.replace('file:///', '');
	callback(pathname);
  });
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  	app.quit();
}

const createWindow = (): void => {
	const menu = Menu.buildFromTemplate([

	]);

	Menu.setApplicationMenu(menu);

	// Create the browser window.
	const mainWindow = new BrowserWindow({
		height: 600,
		width: 800,
		title: "Blueprint",
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			webSecurity: false,
			enableRemoteModule: true
		}
  	});

	// and load the index.html of the app.
	mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

	contextMenu();

	// Open the DevTools.
	mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async function() {
	registerHandlers();
	await db.migrate();
	createWindow();
});

process.on('exit', async () => {
	if(db) { await db.close() }
});

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