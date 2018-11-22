/* global $  Processflow */
$(function () {

    var flows = [
        {
            component: {
                id: '202',
                name: '安全护板',
                count: 1,
                material: 'Mocr',
                weight: 200.1,
                type: '铸件'
            },
            process: [
                {
                    id: {
                        text: 'R302',
                        state: 'new'
                    },
                    index: 1,
                    unique: {
                        text: '1035',
                        state: 'uploaded'
                    },
                    equipment: '设备1',
                    plandate: '2018-10-11'
                }, {
                    id: {
                        text: 'IH',
                        state: 'audit'
                    },
                    index: 2,
                    unique: '1038',
                    equipment: '设备2',
                    plandate: '2018-10-11',
                }, {
                    id: {
                        text: 'R332',
                        state: 'audited'
                    },
                    index: 3,
                    unique: {
                        text: '1039',
                        state: 'uploaded'
                    },
                    equipment: '设备3',
                    plandate: '2018-10-11'
                }, {
                    id: {
                        text: 'IH2',
                        state: 'dispatched'
                    },
                    index: 4,
                    unique: '1040',
                    equipment: '设备1',
                    plandate: '2018-10-11'
                }, {
                    id: {
                        text: 'R3023',
                        state: 'machining'
                    },
                    index: 5,
                    unique: '1041',
                    equipment: '设备1',
                    plandate: '2018-10-11'
                }, {
                    id: {
                        text: 'IH8',
                        state: 'pause'
                    },
                    index: 6,
                    unique: '1042',
                    equipment: '设备1',
                    plandate: '2018-10-11'
                }, {
                    id: {
                        text: 'IH88',
                        state: 'complete'
                    },
                    index: 7,
                    unique: '1049',
                    equipment: '设备1',
                    plandate: '2018-10-11'
                }
            ]
        },
        {
            component: {
                id: '202',
                name: '安全护板',
                count: 1,
                material: 'Mocr',
                weight: 200.1,
                type: '铸件'
            },
            process: [
                {
                    id: 'R302',
                    index: 1,
                    unique: '1055',
                    equipment: '设备1',
                    plandate: '2018-10-11'
                }, {
                    id: 'IH',
                    index: 2,
                    unique: '1056',
                    equipment: '设备2',
                    plandate: '2018-10-11'
                }, {
                    id: 'R332',
                    index: 3,
                    unique: '1057',
                    equipment: '设备3',
                    plandate: '2018-10-11'
                }, {
                    id: 'IH2',
                    index: 4,
                    unique: '1058',
                    equipment: '设备1',
                    plandate: '2018-10-11'
                }, {
                    id: 'R3023',
                    index: 5,
                    unique: '1059',
                    equipment: '设备1',
                    plandate: '2018-10-11'
                }, {
                    id: 'IH8',
                    index: 6,
                    unique: '1060',
                    equipment: '设备1',
                    plandate: '2018-10-11'
                }
            ]
        },
        {
            component: {
                id: '202',
                name: '安全护板',
                count: 1,
                material: 'Mocr',
                weight: 200.1,
                type: '铸件'
            },
            process: [
                {
                    id: 'R302',
                    index: 1,
                    unique: '1071',
                    equipment: '设备1',
                    plandate: '2018-10-11'
                }, {
                    id: 'IH',
                    index: 2,
                    unique: '1072',
                    equipment: '设备2',
                    plandate: '2018-10-11'
                }, {
                    id: 'R332',
                    index: 3,
                    unique: '1073',
                    equipment: '设备3',
                    plandate: '2018-10-11'
                }, {
                    id: 'IH2',
                    index: 4,
                    unique: '1074',
                    equipment: '设备1',
                    plandate: '2018-10-11'
                }, {
                    id: 'R3023',
                    index: 5,
                    unique: '1075',
                    equipment: '设备1',
                    plandate: '2018-10-11'
                }, {
                    id: 'IH8',
                    index: 6,
                    unique: '1076',
                    equipment: '设备1',
                    plandate: '2018-10-11'
                }
            ]
        }
    ];

    var flowline1 = [
        {
            start: '1038',
            end: '1056'
        },
        {
            start: '1073',
            end: '1057'
        },
        {
            start: '1058',
            end: '1039'
        },
        {
            start: '1059',
            end: '1074'
        }
    ];

    var flowline2 = [
        {
            start: '1073',
            end: '1056'
        },
        {
            start: '1059',
            end: '1074'
        },
        {
            start: '1038',
            end: '1056'
        },
        {
            start: '1076',
            end: '1039'
        }
    ];

    var flowline3 = [
        {
            start: '1038',
            end: '1056'
        },
        {
            start: '1073',
            end: '1057'
        },
        {
            start: '1058',
            end: '1039'
        },
        {
            start: '1059',
            end: '1074'
        }
    ];

    var flowline4 = [
        {
            start: '1035',
            end: '1058'
        },
        {
            start: '1072',
            end: '1058'
        },
        {
            start: '1059',
            end: '1073'
        },
        {
            start: '1059',
            end: '1038'
        }
    ];

    var flowline5 = [
        {
            start: '1073',
            end: '1039'
        },
        {
            start: '1058',
            end: '1039'
        }
    ];

    var flowline6 = [
        {
            start: '1073',
            end: '1039'
        },
        {
            start: '1057',
            end: '1040'
        }
    ];

    var flowline7 = [
        {
            start: '1073',
            end: '1058'
        },
        {
            start: '1058',
            end: '1039'
        },
        {
            start: '1049',
            end: '1059'
        },
        {
            start: '1060',
            end: '1074'
        }
    ];

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


    // processflow1.load({
    //     processflow: flows,
    //     flowline: flowline1
    // });


}());