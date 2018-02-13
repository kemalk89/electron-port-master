var AppController = function() {

    function disableSearchBtn() {
        $('#searchButton').prop('disabled', true);
    }

    function enableSearchBtn() {
        $('#searchButton').prop('disabled', false);
    }

    function enableKillProcessBtn() {
        $('#killProcessBtn').prop('disabled', false);
    }

    function disableKillProcessBtn() {
        $('#killProcessBtn').prop('disabled', true);
    }

    function onSearchProcess() {
        var portNumber = document.getElementById("portNumber").value;
        window.require('electron').ipcRenderer.send('search', portNumber);
    }

    function onKillProcess(pid) {
        window.require('electron').ipcRenderer.send('kill', pid);
    }

    return {
        bootstrap: function() {
            var lastSelectedRow = null;

            var DataTable = $('#portTable').DataTable({
                data: AppController.data,
                paging:   false,
                responsive: true,
                fixedColumns: true,
                columns: [
                    { title: 'Process' },
                    { title: 'Details' },
                    { title: 'Protocol' },
                    { title: 'Port' },
                    { title: 'PID' },
                    { orderable: false, defaultContent: '<button class="btn btn-xs btn-danger">Kill</button>' }
                ]
            });

            $('#portTable tbody').on('click', 'button', function () {
                lastSelectedRow = DataTable.row($(this).parents('tr'));
                var pid = lastSelectedRow.data()[4];
                if (pid > 0) {
                    $('#killProcessModal').modal('show');
                }
            });

            $('#killProcessBtn').on('click', function() {
                var pid = lastSelectedRow.data()[4];
                disableKillProcessBtn();
                onKillProcess(pid);
            });

            $('#searchButton').on('click', function() {
                disableSearchBtn();
                onSearchProcess();
            });

            window.require('electron').ipcRenderer.on('process-killed', function(event, args) {
                $('#killProcessModal').modal('hide');

                if (args.success) {
                    lastSelectedRow.remove().draw();
                } else {
                    $('#killProcessFailedModal').modal('show');
                }

                enableKillProcessBtn();
                lastSelectedRow = null;
            });

            window.require('electron').ipcRenderer.on('netstat-results', function(event, args) {
                enableSearchBtn();

                DataTable.clear().draw();

                args.resultList.forEach(function(item) {
                    DataTable.row.add([ item.process, item.details, item.protocol, item.port, item.pid, null ]);
                });

                DataTable.draw();
            });
        }
    };
};

$(document).ready(function() {
    var appController = new AppController();
    appController.bootstrap();
});

