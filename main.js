const {app,BrowserWindow} = require('electron');
const exec = require('child_process').exec;
const path = require('path');
const url = require('url');
require("dotenv").load()

let mainWindow=null;
const createWindow = () => {
	mainWindow = new BrowserWindow({ width: 1920, height: 1080, backgroundColor: '#222222', titleBarStyle: 'hidden' });
	// const server = require("./server/index")
	exec('nodemon server/index')
	if (process.env.dev) {
		exec('yarn start')
		exec("yarn scss")
		mainWindow.loadURL("http://localhost:3000")
		mainWindow.webContents.openDevTools();
	}
	else {
		mainWindow.loadURL(
			process.env.ELECTRON_START_URL ||
			url.format({
				pathname: path.join(__dirname, '/public/index.html'),
				protocol: 'file:',
				slashes: true
			})
		);
	}


	mainWindow.focus();
	
    // Open the DevTools.
	mainWindow.on('closed', () => {
		mainWindow = null;
		setTimeout(()=>app.quit(),300)

	});
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});
