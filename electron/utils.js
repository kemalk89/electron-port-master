function parseDirty(input) {
    const regex = /\[[\w]+\.[\w]+\]/gi;
    var start = 0;
    var stop = 0;
    var dirtyResultList = [];
    var match;
    while((match = regex.exec(input)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (match.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        stop = match[0].length + match.index;

        dirtyResultList.push(input.substr(start, stop - start));

        start = stop;
    }

    return dirtyResultList;
}

module.exports = {
    parse: function(input, portNumber) {
        var dirtyList = parseDirty(input);

        var resultList = [];
        for (var i = 0; i < dirtyList.length; i++) {
            var item = dirtyList[i];

            const regex = /([\w]+)\s+(([\d]+\.?)|\[[\w:%]+\])+:([\d]+)/gi;
            var matches = regex.exec(item);
            var currentPortNumber = matches[4];
            if (! portNumber || currentPortNumber === portNumber) {
                var processName = /\[([\w]+\.[\w]+)\]/gi.exec(item)[1];
                var processDetail = '';
                var processDetailMatch = /\n\s+([a-z]+)\s+\n\s+\[/gi.exec(item);
                if (processDetailMatch !== null) {
                    processDetail = processDetailMatch[1];
                }

                var pid = '';
                var pidMatch = /\s+([0-9]+)\s+/gi.exec(item);
                if (pidMatch !== null) {
                    pid = pidMatch[1];
                }

                var protocol = matches[1];

                resultList.push({
                    process: processName,
                    details: processDetail,
                    protocol: protocol,
                    port: currentPortNumber,
                    pid: pid
                });
            }
        }

        return resultList;
    }
};