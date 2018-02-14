const { app, BrowserWindow, ipcMain, MenuItem } = require('electron');
const { exec } = require('child_process');
const path = require('path');
const url = require('url');

require('electron-context-menu')({});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
    win = new BrowserWindow({ width: 1000, height: 800 });

    win.loadURL(url.format({
        pathname: path.join(__dirname, '../app/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    require('./menu.js').init(win);

    win.on('closed', function() {
        win = null;
    });

    ipcMain.on('search', function(a, portNumber) {
        var sudo = require('sudo-prompt');
        var options = {
            name: 'Electron'
        };
        sudo.exec('netstat -anb -o', options, function(error, stdout) {
            var success = true;
            var result = [];
            if (error) {
                success = false;
            } else {
                result = require('./utils.js').parse(stdout, portNumber);
            }
            win.webContents.send('netstat-results', { success: success, resultList: result });
        });
    });

    ipcMain.on('kill', function(a, pid) {
        exec('taskkill /f /pid ' + pid, function(err) {
            var success = true;
            if (err) {
                success = false;
            }

            win.webContents.send('process-killed', { success: success });
        });
    });
}

app.on('ready', function() {
    createWindow();
});

app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
});
