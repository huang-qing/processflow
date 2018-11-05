/* global jQuery Snap  */
(function ($, Snap, window) {

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
        this.config = {
            component: $.extend(true, {}, Processflow.component),
            process: $.extend(true, {}, Processflow.process)
        };
        this.$container = $(options.query);
        this.data = options.data;
        this.$svg;
        this.svg;
        this.paper;
        this.elements = {
            component: null,
            process: null,
            line: null
        };
        this.cache;

        this.create();
        this.resize();
        this.createFlowline();
        this.bindEvent();
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
                cursor: 'pointer'
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
            }
        },
        className: {
            main: 'procesflow-process-node-main',
            top: 'processflow-process-node-top',
            bottom: 'processflow-process-node-bottom',
            node: 'processflow-process-node',
            line: 'processflow-process-line',
            process: 'processflow-process',
            panel: 'processflow-process-panel'
        },
        id: 'unique'

    };

    Processflow.prototype.create = function () {
        if (this.$container.length > 0) {

            this.size = this.getSvgSize();

            this.componentSvg = Snap(this.size.component.width, this.size.component.height);
            this.processSvg = Snap(this.size.process.width, this.size.process.height);

            this.componentPaper = this.componentSvg.paper;
            this.processPaper = this.processSvg.paper;

            this.$componentSvg = $(this.componentSvg.node);
            this.$processSvg = $(this.processSvg.node);

            this.$componentContainer = $('<div class="processflow-component-container"></div>');
            this.$processContainer = $('<div class="processflow-process-container"></div>');

            this.$componentContainer.append(this.$componentSvg);
            this.$processContainer.append(this.$processSvg);
            this.$container.append(this.$componentContainer);
            this.$container.append(this.$processContainer);
            this.$container.addClass('processflow');

            this.createFlowPanels();
        }
    };

    Processflow.prototype.createFlowline = function (paper, data) {
        var flowline = new Flowline(this.processPaper, this.elements.process, this.data.flowline, this.config.process);

        flowline.render();
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
            containerWidth = container.width(),
            containerHeight = container.parent().height();

        container.css({
            height: containerHeight
        });

        component.css({
            width: size.component.width,
            height: containerHeight
        });

        process.css({
            width: containerWidth - size.component.width - (containerHeight < size.component.height ? 22 : 1),
            height: containerHeight
        });
    };

    Processflow.prototype.createFlowPanels = function () {
        var data = this.data.processflow,
            height = this.config.component.height,
            x = this.config.component.x,
            y = this.config.component.y,
            componentNodes = [],
            processNodes = [],
            panel;

        for (var i = 0, len = data.length; i < len; i++) {
            panel = new processflowPanel(this.componentPaper, this.processPaper, data[i], this.config, x, y + i * height, this.cache);
            componentNodes.push(panel.component.element);
            processNodes.push(panel.flowChart.element);
        }

        this.elements.component = setGroup(this.componentPaper, componentNodes, this.config.component.className.panel);
        this.elements.process = setGroup(this.processPaper, processNodes, this.config.process.className.panel);
    };

    Processflow.prototype.bindEvent = function () {
        var process = this.$processContainer,
            component = this.$componentContainer;

        process.scroll(function () {
            var top = this.scrollTop;
            component.css('margin-top', -1 * top);
        });
    };

    function processflowPanel(componentPaper, processPaper, data, config, x, y, cache) {
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

    processflowPanel.prototype.create = function () {
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
            line: null
        };
        this.endY;
        this.cache = cache;

        this.element = this.create();
    }

    Component.prototype.create = function () {
        var config = this.config,
            info = config.format,
            padding = config.padding,
            x = this.x + padding,
            y = this.y + padding,
            node;

        this.renderVText(x, y, info);
        this.renderLine();

        node = setGroup(this.paper, this.elements.texts.concat([this.elements.line]), this.config.className.component);

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
        this.cache;

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
            'data-flowlinecount': 1,
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
        element.click(function () {
            console.dir(info);
        });
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

    function Flowline(paper, element, data, config) {
        this.paper = paper;
        this.data = data;
        this.element = element;
        this.config = config;
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
            offsetX = config.node.width + config.line.width;

        this.setNodeState(fromNode, toNode);

        if (fromNodeBox.x === toNodeBox.x) {
            this.translateNodeX(toNode, offsetX);
        }
        else if (fromNodeBox.x + offsetX < toNodeBox.x) {
            this.translateNodeX(this.getNextNode(fromNode), toNodeBox.x - fromNodeBox.x - offsetX);
        }
        else if (fromNodeBox.x > toNodeBox.x) {
            this.translateNodeX(toNode, fromNodeBox.x + offsetX - toNodeBox.x);
        }
    };

    Flowline.prototype.setNodeState = function (fromNode, toNode) {
        var fromProcessId = fromNode.parent().attr('data-id'),
            toProcessId = toNode.parent().attr('data-id'),
            toId = toNode.attr('data-id');


        fromNode.attr({
            'data-state': 'out',
            'data-from-process': fromProcessId,
            'data-to-process': toProcessId,
            'data-to': toId
        });

        toNode.attr({
            'data-state': 'in',
            'data-from-process': fromProcessId,
            'data-to-process': toProcessId
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
            node;

        for (var i = 0, len = rootNodes.length; i < len; i++) {
            node = rootNodes[i];
            this.renderLine(node, {
                id: node.parent().attr('data-id'),
                out: false,
                back: false,
                count: 1
            });
        }
    };

    Flowline.prototype.renderLine = function (node, info) {
        var nextNode,
            nodeState,
            toProcessId,
            fromProcessId,
            isOut = false,
            isBack = false;

        if (!node) {
            return;
        }
   
        nodeState = node.attr('data-state');
        toProcessId = node.attr('data-to-process');
        fromProcessId = node.attr('data-from-process');

        //判断是否拆过件
        if (nodeState === 'out') {
            isOut = fromProcessId === info.id && info.out === false;
            isBack = toProcessId == info.id && info.out === true;
        }
        //计算合件的次数
        else if (nodeState === 'in' && toProcessId === info.id) {
            info.count++;
        }

        if (nodeState === 'out' && (isOut || isBack)) {
            if (info.count > 1) {
                nextNode = this.getNextNode(node);
                this.renderStraightLine(node, nextNode);
                this.renderLine(nextNode, info);
            }
            else {
                //合并后无法区分是拆件还是整体移件，全部按照拆件处理，实际的工艺由人工判断
                this.count--;

                nextNode = this.element.select('[data-id="' + node.attr('data-to') + '"]');
                this.renderBrokenLine(node, nextNode);
                if (isOut) {
                    info.out = true;
                }
                else {
                    info.out = false;
                }
                this.renderLine(nextNode, info);
            }
        }
        else {
            nextNode = this.getNextNode(node);
            this.renderStraightLine(node, nextNode);
            this.renderLine(nextNode, info);
        }

        //横向的连线全部连上，项目要求，没有任何逻辑，个人认为对流程图是个破坏，让流程图表述不清晰
        // nextNode = this.getNextNode(node);
        // this.renderStraightLine(node, nextNode);
        // this.renderLine(nextNode, processId);
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

    Flowline.prototype.renderStraightLine = function (node, nextNode) {
        var position,
            element;

        if (!node || !nextNode) {
            return null;
        }

        position = this.getPositionInfo(node, nextNode);

        element = this.paper.line(position.x1, position.y1, position.x2, position.y2);
        element.attr(this.config.line.attr);

        return element;

    };

    Flowline.prototype.renderBrokenLine = function (node, nextNode) {
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

        return element;
    };

    function Menu($) {

    }

    function ContextMenu($) {

    }

    window.Processflow = Processflow;

}(jQuery, Snap, window));