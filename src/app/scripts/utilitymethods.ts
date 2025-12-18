/**
 *  Home page handler
 */

import {
    NodeModel, NodeConstraints, PointModel, ConnectorModel, LinearGradient,
    Diagram, ConnectorConstraints, Node, TextStyle, TextStyleModel, SelectorConstraints, TextAlign, HorizontalAlignment, VerticalAlignment, Connector, ShapeAnnotationModel, randomId, UserHandleModel, Side, MarginModel, SnapConstraints,
    DiagramRegions
} from '@syncfusion/ej2-diagrams';
import { SelectorViewModel } from './selector';
import { Dialog } from '@syncfusion/ej2-angular-popups';
import { Ajax } from '@syncfusion/ej2-base';
import { Toolbar, ContextMenu, MenuItemModel } from '@syncfusion/ej2-angular-navigations';



export class PaperSize {
    public pageWidth: number;
    public pageHeight: number;
}

export class UtilityMethods {

    private selectedItem: SelectorViewModel;
    constructor(selectedItem: SelectorViewModel) {
        this.selectedItem = selectedItem;
    }

    public toolbarEditor: Toolbar;

    public index: number = 1;

    public isExpanded: boolean = false;

    public lastFillIndex: number = 0;

    public templateType: string;

    public fillColorCode = ['#C4F2E8', '#F7E0B3', '#E5FEE4', '#E9D4F1', '#D4EFED', '#DEE2FF'];
    public borderColorCode = ['#8BC1B7', '#E2C180', '#ACCBAA', '#D1AFDF', '#90C8C2', '#BBBFD6'];

    public addNode(orientation: string, label?: string, canSelect?: boolean) {
        let diagram: Diagram = this.selectedItem.diagram;
        let selectedNode: NodeModel = diagram.selectedItems.nodes[0];
        if ((selectedNode.data as any).branch !== 'Root') {
            let selectedNodeOrientation = (selectedNode.addInfo as any).orientation.toString();
            orientation = selectedNodeOrientation;
        }
        diagram.startGroupAction();
        let mindmapData: { [key: string]: Object } = this.getMindMapShape(selectedNode);
        let node: NodeModel = mindmapData.node;
        this.addMindMapLevels('Level' + (node.addInfo as { [key: string]: Object }).level);
        this.selectedItem.index = this.selectedItem.index + 1;
        node.id = this.selectedItem.index.toString();
        if ((node.addInfo as { [key: string]: Object })) {
            (node.addInfo as { [key: string]: Object }).orientation = orientation;
        }
        else {
            (node.addInfo as { [key: string]: Object }) = { 'orientation': orientation };
        }
        selectedNode.expandIcon.shape = this.selectedItem.isExpanded ? 'Minus' : 'None';
        selectedNode.collapseIcon.shape = this.selectedItem.isExpanded ? 'Plus' : 'None';
        let nodeData = {
            id: node.id,
            Label: label ? label : "Node",
            fill: node.style.fill,
            branch: orientation,
            strokeColor: node.style.strokeColor,
            parentId: (selectedNode.data as any).id,
            level: (node.addInfo as { [key: string]: Object }).level,
            orientation: (node.addInfo as { [key: string]: Object }).orientation,
            hasChild: false,
        };
        (node.data as any) = {
            id: node.id,
            Label: label ? label : "Node",
            fill: node.style.fill,
            strokeColor: node.style.strokeColor,
            orientation: (node.addInfo as { [key: string]: Object }).orientation,
            branch: orientation,
            parentId: (selectedNode.data as any).id,
            level: (node.addInfo as { [key: string]: Object }).level,
            hasChild: false,
        };
        let tempData = this.selectedItem.workingData.filter(
            (a: any) => a.id === (selectedNode.data as any).id
        );
        tempData[0].hasChild = true;
        this.selectedItem.workingData.push(nodeData);
        diagram.add(node);
        let connector = this.setConnectorDefault(diagram, orientation, mindmapData.connector, selectedNode.id, node.id);
        diagram.add(connector);
        let node1 = this.getNode(diagram.nodes, node.id);
        diagram.doLayout();
        diagram.endGroupAction();
        if (!canSelect) {
            diagram.select([node1]);
        }
        let mindMapPatternTarget : any = this.selectedItem.mindMapPatternTarget;
        if (mindMapPatternTarget) {
          this.mindmapPatternChange(mindMapPatternTarget);
        }
        var diagramOrientation : any = diagram.layout.orientation;
        if(diagramOrientation === 'Vertical') {
            this.updateOrientation(diagram);
        }

        diagram.dataBind();
        diagram.doLayout();
        diagram.fitToPage();

    }
    public getMindMapShape(parentNode: NodeModel) {
        let sss: { [key: string]: Object } = {};
        let node: NodeModel = {};
        let connector: ConnectorModel = {};
        let addInfo: any = parentNode.addInfo;
        if (this.templateType === 'template1') {
            let annotations = {
                content: ''
            };
            node = {
                minWidth: 100, maxWidth: 100, shape: { type: 'Basic', shape: 'Rectangle' },
                annotations: [annotations], style: { fill: '#000000', strokeColor: '#000000' },
                addInfo: { level: addInfo.level + 1 },
                offsetX: 200, offsetY: 200
            };
            connector = { type: 'Bezier', style: { strokeWidth: 3 } };
        }
        else {
            node = {
                minWidth: 100, maxWidth: 100, shape: { type: 'Basic', shape: 'Rectangle' },
                annotations: [{ content: '' }],
                style: { fill: '#000000', strokeColor: '#000000' },
                addInfo: { level: addInfo.level + 1 },
                offsetX: 200, offsetY: 200
            };
            if (this.templateType === 'template2') {
                connector = { type: 'Orthogonal', style: { strokeColor: '#000000' } };
            }
            else if (this.templateType === 'template3') {
                connector = { type: 'Straight', style: { strokeColor: '#000000' } };
            }
            else {
                connector = { type: 'Bezier', style: { strokeColor: '#000000' } };
            }
        }
        if (addInfo.level < 1) {
            node.style.fill = this.fillColorCode[this.lastFillIndex];
            node.style.strokeColor = this.borderColorCode[this.lastFillIndex];
            ;
            if (this.lastFillIndex + 1 >= this.fillColorCode.length) {
                this.lastFillIndex = 0;
            }
            else {
                this.lastFillIndex++;
            }
        }
        else {
            node.style.strokeColor = node.style.fill = parentNode.style.fill;
        }
        connector.type = 'Orthogonal';
        connector.style.strokeColor = node.style.fill;
        connector.targetDecorator = { shape: 'None' };
        node.constraints = NodeConstraints.Default & ~NodeConstraints.Drag;
        node.ports = [
            { id: 'leftPort', offset: { x: 0, y: 0.5 } },
            { id: 'rightPort', offset: { x: 1, y: 0.5 } },
            { id: 'topPort', offset: { x: 0.5, y: 0 } },
            { id: 'bottomPort', offset: { x: 0.5, y: 1 } }];
        sss.node = node;
        sss.connector = connector;
        return sss;
    };

    public addMindMapLevels(level: any) {
        let mindmap: any = document.getElementById('mindMapLevels');
        if (mindmap.ej2_instances) {
            let dropdownlist = mindmap.ej2_instances[0];
            let dropdowndatasource = dropdownlist.dataSource;
            let isExist = false;
            for (let i = 0; i < dropdowndatasource.length; i++) {
                let data = dropdowndatasource[i];
                if (data.text === level) {
                    isExist = true;
                    break;
                }
            }
            if (!isExist) {
                dropdowndatasource.push({ text: level, value: level });
            }
            dropdownlist.dataSource = dropdowndatasource;
            dropdownlist.dataBind();
        }
    };

    public setConnectorDefault(diagram: Diagram, orientation: string, connector: ConnectorModel, sourceID: string, targetID: string) {
        connector.id = 'connector' + randomId();
        connector.sourceID = sourceID;
        connector.targetID = targetID;
        connector.sourcePortID = 'rightPort';
        connector.targetPortID = 'leftPort';
        if (orientation === 'Right') {
            connector.sourcePortID = 'leftPort';
            connector.targetPortID = 'rightPort';
        }
        connector.style.strokeWidth = 3;
        return connector;
    };
    public bindMindMapProperties(node: NodeModel, selectedItem: SelectorViewModel): void {
        selectedItem.preventPropertyChange = true;
        selectedItem.mindmapSettings.stroke = node.style.strokeColor;
        selectedItem.mindmapSettings.strokeStyle = node.style.strokeDashArray ? node.style.strokeDashArray : 'None';
        selectedItem.mindmapSettings.strokeWidth = node.style.strokeWidth;
        selectedItem.mindmapSettings.fill = node.style.fill;
        selectedItem.mindmapSettings.opacity = (node.style.opacity || 1) * 100;
        selectedItem.mindmapSettings.opacityText = (selectedItem.mindmapSettings.opacity || '100') + '%';
        if (node.annotations.length > 0) {
            let annotation: TextStyle = node.annotations[0].style as TextStyle;
            selectedItem.mindmapSettings.fontFamily = annotation.fontFamily;
            selectedItem.mindmapSettings.fontColor = annotation.color;
            selectedItem.mindmapSettings.fontSize = annotation.fontSize;
            selectedItem.mindmapSettings.textOpacity = (annotation.opacity || 1) * 100;
            selectedItem.mindmapSettings.textOpacityText = (selectedItem.mindmapSettings.textOpacity || '100') + '%';
            let toolbarTextStyle: any = document.getElementById('mindmapTextStyleToolbar');
            if (toolbarTextStyle) {
                toolbarTextStyle = toolbarTextStyle.ej2_instances[0];
            }
            if (toolbarTextStyle) {
                toolbarTextStyle.items[0].cssClass = annotation.bold ? 'tb-item-start tb-item-selected' : 'tb-item-start';
                toolbarTextStyle.items[1].cssClass = annotation.italic ? 'tb-item-middle tb-item-selected' : 'tb-item-middle';
                toolbarTextStyle.items[2].cssClass = annotation.textDecoration === 'Underline' ? 'tb-item-end tb-item-selected' : 'tb-item-end';
            }
        }
        selectedItem.preventPropertyChange = false;
    }
    public getConnector(connectors: ConnectorModel[], name: string): Connector {
        for (let i: number = 0; i < connectors.length; i++) {
            if (connectors[i].id === name) {
                return connectors[i] as Connector;
            }
        }
        return null;
    }

    public getNode(nodes: NodeModel[], name: string): Node {
        for (let i: number = 0; i < nodes.length; i++) {
            if (nodes[i].id === name) {
                return nodes[i] as Node;
            }
        }
        return null;
    }

    public removeChild() {
        let diagram: Diagram = this.selectedItem.diagram;
        if (diagram.selectedItems.nodes.length > 0) {
            diagram.historyManager.startGroupAction();
            this.removeSubChild(diagram.selectedItems.nodes[0] as Node);
            diagram.historyManager.endGroupAction();
            diagram.doLayout();
        }
    }

    public removeSubChild(node: Node) {
        let diagram: Diagram = this.selectedItem.diagram;
        for (let i = node.outEdges.length - 1; i >= 0; i--) {
            let connector = this.getConnector(diagram.connectors, node.outEdges[i]);
            let childNode = this.getNode(diagram.nodes, connector.targetID);
            if (childNode != null && childNode.outEdges.length > 0) {
                this.removeSubChild(childNode);
            }
            else {
                for (var x = this.selectedItem.workingData.length - 1; x >= 0; x--) {
                    if (this.selectedItem.workingData[x].id === (childNode.data as any).id) {
                        this.selectedItem.workingData.splice(x, 1);
                    }
                }
                diagram.remove(childNode);
            }
        }
        for (let j = node.inEdges.length - 1; j >= 0; j--) {
            let connector = this.getConnector(diagram.connectors, node.inEdges[j]);
            let childNode = this.getNode(diagram.nodes, connector.sourceID);
            let index = childNode.outEdges.indexOf(connector.id);
            if (childNode.outEdges.length > 1 && index === 0) {
                index = childNode.outEdges.length;
            }
            if (index > 0) {
                let node1 = childNode.outEdges[index - 1];
                let connector1: ConnectorModel = diagram.getObject(node1);
                let node2 = this.getNode(diagram.nodes, connector1.targetID);
                diagram.select([node2]);
            }
            else {
                diagram.select([childNode]);
            }
        }
        for (var x = this.selectedItem.workingData.length - 1; x >= 0; x--) {
            if (this.selectedItem.workingData[x].id === (node.data as any).id && (node.data as any).branch !='Root') {
                this.selectedItem.workingData.splice(x, 1);
            }
        }
        if ((node.data as any).branch !=="Root") {
            diagram.remove(node);
        }
    }

    public hideUserHandle(name: string) {
        let diagram = this.selectedItem.diagram;
        for (let handle of diagram.selectedItems.userHandles) {
            if (handle.name === name) {
                handle.visible = false;
            }
        }
    }

    //Change the Position of the UserHandle.
    public changeUserHandlePosition(change: string) {
        let diagram = this.selectedItem.diagram;
        for (let i = 0; i < diagram.selectedItems.userHandles.length; i++) {
            let handle = diagram.selectedItems.userHandles[i];
            if (handle.name === 'devare' && change === 'leftHandle') {
                this.applyHandle(handle, 'Left', 1, { top: 0, bottom: 0, left: 0, right: 10 }, 'Left', 'Top');

            } else if (handle.name === 'devare' && change === 'rightHandle') {
                this.applyHandle(handle, 'Right', 1, { top: 0, bottom: 0, left: 10, right: 0 }, 'Right', 'Top');
            }
        }
    }
    //set the value for UserHandle element
    public applyHandle(handle: UserHandleModel, side: Side, offset: number, margin: MarginModel, halignment: HorizontalAlignment, valignment: VerticalAlignment) {
        handle.side = side;
        handle.offset = offset;
        handle.margin = margin;
        handle.horizontalAlignment = halignment;
        handle.verticalAlignment = valignment;
    }

    public mindmapPatternChange(args: any, canUpdate?: any) {
        let diagram = this.selectedItem.diagram;
        let target = args.target;
        this.selectedItem.mindMapPatternTarget = args;
        diagram.historyManager.startGroupAction();
        var nodes = canUpdate ? diagram.selectedItems.nodes : diagram.nodes;
        let targetData : any;
        if (canUpdate && diagram.selectedItems.nodes.length > 0) {
            nodes = diagram.selectedItems.nodes;
        } else {
            nodes = diagram.nodes;
        }

        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            targetData = this.selectedItem.workingData.find((item : any) => item.id === (node.data as any).id);
            if (node.id !== 'textNode') {
                if (target.className === 'mindmap-pattern-style mindmap-pattern1') {
                    if ((node.data as any).branch === 'Root') {
                        node.height = 70;
                        node.shape = { type: 'Basic', shape: 'Ellipse' };
                    }
                    else {
                        node.height = 30;
                        this.selectedItem.childHeight = 30;
                        node.shape = { type: 'Basic', shape: 'Rectangle' };
                    }
                } else if (target.className === 'mindmap-pattern-style mindmap-pattern2') {
                    if ((node.data as any).branch === 'Root') {
                        node.height = 50;
                        node.shape = { type: 'Basic', shape: 'Rectangle' };
                    }
                    else {
                        node.height = 30;
                        this.selectedItem.childHeight = 30;
                        node.shape = { type: 'Basic', shape: 'Rectangle' };
                    }
                } else if (target.className === 'mindmap-pattern-style mindmap-pattern3') {
                    if ((node.data as any).branch === 'Root') {
                        node.height = 50;
                        node.shape = { type: 'Path', data: 'M55.7315 17.239C57.8719 21.76 54.6613 27.788 47.1698 26.0787C46.0997 32.309 33.2572 35.323 28.9764 29.2951C25.7658 35.323 10.7829 33.816 10.7829 26.0787C3.29143 30.802 -0.989391 20.253 2.22121 17.239C-0.989317 14.2249 2.22121 6.68993 10.7829 8.39934C13.9935 -0.845086 25.7658 -0.845086 28.9764 5.18301C32.187 0.661909 45.0294 0.661908 47.1698 8.39934C52.5209 5.18301 60.0123 12.7179 55.7315 17.239Z' };
                    } else if ((node.addInfo as any).level === 1) {
                        node.height = 30;
                        this.selectedItem.childHeight = 30;
                        node.shape = { type: 'Basic', shape: 'Ellipse' };
                    } else if ((node.addInfo as any).level === 2) {
                        node.height = 30;
                        this.selectedItem.childHeight = 30;
                        node.shape = { type: 'Basic', shape: 'Rectangle' };
                    } else if ((node.addInfo as any).level === 3) {
                        node.height = 30;
                        this.selectedItem.childHeight = 30;
                        node.shape = { type: 'Path', data: 'M24.9123 3.78029C25.0975 4.3866 24.9466 4.88753 24.8501 5.15598L24.8444 5.17188L24.8379 5.18757C24.543 5.89091 23.7879 6.37572 22.9737 6.71397C22.1386 7.06093 21.0847 7.3197 19.9302 7.51132C17.6145 7.89568 14.7099 8.03929 11.8845 7.99097C9.05877 7.94266 6.24887 7.70127 4.11982 7.29202C3.06318 7.08891 2.11594 6.83369 1.41022 6.51281C0.766274 6.22 0 5.72087 0 4.9469C0 4.01004 0.964525 3.41277 1.79867 3.05724C2.70576 2.67063 3.89493 2.37901 5.11258 2.15935C7.44304 1.73893 10.1147 1.54134 11.7304 1.52346C11.8769 1.52184 12.0122 1.59735 12.0902 1.72133V1.72133C12.2554 1.98406 12.0895 2.33011 11.7819 2.37125C6.76467 3.04222 7.47107 3.02672 5.26455 3.42478C4.10916 3.63321 3.07622 3.89464 2.39298 4.18584C1.76916 4.45172 1.91438 4.9469 1.92108 4.92166C1.95272 4.95811 2.05541 5.05272 2.36059 5.19149C2.83828 5.4087 3.58481 5.6232 4.56968 5.81251C6.52366 6.18811 9.1877 6.42238 11.9256 6.4692C14.6639 6.51602 17.4127 6.37423 19.539 6.02131C20.6055 5.8443 21.4697 5.62145 22.0872 5.36491C22.7085 5.10676 22.9449 4.87196 23.0162 4.71867C23.0759 4.54803 23.1185 4.35742 23.052 4.13951C22.9867 3.92586 22.7842 3.58431 22.1006 3.17831C20.6845 2.3372 17.4158 1.34558 10.1686 0.773902C10.0395 0.763721 9.92243 0.68718 9.86361 0.571853V0.571853C9.7338 0.317364 9.92861 0.0177825 10.2139 0.0325302C17.4619 0.407187 21.4191 0.873597 23.2463 1.95885C24.2179 2.53589 24.7233 3.16153 24.9123 3.78029Z' };
                    } else {
                        node.height = 4;
                        this.selectedItem.childHeight = 4;
                    }
                } else {
                    if ((node.data as any).branch === 'Root') {
                        node.height = 50;
                        node.shape = { type: 'Path', data: 'M28 1.60745L32.6757 7.49196L33.1063 8.03386L33.7651 7.82174L43.5571 4.66902L41.3666 9.9757L40.8265 11.2839L42.24 11.356L52.0141 11.8539L45.233 15.0979L43.3473 16L45.233 16.9021L52.0141 20.1461L42.24 20.644L40.8265 20.716L41.3666 22.0243L43.5571 27.331L33.7651 24.1783L33.1063 23.9661L32.6757 24.508L28 30.3926L23.3243 24.508L22.8937 23.9661L22.2349 24.1783L12.4429 27.331L14.6334 22.0243L15.1734 20.7161L13.7599 20.644L3.98585 20.1461L10.767 16.9021L12.6527 16L10.767 15.0979L3.98585 11.8539L13.7599 11.356L15.1734 11.2839L14.6334 9.9757L12.4429 4.66902L22.2349 7.82174L22.8937 8.03386L23.3243 7.49196L28 1.60745Z' };
                    } else if ((node.addInfo as any).level === 1) {
                        node.height = 30;
                        this.selectedItem.childHeight = 30;
                        node.shape = { type: 'Path', data: 'M55.7315 17.239C57.8719 21.76 54.6613 27.788 47.1698 26.0787C46.0997 32.309 33.2572 35.323 28.9764 29.2951C25.7658 35.323 10.7829 33.816 10.7829 26.0787C3.29143 30.802 -0.989391 20.253 2.22121 17.239C-0.989317 14.2249 2.22121 6.68993 10.7829 8.39934C13.9935 -0.845086 25.7658 -0.845086 28.9764 5.18301C32.187 0.661909 45.0294 0.661908 47.1698 8.39934C52.5209 5.18301 60.0123 12.7179 55.7315 17.239Z' };
                    } else if ((node.addInfo as any).level === 2) {
                        node.height = 30;
                        this.selectedItem.childHeight = 30;
                        node.shape = { type: 'Basic', shape: 'Rectangle' };
                    } else if ((node.addInfo as any).level === 3) {
                        node.height = 30;
                        this.selectedItem.childHeight = 30;
                        node.shape = { type: 'Basic', shape: 'Ellipse' };
                    } else {
                        node.height = 3;
                        this.selectedItem.childHeight = 3;
                    }
                }
            }
            targetData.nodeShapeType = node.shape.type;
            if (targetData.nodeShapeType === 'Basic') {
                targetData.nodeShape = (node.shape as any).shape;
                targetData.nodeShapeData = '';
                targetData.nodeHeight = node.height
            }
            else {
                targetData.nodeShapeData = (node.shape as any).data;
                targetData.nodeShape = '';
                targetData.nodeHeight = node.height
            }
            diagram.dataBind();
        }

        for (let i = 0; i < diagram.connectors.length; i++) {
            let connector = diagram.connectors[i];
            switch (target.className) {
                case 'mindmap-pattern-style mindmap-pattern1':
                    connector.type = 'Bezier';
                    this.selectedItem.connectorType = 'Bezier';
                    this.selectedItem.templateType = 'template1';
                    break;
                case 'mindmap-pattern-style mindmap-pattern2':
                    connector.type = 'Orthogonal';
                    this.selectedItem.connectorType = 'Orthogonal';
                    this.selectedItem.templateType = 'template4';
                    break;
                case 'mindmap-pattern-style mindmap-pattern3':
                    connector.type = 'Bezier';
                    this.selectedItem.connectorType = 'Bezier';
                    this.selectedItem.templateType = 'template2';
                    break;
                case 'mindmap-pattern-style mindmap-pattern4':
                    connector.type = 'Bezier';
                    this.selectedItem.connectorType = 'Bezier';
                    this.selectedItem.templateType = 'template3';
                    break;
            }

        }
        diagram.historyManager.endGroupAction();
        diagram.doLayout();
        diagram.dataBind();
    }

    public navigateChild(direction: string) {
        let diagram = this.selectedItem.diagram;
        let node = null;
        if (direction === 'top' || direction === 'bottom') {
            let sameLevelNodes = this.getSameLevelNodes();
            let index = sameLevelNodes.indexOf(diagram.selectedItems.nodes[0] as Node);
            node = direction === 'top' ? sameLevelNodes[index - 1] : sameLevelNodes[index + 1];
        }
        else {
            node = this.getMinDistanceNode(diagram, direction);
        }
        if (node) {
            diagram.clearSelection();
            diagram.select([node]);
        }
    }
    public getSameLevelNodes() {
        let diagram = this.selectedItem.diagram;
        let sameLevelNodes = [];
        if (diagram.selectedItems.nodes.length > 0) {
            let node = diagram.selectedItems.nodes[0];
            if ((node.data as any).branch !== 'Root') {
                let orientation_1 = (node.addInfo as any).orientation.toString();
                let connector = this.getConnector(diagram.connectors, (node as Node).inEdges[0]);
                let parentNode = this.getNode(diagram.nodes, connector.sourceID);
                for (let i = 0; i < parentNode.outEdges.length; i++) {
                    connector = this.getConnector(diagram.connectors, parentNode.outEdges[i]);
                    let childNode = this.getNode(diagram.nodes, connector.targetID);
                    if (childNode) {
                        let childOrientation = (childNode.addInfo as any).orientation.toString();
                        if (orientation_1 === childOrientation) {
                            sameLevelNodes.push(childNode);
                        }
                    }
                }
            }
        }
        return sameLevelNodes;
    };
    public getMinDistanceNode(diagram: Diagram, direction: string) {
        let node = diagram.selectedItems.nodes[0];
        let parentBounds = node.wrapper.bounds;
        let childBounds = null;
        let oldChildBoundsTop = 0;
        let childNode = null;
        let lastChildNode = null;
        let leftOrientationFirstChild = null, rightOrientationFirstChild = null;
        if ((node.data as any).orientation === "Root") {
            let edges = (node as Node).outEdges;
            for (let i = 0; i < edges.length; i++) {
                let connector = this.getConnector(diagram.connectors, edges[i]);
                childNode = this.getNode(diagram.nodes, connector.targetID);
                let addInfo = (childNode.addInfo as any);
                if (addInfo.orientation.toString().toLowerCase() === direction) {
                    if (direction === 'left' && leftOrientationFirstChild === null) {
                        leftOrientationFirstChild = childNode;
                    }
                    if (direction === 'right' && rightOrientationFirstChild === null) {
                        rightOrientationFirstChild = childNode;
                    }
                    childBounds = childNode.wrapper.bounds;
                    if (parentBounds.top >= childBounds.top && (childBounds.top >= oldChildBoundsTop || oldChildBoundsTop === 0)) {
                        oldChildBoundsTop = childBounds.top;
                        lastChildNode = childNode;
                    }
                }
            }
            if (!lastChildNode) {
                lastChildNode = direction === 'left' ? leftOrientationFirstChild : rightOrientationFirstChild;
            }
        }
        else {
            let edges: string[] = [];
            let selecttype = '';
            let orientation_2 = (node.addInfo as any).orientation.toString();
            if (orientation_2.toLowerCase() === 'left') {
                edges = direction === 'left' ? (node as Node).outEdges : (node as Node).inEdges;
                selecttype = direction === 'left' ? 'target' : 'source';
            }
            else {
                edges = direction === 'right' ? (node as Node).outEdges : (node as Node).inEdges;
                selecttype = direction === 'right' ? 'target' : 'source';
            }
            for (let i = 0; i < edges.length; i++) {
                let connector = this.getConnector(diagram.connectors, edges[i]);
                childNode = this.getNode(diagram.nodes, selecttype === 'target' ? connector.targetID : connector.sourceID);
                if ((childNode.data as any).orientation === "Root") {
                    lastChildNode = childNode;
                    break;
                }
                else {
                    childBounds = childNode.wrapper.bounds;
                    if (selecttype === 'target') {
                        if (parentBounds.top >= childBounds.top && (childBounds.top >= oldChildBoundsTop || oldChildBoundsTop === 0)) {
                            oldChildBoundsTop = childBounds.top;
                            lastChildNode = childNode;
                        }
                    }
                    else {
                        lastChildNode = childNode;
                    }
                }
            }
        }
        return lastChildNode;
    }

    public addSibilingChild() {
        let diagram: Diagram = this.selectedItem.diagram;
        let selectedNode: NodeModel = diagram.selectedItems.nodes[0];
        if (selectedNode && (selectedNode.data as any).branch !== 'Root') {
            let selectedNodeOrientation = (selectedNode.addInfo as any).orientation.toString();
            let orientation_3 = selectedNodeOrientation;
            let connector1 = this.getConnector(diagram.connectors, (selectedNode as Node).inEdges[0]);
            diagram.startGroupAction();
            let mindmapData = this.getMindMapShape(this.getNode(diagram.nodes, connector1.sourceID));
            let node: NodeModel = mindmapData.node;
            this.selectedItem.index = this.selectedItem.index + 1;
            node.id = this.selectedItem.index.toString();
            if (node.addInfo) {
                (node.addInfo as any).orientation = orientation_3;
            }
            else {
                node.addInfo = { 'orientation': orientation_3 };
            }
            let nodeData = {
                id: node.id,
                Label: 'Node',
                fill: node.style.fill,
                branch: orientation_3,
                strokeColor: node.style.strokeColor,
                parentId: (selectedNode.data as any).parentId,
                level: (node.addInfo as any).level,
                orientation: (node.addInfo as any).orientation,
                hasChild: false,
            };
            node.data = {
                id: node.id,
                Label: 'Node',
                fill: node.style.fill,
                strokeColor: node.style.strokeColor,
                orientation: (node.addInfo as any).orientation,
                branch: orientation_3,
                parentId: (selectedNode.data as any).parentId,
                level: (node.addInfo as any).level,
                hasChild: false,
            };
            let tempData = this.selectedItem.workingData.filter(
                (a: any) => a.id === (selectedNode.data as any).id
            );
            tempData[0].hasChild = (selectedNode.data as any).hasChild;
            this.selectedItem.workingData.push(nodeData);
            diagram.add(node);
            let connector = this.setConnectorDefault(diagram, orientation_3, mindmapData.connector, connector1.sourceID, node.id);
            diagram.add(connector);
            let node1 = this.getNode(diagram.nodes, node.id);
            diagram.doLayout();
            diagram.endGroupAction();
            diagram.select([node1]);
            let mindMapPatternTarget: any = this.selectedItem.mindMapPatternTarget;
            if (mindMapPatternTarget) {
                this.mindmapPatternChange(mindMapPatternTarget);
            }
            let diagramOrientation : any = diagram.layout.orientation;
            if (diagramOrientation === 'Vertical') {
                this.updateOrientation(diagram);
            }
        }
    }

    public download(data: string, filename: string): void {
        if ((window.navigator as any).msSaveBlob) {
            let blob = new Blob([data], { type: 'data:text/json;charset=utf-8,' });
            (window.navigator as any).msSaveOrOpenBlob(blob, filename + '.json');
        }
        else {
            let dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(data);
            let a = document.createElement('a');
            a.href = dataStr;
            a.download = filename + '.json';
            document.body.appendChild(a);
            a.click();
            a.remove();
        }
    };

    public getShortCutKey(menuItem: any): string {
        let shortCutKey: string = navigator.platform.indexOf('Mac') > -1 ? 'Cmd' : 'Ctrl';
        switch (menuItem) {
            case 'New':
                shortCutKey = 'Shift' + '+N';
                break;
            case 'Open':
                shortCutKey = shortCutKey + '+O';
                break;
            case 'Save':
                shortCutKey = shortCutKey + '+S';
                break;

            case 'Cut':
                shortCutKey = shortCutKey + '+X';
                break;
            case 'Copy':
                shortCutKey = shortCutKey + '+C';
                break;
            case 'Paste':
                shortCutKey = shortCutKey + '+V';
                break;
            case 'Delete':
                shortCutKey = 'Delete';
                break;
            case 'Duplicate':
                shortCutKey = shortCutKey + '+D';
                break;
            case 'Select All':
                shortCutKey = shortCutKey + '+A';
                break;
            case 'Zoom In':
                shortCutKey = shortCutKey + '++';
                break;
            case 'Zoom Out':
                shortCutKey = shortCutKey + '+-';
                break;
            case 'Group':
                shortCutKey = shortCutKey + '+G';
                break;
            case 'Ungroup':
                shortCutKey = shortCutKey + '+U';
                break;
            case 'Send To Back':
                shortCutKey = shortCutKey + '+Shift+B';
                break;
            case 'Bring To Front':
                shortCutKey = shortCutKey + '+Shift+F';
                break;
            default:
                shortCutKey = '';
                break;
        }
        return shortCutKey;
    };

    public enableMenuItems(itemText: any) {
        let diagram = this.selectedItem.diagram;
        let selectedItems: Object[] = diagram.selectedItems.nodes;
        selectedItems = selectedItems.concat(diagram.selectedItems.connectors);
        if (itemText) {
            let commandType = itemText.replace(/[' ']/g, '');
            if (selectedItems.length === 0) {
                switch (commandType.toLowerCase()) {
                    case 'cut':
                        return true;
                    case 'copy':
                        return true;
                    case 'delete':
                        return true;
                    case 'duplicate':
                        return true;
                }
            }
            if (selectedItems.length > 1) {
                switch (commandType.toLowerCase()) {
                    case 'edittooltip':
                        return true;
                }
            }
            if (!(diagram.commandHandler.clipboardData.pasteIndex !== undefined
                && diagram.commandHandler.clipboardData.clipObject !== undefined) && itemText === 'Paste') {
                return true;
            }
            if (itemText === 'Themes') {
                return true;
            }
            if (itemText === 'Show Shortcuts' && document.getElementById('overlay').style.display === 'none') {
                return true;
            }

        }
        return false;
    };

    public onClickDisable(args: any, node?: NodeModel) {
        if (args === false) {
            this.selectedItem.toolbarObj.items[6].disabled = false;
            this.selectedItem.toolbarObj.items[8].disabled = false;
            if (node && (node.addInfo as any).level !== 0) {
                this.selectedItem.toolbarObj.items[7].disabled = false;
            } else {
                this.selectedItem.toolbarObj.items[7].disabled = true;
            }
        }
        else if (args === true) {
           this.selectedItem.toolbarObj.items[6].disabled = true;
           this.selectedItem.toolbarObj.items[7].disabled = true;
           this.selectedItem.toolbarObj.items[8].disabled = true;
        }
        this.removeSelectedToolbarItem();
    };

    public removeSelectedToolbarItem() {
        let toolbarEditor = this.selectedItem.toolbarObj;
        for (let i = 0; i < toolbarEditor.items.length; i++) {
            let item = toolbarEditor.items[i];
            if (item.cssClass.indexOf('tb-item-selected') !== -1) {
                item.cssClass = item.cssClass.replace(' tb-item-selected', '');
            }
        }
        toolbarEditor.dataBind();
    }

    public getOrientation() {
        let diagram: Diagram = this.selectedItem.diagram;
        var leftChildCount = 0;
        var rightChildCount = 0;
        var orientation;
        if ((diagram.selectedItems.nodes[0].data as any).branch === "Root") {
            for (var i = 0; i < diagram.nodes.length; i++) {
                if (diagram.nodes[i].addInfo && (diagram.nodes[i].addInfo as any).level === 1) {
                    if ((diagram.nodes[i].addInfo as any).orientation === "Left") {
                        leftChildCount++;
                    } else {
                        rightChildCount++;
                    }
                }
            }
            orientation = leftChildCount > rightChildCount ? "Right" : "Left";
        } else {
            var selectedNodeOrientation = (diagram.selectedItems.nodes[0].addInfo as any).orientation.toString();
            orientation = selectedNodeOrientation;
        }
        return orientation;

    }

    public addMultipleChild() {
        document.getElementById('mindMapContainer').style.display = 'none';
        document.getElementById('multipleChildPropertyContainer').style.display = '';
        document.getElementById('propertyHeader').innerText = "Add Multiple Child";
    }

    public menuClick(args: any) {
        let diagram: Diagram = this.selectedItem.diagram;
        var buttonElement = document.getElementsByClassName('e-btn-hover')[0];
        if (buttonElement) {
            buttonElement.classList.remove('e-btn-hover');
        }
        var commandType = args.item.text.replace(/[' ']/g, '');
        var zoomCurrentValue = (document.getElementById("btnZoomIncrement") as any).ej2_instances[0];
        switch (commandType.toLowerCase()) {
            case 'new':
                diagram.clear();
                diagram.loadDiagram('{"width":"100%","height":"100%","snapSettings":{"constraints":0,"gridType":"Lines","verticalGridlines":{"lineIntervals":[1.25,18.75,0.25,19.75,0.25,19.75,0.25,19.75,0.25,19.75]},"horizontalGridlines":{"lineIntervals":[1.25,18.75,0.25,19.75,0.25,19.75,0.25,19.75,0.25,19.75]}},"tool":1,"layout":{"type":"MindMap","horizontalSpacing":50,"verticalSpacing":50,"getBranch":{},"enableAnimation":true,"connectionPointOrigin":"SamePoint","arrangement":"Nonlinear","enableRouting":false,"fixedNode":"sZIN0"},"selectedItems":{"constraints":4096,"userHandles":[{"name":"leftHandle","pathData":"M11.924,6.202 L4.633,6.202 L4.633,9.266 L0,4.633 L4.632,0 L4.632,3.551 L11.923,3.551 L11.923,6.202Z","backgroundColor":"black","pathColor":"white","side":"Left","offset":0.5,"margin":{"top":10,"bottom":0,"left":0,"right":10},"horizontalAlignment":"Left","verticalAlignment":"Top"},{"name":"rightHandle","pathData":"M0,3.063 L7.292,3.063 L7.292,0 L11.924,4.633 L7.292,9.266 L7.292,5.714 L0.001,5.714 L0.001,3.063Z","backgroundColor":"black","pathColor":"white","side":"Right","offset":0.5,"margin":{"top":10,"bottom":0,"left":10,"right":0},"horizontalAlignment":"Right","verticalAlignment":"Top"},{"name":"devare","pathData":"M 7.04 22.13 L 92.95 22.13 L 92.95 88.8 C 92.95 91.92 91.55 94.58 88.7696.74 C 85.97 98.91 82.55 100 78.52 100 L 21.48 100 C 17.45 100 14.03 98.91 11.24 96.74 C 8.45 94.58 7.0491.92 7.04 88.8 z M 32.22 0 L 67.78 0 L 75.17 5.47 L 100 5.47 L 100 16.67 L 0 16.67 L 0 5.47 L 24.83 5.47 z","backgroundColor":"black","pathColor":"white","side":"Top","offset":0.5,"margin":{"top":0,"bottom":0,"left":0,"right":0},"horizontalAlignment":"Center","verticalAlignment":"Center"}],"nodes":[],"connectors":[],"wrapper":null,"selectedObjects":[]},"dataSourceSettings":{"id":"id","parentId":"parentId","dataSource":{"dateParse":true,"timeZoneHandling":true,"requests":[],"dataSource":{"json":[{"id":"1","Label":"Root","fill":"#D0ECFF","branch":"Root","hasChild":true,"level":0,"strokeColor":"#80BFEA","orientation":"Root"}],"offline":true,"dataType":"json"},"defaultQuery":{"subQuery":null,"isChild":false,"distincts":[],"queries":[{"fn":"onTake","e":{"nos":7}}],"key":"","fKey":"","expands":[],"sortedColumns":[],"groupedColumns":[],"params":[],"lazyLoad":[]},"adaptor":{"options":{"from":"table","requestType":"json","sortBy":"sorted","select":"select","skip":"skip","group":"group","take":"take","search":"search","count":"requiresCounts","where":"where","aggregates":"aggregates","expand":"expand"},"type":{},"pvt":{}}},"root":"1","dataManager":null,"crudAction":{"read":""},"connectionDataSource":{"dataManager":null},"dataMapSettings":[]},"getNodeDefaults":{},"getConnectorDefaults":{},"getCustomTool":{},"selectionChange":{},"rulerSettings":{"showRulers":true,"dynamicGrid":true,"horizontalRuler":{"orientation":"Horizontal","interval":10,"segmentWidth":100,"thickness":25,"tickAlignment":"RightOrBottom","arrangeTick":null},"verticalRuler":{"orientation":"Vertical","interval":10,"segmentWidth":100,"thickness":25,"tickAlignment":"RightOrBottom","arrangeTick":null}},"created":{},"keyDown":{},"textEdit":{},"drop":{},"scrollChange":{},"enableRtl":false,"locale":"en-US","scrollSettings":{"currentZoom":1,"viewPortWidth":1330,"viewPortHeight":629.6614379882812,"horizontalOffset":0,"verticalOffset":-0.33,"padding":{"left":0,"right":0,"top":0,"bottom":0},"scrollLimit":"Diagram","minZoom":0.2,"maxZoom":30},"enablePersistence":false,"backgroundColor":"transparent","constraints":500,"contextMenuSettings":{},"mode":"SVG","layers":[{"id":"default_layer","visible":true,"lock":false,"objects":["sZIN0"],"zIndex":0,"objectZIndex":0}],"nodes":[{"id":"sZIN0","data":{"id":"1","Label":"Root","fill":"#D0ECFF","branch":"Root","hasChild":true,"level":0,"strokeColor":"#80BFEA","orientation":"Root"},"shape":{"type":"Basic","cornerRadius":5,"shape":"Ellipse"},"ports":[{"id":"leftPort","offset":{"x":0,"y":0.5},"visibility":2,"style":{"fill":"black","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"inEdges":[],"outEdges":[],"height":12,"width":12,"shape":"Square","margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center"},{"id":"rightPort","offset":{"x":1,"y":0.5},"visibility":2,"style":{"fill":"black","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"inEdges":[],"outEdges":[],"height":12,"width":12,"shape":"Square","margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center"}],"zIndex":0,"constraints":5240810,"style":{"fill":"#D0ECFF","strokeColor":"#80BFEA","strokeWidth":1,"gradient":{"type":"None"},"strokeDashArray":"","opacity":1},"addInfo":{"level":0,"orientation":"Root"},"expandIcon":{"shape":"None","height":10,"width":10,"fill":"white","borderColor":"black","offset":{"x":0.5,"y":1}},"collapseIcon":{"shape":"None","height":10,"width":10,"fill":"white","borderColor":"black","offset":{"x":0.5,"y":1}},"width":150,"height":75,"annotations":[{"id":"VgDkd","content":"Root","annotationType":"String","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","bold":false,"textWrapping":"WrapWithOverflow","color":"black","whiteSpace":"CollapseSpace","fontFamily":"Arial","fontSize":12,"italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textOverflow":"Wrap","textDecoration":"None"},"hyperlink":{"link":"","hyperlinkOpenState":"NewTab","content":"","textDecoration":"None"},"constraints":4,"visibility":true,"rotateAngle":0,"margin":{"right":0,"bottom":0,"left":0,"top":0},"horizontalAlignment":"Center","verticalAlignment":"Center","offset":{"x":0.5,"y":0.5}}],"container":null,"offsetX":665,"offsetY":314.8307189941406,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":150,"height":75},"offsetX":665,"offsetY":314.8307189941406},"flipMode":"All","isExpanded":true,"fixedUserHandles":[],"excludeFromLayout":false,"inEdges":[],"outEdges":[],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false}],"connectors":[],"diagramSettings":{"inversedAlignment":true},"pageSettings":{"boundaryConstraints":"Infinity","width":null,"orientation":"Landscape","height":null,"background":{"source":"","color":"transparent"},"showPageBreaks":false,"fitOptions":{"canFit":false}},"basicElements":[],"tooltip":{"content":""},"commandManager":{"commands":[{"name":"leftChild","canExecute":{},"execute":{},"gesture":{"key":9},"parameter":""},{"name":"rightChild","canExecute":{},"execute":{},"gesture":{"key":9,"keyModifiers":4},"parameter":""},{"name":"showShortCut","canExecute":{},"execute":{},"gesture":{"key":112},"parameter":""},{"name":"FitToPage","canExecute":{},"execute":{},"gesture":{"key":119},"parameter":""},{"name":"boldLabel","canExecute":{},"execute":{},"gesture":{"key":66,"keyModifiers":1},"parameter":""},{"name":"italicLabel","canExecute":{},"execute":{},"gesture":{"key":73,"keyModifiers":1},"parameter":""},{"name":"underlineLabel","canExecute":{},"execute":{},"gesture":{"key":85,"keyModifiers":1},"parameter":""},{"name":"deleteNode","canExecute":{},"execute":{},"gesture":{"key":8},"parameter":""},{"name":"removeNode","canExecute":{},"execute":{},"gesture":{"key":46},"parameter":""},{"name":"expandCollapse","canExecute":{},"execute":{},"gesture":{"key":32},"parameter":""},{"name":"expandCollapseParent","canExecute":{},"execute":{},"gesture":{"key":69,"keyModifiers":1},"parameter":""},{"gesture":{"key":13},"canExecute":{},"execute":{},"name":"sibilingChildTop","parameter":""},{"name":"newDiagram","canExecute":{},"execute":{},"gesture":{"key":78,"keyModifiers":1},"parameter":""},{"name":"saveDiagram","canExecute":{},"execute":{},"gesture":{"key":83,"keyModifiers":1},"parameter":""},{"name":"openDiagram","canExecute":{},"execute":{},"gesture":{"key":79,"keyModifiers":1},"parameter":""},{"name":"navigationDown","canExecute":{},"execute":{},"gesture":{"key":40},"parameter":""},{"name":"navigationUp","canExecute":{},"execute":{},"gesture":{"key":38},"parameter":""},{"name":"navigationLeft","canExecute":{},"execute":{},"gesture":{"key":37},"parameter":""},{"name":"navigationRight","canExecute":{},"execute":{},"gesture":{"key":39},"parameter":""}]},"version":17.1}');
                this.selectedItem.workingData = [{ id: '1', Label: 'Root', branch: 'Root', hasChild: true, level: 0, fill: "#D0ECFF", strokeColor: "#80BFEA", orientation: 'Root',nodeShapeType: 'Basic', nodeShape: 'Ellipse', nodeShapeData:'', },];
                diagram.fitToPage();
                break;
            case 'open':
                document.getElementsByClassName('e-file-select-wrap')[0].querySelector('button').click();
                break;
            case 'save':
                this.download(diagram.saveDiagram(),(document.getElementById('diagramName') as HTMLInputElement).innerHTML);
                break;
            case 'print':
                this.selectedItem.printSettings.pageHeight = 1000;
                this.selectedItem.printSettings.pageWidth = 900;
                this.selectedItem.printSettings.paperSize = "A4";
                this.selectedItem.printSettings.isPortrait = this.selectedItem.diagram.pageSettings.orientation === 'Portrait' ? true : false
                this.selectedItem.printSettings.isLandscape = this.selectedItem.diagram.pageSettings.orientation === 'Landscape' ? true : false
                this.selectedItem.printSettings.multiplePage = this.selectedItem.diagram.pageSettings.multiplePage;
                this.selectedItem.printSettings.region = 'Content';
                this.btnPrintClick()
                break;
            case 'export':
                this.selectedItem.exportDialog.show();
                break;
            case 'fittoscreen':
                diagram.fitToPage({ mode: 'Page', region: 'Content', margin: { left: 0, top: 0, right: 0, bottom: 0 } });
                break;
            case 'showrulers':
                diagram.rulerSettings.showRulers = !diagram.rulerSettings.showRulers;
                args.item.iconCss = args.item.iconCss ? '' : 'sf-icon-check-tick';
                break;
            case 'zoomin':
                diagram.zoomTo({ type: 'ZoomIn', zoomFactor: 0.2 });
                zoomCurrentValue.content = (diagram.scrollSettings.currentZoom * 100).toFixed() + '%';
                break;
            case 'zoomout':
                diagram.zoomTo({ type: 'ZoomOut', zoomFactor: 0.2 });
                zoomCurrentValue.content = (diagram.scrollSettings.currentZoom * 100).toFixed() + '%';
                break;
            case 'showtoolbar':
                this.hideElements('hide-toolbar', diagram);
                args.item.iconCss = args.item.iconCss ? '' : 'sf-icon-check-tick';
                break;
            case 'showlines':
                diagram.snapSettings.constraints = diagram.snapSettings.constraints ^ SnapConstraints.ShowLines;
                args.item.iconCss = args.item.iconCss ? '' : 'sf-icon-check-tick';
                break;
            case 'showproperties':
                this.hideElements('hide-properties', diagram);
                args.item.iconCss = args.item.iconCss ? '' : 'sf-icon-check-tick';
                break;
            case 'showshortcuts':
                var node1 = document.getElementById('shortcutDiv');
                node1.style.visibility = node1.style.visibility === "hidden" ? node1.style.visibility = "visible" : node1.style.visibility = "hidden";
                args.item.iconCss = args.item.iconCss ? '' : 'sf-icon-check-tick';
                break;
            case 'showpagebreaks':
                args.item.iconCss = args.item.iconCss ? '' : 'sf-icon-check-tick';
                diagram.pageSettings.showPageBreaks = !diagram.pageSettings.showPageBreaks;
                break;
            case 'showmultiplepage':
                args.item.iconCss = args.item.iconCss ? '' : 'sf-icon-check-tick';
                diagram.pageSettings.multiplePage = !diagram.pageSettings.multiplePage;
                break;
            default:
                this.executeEditMenu(diagram, commandType);
                break;
        }
        diagram.dataBind();

    };

    public executeEditMenu(diagram: Diagram, commandType: string) {
        var key = '';
        switch (commandType.toLowerCase()) {
            case 'undo':
                diagram.undo();
                diagram.doLayout();
                break;
            case 'redo':
                diagram.redo();
                break;
            case 'cut':
                diagram.cut();
                break;
            case 'copy':
                diagram.copy();
                break;
            case 'paste':
                diagram.paste();
                break;
            case 'delete':
                this.removeChild();
                break;
            case 'selectall':
                diagram.selectAll();
                break;
        }
    }
    public btnPrintClick(): void {
        let pageWidth: number = this.selectedItem.printSettings.pageWidth;
        let pageHeight: number = this.selectedItem.printSettings.pageHeight;
        let diagram: Diagram = this.selectedItem.diagram;
        diagram.print({ pageHeight: pageHeight, pageWidth: pageWidth,
        });

    }
    public hideElements(elementType: string, diagram: Diagram) {
        var diagramContainer = document.getElementsByClassName('diagrambuilder-container')[0];
        if (diagramContainer.classList.contains(elementType)) {
            diagramContainer.classList.remove(elementType);
        }
        else {
            diagramContainer.classList.add(elementType);
        }
        if (diagram) {
            diagram.updateViewPort();
        }
        if (elementType == 'hide-properties') {
            this.selectedItem.btnHideToolbar.isPrimary = this.selectedItem.btnHideToolbar.isPrimary ? false : true;
        }
    }

    public getPaperSize(paperName: string) {
        let paperSize: PaperSize = new PaperSize();
        switch (paperName) {
            case 'Letter':
                paperSize.pageWidth = 816;
                paperSize.pageHeight = 1056;
                break;
            case 'Legal':
                paperSize.pageWidth = 816;
                paperSize.pageHeight = 1344;
                break;
            case 'Tabloid':
                paperSize.pageWidth = 1056;
                paperSize.pageHeight = 1632;
                break;
            case 'A3':
                paperSize.pageWidth = 1122;
                paperSize.pageHeight = 1587;
                break;
            case 'A4':
                paperSize.pageWidth = 793;
                paperSize.pageHeight = 1122;
                break;
            case 'A5':
                paperSize.pageWidth = 559;
                paperSize.pageHeight = 793;
                break;
            case 'A6':
                paperSize.pageWidth = 396;
                paperSize.pageHeight = 559;
                break;
        }
        return paperSize;
    };

    public fileName() {
        return document.getElementById('diagramName').innerHTML;
    }

    public updateOrientation(diagram: Diagram) {
        for (var i = 0; i < diagram.connectors.length; i++) {
            var connector = diagram.connectors[i];
            if ((diagram as any).layout.orientation === "Vertical") {
                if (connector.sourcePortID === "rightPort" && connector.targetPortID === "leftPort") {
                    connector.sourcePortID = 'bottomPort';
                    connector.targetPortID = "topPort";
                }
                if (connector.sourcePortID === "leftPort" && connector.targetPortID === "rightPort") {
                    connector.sourcePortID = 'topPort';
                    connector.targetPortID = 'bottomPort';
                }
            } else if ((diagram as any).layout.orientation === "Horizontal") {
                if (connector.sourcePortID === "bottomPort" && connector.targetPortID === "topPort"){
                    connector.sourcePortID = 'rightPort';
                    connector.targetPortID = "leftPort";
                }
                if (connector.sourcePortID === "topPort" && connector.targetPortID === "bottomPort") {
                    connector.sourcePortID = 'leftPort';
                    connector.targetPortID = 'rightPort';
                }
            }
        }
    }

}