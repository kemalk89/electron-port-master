var DataTable = null;

var AppController = {
    data: [],
    bootstrap: function() {
        document.getElementById('searchButton').addEventListener('click', function() {
           AppController.onSearchProcess();
        });

        window.require('electron').ipcRenderer.on('netstat-results', function(event, args) {
            DataTable.clear().draw();

            const regex = /\[[\w]+\.[\w]+\]/gi;
            var start = 0;
            var stop = 0;
            var map = [];
            var match;
            while((match = regex.exec(args.stdout)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (match.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                stop = match[0].length + match.index;

                map.push(args.stdout.substr(start, stop - start));

                start = stop;
            }

            for (var i = 0; i < map.length; i++) {
                var item = map[i];

                const regex = /([\w]+)\s+(([\d]+\.?)|\[[\w:%]+\])+:([\d]+)/gi;
                var matches = regex.exec(item);
                var currentPortNumber = matches[4];
                if (! args.portNumber || currentPortNumber === args.portNumber) {
                    var processName = /\[([\w]+\.[\w]+)\]/gi.exec(item)[1];
                    var processDetail = '';
                    var processDetailMatch = /\n\s+([a-z]+)\s+\n\s+\[/gi.exec(item);

                    if (processDetailMatch !== null) {
                        processDetail = processDetailMatch[1];
                    }
                    var protocol = matches[1];

                    DataTable.row.add([ processName, processDetail, protocol, currentPortNumber ]);
                }
            }

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
        "paging":   false,
        columns: [
            { title: "Prozess" },
            { title: "Details" },
            { title: "Protokoll" },
            { title: "Port" }
        ]
    });
});

