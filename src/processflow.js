/* global jQuery Snap  */
(function ($, Snap, window) {

    function setGroup(paper, list, className) {
        var node = paper.g.apply(paper, list);
        node.attr({
            'class': className
        });

        return node;
    }

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
            process: null
        };
        this.cache;

        this.create();
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
        width: 200,
        height: 120,
        offsetX: 12,
        offsetY: 20,
        x: 0,
        y: 0,
        padding: 6,
        line: {
            attr: {
                stroke: '#C1C1C1',
                strokeWidth: 1
            }
        },
        className: {
            component: 'procesflow-component',
            panel: 'procesflow-component-panel'
        }
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
                strokeWidth: 1
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
        }

    };

    Processflow.prototype.create = function () {
        if (this.$container.length > 0) {
            this.svg = Snap(2000, 1000);
            this.paper = this.svg.paper;
            this.$svg = $(this.svg.node);
            this.$svg.appendTo(this.$container);
            this.$container.addClass('processflow');

            this.createFlowPanels();
        }
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
            panel = new processflowPanel(this.paper, data[i], this.config, x, y + i * height, this.cache);
            componentNodes.push(panel.component.element);
            processNodes.push(panel.flowChart.element);
        }

        this.elements.component = setGroup(this.paper, componentNodes, this.config.component.className.panel);
        this.elements.process = setGroup(this.paper, processNodes, this.config.process.className.panel);
    };

    function processflowPanel(paper, data, config, x, y, cache) {
        this.paper = paper;
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

        this.component = new Component(this.paper, this.data.component, c_config, this.x, this.y, this.cache);
        this.flowChart = new FlowChart(this.paper, this.data.process, p_config, this.x + c_config.width, this.y + Math.floor(c_config.height / 2), this.cache);

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
            this.elements.nodes.push(this.renderNode(startX + i * (nodeWidth + lineWidth), startY, info));
            if (i > 0) {
                this.elements.lines.push(this.renderLine(startX + nodeWidth + (i - 1) * (nodeWidth + lineWidth), startY));
            }
        }

        node = setGroup(this.paper, this.elements.nodes.concat(this.elements.lines), this.config.className.process);

        return node;
    };

    FlowChart.prototype.renderNode = function (x, y, info) {
        var mainNode,
            topNode,
            bottomNode,
            node;

        mainNode = this.renderMainNode(x, y, info);
        topNode = this.renderSecondaryNode(x, y, 'top', info);
        bottomNode = this.renderSecondaryNode(x, y, 'bottom', info);
        node = setGroup(this.paper, [mainNode, topNode, bottomNode], this.config.className.node);

        this.bindMainNodeEvent(mainNode, info);

        return node;
    };

    FlowChart.prototype.renderMainNode = function (x, y, info) {
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

    FlowChart.prototype.renderLine = function (x, y) {
        var config = this.config.line,
            startX = x,
            startY = y,
            endX = x + config.width,
            endY = startY,
            element;

        element = this.paper.line(startX, startY, endX, endY);
        element.attr(config.attr);

        return element;

    };

    function Flowline($, Snap) {

    }

    function Menu($) {

    }

    function ContextMenu($) {

    }

    window.Processflow = Processflow;

}(jQuery, Snap, window));