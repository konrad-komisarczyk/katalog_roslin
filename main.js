const { app, BrowserWindow } = require('electron')

function createWindow () {
    const win = new BrowserWindow({
        width: 1200,
        height: 720,
        //fullscreen: true,
        icon: './files/icon.png',
        webPreferences: {
            //webSecurity: false,
            nodeIntegration: true
        }
    })

    win.loadFile('index.html');
    //win.webContents.openDevTools()
    win.maximize();
    win.removeMenu();
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})