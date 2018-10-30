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
                            id: 'R302',
                            index: 1,
                            unique: '1036',
                            equipment: '设备1',
                            plandate: '2018-10-11'
                        }, {
                            id: 'IH',
                            index: 2,
                            unique: '1038',
                            equipment: '设备2',
                            plandate: '2018-10-11'
                        }, {
                            id: 'R332',
                            index: 1,
                            unique: '1036',
                            equipment: '设备3',
                            plandate: '2018-10-11'
                        }, {
                            id: 'IH2',
                            index: 2,
                            unique: '1038',
                            equipment: '设备1',
                            plandate: '2018-10-11'
                        }, {
                            id: 'R3023',
                            index: 1,
                            unique: '1036',
                            equipment: '设备1',
                            plandate: '2018-10-11'
                        }, {
                            id: 'IH8',
                            index: 2,
                            unique: '1038',
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
                            unique: '1036',
                            equipment: '设备1',
                            plandate: '2018-10-11'
                        }, {
                            id: 'IH',
                            index: 2,
                            unique: '1038',
                            equipment: '设备2',
                            plandate: '2018-10-11'
                        }, {
                            id: 'R332',
                            index: 1,
                            unique: '1036',
                            equipment: '设备3',
                            plandate: '2018-10-11'
                        }, {
                            id: 'IH2',
                            index: 2,
                            unique: '1038',
                            equipment: '设备1',
                            plandate: '2018-10-11'
                        }, {
                            id: 'R3023',
                            index: 1,
                            unique: '1036',
                            equipment: '设备1',
                            plandate: '2018-10-11'
                        }, {
                            id: 'IH8',
                            index: 2,
                            unique: '1038',
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