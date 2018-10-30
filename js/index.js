/* global $  Processflow */
$(function () {
    var processflow = new Processflow({
        query: '#processflow',
        data: {
            processflow: [
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
                            index: 1,
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
                            index: 2,
                            unique: '1040',
                            equipment: '设备1',
                            plandate: '2018-10-11'
                        }, {
                            id: {
                                text: 'R3023',
                                state: 'machining'
                            },
                            index: 1,
                            unique: '1041',
                            equipment: '设备1',
                            plandate: '2018-10-11'
                        }, {
                            id: {
                                text: 'IH8',
                                state: 'pause'
                            },
                            index: 2,
                            unique: '1042',
                            equipment: '设备1',
                            plandate: '2018-10-11'
                        }, {
                            id: {
                                text: 'IH88',
                                state: 'complete'
                            },
                            index: 2,
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
                            index: 1,
                            unique: '1057',
                            equipment: '设备3',
                            plandate: '2018-10-11'
                        }, {
                            id: 'IH2',
                            index: 2,
                            unique: '1058',
                            equipment: '设备1',
                            plandate: '2018-10-11'
                        }, {
                            id: 'R3023',
                            index: 1,
                            unique: '1059',
                            equipment: '设备1',
                            plandate: '2018-10-11'
                        }, {
                            id: 'IH8',
                            index: 2,
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
                            index: 1,
                            unique: '1073',
                            equipment: '设备3',
                            plandate: '2018-10-11'
                        }, {
                            id: 'IH2',
                            index: 2,
                            unique: '1074',
                            equipment: '设备1',
                            plandate: '2018-10-11'
                        }, {
                            id: 'R3023',
                            index: 1,
                            unique: '1075',
                            equipment: '设备1',
                            plandate: '2018-10-11'
                        }, {
                            id: 'IH8',
                            index: 2,
                            unique: '1076',
                            equipment: '设备1',
                            plandate: '2018-10-11'
                        }
                    ]
                }
            ],
            flowline: []
        }
    });
}());