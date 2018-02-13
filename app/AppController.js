var DataTable = null;

var AppController = {
    data: [],
    bootstrap: function() {
        document.getElementById('searchButton').addEventListener('click', function() {
           AppController.onSearchProcess();
        });

        window.require('electron').ipcRenderer.on('netstat-results', function(event, args) {
            DataTable.clear().draw();

            args.resultList.forEach(function(item) {
                DataTable.row.add([ item.process, item.details, item.protocol, item.port ]);
            });

            DataTable.draw();
        });
    },
    onSearchProcess: function() {
        var portNumber = document.getElementById("portNumber").value;
        window.require('electron').ipcRenderer.send('search', portNumber);
    }
};

$(document).ready(function() {
    AppController.bootstrap();
    DataTable = $('#portTable').DataTable({
        data: AppController.data,
        paging:   false,
        responsive: true,
        fixedColumns: true,
        columns: [
            { title: 'Process' },
            { title: 'Details' },
            { title: 'Protocol' },
            { title: 'Port' }
        ]
    });
});

