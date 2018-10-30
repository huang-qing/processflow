/* global jQuery Snap  */
(function ($, Snap, window) {

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
        this.elements = [];

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
        }
    };

    Processflow.process = {
        property: {
            id: {
                name: 'id',
                attr: {
                    'font-size': 12,
                    'fill': '#333'
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
                fill: '#ffffff'
            },
            state: {
                new: {
                    fill: '#ffffff'
                },
                audit: {
                    fill: '#ffffff'
                },
                audited: {
                    fill: '#ffffff'
                },
                dispatched: {
                    fill: '#ffffff'
                },
                machining: {
                    fill: '#ffffff'
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
        }

    };

    Processflow.prototype.create = function () {
        if (this.$container.length > 0) {
            this.svg = Snap(1000, 1000);
            this.paper = this.svg.paper;
            this.$svg = $(this.svg.node);
            this.$svg.appendTo(this.$container);
            this.$container.addClass('processflow');

            this.createFlowPanels();
        }
    };

    Processflow.prototype.createFlowPanels = function () {
        var data = this.data.processflow,
            config = this.config.component,
            height = config.height,
            x = config.x,
            y = config.y;

        for (var i = 0, len = data.length; i < len; i++) {
            this.elements.push(new processflowPanel(this.paper, data[i], this.config, x, y + i * height));
        }
    };

    function processflowPanel(paper, data, config, x, y) {
        this.paper = paper;
        this.data = data;
        this.element;
        this.config = config;
        this.x = x;
        this.y = y;

        this.element = this.create();
    }

    processflowPanel.prototype.create = function () {
        var c_config = this.config.component,
            p_config = this.config.process;

        this.component = new Component(this.paper, this.data.component, c_config, this.x, this.y);
        this.flowChart = new FlowChart(this.paper, this.data.process, p_config, this.x + c_config.width, this.y + Math.floor(c_config.height / 2));

        return {
            component: this.component,
            flowChart: this.flowChart
        };
    };

    function Component(paper, data, config, x, y) {
        this.paper = paper;
        this.data = data;
        this.elememt;
        this.x = x;
        this.y = y;
        this.config = config;
        this.elements = {
            texts: [],
            line: null
        };
        this.endY;

        this.elememt = this.create();
    }

    Component.prototype.create = function () {
        var config = this.config,
            info = config.format,
            padding = config.padding,
            x = this.x + padding,
            y = this.y + padding;

        this.renderVText(x, y, info);
        this.renderLine();
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

    // Component.prototype.renderLine = function () {
    //     var config = this.config,
    //         offsetY = config.offsetY,
    //         padding = config.padding,
    //         startX = config.x,
    //         startY = this.endY + offsetY + padding,
    //         endX = startX + config.width,
    //         endY = startY,
    //         element;

    //     element = this.paper.line(startX, startY, endX, endY);
    //     element.attr(config.line.attr);
    //     this.elements.line = element;
    // };

    Component.prototype.renderLine = function () {
        var config = this.config,
            element;

        element = this.paper.line(config.x, config.height, config.width, config.height);
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

    function FlowChart(paper, data, config, x, y) {
        debugger;
        this.paper = paper;
        this.data = data;
        this.x = x;
        this.y = y;
        this.config = config;
        this.elements = {
            node: [],
            line: [],
            text: []
        };

        this.create();
    }

    FlowChart.prototype.create = function () {
        var data = this.data,
            item,
            startX = this.x,
            startY = this.y,
            config = this.config,
            nodeWidth = config.node.width,
            lineWidth = config.line.width;

        for (var i = 0, len = data.length; i < len; i++) {
            item = data[i];
            if (i == 0) {
                this.renderNode(startX, startY, item);
            }
            else {
                debugger;
                this.renderLine(startX + nodeWidth + (i - 1) * (nodeWidth + lineWidth), startY);
                this.renderNode(startX + i * (nodeWidth + lineWidth), startY, item);
            }
        }
    };

    FlowChart.prototype.renderNode = function (x, y, info) {
        var n_config = this.config.node,
            t_config = this.config.text,
            width = n_config.width,
            height = n_config.height,
            order = this.config.order,
            padding = n_config.padding,
            startX = x,
            startY = y,
            r_startY = startY - height / 2,
            t_startX = startX + width / 2,
            t_startY = startY + padding,
            element,
            i,
            name,
            len;

        //rect
        element = this.paper.rect(startX, r_startY, width, height, 4);
        element.attr(n_config.attr);
        this.elements.node.push(element);

        //text
        this.renderText(t_startX, t_startY, order.middle, info);

        //top text
        for (i = 0, len = order.top.length; i < len; i++) {
            name = order.top[i];
            this.renderText(t_startX, t_startY - (t_config.offsetY) * (i + 1), name, info);
        }

        //bottom text
        for (i = 0, len = order.bottom.length; i < len; i++) {
            name = order.bottom[i];
            this.renderText(t_startX, t_startY + (t_config.offsetY) * (i + 1), name, info);
        }
    };

    FlowChart.prototype.renderText = function (x, y, name, info) {
        var element,
            properties = this.config.property,
            property = properties[name],
            map = this.config.map,
            text = info[map[name]] || null;

        if (text) {
            element = this.paper.text(x, y, text);
            element.attr($.extend({}, {
                'text-anchor': 'middle'
            }, property.attr));

            this.elements.text.push(element);
        }
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
        this.elements.line.push(element);
    };

    function Flowline($, Snap) {

    }

    function Menu($) {

    }

    function ContextMenu($) {

    }

    window.Processflow = Processflow;

}(jQuery, Snap, window));