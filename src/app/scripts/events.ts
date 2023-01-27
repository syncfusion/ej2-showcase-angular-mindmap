//import { SelectorViewModel } from './selector';
import {
    IKeyEventArgs, ISelectionChangeEventArgs, Diagram, Node, Keys,
    KeyModifiers, IHistoryChangeArgs, ITextEditEventArgs, IScrollChangeEventArgs, DiagramAction
} from '@syncfusion/ej2-diagrams';

import { SelectorViewModel } from './selector';
//import { PaperSize } from './utilitymethods';

export class DiagramClientSideEvents {
    private selectedItem: SelectorViewModel;
    constructor(selectedItem: SelectorViewModel) {
        this.selectedItem = selectedItem;
    }

    public created() {
        let diagram: Diagram = this.selectedItem.diagram;
        diagram.fitToPage();
        diagram.commandManager = {
            commands: [
                {
                    name: 'leftChild',
                    canExecute: function () {
                        if (diagram.selectedItems.nodes.length > 0) {
                            return true;
                        }
                        return false;
                    },
                    execute: () => {
                        var selectedObject = diagram.selectedItems.nodes;
                        if (selectedObject[0]) {
                            if ((selectedObject[0] as Node).inEdges) {
                                this.selectedItem.utilityMethods.addNode('Left');
                            }
                        }
                    },
                    gesture: {
                        key: Keys.Tab,
                    }
                },
                {
                    name: 'rightChild',
                    canExecute: function () {
                        if (diagram.selectedItems.nodes.length > 0) {
                            return true;
                        }
                        return false;
                    },
                    execute: () => {
                        var selectedObject = diagram.selectedItems.nodes;
                        if (selectedObject[0]) {
                            if ((selectedObject[0] as Node).inEdges) {
                                this.selectedItem.utilityMethods.addNode('Right');
                            }
                        }
                    },
                    gesture: {
                        key: Keys.Tab,
                        keyModifiers: KeyModifiers.Shift
                    }

                },
                {
                    name: 'showShortCut',
                    canExecute: function () {
                        return true;
                    },
                    execute: () => {
                        var node1 = document.getElementById('shortcutDiv');
                        node1.style.visibility = node1.style.visibility === "hidden" ? node1.style.visibility = "visible" : node1.style.visibility = "hidden";
                        this.selectedItem.btnWindowMenu.items[2].iconCss = node1.style.visibility === "hidden" ? '' : 'sf-icon-check-tick';
                        diagram.dataBind();
                    },
                    gesture: {
                        key: Keys.F1,
                    }

                },

                {
                    name: 'FitToPage',
                    canExecute: function () {
                        return true;
                    },
                    execute: () => {
                        diagram.fitToPage({ mode: 'Width' });
                    },
                    gesture: {
                        key: Keys.F8,
                    }

                },
                {
                    name: 'boldLabel',
                    canExecute: function () {
                        return true;
                    },
                    execute: () => {
                        if (diagram.selectedItems.nodes.length > 0) {
                            var node = diagram.selectedItems.nodes[0];
                            if (node.annotations && node.annotations.length > 0) {
                                node.annotations[0].style.bold = !node.annotations[0].style.bold;
                                diagram.dataBind();
                            }
                        }
                    },
                    gesture: {
                        key: Keys.B,
                        keyModifiers: KeyModifiers.Control
                    }
                },
                {
                    name: 'italicLabel',
                    canExecute: function () {
                        return true;
                    },
                    execute: () => {
                        if (diagram.selectedItems.nodes.length > 0) {
                            var node = diagram.selectedItems.nodes[0];
                            if (node.annotations && node.annotations.length > 0) {
                                node.annotations[0].style.italic = !node.annotations[0].style.italic;
                                diagram.dataBind();
                            }
                        }
                    },
                    gesture: {
                        key: Keys.I,
                        keyModifiers: KeyModifiers.Control
                    }
                },
                {
                    name: 'underlineLabel',
                    canExecute: function () {
                        return true;
                    },
                    execute: () => {
                        if (diagram.selectedItems.nodes.length > 0) {
                            var node = diagram.selectedItems.nodes[0];
                            if (node.annotations && node.annotations.length > 0) {
                                node.annotations[0].style.textDecoration = node.annotations[0].style.textDecoration === 'Underline' ? 'None' : 'Underline';
                                diagram.dataBind();
                            }
                        }
                    },
                    gesture: {
                        key: Keys.U,
                        keyModifiers: KeyModifiers.Control
                    }
                },
                {
                    name: 'deleteNode',
                    canExecute: function () {
                        return true;
                    },
                    execute: () => {
                        if (diagram.selectedItems.nodes.length > 0 && (diagram.selectedItems.nodes[0].data as any).branch !== 'Root') {
                            this.selectedItem.utilityMethods.removeChild();
                        }
                    },
                    gesture: {
                        key: Keys.BackSpace
                    }
                },
                {
                    name: 'removeNode',
                    canExecute: function () {
                        return true;
                    },
                    execute: () => {
                        if (diagram.selectedItems.nodes.length > 0 && (diagram.selectedItems.nodes[0].data as any).branch !== 'Root') {
                            this.selectedItem.utilityMethods.removeChild();
                        }
                    },
                    gesture: {
                        key: Keys.Delete
                    }
                },
                {
                    name: 'expandCollapse',
                    canExecute: function () {
                        return true;
                    },
                    execute: () => {
                        if (diagram.selectedItems.nodes.length > 0) {
                            var node = diagram.selectedItems.nodes[0];
                            node.isExpanded = !node.isExpanded;
                            diagram.dataBind();
                        }
                    },
                    gesture: {
                        key: Keys.Space
                    }
                },
                {
                    name: 'expandCollapseParent',
                    canExecute: function () {
                        return true;
                    },
                    execute: () => {
                        var node = diagram.nodes[0];
                        node.isExpanded = !node.isExpanded;
                        diagram.dataBind();
                    },
                    gesture: {
                        key: Keys.E,
                        keyModifiers: KeyModifiers.Control
                    }
                },
                {
                    gesture: { key: Keys.Enter },
                    canExecute: function () {
                        return true;
                    },
                    execute: () => {
                        this.selectedItem.utilityMethods.addSibilingChild()
                    },
                    name: 'sibilingChildTop'
                },
                {
                    name: 'newDiagram',
                    canExecute: function () {
                        return true;
                    },
                    execute: () => {
                        diagram.clear();
                    },
                    gesture: {
                        key: Keys.N,
                        keyModifiers: KeyModifiers.Control
                    }
                },
                {
                    name: 'saveDiagram',
                    canExecute: function () {
                        return true;
                    },
                    execute: () => {
                        this.selectedItem.utilityMethods.download(diagram.saveDiagram());
                    },
                    gesture: {
                        key: Keys.S,
                        keyModifiers: KeyModifiers.Control
                    }
                },
                {
                    name: 'openDiagram',
                    canExecute: function () {
                        return true;
                    },
                    execute: () => {
                        document.getElementsByClassName('e-file-select-wrap')[0].querySelector('button').click();
                    },
                    gesture: {
                        key: Keys.O,
                        keyModifiers: KeyModifiers.Control
                    }
                },
                {
                    name: 'navigationDown',
                    canExecute: function () {
                        return true;
                    },
                    execute: () => {
                        this.selectedItem.utilityMethods.navigateChild('bottom');
                    },
                    gesture: {
                        key: Keys.Down
                    }
                },
                {
                    name: 'navigationUp',
                    canExecute: function () {
                        return true;
                    },
                    execute: () => {
                        this.selectedItem.utilityMethods.navigateChild('up');
                    },
                    gesture: {
                        key: Keys.Up
                    }
                },
                {
                    name: 'navigationLeft',
                    canExecute: function () {
                        return true;
                    },
                    execute: () => {
                        this.selectedItem.utilityMethods.navigateChild('right');
                    },
                    gesture: {
                        key: Keys.Left
                    }
                },
                {
                    name: 'navigationRight',
                    canExecute: function () {
                        return true;
                    },
                    execute: () => {
                        this.selectedItem.utilityMethods.navigateChild('left');
                    },
                    gesture: {
                        key: Keys.Right
                    }
                },
            ]
        };
        diagram.dataBind();
        this.selectedItem.diagram.select([this.selectedItem.diagram.nodes[0]]);
    }

    public selectionChange(arg: ISelectionChangeEventArgs): void {
        let diagram: Diagram = this.selectedItem.diagram;
        if (arg.state === 'Changing') {
            if (arg.type === "Addition") {
                if (arg.newValue[0] instanceof Node && (arg.newValue[0].addInfo as any)) {
                    for (var _i = 0, _a = diagram.selectedItems.userHandles; _i < _a.length; _i++) {
                        var handle_1 = _a[_i];
                        handle_1.visible = true;
                    }
                    if ((arg.newValue[0].addInfo as any).orientation === 'Left' ||
                        (arg.newValue[0].addInfo as any).orientation === 'subLeft') {
                        this.selectedItem.utilityMethods.hideUserHandle('leftHandle');
                        this.selectedItem.utilityMethods.changeUserHandlePosition('leftHandle');
                    }
                    else if ((arg.newValue[0].addInfo as any).orientation === 'Right' ||
                        (arg.newValue[0].addInfo as any).orientation === 'subRight') {
                        this.selectedItem.utilityMethods.hideUserHandle('rightHandle');
                        this.selectedItem.utilityMethods.changeUserHandlePosition('rightHandle');
                    }
                    else if ((arg.newValue[0].data as any).branch === 'Root') {
                        this.selectedItem.utilityMethods.hideUserHandle('devare');
                    }
                    this.selectedItem.utilityMethods.onClickDisable(false, arg.newValue[0]);
                }
                else {
                    this.selectedItem.utilityMethods.hideUserHandle('leftHandle');
                    this.selectedItem.utilityMethods.hideUserHandle('rightHandle');
                    this.selectedItem.utilityMethods.hideUserHandle('devare');
                    this.selectedItem.utilityMethods.onClickDisable(true);
                }
            } else {
                document.getElementById('mindMapContainer').style.display = '';
                document.getElementById('multipleChildPropertyContainer').style.display = 'none';
                document.getElementById('propertyHeader').innerText = "Properties";
                this.selectedItem.textAreaObj.value = "";
                this.selectedItem.utilityMethods.onClickDisable(true);
            }
        }
    }

    public historyChange(arg: IHistoryChangeArgs): void {
        let diagram: Diagram = this.selectedItem.diagram;
        diagram.historyManager.undoStack.length > 0 ? this.selectedItem.toolbarObj.items[0].disabled = false : this.selectedItem.toolbarObj.items[0].disabled = true
        diagram.historyManager.redoStack.length > 0 ? this.selectedItem.toolbarObj.items[1].disabled = false : this.selectedItem.toolbarObj.items[1].disabled = true
    };

    

    public keyDown(args: IKeyEventArgs) {
        let diagram: Diagram = this.selectedItem.diagram;
        if (args.key === "Enter" && args.keyModifiers === 0 && (diagram.diagramActions & DiagramAction.TextEdit)) {
            diagram.endEdit();
        }
    }
    public textEdit(args: ITextEditEventArgs) {
        setTimeout(() => {
            if (args.annotation) {
                var tempData = this.selectedItem.workingData.filter((a: any) => a.id === (args.element as any).data.id);
                tempData[0].Label = args.annotation.content;
            }
        }, 0);
    }

    public scrollChange(args: IScrollChangeEventArgs) {
        var zoomCurrentValue: any = document.getElementById("btnZoomIncrement");
        if (zoomCurrentValue && (zoomCurrentValue as any).ej2_instances) {
      
            zoomCurrentValue = (document.getElementById("btnZoomIncrement") as any).ej2_instances[0];
            zoomCurrentValue.content = Math.round(this.selectedItem.diagram.scrollSettings.currentZoom * 100) + ' %';
        }
    }



}

