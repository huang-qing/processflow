/*!
 * processflow v1.0.0 - jQuery plug 
 *
 * Includes jquery.js
 * Includes snap.js
 * 
 * Copyright © 2018-2019 huangqing
 * Released under the MIT license
 *
 * Date: 2018-11-06
 */

/* global jQuery Snap   */
(function ($, Snap, window, console) {

    function setGroup(paper, list, className) {
        var node = paper.g.apply(paper, list);
        node.attr({
            'class': className
        });

        return node;
    }

    var guid = function guid() {
        var i = 1;

        return function () {
            return i++;
        };
    }();

    function Processflow(options) {
        debugger;
        this.options = $.extend(true, {
            query: '',
            data: {
                processflow: [],
                flowline: []
            },
            autoResize: true,
            events: {
                component: {
                    contextmenu: function (e, data, config) {
                        //console.log('component contextmenu event');
                    }
                },
                process: {
                    node: {
                        contextmenu: function (e, data, config) {
                            //console.log('process node contextmenu event');
                        },
                        click: function (e, data, config) {
                            console.log('process node click event');
                        }
                    },
                    line: {
                        contextmenu: function (e, data, config) {
                            //console.log('process line contextmenu event');
                        }
                    }
                }
            }
        }, options);

        this.config = {
            component: $.extend(true, {}, Processflow.component, { events: this.options.events.component }),
            process: $.extend(true, {}, Processflow.process, { events: this.options.events.process })
        };
        this.$container = $(this.options.query);
        this.data = $.extend(true, { processflow: [], flowline: [] }, this.options.data);
        this.autoResize = this.options.autoResize || true;
        this.$svg;
        this.svg;
        this.paper;
        this.elements = {
            component: null,
            process: null,
            line: null
        };
        this.cache = {
            select: {
                component: null,
                processLine: null,
                processNode: null
            },
            operatingStatus: null,
            line: {
                start: null,
                end: null,
                processIds: [],
                //endProcessId: null,
                error: null
            },
            flow: {},
            scale: 1,
            instance: {
                processflow: this,
                flowline: null
            }
        };

        this.render();
    }

    Processflow.component = {
        property: {
            id: {
                name: 'id',
                attr: {
                    'font-size': 12,
                    'fill': '#007ACC'
                }
            },
            name: {
                name: 'name',
                attr: {
                    'font-size': 12,
                    'fill': '#333'
                }
            },
            count: {
                name: 'count',
                attr: {
                    'font-size': 12,
                    'fill': '#C3622C'
                },
                format: function (number) {
                    return number.toFixed(2);
                }
            },
            material: {
                name: 'material',
                attr: {
                    'font-size': 12,
                    'fill': '#68D0FE'
                }
            },
            weight: {
                name: 'weight',
                attr: {
                    'font-size': 12,
                    'fill': '#C3622C'
                },
                format: function (number) {
                    return number.toFixed(2);
                }
            },
            type: {
                name: 'type',
                attr: {
                    'font-size': 12,
                    'fill': '#93CEA8'
                }
            }
        },
        format: ['id', ['name', 'count'], 'material', 'weight', 'type'],
        map: {
            id: 'id',
            name: 'name',
            count: 'count',
            material: 'material',
            weight: 'weight',
            type: 'type'
        },
        line: {
            attr: {
                stroke: '#C1C1C1',
                strokeWidth: 1
            }
        },
        rect: {
            attr: {
                opacity: 0
            }
        },
        className: {
            component: 'procesflow-component',
            panel: 'procesflow-component-panel'
        },
        width: 200,
        height: 120,
        offsetX: 12,
        offsetY: 20,
        x: 0,
        y: 0,
        padding: 6
    };

    Processflow.process = {
        property: {
            id: {
                name: 'id',
                attr: {
                    'font-size': 12,
                    'fill': '#333',
                    'cursor': 'pointer'
                }
            },
            index: {
                name: 'index',
                attr: {
                    'font-size': 12,
                    'fill': '#333'
                }
            },
            unique: {
                name: 'unique',
                attr: {
                    'font-size': 12,
                    'fill': '#F11611'
                },
                state: {
                    waitupload: {
                        'fill': '#F11611'
                    },
                    uploaded: {
                        'fill': '#7FD53E'
                    }
                }
            },
            equipment: {
                name: 'equipment',
                attr: {
                    'font-size': 12,
                    'fill': '#333'
                },
            },
            plandate: {
                name: 'plandate',
                attr: {
                    'font-size': 12,
                    'fill': '#333'
                },
            }
        },
        map: {
            id: 'id',
            index: 'index',
            unique: 'unique',
            equipment: 'equipment',
            plandate: 'plandate',
        },
        order: {
            middle: 'id',
            top: ['index', 'unique'],
            bottom: ['equipment', 'plandate']
        },
        text: {
            offsetY: 18
        },
        node: {
            width: 12 * 6,
            height: 18,
            padding: 4,
            attr: {
                stroke: '#4695F9',
                strokeWidth: 1,
                fill: '#ffffff',
                cursor: 'pointer',
                'stroke-dasharray': 0
            },
            selectAttr: {
                stroke: '#007ACC',
                strokeWidth: 3
            },
            selectAttr2: {
                stroke: '#007ACC',
                strokeWidth: 3,
                'stroke-dasharray': [4, 2]
            },
            errorAttr: {
                stroke: '#EC4D3C',
                strokeWidth: 3,
                'stroke-dasharray': [4, 2]
            },
            state: {
                new: {
                    fill: '#CCCCCC'
                },
                audit: {
                    fill: '#C73AF6'
                },
                audited: {
                    fill: '#5B9CFE'
                },
                dispatched: {
                    fill: '#DCD079'
                },
                machining: {
                    fill: '#F9CC9D'
                },
                pause: {
                    fill: '#E45C44'
                },
                complete: {
                    fill: '#36DE81'
                }
            }
        },
        line: {
            width: 12 * 6,
            attr: {
                stroke: '#4695F9',
                strokeWidth: 1,
                fill: 'none'
            },
            selectAttr: {
                stroke: '#007ACC',
                strokeWidth: 3,
                fill: 'none'
            }
        },
        className: {
            main: 'procesflow-process-node-main',
            top: 'processflow-process-node-top',
            bottom: 'processflow-process-node-bottom',
            node: 'processflow-process-node',
            line: 'processflow-process-line',
            process: 'processflow-process',
            panel: 'processflow-process-panel',
            brokenLine: 'processflow-process-broken-line',
            defaultStatus: 'processflow-process-operating-status-default',
            connectionStatus: 'processflow-process-operating-status-connection',
        },
        attr: {
            stroke: '#4695F9',
            strokeWidth: 1,
            'stroke-dasharray': 0
        },
        selectAttr: {
            stroke: '#007ACC',
            strokeWidth: 3
        },
        id: 'unique'

    };

    Processflow.prototype.render = function () {
        if (this.$container.length > 0) {
            this.create();
            this.resize();
            this.renderFlowline();
            this.renderMenu();
            this.bindEvent();
        }
    };

    Processflow.prototype.create = function () {
        this.size = this.getSvgSize();
        this.cache.size = this.size;

        this.$componentContainer = $('<div class="processflow-component-container"></div>');
        this.$processContainer = $('<div class="processflow-process-container"></div>');

        this.componentSvg = Snap();
        this.processSvg = Snap();

        this.componentPaper = this.componentSvg.paper;
        this.processPaper = this.processSvg.paper;

        this.$componentSvg = $(this.componentSvg.node);
        this.$processSvg = $(this.processSvg.node);


        this.$componentContainer.append(this.$componentSvg);
        this.$processContainer.append(this.$processSvg);
        this.$container.append(this.$componentContainer);
        this.$container.append(this.$processContainer);
        this.$container.addClass('processflow');

        this.resizeComponent();
        this.renderFlows();
    };

    Processflow.prototype.load = function (data) {
        this.data = data;
        this.clear();
        this.renderFlows();
        this.renderFlowline();
    };

    Processflow.prototype.clear = function () {
        this.processPaper.clear();
        this.componentPaper.clear();
    };

    Processflow.prototype.getData = function () {
        return this.data;
    };

    Processflow.prototype.setOperatingStatus = function (status) {
        var className = this.config.process.className;

        //默认状态：default
        //连线状态：connection
        this.cache.operatingStatus = status || 'default';

        this.$processContainer
            .removeClass([className.defaultStatus, className.connectionStatus].join(' '))
            .addClass(status === 'connection' ? className.connectionStatus : className.defaultStatus);
    };

    Processflow.prototype.renderFlows = function () {
        var data = this.data.processflow,
            height = this.config.component.height,
            x = this.config.component.x,
            y = this.config.component.y,
            componentNodes = [],
            processNodes = [],
            panel;

        for (var i = 0, len = data.length; i < len; i++) {
            panel = new Panel(this.componentPaper, this.processPaper, data[i], this.config, x, y + i * height, this.cache);
            componentNodes.push(panel.component.element);
            processNodes.push(panel.flowChart.element);
        }

        this.elements.component = setGroup(this.componentPaper, componentNodes, this.config.component.className.panel);
        this.elements.process = setGroup(this.processPaper, processNodes, this.config.process.className.panel);
    };

    Processflow.prototype.renderFlowline = function () {
        var flowline = new Flowline(this.processPaper, this.elements.process, this.data.flowline, this.config.process, this.cache);
        flowline.render();
        this.cache.instance.flowline = flowline;
    };

    Processflow.prototype.renderMenu = function () {
        this.menu = new Menu(this.cache);
        this.menu.create();
    };

    Processflow.prototype.getSvgSize = function () {
        var count = this.data.processflow.length,
            c_height = this.config.component.height,
            c_width = this.config.component.width,
            height = c_height * count;


        return {
            component: {
                width: c_width,
                height: height
            },
            process: {
                width: 10000,
                height: height
            }
        };
    };

    Processflow.prototype.resize = function () {
        var container = this.$container,
            component = this.$componentContainer,
            process = this.$processContainer,
            size = this.size,
            //containerWidth = container.width(),
            containerHeight = container.parent().height(),
            componentWidth = size.component.width * this.cache.scale;


        container.css({
            height: containerHeight
        });

        component.css({
            width: componentWidth,
            height: containerHeight
        });

        process.css({
            //width: containerWidth - componentWidth - (containerHeight < size.component.height ? 22 : 1),
            height: containerHeight,
            left: componentWidth,
            right: 0
        });
    };

    Processflow.prototype.resizeComponent = function () {
        var svg = this.componentPaper,
            size = this.cache.size,
            height = size.component.height,
            width = size.component.width;

        svg.attr({
            width: width,
            height: height,
            viewBox: [0, 0, width, height].join(' ')
        });
    };

    Processflow.prototype.bindEvent = function () {
        var process = this.$processContainer,
            component = this.$componentContainer,
            self = this;

        process.scroll(function () {
            var top = this.scrollTop;
            component.css('margin-top', -1 * top);
        });

        component.contextmenu(function () {
            return false;
        });
        process.contextmenu(function () {
            return false;
        });

        if (this.autoResize) {
            $(window).resize(function () {
                self.resize();
            });
        }
    };

    Processflow.prototype.zoomIn = function () {
        var scale = this.cache.scale;

        if (scale >= 4) {
            scale = 4;
        }
        else if (scale >= 1) {
            scale += 0.5;
        }
        else if (scale < 1) {
            scale = Math.ceil((scale + 0.1) * 10) / 10;
        }

        this.zoom(scale);
    };

    Processflow.prototype.zoomOut = function () {
        var scale = this.cache.scale;

        if (scale <= 0.2) {
            scale = 0.1;
        }
        else if (scale > 1) {
            scale -= 0.5;
        }
        else if (scale <= 1) {
            scale = Math.floor((scale - 0.1) * 10) / 10;
        }

        this.zoom(scale);
    };

    Processflow.prototype.zoom = function (scale) {
        var componentViewbox = this.componentPaper.attr('viewBox'),
            processViewbox = this.processPaper.attr('viewBox');

        this.cache.scale = scale;
        //console.log(scale);
        this.componentPaper.attr({
            width: componentViewbox.width * scale,
            height: componentViewbox.height * scale
        });

        this.processPaper.attr({
            width: processViewbox.width * scale,
            height: processViewbox.height * scale
        });

        this.resize();
    };

    Processflow.prototype.removeFlowLine = function () {
        this.cache.instance.flowline.removeFlowLine();
    };

    function Panel(componentPaper, processPaper, data, config, x, y, cache) {
        this.componentPaper = componentPaper;
        this.processPaper = processPaper;
        this.data = data;
        this.element;
        this.config = config;
        this.x = x;
        this.y = y;
        this.cache = cache;

        this.element = this.create();
    }

    Panel.prototype.create = function () {
        var c_config = this.config.component,
            p_config = this.config.process;

        this.component = new Component(this.componentPaper, this.data.component, c_config, this.x, this.y, this.cache);
        this.flowChart = new FlowChart(this.processPaper, this.data.process, p_config, this.x + 2, this.y + Math.floor(c_config.height / 2), this.cache);

        return {
            component: this.component,
            flowChart: this.flowChart
        };
    };

    function Component(paper, data, config, x, y, cache) {
        this.paper = paper;
        this.data = data;
        this.x = x;
        this.y = y;
        this.config = config;
        this.element;
        this.elements = {
            texts: [],
            line: null,
            rect: null
        };
        this.endY;
        this.cache = cache;

        this.element = this.create();
        this.bindEvent();
    }

    Component.prototype.create = function () {
        var config = this.config,
            info = config.format,
            padding = config.padding,
            x = this.x + padding,
            y = this.y + padding,
            node;

        this.renderRect();
        this.renderVText(x, y, info);
        this.renderLine();

        node = setGroup(this.paper, this.elements.texts.concat([this.elements.line, this.elements.rect]), this.config.className.component);

        return node;
    };

    Component.prototype.renderVText = function (x, y, info) {
        var item,
            config = this.config,
            offsetY = config.offsetY,
            startX,
            startY;

        for (var i = 0, len = info.length; i < len; i++) {
            item = info[i];
            startX = x;
            startY = y + i * offsetY;
            if (typeof item === 'string') {
                this.renderText(startX, startY, item);
                this.endY = startY;
            }
            else if (item instanceof Array) {
                this.renderHInfo(startX, startY, item);
            }
        }
    };

    Component.prototype.renderHInfo = function (x, y, info) {
        var name,
            config = this.config,
            offsetX = config.offsetX,
            startX,
            startY,
            width,
            element,
            bbox;

        for (var i = 0, len = info.length; i < len; i++) {
            name = info[i];
            startX = x + i * offsetX;
            startY = y;
            width = 0;

            if (element) {
                bbox = element.getBBox();
                width = bbox.width;
            }

            element = this.renderText(startX + width, startY, name) || element;
        }
    };

    Component.prototype.renderRect = function () {
        var config = this.config,
            element,
            startX = config.x,
            startY = this.y;

        element = this.paper.rect(startX, startY, config.width, config.height);
        element.attr(config.rect.attr);
        this.elements.rect = element;
    };

    Component.prototype.renderLine = function () {
        var config = this.config,
            element,
            startX = config.x,
            startY = this.y + config.height,
            endX = config.width,
            endY = startY;

        element = this.paper.line(startX, startY, endX, endY);
        element.attr(config.line.attr);
        this.elements.line = element;
    };

    Component.prototype.renderText = function (x, y, name) {
        var data = this.data,
            properties = this.config.property,
            property = properties[name] || {},
            attr = property.attr || {},
            mapName = this.config.map[name] || name,
            text = data[mapName] || '',
            element;

        if (text) {
            if (typeof property.format === 'function') {
                text = property.format(text);
            }
            element = this.paper.text(x, y + attr['font-size'], text);
            element.attr($.extend({}, {
                'text-anchor': 'start'
            }, attr));

            this.elements.texts.push(element);
        }

        return element;
    };

    Component.prototype.bindEvent = function () {
        var element = this.element,
            self = this;

        element.mouseup(function (e) {
            if (e.button === 2) {
                self.config.events.contextmenu(e, self.data, self.config);
            }
        });
    };

    function FlowChart(paper, data, config, x, y, cache) {
        this.paper = paper;
        this.data = data;
        this.x = x;
        this.y = y;
        this.config = config;
        this.elements = {
            nodes: [],
            lines: []
        };
        this.element;
        this.cache = cache;

        this.element = this.create();
    }

    FlowChart.prototype.create = function () {
        var data = this.data,
            info,
            startX = this.x,
            startY = this.y,
            config = this.config,
            nodeWidth = config.node.width,
            lineWidth = config.line.width,
            node;

        for (var i = 0, len = data.length; i < len; i++) {
            info = data[i];
            this.elements.nodes.push(this.renderNode(startX + i * (nodeWidth + lineWidth), startY, info, i + 1));
        }

        node = setGroup(this.paper, this.elements.nodes.concat(this.elements.lines), this.config.className.process);
        node.attr({
            'data-id': guid()
        });
        return node;
    };

    FlowChart.prototype.renderNode = function (x, y, info, index) {
        var mainNode,
            topNode,
            bottomNode,
            node;

        mainNode = this.renderMainNode(x, y, info, index);
        topNode = this.renderSecondaryNode(x, y, 'top', info);
        bottomNode = this.renderSecondaryNode(x, y, 'bottom', info);
        node = setGroup(this.paper, [mainNode, topNode, bottomNode], this.config.className.node);
        node.attr({
            'data-index': index,
            'data-path': this.getPath(index),
            'data-id': this.getInfo(this.config.id, info).text
        });
        this.bindMainNodeEvent(mainNode, info);

        return node;
    };

    FlowChart.prototype.renderMainNode = function (x, y, info, index) {
        var order = this.config.order,
            config = this.config,
            width = config.node.width,
            height = config.node.height,
            padding = config.node.padding,
            rectElement,
            textElement,
            state = {},
            node;

        //rect
        rectElement = this.paper.rect(x, y - height / 2, width, height, 4);
        state = config.node.state[this.getInfo(order.middle, info).state] || {};
        rectElement.attr($.extend({}, config.node.attr, state));
        //text
        textElement = this.renderText(x + width / 2, y + padding, order.middle, info);
        node = setGroup(this.paper, [rectElement, textElement], this.config.className.main);

        return node;
    };

    FlowChart.prototype.getPath = function (index) {
        var path = [];

        for (var i = 0, len = index; i < len; i++) {
            path.push(i + 1);
        }

        return path.join('-');
    };

    FlowChart.prototype.bindMainNodeEvent = function (element, info) {
        var self = this;

        element.mouseup(function (e) {
            if (e.button === 2) {
                self.config.events.node.contextmenu(e, info, self.config);
            }
            else if (e.button === 0) {
                self.selectNode(this);
                if (self.cache.operatingStatus !== 'connection') {
                    self.config.events.node.click(e, info, self.config);
                }
            }
        });

    };

    FlowChart.prototype.selectNode = function (element) {
        var selected = this.cache.select.processLine || this.cache.select.processNode,
            node = element.select('rect'),
            flowline = this.cache.instance.flowline,
            attr;

        if (this.cache.select.processLine) {
            selected.attr(this.config.attr);
        } else if (this.cache.select.processNode) {
            selected.select('rect').attr(this.config.attr);
        }

        if (this.cache.operatingStatus === 'connection') {
            this.cache.select.processLine = null;
            this.cache.select.processNode = null;
            flowline.addFlowLine(element.parent());
        }
        else {
            attr = this.config.node.selectAttr;
            node.attr(attr);
            this.cache.select.processLine = null;
            this.cache.select.processNode = element;
        }

    };

    FlowChart.prototype.renderSecondaryNode = function (x, y, type, info) {
        var name,
            order = this.config.order,
            list = order[type],
            sign = type === 'top' ? -1 : 1,
            config = this.config,
            startX = x + config.node.width / 2,
            startY,
            nodes = [],
            node;

        for (var i = 0, len = list.length; i < len; i++) {
            name = list[i];
            startY = y + config.node.height / 4 + sign * (config.text.offsetY) * (i + 1);
            nodes.push(this.renderText(startX, startY, name, info));
        }

        node = setGroup(this.paper, nodes, this.config.className[type]);

        return node;
    };

    FlowChart.prototype.getInfo = function (name, info) {
        var map = this.config.map,
            _info = info[map[name]] || null;

        if (!_info) {
            return {
                text: '',
                state: ''
            };
        }
        else if (typeof _info !== 'object') {
            return {
                text: _info,
                state: ''
            };
        }
        else {
            return _info;
        }

    };

    FlowChart.prototype.getState = function (name, info) {
        var properties = this.config.property,
            property = properties[name],
            state = {};

        if (property.state && typeof info === 'object') {
            state = property.state[info.state] || {};
        }

        return state;
    };

    FlowChart.prototype.renderText = function (x, y, name, info) {
        var element,
            property = this.config.property[name],
            information = this.getInfo(name, info),
            state = {};

        if (property.state) {
            state = property.state[information.state] || {};
        }

        element = this.paper.text(x, y, information.text);
        element.attr($.extend({}, {
            'text-anchor': 'middle'
        }, property.attr, state));

        return element;
    };

    function Flowline(paper, element, data, config, cache) {
        this.paper = paper;
        this.data = data;
        this.element = element;
        this.config = config;
        this.cache = cache;
    }

    Flowline.prototype.render = function () {
        this.adjustProcessNode();
        this.renderAllLine();
    };

    Flowline.prototype.sortData = function () {
        var i, j, len, jlen,
            a, b,
            line,
            data = this.data,
            temp;

        if (!data) {
            return;
        }

        for (i = 0, len = data.length; i < len; i++) {
            line = data[i];
            line.index = parseInt(this.element.select('[data-id="' + line.start + '"]').attr('data-index'));
        }

        for (i = 0, len = data.length; i < len - 1; i++) {

            for (j = 1, jlen = len; j < jlen; j++) {
                a = data[j - 1];
                b = data[j];
                if (a.index > b.index) {
                    temp = data[j];
                    data[j] = data[j - 1];
                    data[j - 1] = temp;
                }
            }
        }
    };

    Flowline.prototype.adjustProcessNode = function () {
        var line,
            data = this.data || [];

        this.sortData();
        for (var i = 0, len = data.length; i < len; i++) {
            line = data[i];
            this.adjustNode(line);
        }
    };

    Flowline.prototype.adjustNode = function (line) {
        var config = this.config,
            element = this.element,
            fromNode = element.select('[data-id="' + line.start + '"]'),
            toNode = element.select('[data-id="' + line.end + '"]'),
            fromNodeBox = fromNode.getBBox(),
            toNodeBox = toNode.getBBox(),
            offsetX = config.node.width + config.line.width,
            fromNodesId,
            nextNode;

        this.setNodeState(fromNode, toNode);

        //当前节点与跳转节点x位置相同
        if (fromNodeBox.x === toNodeBox.x) {
            this.translateNodeX(toNode, offsetX);
        }
        //当前节点在跳转节点x位置之前
        else if (fromNodeBox.x + offsetX < toNodeBox.x) {
            offsetX = toNodeBox.x - fromNodeBox.x - offsetX;
            this.translateNodeX(this.getNextNode(fromNode), offsetX);
        }
        //当前节点在跳转节点x位置之后
        else if (fromNodeBox.x > toNodeBox.x) {
            offsetX = fromNodeBox.x + offsetX - toNodeBox.x;
            this.translateNodeX(toNode, offsetX);
        }

        //调整与跳转节点关联节点的后续流程节点的位置
        fromNodesId = toNode.attr('data-from');
        if (fromNodesId) {
            fromNodesId = fromNodesId.split(',');
            for (var i = 0, len = fromNodesId.length; i < len - 1; i++) {
                fromNode = element.select('[data-id="' + fromNodesId[i] + '"]');
                nextNode = this.getNextNode(fromNode);
                if (nextNode.getBBox().x < toNode.getBBox().x) {
                    this.translateNodeX(nextNode, offsetX);
                }
            }
        }
    };

    Flowline.prototype.setNodeState = function (fromNode, toNode) {
        var fromProcessId = fromNode.parent().attr('data-id'),
            toProcessId = toNode.parent().attr('data-id'),
            fromId = fromNode.attr('data-id'),
            toId = toNode.attr('data-id'),
            dataFromProcess,
            dataToProcess,
            dataTo,
            dataFrom;

        //拆件
        if (fromNode.attr('data-state')) {
            dataToProcess = fromNode.attr('data-to-process') + ',' + toProcessId;
            dataTo = fromNode.attr('data-to') + ',' + toId;
        }
        else {
            dataToProcess = toProcessId;
            dataTo = toId;
        }

        fromNode.attr({
            'data-state': 'out',
            'data-from-process': fromProcessId,
            'data-to-process': dataToProcess,
            'data-to': dataTo
        });

        //合件
        if (toNode.attr('data-state')) {
            dataFromProcess = toNode.attr('data-from-process') + ',' + fromProcessId;
            dataFrom = toNode.attr('data-from') + ',' + fromId;
        }
        else {
            dataFromProcess = fromProcessId;
            dataFrom = fromId;
        }

        toNode.attr({
            'data-state': 'in',
            'data-from-process': dataFromProcess,
            'data-to-process': toProcessId,
            'data-from': dataFrom
        });
    };

    Flowline.prototype.getNextNode = function (node) {
        var index = node.attr('data-index'),
            nextIndex = parseInt(index) + 1;

        return node.parent().select('[data-index="' + nextIndex + '"]');
    };

    Flowline.prototype.getPrevNode = function (node) {
        var index = node.attr('data-index'),
            prevIndex = parseInt(index) - 1;

        return node.parent().select('[data-index="' + prevIndex + '"]');
    };

    Flowline.prototype.translateNodeX = function (node, offsetX) {
        var nodes,
            m,
            dx,
            currentNode;

        nodes = node.parent().selectAll('[data-path^="' + node.attr('data-path') + '"]');
        // 位移
        for (var i = 0, len = nodes.items.length; i < len; i++) {
            currentNode = nodes[i];
            dx = currentNode.attr('data-dx') || 0;
            if (isNaN(dx)) {
                dx = 0;
            }
            else {
                dx = parseInt(dx);
            }
            dx += offsetX;
            m = new Snap.Matrix();
            m.translate(dx, 0);
            currentNode.attr('data-dx', dx);
            currentNode.transform(m);
        }
    };

    Flowline.prototype.renderAllLine = function () {
        var rootNodes = this.element.selectAll('[data-index="1"]'),
            node,
            id,
            info;

        for (var i = 0, len = rootNodes.length; i < len; i++) {
            node = rootNodes[i];
            id = node.parent().attr('data-id');
            info = this.cache.flow[id] = {
                id: id,
                out: null,
                back: false,
                count: 1,
                brokenLine: [],
                path: []
            };
            this.renderLine(node, info);
        }

        this.resize();
    };

    Flowline.prototype.updateAllLine = function () {
        this.clear();
        this.sortData();
        this.adjustProcessNode();
        this.renderAllLine();
    };

    Flowline.prototype.clear = function () {
        var lines = this.paper.selectAll('.' + this.config.className.line),
            nodes = this.paper.selectAll('.' + this.config.className.node);

        nodes.attr({
            transform: '',
            'data-dx': '',
            'data-to': '',
            'data-from': '',
            'data-to-process': '',
            'data-from-process': '',
            'data-state': ''
        });

        lines.remove();

        this.cache.flow = {};
        this.cache.select = {
            processLine: null,
            processNode: null
        };
        // this.cache.line = {
        //     start: null,
        //     end: null,
        //     processIds: [],
        //     error:null
        //    // endProcessId: null
        // };
    };

    Flowline.prototype.removeLine = function () {
        this.clear();
        this.sortData();
        this.adjustProcessNode();
        this.renderAllLine();
    };

    Flowline.prototype.renderLine = function (node, info) {
        var nextNode,
            nodeState,
            toProcessId,
            fromProcessId,
            toNode,
            isOut = false,
            isBack = false,
            fromId,
            toId;

        if (!node) {
            return;
        }

        nodeState = node.attr('data-state');
        toProcessId = node.attr('data-to-process');
        fromProcessId = node.attr('data-from-process');
        toNode = node.attr('data-to');
        fromId = node.attr('data-id');

        info.path.push(fromId);
        //判断拆件
        if (nodeState === 'out') {
            //在其他流程线进行合件
            isOut = this.hasProcessId(fromProcessId, info.id) && info.out === null;
            //拆件返回当前流程
            isBack = this.hasProcessId(toProcessId, info.id) && info.out !== null;
        }
        //判断合件
        else if (nodeState === 'in') {
            //合件从其他流程中拆回当前流程
            if (info.out && info.back && this.hasProcessId(toProcessId, info.id)) {
                info.out = null;
                info.back = false;
            }
            //到其他流程中合件,保持状态
            // else if (info.out && this.hasProcessId(fromProcessId, info.id)) {
            // }
            //其他件在当前流程中进行合件，增加流程数量
            else if (this.hasProcessId(toProcessId, info.id)) {
                info.count++;
            }
        }

        //其他合件从当前流程拆回，当前流程继续往下走
        if (nodeState === 'out' && info.count > 1) {
            //强制判定为其他件拆回（项目要求），不是合件整体再到其他的流程中再次合件
            //实际真正的流程有可能存在上面排除的情况，由人工凭经验自行判断
            nextNode = this.getNextNode(node);
            this.renderStraightLine(node, nextNode);
            this.renderLine(nextNode, info);
        }
        //合件到其他流程
        else if (nodeState === 'out' && isOut) {
            info.out = toProcessId;
            nextNode = this.queryNode(null, toProcessId, toNode);
            this.renderBrokenLine(node, nextNode, info.id);

            toId = nextNode.attr('data-id');
            info.brokenLine.push({
                'start': fromId,
                'end': toId,
            });

            this.renderLine(nextNode, info);
        }
        //从其他流程的合件中拆回，返回到当前流程
        else if (nodeState == 'out' && isBack) {
            info.back = true;
            nextNode = this.queryNode(info.id, toProcessId, toNode);
            this.renderBrokenLine(node, nextNode, info.id);

            toId = nextNode.attr('data-id');
            info.brokenLine.push({
                'start': fromId,
                'end': toId
            });

            this.renderLine(nextNode, info);
        }
        else {
            nextNode = this.getNextNode(node);
            this.renderStraightLine(node, nextNode, info.id);
            this.renderLine(nextNode, info);
        }

    };

    Flowline.prototype.hasProcessId = function (list, id) {
        var item;

        list = list.split(',');
        for (var i = 0, len = list.length; i < len; i++) {
            item = list[i];
            if (item === id) {
                return true;
            }
        }

        return false;
    };

    Flowline.prototype.queryNode = function (processId, processList, nodeList) {
        var nodeId;

        if (typeof processList === 'string') {
            processList = processList.split(',');
        }
        if (typeof nodeList === 'string') {
            nodeList = nodeList.split(',');
        }

        for (var i = 0, len = processList.length; i < len; i++) {
            //指定流程id或任意流程id
            if (processList[i] === processId || processId === null) {
                nodeId = nodeList[i];
                break;
            }
        }

        return this.element.select('[data-id="' + nodeId + '"]');
    };

    Flowline.prototype.getPositionInfo = function (node, nextNode) {
        var nodeBox,
            nextNodeBox,
            startX,
            startY,
            endX,
            endY,
            rect,
            nextRect;

        if (!node || !nextNode) {
            return null;
        }

        rect = node.select('.' + this.config.className.main);
        nextRect = nextNode.select('.' + this.config.className.main);

        nodeBox = rect.getBBox();
        nextNodeBox = nextRect.getBBox();
        startX = nodeBox.x + nodeBox.width + (parseInt(node.attr('data-dx')) || 0);
        startY = nodeBox.y + nodeBox.height / 2;
        endX = nextNodeBox.x + (parseInt(nextNode.attr('data-dx')) || 0);
        endY = nextNodeBox.y + nodeBox.height / 2;

        return {
            x1: startX,
            y1: startY,
            x2: endX,
            y2: endY
        };
    };

    Flowline.prototype.renderStraightLine = function (node, nextNode, processId) {
        var position,
            element;

        if (!node || !nextNode) {
            return null;
        }

        position = this.getPositionInfo(node, nextNode);

        element = this.paper.line(position.x1, position.y1, position.x2, position.y2);
        element.attr(this.config.line.attr);
        element.attr('class', this.config.className.line);
        element.attr({
            'data-from': node.attr('data-id'),
            'data-to': nextNode.attr('data-id'),
            'data-process-id': processId
        });

        return element;
    };

    Flowline.prototype.renderBrokenLine = function (node, nextNode, processId) {
        var position,
            x1,
            y1,
            x2,
            y3,
            x4,
            path,
            element;

        if (!node || !nextNode) {
            return null;
        }

        position = this.getPositionInfo(node, nextNode);
        x1 = position.x1;
        y1 = position.y1;
        x2 = position.x2 - this.config.line.width / 2;
        y3 = position.y2;
        x4 = position.x2;
        path = ['M', x1, ' ', y1, 'H', x2, 'V', y3, 'H', x4].join('');

        element = this.paper.path(path);
        element.attr(this.config.line.attr);
        element.attr({
            'data-from': node.attr('data-id'),
            'data-to': nextNode.attr('data-id'),
            'data-process-id': processId
        });
        element.attr('class', [this.config.className.line, this.config.className.brokenLine].join(' '));

        this.bindBrokenLineEvent(element);

        return element;
    };

    Flowline.prototype.selectLine = function (element) {
        var selected = this.cache.select.processLine || this.cache.select.processNode,
            line = element;

        if (this.cache.select.processLine) {
            selected.attr(this.config.attr);
        } else if (this.cache.select.processNode) {
            selected.select('rect').attr(this.config.attr);
        }

        line.attr(this.config.node.selectAttr);
        this.cache.select.processLine = line;
        this.cache.select.processNode = null;
    };

    Flowline.prototype.removeFlowLine = function () {
        var cache = this.cache,
            selectLine = cache.select.processLine,
            processId,
            startId,
            endId,
            list,
            sign = false,
            item;

        if (!selectLine) {
            return;
        }

        processId = selectLine.attr('data-process-id');
        startId = selectLine.attr('data-from');
        endId = selectLine.attr('data-to');

        list = cache.flow[processId].brokenLine;

        for (var i = 0, len = list.length; i < len; i++) {
            item = list[i];
            if ((item.start == startId && item.end == endId) || sign) {
                sign = true;
                this.removeFlowLineInData(item.start, item.end);
            }
        }

        this.updateAllLine();
    };

    Flowline.prototype.removeFlowLineInData = function (start, end) {
        var data = this.data,
            item;

        for (var len = data.length, i = len - 1; i >= 0; i--) {
            item = data[i];
            if (item.start == start && item.end == end) {
                data.splice(i, 1);
                break;
            }
        }
    };

    Flowline.prototype.addFlowLine = function (node) {
        var line = this.cache.line,
            id = node.attr('data-id'),
            index = node.attr('data-index'),
            processId = node.parent().attr('data-id'),
            flow = this.cache.flow[processId],
            state = node.attr('data-state'),
            attr = this.config.node.attr,
            selectedAttr = this.config.node.selectAttr2,
            errorAttr = this.config.node.errorAttr,
            //startFlow,
            toNode,
            length,
            i;

        if (line.error) {
            this.paper.select('[data-id="' + line.error + '"] rect').attr(attr);
            line.error = null;
        }


        //重复点击工艺节点，取消选择
        if (line.start === id) {
            node.select('rect').attr(attr);
            line.start = null;
        }
        //合件工艺节点不允许拆件
        else if (line.start === null && state === 'in') {
            this.renderErrorFlowline(node);
        }
        else if (line.start === null) {
            this.renderStartFlowline(node);
        }
        //不允许连线在已存在的流程中
        else if (line.start !== null && this.hasNodeInProcessIds(id)) {
            this.renderErrorFlowline(node);
        }
        //存在拆合件的流程
        else if (line.start !== null && flow.brokenLine.length > 0) {
            length = flow.brokenLine.length;
            i = length % 2 === 0 ? length - 2 : length - 1;
            toNode = this.getNextNode(this.paper.select('[data-id="' + flow.brokenLine[i].start + '"]'));
            //流程合件未拆回
            if (length % 2 === 1) {
                //判断流程中拆回件允许返回的节点，必须是最后一个合件节点之后的相邻节点
                if (toNode.attr('data-id') == id) {
                    this.renderEndFlowline(node);
                }
                else {
                    this.renderErrorFlowline(node);
                }
            }
            //流程合件已拆回
            else {
                //只能选取最后一个拆回件之后的节点
                i = toNode.attr('data-index');
                if (i < index) {
                    this.renderEndFlowline(node);
                }
                else {
                    this.renderErrorFlowline(node);
                }
            }
        }
        else {
            this.renderEndFlowline(node);
        }

        if (line.start && line.end) {
            this.addFlowLineInData();
            this.paper.select('[data-id="' + line.start + '"] rect').attr(this.config.attr);
            this.paper.select('[data-id="' + line.end + '"] rect').attr(this.config.attr);
            line.start = null;
            line.end = null;
            line.processIds = [];
        }
    };

    Flowline.prototype.queryNodeProcessIds = function (id) {
        var flow = this.cache.flow,
            path,
            ids = [];

        for (var i in flow) {
            path = flow[i].path;
            if (path.indexOf(id) !== -1) {
                ids.push(i);
            }
        }

        return ids;
    };

    Flowline.prototype.hasNodeInProcessIds = function (id) {
        var line = this.cache.line,
            processIds = line.processIds,
            flow;

        for (var i = 0, len = processIds.length; i < len; i++) {
            flow = this.cache.flow[processIds[i]];
            if (flow.path.indexOf(id) !== -1) {
                return true;
            }
        }

        return false;
    };

    Flowline.prototype.renderStartFlowline = function (node) {
        var line = this.cache.line,
            attr = this.config.node.attr,
            selectedAttr = this.config.node.selectAttr2,
            id = node.attr('data-id');

        if (line.start) {
            this.paper.select('[data-id="' + line.start + '"] rect').attr(attr);
        }
        line.start = id;
        line.processIds = this.queryNodeProcessIds(id);
        node.select('rect').attr(selectedAttr);
    };

    Flowline.prototype.renderEndFlowline = function (node) {
        var line = this.cache.line,
            //attr = this.config.node.attr,
            selectedAttr = this.config.node.selectAttr2,
            id = node.attr('data-id');

        line.end = id;
        //line.endProcessId = processId;
        node.select('rect').attr(selectedAttr);
    };

    Flowline.prototype.renderErrorFlowline = function (node) {
        var line = this.cache.line,
            errorAttr = this.config.node.errorAttr,
            id = node.attr('data-id');

        line.error = id;
        node.select('rect').attr(errorAttr);
    };

    Flowline.prototype.addFlowLineInData = function () {
        var line = this.cache.line,
            fromProcessId,
            toProcessId,
            fromNode,
            fromId,
            toId,
            toNode,
            node;

        fromNode = this.paper.select('[data-id="' + line.start + '"]');
        toNode = this.paper.select('[data-id="' + line.end + '"]');
        fromId = fromNode.attr('data-id');
        toId = toNode.attr('data-id');
        fromProcessId = fromNode.parent().attr('data-id');
        toProcessId = toNode.parent().attr('data-id');

        //清除在这两个流程选中工序节点的后续关联拆合件流程关联
        node = this.getNextNode(fromNode);
        while (node) {
            this.removeFlowlineByProcessIdInData(node, fromProcessId, toProcessId);
            node = this.getNextNode(node);
        }

        node = this.getNextNode(toNode);
        while (node) {
            this.removeFlowlineByProcessIdInData(node, fromProcessId, toProcessId);
            node = this.getNextNode(node);
        }

        this.data.push({
            start: fromId,
            end: toId
        });

        this.updateAllLine();
    };

    Flowline.prototype.removeFlowlineByProcessIdInData = function (node, fromProcessId, toProcessId) {
        var _fromProcessId = node.attr('data-from-process'),
            _toProcessId = node.attr('data-to-process'),
            data = this.data,
            item,
            id;

        if (!_fromProcessId) {
            return;
        }

        if (this.hasProcessId(_fromProcessId, fromProcessId) ||
            this.hasProcessId(_fromProcessId, toProcessId) ||
            this.hasProcessId(_toProcessId, fromProcessId) ||
            this.hasProcessId(_toProcessId, toProcessId)) {
            id = node.attr('data-id');
            for (var len = data.length, i = len - 1; i >= 0; i--) {
                item = data[i];
                if (item.start == id || item.end == id) {
                    data.splice(i, 1);
                }
            }
        }
    };

    Flowline.prototype.bindBrokenLineEvent = function (element) {
        var self = this;

        element.click(function (e) {
            if (self.cache.operatingStatus === 'connection') {
                return;
            }
            self.selectLine(this);
        });
    };

    Flowline.prototype.resize = function () {
        var paper = this.paper,
            panel = this.element,
            size = this.cache.size,
            height = size.process.height,
            width = panel.getBBox().width + 10;

        paper.attr({
            width: width,
            height: height,
            viewBox: [0, 0, width, height].join(' ')
        });
    };

    function Menu(cache) {
        this.processflow = cache.instance.processflow;
        this.flowline = cache.instance.flowline;

        this.items = {
            zoomin: {
                icon: 'processflow-zoomin-icon',
                fn: function () {
                    this.processflow.zoomIn();
                }
            },
            zoomout: {
                icon: 'processflow-zoomout-icon',

                fn: function () {
                    this.processflow.zoomOut();
                }
            },
            'default': {
                icon: 'processflow-default-status-icon',
                fn: function () {
                    this.processflow.setOperatingStatus('default');
                }
            },
            connection: {
                icon: 'processflow-line-add-icon',
                fn: function () {
                    this.processflow.setOperatingStatus('connection');
                }
            },
            remove: {
                icon: 'processflow-line-remove-icon',
                fn: function () {
                    this.processflow.removeFlowLine();
                }
            },
        };

        this.className = {
            menu: 'processflow-menu',
            item: 'processflow-menu-item',
            icon: 'processflow-menu-icon',
            text: 'processflow-menu-text'
        };
    }

    Menu.prototype.create = function () {
        var items = this.items,
            item,
            $menu,
            $item,
            self = this;

        $menu = $(['<div class="', this.className.menu, '"', '></div>'].join(''));
        for (var i in items) {
            item = items[i];
            $item = $([
                '<a class="', this.className.item, '"', '>',
                '<span class="', this.className.icon, ' ', item.icon, '"></span>',
                '</a>'
            ].join(''));

            $menu.append($item);

            $item.on('click', { item: item }, function (e) {
                e.data.item.fn.call(self);
            });

            this.processflow.$container.append($menu);
        }
    };

    function API(options) {
        this.processflow = new Processflow(options);
    }

    API.component = Processflow.component;
    API.process = Processflow.process;

    API.prototype.resize = function () {
        this.processflow.resize();
    };

    API.prototype.load = function (data) {
        this.processflow.load(data);
    };

    API.prototype.getData = function () {
        return this.processflow.getData();
    };

    API.prototype.zoomIn = function () {
        this.processflow.zoomIn();
    };

    API.prototype.zoomOut = function () {
        this.processflow.zoomOut();
    };

    API.prototype.removeLine = function () {
        this.processflow.removeFlowLine();
    };

    API.prototype.setOperatingStatus = function (status) {
        //默认状态：default
        //连线状态：connection
        this.processflow.setOperatingStatus(status);
    };

    window.Processflow = API;

}(jQuery, Snap, window, console));