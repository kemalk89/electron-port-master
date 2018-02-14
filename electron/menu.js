const { app, dialog, Menu } = require('electron');

let windowObj = null;

const template = [
    {
        label: 'View',
        submenu: [
            {role: 'reload'},
            {role: 'forcereload'},
            {role: 'toggledevtools'},
            {type: 'separator'},
            {role: 'togglefullscreen'}
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'About ' + app.getName(),
                click: function() {
                    dialog.showMessageBox(windowObj, {
                        type: 'info',
                        title: 'About ' + app.getName(),
                        message: 'Name: ' + app.getName() + '\nVersion: ' + app.getVersion()
                    });
                }
            }
        ]
    }
];

if (process.platform === 'darwin') {
    template.unshift({
        label: app.getName(),
        submenu: [
            {role: 'about'},
            {type: 'separator'},
            {role: 'services', submenu: []},
            {type: 'separator'},
            {role: 'hide'},
            {role: 'hideothers'},
            {role: 'unhide'},
            {type: 'separator'},
            {role: 'quit'}
        ]
    });

    // Edit menu
    template[1].submenu.push(
        {type: 'separator'},
        {
            label: 'Speech',
            submenu: [
                {role: 'startspeaking'},
                {role: 'stopspeaking'}
            ]
        }
    );

    // Window menu
    template[3].submenu = [
        {role: 'close'},
        {role: 'minimize'},
        {role: 'zoom'},
        {type: 'separator'},
        {role: 'front'}
    ];
}

module.exports = {
    init: function(win) {
        windowObj = win;

        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    }
};