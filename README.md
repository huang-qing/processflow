# processflow

## 工艺流程图

在多个装配线中工艺在装配线中进行合件、拆件工艺加工的流程展示，可以清晰的展示出零件的工艺加工流程。

![工艺流程图](/images/2018-11-27_112601.png) 

## 使用

1. 添加类库 `jquery-1.8.2.js` `snap.svg.js`
2. 添加控件 `processflow.css` `processflow.js`
3. 指定容器，设置id

```html
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>processflow</title>
    <link rel="stylesheet" href="/src/processflow.css">
    <link rel="stylesheet" href="/css/index.css">
</head>

<body>
    <div id="container">
        <div id="processflow"></div>
    </div>

</body>
<script src="lib/jquery-1.8.2.js"></script>
<script src="lib/snap.svg.js"></script>
<script src="src/processflow.js"></script>
<script src="js/index.js"></script>
</html>
 ```   

数据结构如下：

```javascript
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

    var flowline = [
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

```

创建并绘制流程图：

```javascript
var processflow1 = new Processflow({
    //选择器
    query: '#processflow',
    //数据
    data: {
        //流程图节点信息
        processflow: flows,
        //流程图连线信息
        flowline: flowline
    },
    //是否自动调整大小
    autoResize: true,
    //事件配置
    events: {
        //零件面板
        component: {
            contextmenu: function (data) {
                console.dir(data);
            },
            click: function (data) {
                console.dir(data);
            }
        },
        //工艺流程装配线
        process: {
            node: {
                contextmenu: function (data) {
                    console.dir(data);
                },
                click: function (data) {
                    console.dir(data);
                }
            }
        }
    }
});
```

API

加载数据 `load`

```javascript
processflow.load({
    processflow: flows,
    flowline: flowline
});
```

获取数据 `getData`

```javascript
var data=processflow.getDate();
```

重置大小 `resize`

```javascript
processflow.resize();
```

放大流程图 `zoomIn`

```javascript
processflow.zoomIn();
```

缩小流程图 `zoomOut`

```javascript
processflow.zoomOut();
```

删除当前选中的工艺拆合流程连线 `removeLine`

```javascript
processflow.removeLine();
```

设置编辑状态 `setOperatingStatus(status)`

`status`:`string`

1. 默认状态：`default`
2. 连线状态：`connection`

```javascript
processflow.setOperatingStatus(status);
```

获取选中内容信息 `getSelected(type)`

`type`:`string`

1. 零件：`item`
2. 工艺节：`process`

```javascript
var info=processflow.getSelected(type);
```


