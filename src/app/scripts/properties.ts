/**
 * Selector Handler
 */
import {
    Diagram, NodeModel, Node, NodeConstraints,
    ConnectorModel, Connector, Segments, DecoratorShapes, ConnectorConstraints, TextStyleModel
} from '@syncfusion/ej2-diagrams';
import { Input, Injectable } from '@angular/core';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { UtilityMethods } from './utilitymethods';
import { SelectorViewModel } from './selector';


@Injectable()
export class PropertyChange {

    private selectedItem: SelectorViewModel;
    constructor(selectedItem: SelectorViewModel) {
        this.selectedItem = selectedItem;
    }

    public mindMapPropertyChange(args: any) {
        let diagram: Diagram = this.selectedItem.diagram;
        if (diagram && diagram.nodes.length > 0) {
            var nodes = this.selectedItem.levelType === "Selected Item" ? diagram.selectedItems.nodes : diagram.nodes;
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                if (node.addInfo) {
                    var addInfo = (node.addInfo as any);
                    if ('Level' + addInfo.level === this.selectedItem.levelType || addInfo.level === this.selectedItem.levelType || this.selectedItem.levelType === "Selected Item") {
                        switch (args.propertyName.toString().toLowerCase()) {
                            case 'fill':
                                node.style.fill = this.getColor(this.selectedItem.fill);
                                break;
                            case 'stroke':
                                node.style.strokeColor = this.getColor(this.selectedItem.stroke);
                                if ((node as Node).inEdges.length > 0) {
                                    var connector = this.selectedItem.utilityMethods.getConnector(diagram.connectors, (node as Node).inEdges[0]);
                                    connector.style.strokeColor = node.style.strokeColor;
                                }
                                break;
                            case 'strokewidth':
                                node.style.strokeWidth = this.selectedItem.strokeWidth;
                                if ((node as Node).inEdges.length > 0) {
                                    var connector1 = this.selectedItem.utilityMethods.getConnector(diagram.connectors, (node as Node).inEdges[0]);
                                    connector1.style.strokeWidth = this.selectedItem.strokeWidth;
                                }
                                break;
                            case 'strokestyle':
                                node.style.strokeDashArray = this.selectedItem.strokeStyle;
                                if ((node as Node).inEdges.length > 0) {
                                    var connector2 = this.selectedItem.utilityMethods.getConnector(diagram.connectors, (node as Node).inEdges[0]);
                                    connector2.style.strokeDashArray = this.selectedItem.strokeStyle;
                                }
                                break;
                            case 'opacity':
                                node.style.opacity = this.selectedItem.shapeOpacity / 100;
                                (document.getElementById("mindmapOpacityText") as any).value = this.selectedItem.shapeOpacity + '%';
                                break;
                            case 'shape':
                                this.drawShapeChange(node);
                                break;
                            default:
                                this.updateMindMapTextStyle(node, args.propertyName.toString().toLowerCase());
                                break;
                        }
                    }
                }
                diagram.dataBind();
            }
        }
    };
    public updateMindMapTextStyle(node: NodeModel, propertyName: string) {
        let diagram: Diagram = this.selectedItem.diagram;
        if (node.addInfo && node.annotations.length > 0) {
            var annotation = node.annotations[0].style;
            switch (propertyName) {
                case 'fontfamily':
                    annotation.fontFamily = this.selectedItem.fontFamily;
                    break;
                case 'fontsize':
                    annotation.fontSize = this.selectedItem.fontSize;
                    break;
                case 'fontcolor':
                    annotation.color = this.getColor(this.selectedItem.fontColor);
                    break;
                case 'textopacity':
                    annotation.opacity = this.selectedItem.textOpacity / 100;
                    (document.getElementById("textOpacityText") as any).value = this.selectedItem.textOpacity + '%';
                    break;
                case 'bold':
                    annotation.bold = !annotation.bold;
                    break;
                case 'italic':
                    annotation.italic = !annotation.italic;
                    break;
                case 'underline':
                    annotation.textDecoration = annotation.textDecoration === 'None' || !annotation.textDecoration ? 'Underline' : 'None';
                    break;
            }
        }
        diagram.dataBind();
    }
    public drawShapeChange(node: NodeModel) {
        let diagram: Diagram = this.selectedItem.diagram;
        if (this.selectedItem.nodeShape === 'Rectangle') {
            node.shape = { type: 'Basic', shape: 'Rectangle' };
        } else if (this.selectedItem.nodeShape === 'Ellipse') {
            node.shape = { type: 'Basic', shape: 'Ellipse' };
        } else if (this.selectedItem.nodeShape === 'Star') {
            node.shape = { type: 'Path', data: 'M28 1.60745L32.6757 7.49196L33.1063 8.03386L33.7651 7.82174L43.5571 4.66902L41.3666 9.9757L40.8265 11.2839L42.24 11.356L52.0141 11.8539L45.233 15.0979L43.3473 16L45.233 16.9021L52.0141 20.1461L42.24 20.644L40.8265 20.716L41.3666 22.0243L43.5571 27.331L33.7651 24.1783L33.1063 23.9661L32.6757 24.508L28 30.3926L23.3243 24.508L22.8937 23.9661L22.2349 24.1783L12.4429 27.331L14.6334 22.0243L15.1734 20.7161L13.7599 20.644L3.98585 20.1461L10.767 16.9021L12.6527 16L10.767 15.0979L3.98585 11.8539L13.7599 11.356L15.1734 11.2839L14.6334 9.9757L12.4429 4.66902L22.2349 7.82174L22.8937 8.03386L23.3243 7.49196L28 1.60745Z' };
        } else if (this.selectedItem.nodeShape === "Cloud") {
            node.shape = { type: 'Path', data: 'M55.7315 17.239C57.8719 21.76 54.6613 27.788 47.1698 26.0787C46.0997 32.309 33.2572 35.323 28.9764 29.2951C25.7658 35.323 10.7829 33.816 10.7829 26.0787C3.29143 30.802 -0.989391 20.253 2.22121 17.239C-0.989317 14.2249 2.22121 6.68993 10.7829 8.39934C13.9935 -0.845086 25.7658 -0.845086 28.9764 5.18301C32.187 0.661909 45.0294 0.661908 47.1698 8.39934C52.5209 5.18301 60.0123 12.7179 55.7315 17.239Z' };
        } else if (this.selectedItem.nodeShape === "Free hand") {
            node.shape = { type: 'Path', data: 'M24.9123 3.78029C25.0975 4.3866 24.9466 4.88753 24.8501 5.15598L24.8444 5.17188L24.8379 5.18757C24.543 5.89091 23.7879 6.37572 22.9737 6.71397C22.1386 7.06093 21.0847 7.3197 19.9302 7.51132C17.6145 7.89568 14.7099 8.03929 11.8845 7.99097C9.05877 7.94266 6.24887 7.70127 4.11982 7.29202C3.06318 7.08891 2.11594 6.83369 1.41022 6.51281C0.766274 6.22 0 5.72087 0 4.9469C0 4.01004 0.964525 3.41277 1.79867 3.05724C2.70576 2.67063 3.89493 2.37901 5.11258 2.15935C7.44304 1.73893 10.1147 1.54134 11.7304 1.52346C11.8769 1.52184 12.0122 1.59735 12.0902 1.72133V1.72133C12.2554 1.98406 12.0895 2.33011 11.7819 2.37125C6.76467 3.04222 7.47107 3.02672 5.26455 3.42478C4.10916 3.63321 3.07622 3.89464 2.39298 4.18584C1.76916 4.45172 1.91438 4.9469 1.92108 4.92166C1.95272 4.95811 2.05541 5.05272 2.36059 5.19149C2.83828 5.4087 3.58481 5.6232 4.56968 5.81251C6.52366 6.18811 9.1877 6.42238 11.9256 6.4692C14.6639 6.51602 17.4127 6.37423 19.539 6.02131C20.6055 5.8443 21.4697 5.62145 22.0872 5.36491C22.7085 5.10676 22.9449 4.87196 23.0162 4.71867C23.0759 4.54803 23.1185 4.35742 23.052 4.13951C22.9867 3.92586 22.7842 3.58431 22.1006 3.17831C20.6845 2.3372 17.4158 1.34558 10.1686 0.773902C10.0395 0.763721 9.92243 0.68718 9.86361 0.571853V0.571853C9.7338 0.317364 9.92861 0.0177825 10.2139 0.0325302C17.4619 0.407187 21.4191 0.873597 23.2463 1.95885C24.2179 2.53589 24.7233 3.16153 24.9123 3.78029Z' };
        } else {
            node.shape = { type: 'Basic', shape: 'Rectangle' };
            node.height = 4;
        }
        diagram.dataBind();
    }

    public getColor(colorName: string) {
        if ((window.navigator as any).msSaveBlob && colorName.length === 9) {
            return colorName.substring(0, 7);
        }
        return colorName;
    };

    public cancelChild() {
        document.getElementById('mindMapContainer').style.display = '';
        document.getElementById('multipleChildPropertyContainer').style.display = 'none';
        document.getElementById('propertyHeader').innerText = "Properties";
    }

    public addChildOnClick() {
        let diagram: Diagram = this.selectedItem.diagram;
        var childText = this.selectedItem.textAreaObj.value.split('\n');
        var orientation = this.selectedItem.utilityMethods.getOrientation();
        for (var i = 0; i < childText.length; i++) {
            this.selectedItem.utilityMethods.addNode(orientation, childText[i], true);
            orientation = (diagram.selectedItems.nodes[0].data as any).branch !== "Root" ? orientation : orientation === "Left" ? "Right" : "Left";
        }
        document.getElementById('mindMapContainer').style.display = '';
        document.getElementById('multipleChildPropertyContainer').style.display = 'none';
        document.getElementById('propertyHeader').innerText = "Properties";
        this.selectedItem.textAreaObj.value = "";
    }


}