const electron = require('electron')
const {
    app,
    BrowserWindow,
    Menu,
    MenuItem,
    ipcMain
    } = electron

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var win, contents;
global.sharedData = {
    os: null,
    lang: null,
    screenWidth: null,
    screenHeight: null,
};

function createWindow() {

    // Create the browser window.
    var configuration;
    switch (process.platform) {
        case "darwin":
            configuration = {
                width: 800,
                height: 600,
                titleBarStyle: 'customButtonsOnHover',
                title: "Melt"
            }
            sharedData.os = "mac";
            break;

        case "win32":
            configuration = {
                width: 800,
                height: 600,
                frame: true,
                title: "Melt"
            }
            sharedData.os = "windows";
            break;

        default:
            configuration = {
                width: 800,
                height: 600,
                frame: false,
                title: "Melt"
            }
            sharedData.os = "linux";
    }

    sharedData.lang = app.getLocale()

    const { screenWidth, screenHeight } = electron.screen.getPrimaryDisplay().workAreaSize
    sharedData.screenWidth = screenWidth;
    sharedData.screenHeight = screenHeight;

    win = new BrowserWindow(configuration);

    contents = win.webContents;
    //contents.openDevTools()
    win.maximize();
    win.show();

    // and load the index.html of the app.
    win.loadFile('client/index.html')

    // Open the DevTools.
    // win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })


    // Other code removed for brevity

    const application = {
        label: 'Application',
        submenu: [{
            label: 'Toggle Inspector',
            accelerator: 'CmdOrCtrl+I',
            click() {
                ToggleDevTools();
            }
        }, {
            label: 'Quit',
            accelerator: "CmdOrCtrl+Q",
            click() {
                app.quit()
            }
        }, {
            label: 'Check for updates...',
            click() {
                contents.send('checkUpdates');
            }
        }]
    }

    const edit = {
        label: "Edit",
        submenu: [{
                label: "Undo",
                accelerator: "CmdOrCtrl+Z",
                selector: "undo:"
            },
            {
                label: "Redo",
                accelerator: "Shift+CmdOrCtrl+Z",
                selector: "redo:"
            },
            {
                type: "separator"
            },
            {
                label: "Cut",
                accelerator: "CmdOrCtrl+X",
                selector: "cut:"
            },
            {
                label: "Copy",
                accelerator: "CmdOrCtrl+C",
                selector: "copy:"
            },
            {
                label: "Paste",
                accelerator: "CmdOrCtrl+V",
                selector: "paste:"
            },
            {
                label: "Select All",
                accelerator: "CmdOrCtrl+A",
                selector: "selectAll:"
            }
        ]}

    const playground = {
        label: "Playground",
        submenu: [{
            label: "Code Mode",
            // accelerator: "CmdOrCtrl+C", // TODO: suitable Shortcut
            click() {
                contents.send('codeMode');
            }
        },{
            label: "Run Script",
            accelerator: "CmdOrCtrl+R",
            click() {
                contents.send('runScript');
            }
        },{
            label: "Keyboard Control Mode",
            accelerator: "CmdOrCtrl+K",
            click() {
                contents.send('keyboardMode');
            }
        }
    ]}


    const control = {
        label: "Control",
        submenu: [{
            label: "Pause/Resume Queue",
            accelerator: "CmdOrCtrl+P",
            // accelerator: "CmdOrCtrl+C", // TODO: suitable Shortcut
            click() {
                contents.send('togglePauseQueue');
            },
        },
        {
            label: "Set Custom Home",
            accelerator: "CmdOrCtrl+H",
            click() {
                contents.send('setHomeMode');
            }
        }
    ]}

    const template = [
        application,
        edit,
        playground,
        control
    ]

    Menu.setApplicationMenu(Menu.buildFromTemplate(template))

} // create window


function ToggleDevTools() {
    if (contents.isDevToolsOpened()) {
        contents.closeDevTools();
    } else {
        contents.openDevTools();
    }
}

app.on('will-quit', () => {
    console.log('users tries to quit');
    contents.send('quittingApp');
    // Unregister all shortcuts.
    // globalShortcut.unregisterAll()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    // if (process.platform !== 'darwin') {
    app.quit()
    // }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    // if (win === null) {
    //   createWindow()
    // }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
