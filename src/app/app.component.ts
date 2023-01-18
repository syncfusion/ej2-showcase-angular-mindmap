import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { DiagramComponent, MindMapService } from '@syncfusion/ej2-angular-diagrams';
import { BasicShapeModel, ConnectorConstraints, ConnectorModel, DataBinding, Diagram, DiagramTools, HierarchicalTree, MindMap, MouseEventArgs, Node, NodeConstraints, NodeModel, PointPort, PointPortModel, PortVisibility, RulerSettingsModel, SelectorConstraints, SelectorModel, SnapConstraints, SnapSettingsModel, ToolBase, UserHandleModel } from '@syncfusion/ej2-diagrams';
import { DropDownDataSources } from './scripts/dropdowndatasource';
import { DataManager } from '@syncfusion/ej2-data';
import { SelectorViewModel } from './scripts/selector';
import { DiagramClientSideEvents } from './scripts/events';
import { UtilityMethods } from './scripts/utilitymethods';
import { ChangeArgs, RadioButtonComponent } from '@syncfusion/ej2-angular-buttons';
import { ChangeEventArgs as DropDownChangeEventArgs, DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { PropertyChange } from './scripts/properties';
import { ChangeEventArgs as NumericChangeEventArgs, ColorPickerEventArgs, SliderChangeEventArgs, TextBoxComponent } from '@syncfusion/ej2-angular-inputs';
import { ChangeEventArgs as CheckBoxChangeEventArgs, ChangeArgs as ButtonChangeArgs } from '@syncfusion/ej2-buttons';
import { DropDownButtonComponent, MenuEventArgs } from '@syncfusion/ej2-angular-splitbuttons';
import { BeforeOpenCloseMenuEventArgs, ClickEventArgs, ContextMenuComponent, NodeEditEventArgs, NodeKeyPressEventArgs, ToolbarComponent, TreeViewComponent } from '@syncfusion/ej2-angular-navigations';
import { closest } from '@syncfusion/ej2-base';

Diagram.Inject(DataBinding, MindMap, HierarchicalTree);

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {

  @ViewChild('diagram')
  public diagram: DiagramComponent;

  @ViewChild('radio1')
  public bezierRadioButton: RadioButtonComponent;

  @ViewChild('radio2')
  public straightRadioButton: RadioButtonComponent;

  @ViewChild('diagramradio')
  public diagramRadioButton: RadioButtonComponent;

  @ViewChild('treeviewradio')
  public textRadioButton: RadioButtonComponent;

  @ViewChild('mindmapFontFamilyList')
  public mindmapFontFamilyList: DropDownListComponent;

  @ViewChild('btnWindowMenu')
  public btnWindowMenu: DropDownButtonComponent;

  @ViewChild('btnZoomIncrement')
  public btnZoomIncrement: DropDownButtonComponent;

  @ViewChild('toolbarEditor')
  public toolbarEditor: ToolbarComponent;

  @ViewChild('multipleChildText')
  public textAreaObj: TextBoxComponent;

  @ViewChild('tree')
  public treeObj: TreeViewComponent;

  @ViewChild('contentmenutree')
  public menuObj: ContextMenuComponent;


  /* Global Member Variables */
  public dropDownDataSources: DropDownDataSources = new DropDownDataSources();
  public selectedItem: SelectorViewModel = new SelectorViewModel();
  public diagramEvents: DiagramClientSideEvents = new DiagramClientSideEvents(this.selectedItem);
  public utilityMethods: UtilityMethods = new UtilityMethods(this.selectedItem);
  public PropertyChange: PropertyChange = new PropertyChange(this.selectedItem);

  ngAfterViewInit() {
    this.selectedItem.diagram = this.diagram;
    this.selectedItem.toolbarObj = this.toolbarEditor;
    this.selectedItem.textAreaObj = this.textAreaObj;
    this.selectedItem.btnWindowMenu = this.btnWindowMenu;
    this.selectedItem.btnZoomIncrement = this.btnZoomIncrement;
    document.getElementById('closeIconDiv').onclick = this.onHideNodeClick.bind(this);
    document.onmouseover = this.menumouseover.bind(this);
    let element: any = document.getElementsByClassName('e-control e-textbox e-lib');
    element[1].style.height = "365px";
  }

  // Datasource for the diagram and treeview

  public data = [
    { id: '1', Label: 'Creativity', branch: 'Root', hasChild: true, level: 0, fill: "#D0ECFF", strokeColor: "#80BFEA", orientation: 'Root' },
  ];

  public workingData = [
    { id: '1', Label: 'Creativity', branch: 'Root', hasChild: true, level: 0, fill: "#D0ECFF", strokeColor: "#80BFEA", orientation: 'Root' },
  ];

  // Maps the treeview datasource value to fields property

  // Treeview initialization start

  public field: Object = {
    dataSource: this.data,
    id: 'id',
    text: 'Label',
    parentID: 'parentId',
    hasChildren: 'hasChild',
  };

  public keyPress(args: NodeKeyPressEventArgs) {
    if (args.event.key === 'Enter') {
      this.addTreeNode();
    } else {
      setTimeout(() => {
        console.log(args);
      }, 0);
    }
  }

  public nodeEdited(args: NodeEditEventArgs) {
    let tempData = this.selectedItem.workingData.filter((a: any) => a.id === args.nodeData.id);
    tempData[0].Label = args.newText;
    this.treeObj.selectedNodes = [(args.nodeData.id).toString()];
  }

  public addTreeNode() {
    let targetNodeId = this.treeObj.selectedNodes[0];
    let tempData = this.selectedItem.workingData.filter((a: any) => a.id === targetNodeId);
    tempData[0].hasChild = true;
    let orientation = this.getTreeOrientation(tempData);
    let branch = orientation;
    let level = tempData[0].level + 1;
    let strokeColor = tempData[0].strokeColor;
    let fill = tempData[0].fill;
    let nodeId = 'tree_' + this.selectedItem.index;
    let item = {
      id: nodeId,
      Label: 'Node',
      parentId: targetNodeId,
      branch: branch,
      level: level,
      fill: fill,
      strokeColor: strokeColor,
      hasChild: false,
      orientation: branch
    };
    this.treeObj.addNodes([item], targetNodeId, null);
    this.selectedItem.index++;
    this.selectedItem.workingData.push(item);
    this.treeObj.beginEdit(nodeId);
  }

  public getTreeOrientation(tempData: any) {
    let leftChildCount = 0;
    let rightChildCount = 0;
    let orientation;
    if (tempData[0].branch === "Root") {
      for (let i = 0; i < this.selectedItem.workingData.length; i++) {
        if (this.selectedItem.workingData[i].level === 1) {
          if (this.selectedItem.workingData[i].orientation === "Left") {
            leftChildCount++;
          } else {
            rightChildCount++;
          }
        }
      }
      orientation = leftChildCount > rightChildCount ? "Right" : "Left";
    } else {
      orientation = tempData[0].branch;
    }
    return orientation;
  }

  public treemenuclick(args: MenuEventArgs) {
    var targetNodeId = this.treeObj.selectedNodes[0];
    if (args.item.text == "Add New Item") {
      this.addTreeNode();
    }
    else if (args.item.text == "Remove Item") {
      this.treeObj.removeNodes([targetNodeId]);
      for (var i = this.selectedItem.workingData.length - 1; i >= 0; i--) {
        if (this.selectedItem.workingData[i].id === targetNodeId) {
          this.selectedItem.workingData.splice(i, 1);
        }
      }
    }
    else if (args.item.text == "Rename Item") {
      this.treeObj.beginEdit(targetNodeId);
    }
  }

  public menuItems = [
    { text: 'Add New Item' },
    { text: 'Rename Item' },
    { text: 'Remove Item' }
  ];

  public beforeopen(args: BeforeOpenCloseMenuEventArgs) {
    var targetNodeId = this.treeObj.selectedNodes[0];
    var targetNode = document.querySelector('[data-uid="' + targetNodeId + '"]');
    if (targetNode.classList.contains('remove')) {
      this.menuObj.enableItems(['Remove Item'], false);
    }
    else {
      this.menuObj.enableItems(['Remove Item'], true);
    }
    if (targetNode.classList.contains('rename')) {
      this.menuObj.enableItems(['Rename Item'], false);
    }
    else {
      this.menuObj.enableItems(['Rename Item'], true);
    }
  }

  public diagramradioChange(args: any) {
    this.textRadioButton.checked = false;
    this.diagram.dataSourceSettings.dataSource = new DataManager(this.selectedItem.workingData);
    this.diagram.dataBind();
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('treeview').style.display = 'none';
    document.getElementById('shortcutDiv').style.visibility = 'visible';
    this.btnWindowMenu.items[2].iconCss = document.getElementById('shortcutDiv').style.visibility === "hidden" ? '' : 'sf-icon-check-tick';
    this.diagram.fitToPage();
  }

  public treeviewradioChange(args: any) {
    this.diagram.clearSelection();
    this.diagramRadioButton.checked = false;

    this.treeObj.fields = {
      dataSource: this.selectedItem.workingData,
      id: 'id',
      text: 'Label',
      parentID: 'parentId',
      hasChildren: 'hasChild',
    };
    if ((this.treeObj.fields.dataSource as any).length > 0) {
      // (this.treeObj.fields.dataSource as any) = new DataManager(this.selectedItem.workingData);
    }
    this.treeObj.dataBind();
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('treeview').style.display = 'block';
    document.getElementById('shortcutDiv').style.visibility = 'hidden';
  }

  // Treeview intialization end

  // maps the appropriate column to fields property for Mindmaplevel dropdownlist
  public fields: Object = { text: 'text', value: 'value' };

  // set a value to Mindmaplevel dropdownlist prevalue
  public value: string = 'Level0';

  // set a value to Mindmapshape dropdownlist prevalue
  public shapeValue: string = 'Rectangle';

  // set a value to FontFamily dropdownlist prevalue
  public fontFamilyValue: string = 'Arial';

  public strokeStyleItemTemplate: string = '<div class="db-ddl-template-style"><span class="${className}"></span></div>';

  public strokeStyleTemplate: string = '<div class="db-ddl-template-style"><span class="${className}"></span></div>';

  public asyncSettings: Object = {
    saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
    removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove'
  };

  // Diagram Initialization

  public handle: UserHandleModel[] = [
    {
      name: 'leftHandle', visible: true, backgroundColor: 'black', offset: 0.5, side: 'Left', pathColor: 'white',
      pathData: 'M11.924,6.202 L4.633,6.202 L4.633,9.266 L0,4.633 L4.632,0 L4.632,3.551 L11.923,3.551 L11.923,6.202Z',
      margin: { top: 10, bottom: 0, left: 0, right: 10 }, horizontalAlignment: 'Left', verticalAlignment: 'Top'
    },
    {
      name: 'devare', side: 'Top', horizontalAlignment: 'Center', verticalAlignment: 'Center',
      pathData:
        'M 7.04 22.13 L 92.95 22.13 L 92.95 88.8 C 92.95 91.92 91.55 94.58 88.76' +
        '96.74 C 85.97 98.91 82.55 100 78.52 100 L 21.48 100 C 17.45 100 14.03 98.91 11.24 96.74 C 8.45 94.58 7.04' +
        '91.92 7.04 88.8 z M 32.22 0 L 67.78 0 L 75.17 5.47 L 100 5.47 L 100 16.67 L 0 16.67 L 0 5.47 L 24.83 5.47 z',
      margin: { top: 0, bottom: 0, left: 0, right: 0 }, offset: 0.5, pathColor: 'white'
    },
    {
      name: 'rightHandle', offset: 0.5, horizontalAlignment: 'Right', verticalAlignment: 'Top', pathColor: 'white',
      pathData: 'M0,3.063 L7.292,3.063 L7.292,0 L11.924,4.633 L7.292,9.266 L7.292,5.714 L0.001,5.714 L0.001,3.063Z',
      side: 'Right', backgroundColor: 'black', margin: { top: 10, bottom: 0, left: 10, right: 0 }
    }
  ];

  public snapSettings: SnapSettingsModel = { constraints: SnapConstraints.None };

  public tool: DiagramTools = DiagramTools.SingleSelect;

  public layout: Object = {
    type: 'MindMap', horizontalSpacing: 50, verticalSpacing: 50,
    getBranch: (node: NodeModel, nodes: NodeModel[]) => {
      if (node.addInfo) {
        let addInfo: any = node.addInfo;
        return addInfo.orientation.toString();
      }
      return 'Left';
    }
  };

  public selectedItems: SelectorModel = {
    constraints: SelectorConstraints.UserHandle, userHandles: this.handle
  }

  public items: DataManager = new DataManager(this.data);

  public dataSourceSettings: Object = {
    id: 'id',
    parentId: 'parentId',
    dataSource: this.items,
    root: String(1),
  };

  public rulerSettings: RulerSettingsModel = {
    showRulers: true, dynamicGrid: true, horizontalRuler: {
      interval: 10,
      segmentWidth: 100,
      thickness: 25,
    },
    verticalRuler: {
      interval: 10,
      segmentWidth: 100,
      thickness: 25,
    },
  };

  public isExpanded: boolean = false;

  public getNodeDefaults(obj: NodeModel) {
    if (obj.id !== 'textNode' && (obj.data as any)) {
      obj.constraints = NodeConstraints.Default & ~NodeConstraints.Drag;
      let empInfo = (obj.data as any);
      obj.style = {
        fill: (obj.data as any).fill, strokeColor: (obj.data as any).strokeColor,
        strokeWidth: 1
      };
      if (empInfo.branch === 'Root') {
        obj.addInfo = { level: 0 };
        (obj.data as any).level = (obj.addInfo as any).level;
        (obj.data as any).orientation = empInfo.branch;
      }
      obj.addInfo = { level: (obj.data as any).level, orientation: (obj.data as any).orientation };
      if ((obj.data as any).orientation === "Left") {
        obj.expandIcon = { shape: this.selectedItem.isExpanded ? 'Minus' : 'None', height: 10, width: 10, fill: 'white', borderColor: 'black', offset: { x: 1, y: 0.5 } };
        obj.collapseIcon = { shape: this.selectedItem.isExpanded ? 'Plus' : 'None', height: 10, width: 10, fill: 'white', borderColor: 'black', offset: { x: 1, y: 0.5 } };
      } else if ((obj.data as any).orientation === "Root") {
        obj.expandIcon = { shape: this.selectedItem.isExpanded ? 'Minus' : 'None', height: 10, width: 10, fill: 'white', borderColor: 'black', offset: { x: 0.5, y: 1 } };
        obj.collapseIcon = { shape: this.selectedItem.isExpanded ? 'Plus' : 'None', height: 10, width: 10, fill: 'white', borderColor: 'black', offset: { x: 0.5, y: 1 } };
      } else {
        obj.expandIcon = { shape: this.selectedItem.isExpanded ? 'Minus' : 'None', height: 10, width: 10, fill: 'white', borderColor: 'black', offset: { x: 0, y: 0.5 } };
        obj.collapseIcon = { shape: this.selectedItem.isExpanded ? 'Plus' : 'None', height: 10, width: 10, fill: 'white', borderColor: 'black', offset: { x: 0, y: 0.5 } };
      }
      (obj.shape as BasicShapeModel).cornerRadius = empInfo.branch === 'Root' ? 5 : 0;
      obj.shape = empInfo.branch === 'Root' ? { type: 'Basic', shape: 'Ellipse' } : { type: 'Basic', shape: 'Rectangle' };
      obj.width = empInfo.branch === 'Root' ? 150 : 100;
      obj.height = empInfo.branch === 'Root' ? 75 : this.selectedItem.childHeight;
      obj.annotations = [{
        content: empInfo.Label,

      }];
      let port = this.getPort();
      if (obj.ports && !obj.ports.length) {
        for (let i = 0; i < port.length; i++) {
          obj.ports.push(new PointPort(obj, 'ports', port[i], true));
        }
      }
      this.hideUserHandle('devare');
    }
    setTimeout(() => {
      if (this.selectedItem.mindMapPatternTarget) {
        this.utilityMethods.mindmapPatternChange(this.selectedItem.mindMapPatternTarget);
      }
    }, 0);
  }

  public getPort() {
    let port: PointPortModel[] =
      [{
        id: 'leftPort', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Hidden,
        style: { fill: 'black' }
      },
      {
        id: 'rightPort', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Hidden,
        style: { fill: 'black' }
      },
      ];
    return port;
  }

  public hideUserHandle(name: string) {
    let diagram = this.diagram;
    for (let handle of diagram.selectedItems.userHandles) {
      if (handle.name === name) {
        handle.visible = false;
      }
    }
  }

  public getConnectorDefaults(connector: ConnectorModel) {
    let diagram = this.diagram;
    // Need to set connectorType variable in connector.type
    connector.type = (this.selectedItem.connectorType as any);
    connector.targetDecorator = { shape: 'None' };
    let sourceNode: NodeModel = diagram.getObject(connector.sourceID);
    let targetNode: NodeModel = diagram.getObject(connector.targetID);
    if ((targetNode.data as any).branch === 'Right' || (targetNode.data as any).branch === 'subRight') {
      connector.sourcePortID = sourceNode.ports[0].id;
      connector.targetPortID = targetNode.ports[1].id;
      connector.style = { strokeWidth: 1, strokeColor: '#8E44AD' };
    }
    else if ((targetNode.data as any).branch === 'Left' || (targetNode.data as any).branch === 'subLeft') {
      connector.sourcePortID = sourceNode.ports[1].id;
      connector.targetPortID = targetNode.ports[0].id;
      connector.style = { strokeWidth: 1, strokeColor: '#3498DB' };
    }
    connector.constraints &= ConnectorConstraints.Select;
    return connector;
  }

  public getCustomTool: Function = this.getTool.bind(this);
  //Tool for Userhandles.
  public getTool(action: string): ToolBase {
    let tool: ToolBase;
    if (action === 'leftHandle') {
      this.utilityMethods.addNode('Right');
    } else if (action === 'rightHandle') {
      this.utilityMethods.addNode('Left');
    } else if (action === 'devare') {
      this.utilityMethods.removeChild();
    }
    return tool;
  }

  // Events
  public onHideNodeClick() {
    let node1 = document.getElementById('shortcutDiv');
    node1.style.visibility = node1.style.visibility === "hidden" ? node1.style.visibility = "visible" : node1.style.visibility = "hidden";
    this.btnWindowMenu.items[2].iconCss = node1.style.visibility === "hidden" ? '' : 'sf-icon-check-tick';
    this.diagram.dataBind();
  }

  public hideToolbarClick() {
    var expandcollapseicon = document.getElementById('btnHideToolbar');
    this.utilityMethods.hideElements('hide-properties', this.diagram);
    this.btnWindowMenu.items[1].iconCss = this.btnWindowMenu.items[1].iconCss ? '' : 'sf-icon-check-tick';
  }

  public zoomCreated() {
    this.btnZoomIncrement.content = (100) + ' %';
    this.btnZoomIncrement.dataBind();
  }

  public onZoomChange(args: MenuEventArgs) {
    let currentZoom = this.diagram.scrollSettings.currentZoom;
    let zoom: any = {};
    switch (args.item.text) {
      case 'Zoom In':
        this.diagram.zoomTo({ type: 'ZoomIn', zoomFactor: 0.2 });
        this.btnZoomIncrement.content = (this.diagram.scrollSettings.currentZoom * 100).toFixed() + '%';
        break;
      case 'Zoom Out':
        this.diagram.zoomTo({ type: 'ZoomOut', zoomFactor: 0.2 });
        this.btnZoomIncrement.content = (this.diagram.scrollSettings.currentZoom * 100).toFixed() + '%';
        break;
      case 'Zoom to Fit':
        this.diagram.fitToPage({ mode: 'Page', region: 'Content' });
        this.btnZoomIncrement.content = (this.diagram.scrollSettings.currentZoom).toString();
        break;
      case 'Zoom to 50%':
        zoom.zoomFactor = (0.5 / currentZoom) - 1;
        this.diagram.zoomTo(zoom);
        break;
      case 'Zoom to 100%':
        zoom.zoomFactor = (1 / currentZoom) - 1;
        this.diagram.zoomTo(zoom);
        break;
      case 'Zoom to 200%':
        zoom.zoomFactor = (2 / currentZoom) - 1;
        this.diagram.zoomTo(zoom);
        break;
    }

    this.btnZoomIncrement.content = Math.round(this.diagram.scrollSettings.currentZoom * 100) + ' %';

  }

  // Radio button events
  public bezierRadioChange(args: ChangeArgs): void {
    this.straightRadioButton.checked = false;
    this.straightRadioButton.dataBind();
    this.selectedItem.connectorType = "Bezier";
    for (let i = 0; i < this.diagram.connectors.length; i++) {
      this.diagram.connectors[i].type = "Bezier";
    }
    this.diagram.dataBind();
  }

  public straightRadioChange(args: ChangeArgs): void {
    this.bezierRadioButton.checked = false;
    this.bezierRadioButton.dataBind();
    this.selectedItem.connectorType = "Straight";
    for (let i = 0; i < this.diagram.connectors.length; i++) {
      this.diagram.connectors[i].type = "Straight";
    }
    this.diagram.dataBind();
  }

  // Dropdownlist events
  public mindmapShapeChange(args: DropDownChangeEventArgs) {
    this.selectedItem.nodeShape = args.value as string;
    this.PropertyChange.mindMapPropertyChange({ propertyName: 'shape', propertyValue: args });
  }

  public mindmapFontFamilyChange(args: DropDownChangeEventArgs) {
    this.selectedItem.fontFamily = args.value as string;
    this.PropertyChange.mindMapPropertyChange({ propertyName: 'fontFamily', propertyValue: args });
  }

  public mindmapLevelChange(args: DropDownChangeEventArgs) {
    this.selectedItem.isToolbarClicked = false;
    this.selectedItem.levelType = args.value as string;
  }

  public mindmapStrokeChange(args: DropDownChangeEventArgs) {
    this.selectedItem.strokeStyle = args.value as string;
    this.PropertyChange.mindMapPropertyChange({ propertyName: 'strokeStyle', propertyValue: args });
  }

  public mindmapStrokeWidthChange(args: NumericChangeEventArgs) {
    this.selectedItem.strokeWidth = args.value as number;
    this.PropertyChange.mindMapPropertyChange({ propertyName: 'strokeWidth', propertyValue: args });
  }

  public mindmapFontSizeChange(args: NumericChangeEventArgs) {
    this.selectedItem.fontSize = args.value as number;
    this.PropertyChange.mindMapPropertyChange({ propertyName: 'fontSize', propertyValue: args });
  }

  public horizontalSpacingChange(args: NumericChangeEventArgs) {
    this.diagram.layout.horizontalSpacing = Number(args.value);
    this.diagram.dataBind();
  }

  public verticalSpacingChange(args: NumericChangeEventArgs) {
    this.diagram.layout.verticalSpacing = Number(args.value);
    this.diagram.dataBind();
  }

  public expandChange(args: CheckBoxChangeEventArgs) {
    this.selectedItem.isExpanded = args.checked;
    for (let i = 0; i < this.diagram.nodes.length; i++) {
      if ((this.diagram.nodes[i] as any).outEdges.length > 0) {
        this.diagram.nodes[i].expandIcon.shape = args.checked ? "Minus" : "None";
        this.diagram.nodes[i].collapseIcon.shape = args.checked ? "Plus" : "None";
      }
    }
  }

  public mindmapOpacitySliderChange(args: SliderChangeEventArgs) {
    this.selectedItem.shapeOpacity = args.value as number;
    this.PropertyChange.mindMapPropertyChange({ propertyName: 'opacity', propertyValue: args });
  }

  public mindmapTextOpacityChange(args: SliderChangeEventArgs) {
    this.selectedItem.textOpacity = args.value as number;
    this.PropertyChange.mindMapPropertyChange({ propertyName: 'textOpacity', propertyValue: args });
  }

  // Dropdownbutton events

  public menuClick(args: MenuEventArgs): void {
    this.utilityMethods.menuClick(args);
  }

  public beforeItemRender(args: MenuEventArgs): void {
    let shortCutText = this.utilityMethods.getShortCutKey(args.item.text);
    if (shortCutText) {
      let shortCutSpan = document.createElement('span');
      let text = args.item.text;
      shortCutSpan.textContent = shortCutText;
      shortCutSpan.style.pointerEvents = 'none';
      args.element.appendChild(shortCutSpan);
      if (args.item.text.length === 3) {
        shortCutSpan.setAttribute('class', 'db-shortcutthree');
      } else if (args.item.text.length === 4) {
        shortCutSpan.setAttribute('class', 'db-shortcutfour');
      } else if (args.item.text.length === 5) {
        shortCutSpan.setAttribute('class', 'db-shortcutfive');
      } else if (args.item.text.length === 6) {
        shortCutSpan.setAttribute('class', 'db-shortcutsix');
      } else {
        shortCutSpan.setAttribute('class', 'db-shortcut');
      }
    }
    let status = this.utilityMethods.enableMenuItems(args.item.text);
    if (status) {
      args.element.classList.add('e-disabled');
    } else {
      if (args.element.classList.contains('e-disabled')) {
        args.element.classList.remove('e-disabled');
      }
    }
  }

  public beforeOpen(args: BeforeOpenCloseMenuEventArgs) {
    for (let i = 0; i < args.element.children.length; i++) {
      (args.element.children[i] as any).style.display = 'block';
    }
    //(args.element.children[0]).style.display = 'block';
    if (args.event && closest(args.event.target as any, '.e-dropdown-btn') !== null) {
      args.cancel = true;
    }
  }

  public beforeClose(args: BeforeOpenCloseMenuEventArgs) {
    if (args.event && closest(args.event.target as any, '.e-dropdown-btn') !== null) {
      args.cancel = true;
    }
    if (!args.element) {
      args.cancel = true;
    }
  }

  private buttonInstance: any;
  public menumouseover(args: any) {
    let target = args.target;
    if (target && (target.className === 'e-control e-dropdown-btn e-lib e-btn db-dropdown-menu' ||
      target.className === 'e-control e-dropdown-btn e-lib e-btn db-dropdown-menu e-ddb-active')) {
      if (this.buttonInstance && this.buttonInstance.id !== target.id) {
        if (this.buttonInstance.getPopUpElement().classList.contains('e-popup-open')) {
          this.buttonInstance.toggle();
          let buttonElement = document.getElementById(this.buttonInstance.element.id);
          buttonElement.classList.remove('e-btn-hover');
        }
      }
      let button1 = target.ej2_instances[0];
      this.buttonInstance = button1;
      if (button1.getPopUpElement().classList.contains('e-popup-close')) {
        button1.toggle();
        let buttonElement1 = document.getElementById(this.buttonInstance.element.id);
        buttonElement1.classList.add('e-btn-hover');
      }
    } else {
      if (closest(target, '.e-dropdown-popup') === null && closest(target, '.e-dropdown-btn') === null) {
        if (this.buttonInstance && this.buttonInstance.getPopUpElement().classList.contains('e-popup-open')) {
          this.buttonInstance.toggle();
          let buttonElement2 = document.getElementById(this.buttonInstance.element.id);
          buttonElement2.classList.remove('e-btn-hover');
        }
      }
    }
  }

  // Radio button events



  public onUploadSuccess(args: any) {
    let file1: { [key: string]: Object } = args.file as { [key: string]: Object };
    let file: Blob = file1.rawFile as Blob;
    let reader: FileReader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = this.loadDiagram.bind(this);
  }

  public loadDiagram() {
    //this.diagram.loadDiagram(event.target.result);
  }

  // Property panel events

  public cancelChild() {
    this.PropertyChange.cancelChild();
  }

  public addChildOnClick() {
    this.PropertyChange.addChildOnClick();
  }

  public fillColorChange(args: ColorPickerEventArgs) {
    this.selectedItem.fill = args.currentValue.hex;
    this.PropertyChange.mindMapPropertyChange({ propertyName: 'fill', propertyValue: args });
  }

  public strokeColorChange(args: ColorPickerEventArgs) {
    this.selectedItem.stroke = args.currentValue.hex;
    this.PropertyChange.mindMapPropertyChange({ propertyName: 'stroke', propertyValue: args });
  }

  public fontColorChange(args: ColorPickerEventArgs) {
    this.selectedItem.fontColor = args.currentValue.hex;
    this.PropertyChange.mindMapPropertyChange({ propertyName: 'fontColor', propertyValue: args });
  }

  public toolbarClick(args: ClickEventArgs) {
    let diagram: Diagram = this.diagram;
    let item = args.item.tooltipText;
    let zoomCurrentValue = this.btnZoomIncrement;
    switch (item) {
      case 'Undo':
        diagram.undo();
        break;
      case 'Redo':
        diagram.redo();
        break;
      case 'Zoom In(Ctrl + +)':
        diagram.zoomTo({ type: 'ZoomIn', zoomFactor: 0.2 });
        zoomCurrentValue.content = (diagram.scrollSettings.currentZoom * 100).toFixed() + '%';
        break;
      case 'Zoom Out(Ctrl + -)':
        diagram.zoomTo({ type: 'ZoomOut', zoomFactor: 0.2 });
        zoomCurrentValue.content = (diagram.scrollSettings.currentZoom * 100).toFixed() + '%';
        break;
      case 'Select Tool':
        diagram.tool = DiagramTools.Default;
        break;
      case 'Pan Tool':
        diagram.tool = DiagramTools.ZoomPan;
        break;
      case 'Add Child':
        let orientation = this.selectedItem.utilityMethods.getOrientation();
        this.selectedItem.utilityMethods.addNode(orientation);
        break;
      case 'Add Sibling':
        this.selectedItem.utilityMethods.addSibilingChild();
        break;
      case 'Add Multiple Child':
        this.selectedItem.utilityMethods.addMultipleChild();
        break;
    }
    if (item === 'Undo' || item === 'Redo' || item === 'Select Tool' || item === 'Pan Tool' || item === 'Add Child' || item === 'Add Sibling' || item === 'Add Multiple Child') {
      if (args.item.cssClass.indexOf('tb-item-selected') === -1) {
        this.selectedItem.utilityMethods.removeSelectedToolbarItem();
        args.item.cssClass += ' tb-item-selected';
      }
      diagram.dataBind();
    }
  };

  public textStyleClicked(args: ClickEventArgs) {
    this.PropertyChange.mindMapPropertyChange({ propertyName: args.item.tooltipText.toLowerCase(), propertyValue: false });
  }




}


