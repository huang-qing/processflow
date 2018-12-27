/* global $  Processflow test1 */
$(function () {

    var test = new Processflow({
        query: '#test',
        data: test1,
        autoResize: true
    });
    
    var processflow1 = new Processflow({
        query: '#processflow1',
        data: {
            processflow: flows,
            flowline: flowline1
        },
        autoResize: true,
        events: {
            component: {
                contextmenu: function (data) {
                    console.dir(data);
                }
            },
            process: {
                node: {
                    contextmenu: function (data) {
                        console.dir(data);
                    }
                }
            }
        }
    });

    var processflow2 = new Processflow({
        query: '#processflow2',
        data: {
            processflow: flows,
            flowline: flowline2
        },
        autoResize: true
    });

    var processflow3 = new Processflow({
        query: '#processflow3',
        data: {
            processflow: flows,
            flowline: flowline3
        },
        autoResize: true
    });

    var processflow4 = new Processflow({
        query: '#processflow4',
        data: {
            processflow: flows,
            flowline: flowline4
        },
        autoResize: true
    });

    var processflow5 = new Processflow({
        query: '#processflow5',
        data: {
            processflow: flows,
            flowline: flowline5
        },
        autoResize: true
    });

    var processflow6 = new Processflow({
        query: '#processflow6',
        data: {
            processflow: flows,
            flowline: flowline6
        },
        autoResize: true
    });

    var processflow7 = new Processflow({
        query: '#processflow7',
        data: {
            processflow: flows,
            flowline: flowline7
        },
        autoResize: true
    });

    var processflow8 = new Processflow({
        query: '#processflow8',
        data: {
            processflow: flows,
            flowline: flowline8
        },
        autoResize: true
    });

    var processflow9 = new Processflow({
        query: '#processflow9',
        data: {
            processflow: flows,
            flowline: flowline9
        },
        autoResize: true
    });


    var processflow10 = new Processflow({
        query: '#processflow10',
        data: {
            processflow: flows,
            flowline: flowline10
        },
        autoResize: true
    });

    var processflow11 = new Processflow({
        query: '#processflow11',
        data: {
            processflow: flows,
            flowline: flowline11
        },
        autoResize: true
    });


    processflow1.load({
        processflow: flows,
        flowline: flowline1
    });


}());