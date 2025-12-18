
import {
    IKeyEventArgs, ISelectionChangeEventArgs, Diagram, Node, Keys,
    KeyModifiers, IHistoryChangeArgs, ITextEditEventArgs, IScrollChangeEventArgs, DiagramAction,IExpandStateChangeEventArgs,
    Connector,
    ConnectorModel,
    NodeModel,
    TextStyleModel
} from '@syncfusion/ej2-diagrams';
import { ClickEventArgs as ToolbarClickEventArgs, MenuEventArgs } from '@syncfusion/ej2-navigations';
import { SelectorViewModel } from './selector';

export class DiagramClientSideEvents {
    private selectedItem: SelectorViewModel;
    constructor(selectedItem: SelectorViewModel) {
        this.selectedItem = selectedItem;
    }

    public created() {
        let diagram: Diagram = this.selectedItem.diagram;
        this.maintainExpandState(diagram);
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
                                this.selectedItem.utilityMethods.addNode('Right');
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
                                this.selectedItem.utilityMethods.addNode('Left');
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
                        diagram.fitToPage();
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
                        this.selectedItem.utilityMethods.download(diagram.saveDiagram(),(document.getElementById('diagramName') as HTMLInputElement).innerHTML);
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
                        this.selectedItem.utilityMethods.navigateChild('top');
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
        diagram.nodes.forEach((node : any) => {
            if((node.data as any).branch === 'Root') {
                node.shape.shape = 'Ellipse'
            }
        })
        diagram.dataBind();
    }
    public singleSelectionSettings(selectedObject:Object): void {
        let object: NodeModel | ConnectorModel = null;
        if ((selectedObject as Connector).type === undefined) {
            object = selectedObject as NodeModel;
            this.selectedItem.utilityMethods.bindMindMapProperties(object, this.selectedItem);
            if (object.addInfo && (object.addInfo as { [key: string]: Object }).level !== undefined) {
                this.selectedItem.mindmapSettings.levelType = 'Level' + (object.addInfo as { [key: string]: Object }).level;
            }
        }
    }

    public selectionChange(arg: ISelectionChangeEventArgs): void {
        let diagram: Diagram = this.selectedItem.diagram;
        var selectedItems = diagram.selectedItems.nodes;
            if (selectedItems.length === 1) {
                this.singleSelectionSettings(selectedItems[0] as Object[]);
            }
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

    public keyDown(args: IKeyEventArgs) {
        let diagram: Diagram = this.selectedItem.diagram;
        if (args.key === "Enter" && args.keyModifiers === 0 && (diagram.diagramActions & DiagramAction.TextEdit)) {
            diagram.endEdit();
        }
    }
    public textEdit(args: ITextEditEventArgs) {
        setTimeout(() => {
            if (args.annotation && args.element) {
                var tempData = this.selectedItem.workingData.filter((a: any) => a.id === (args.element as any).data.id);
                tempData[0].Label = args.annotation.content;
                (args.element as any).data.Label = args.annotation.content;
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

    public maintainExpandState(diagram : Diagram) {
        var nodes = diagram.nodes;
        var collapsedParents = new Set();
        let workingData = this.selectedItem.workingData;

        // Function to find the highest parent that is collapsed
        function getHighestCollapsedParent(nodeId : string) {
            let currentNode = workingData.find((item : any) => item.id === nodeId);

            // Traverse up the hierarchy
            while (currentNode && currentNode.parentId) {
                const parent = workingData.find((item : any) => item.id === currentNode.parentId);

                if (parent && parent.isExpanded === false) {
                    currentNode = parent;
                } else {
                    break;
                }
            }
            return currentNode;
        }

        // Step 1: Collect all highest-level collapsed parents
        workingData.forEach((item : any) => {
            if (item.isExpanded === false) {
                const highestParent = getHighestCollapsedParent(item.id);

                // Store only the highest-level parent
                if (highestParent && !collapsedParents.has(highestParent.id)) {
                    collapsedParents.add(highestParent.id);
                }
            }
        });

        // Step 2: Update nodes in the diagram based on the highest collapsed parents
        nodes.forEach(node => {
            if (collapsedParents.has((node.data as any).id)) {
                node.isExpanded = false;
                diagram.dataBind();
            }
        });
    }

    public expandStateChange(args: IExpandStateChangeEventArgs) {
        let node = args.element;
        if (node && node.isExpanded !== undefined) {
            const targetData = this.selectedItem.workingData.find((data: any) => data.id === (node.data as any).id);
            if (targetData) {
                targetData.isExpanded = node.isExpanded;
            }
            // If the node is collapsed, recursively collapse all child nodes
            if (!node.isExpanded && targetData) {
                this.collapseChildNodes(targetData.id);
            }
        }
    }

    collapseChildNodes(parentId: string) {
        // Find all child nodes of the given parentId
        const childNodes = this.selectedItem.workingData.filter((data: any) => data.parentId === parentId);
        childNodes.forEach((child: any) => {
            // Set isExpanded to false for each child node
            child.isExpanded = false;
            // Recursively collapse their children as well
            this.collapseChildNodes(child.id);
        });
    }

    public historyChange(arg: IHistoryChangeArgs): void {
        let diagram: Diagram = this.selectedItem.diagram;
        diagram.historyManager.undoStack.length > 0 ? this.selectedItem.toolbarObj.items[0].disabled = false : this.selectedItem.toolbarObj.items[0].disabled = true
        diagram.historyManager.redoStack.length > 0 ? this.selectedItem.toolbarObj.items[1].disabled = false : this.selectedItem.toolbarObj.items[1].disabled = true
    };

}
export class MindMapPropertyBinding {
    private selectedItem: SelectorViewModel;
    constructor(selectedItem: SelectorViewModel) {
        this.selectedItem = selectedItem;
    }
    public mindmapTextStyleChange(args: ToolbarClickEventArgs): void {
        this.updateMindMapTextStyle(args.item.tooltipText.toLowerCase(), false);
    }
    public updateMindMapTextStyle(propertyName: string, propertyValue: Object): void {
        let diagram: Diagram = this.selectedItem.diagram;
        let targetData : any;
        if (diagram.nodes.length > 0) {
            for (let i: number = 0; i < diagram.nodes.length; i++) {
                let node: Node = diagram.nodes[i] as Node;
                targetData = this.selectedItem.workingData.find((data: any) => data.id === (node.data as any).id);
                if (node.addInfo && node.annotations.length > 0) {
                    let annotation: TextStyleModel = node.annotations[0].style;
                    let addInfo: { [key: string]: Object } = node.addInfo as { [key: string]: Object };
                    let levelType: string = this.selectedItem.mindmapSettings.levelType;
                    if ('Level' + addInfo.level === levelType || addInfo.level === levelType) {
                        switch (propertyName) {
                            case 'bold':
                                annotation.bold = !annotation.bold;
                                (node.data as any).bold = annotation.bold;
                                this.updateToolbarState('mindmapTextStyleToolbar', annotation.bold, 0);
                                break;
                            case 'italic':
                                annotation.italic = !annotation.italic;
                                (node.data as any).italic = annotation.italic;
                                this.updateToolbarState('mindmapTextStyleToolbar', annotation.italic, 1);
                                break;
                            case 'underline':
                                annotation.textDecoration = annotation.textDecoration === 'None' || !annotation.textDecoration ? 'Underline' : 'None';
                                (node.data as any).textDecoration = annotation.textDecoration;

                                this.updateToolbarState('mindmapTextStyleToolbar', annotation.textDecoration, 2);
                                break;
                        }
                    }
                }
                if(targetData) {
                    targetData.bold = node.annotations[0].style.bold;
                    targetData.italic = node.annotations[0].style.italic;
                    targetData.textDecoration = node.annotations[0].style.textDecoration;
                }
                diagram.dataBind();
                this.selectedItem.isModified = true;
            }
        }
    }
    updateToolbarState(toolbarName: string, isSelected: any, index: number) {
        var toolbarTextStyle = (document.getElementById(toolbarName) as any)
        if (toolbarTextStyle) {
            toolbarTextStyle = toolbarTextStyle.ej2_instances[0];
        }
        if (toolbarTextStyle) {
            let cssClass = toolbarTextStyle.items[index].cssClass;
            if (isSelected === "None") {
                isSelected = false;
            }
            if (isSelected) {
                if (!cssClass.includes('tb-item-selected')) {
                    toolbarTextStyle.items[index].cssClass = cssClass + ' tb-item-selected';
                }
            }
            else {
                toolbarTextStyle.items[index].cssClass = cssClass.replace(' tb-item-selected', '');
            }
            toolbarTextStyle.dataBind();
        }
    }

}