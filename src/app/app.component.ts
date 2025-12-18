import { AfterViewInit, Component, ViewChild, ViewEncapsulation, ChangeDetectionStrategy  } from '@angular/core';
import { DiagramComponent, MindMapService } from '@syncfusion/ej2-angular-diagrams';
import { BasicShapeModel, ConnectorConstraints, ConnectorModel, DataBinding, Diagram, DiagramRegions, DiagramTools, FileFormats, HierarchicalTree, MindMap, MouseEventArgs, Node, NodeConstraints, NodeModel, PointPort, PointPortModel, PortVisibility, RulerSettingsModel, ScrollSettingsModel, SelectorConstraints, SelectorModel, SnapConstraints, SnapSettingsModel, ToolBase, UserHandleModel } from '@syncfusion/ej2-diagrams';
import { DropDownDataSources } from './scripts/dropdowndatasource';
import { DataManager } from '@syncfusion/ej2-data';
import { SelectorViewModel } from './scripts/selector';
import {  DiagramClientSideEvents, MindMapPropertyBinding } from './scripts/events';
import { PaperSize, UtilityMethods } from './scripts/utilitymethods';
import { ButtonComponent, ChangeArgs, RadioButtonComponent, CheckBoxComponent } from '@syncfusion/ej2-angular-buttons';
import { ChangeEventArgs as DropDownChangeEventArgs, DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { PropertyChange } from './scripts/properties';
import { ChangeEventArgs as NumericChangeEventArgs, ColorPickerEventArgs, SliderChangeEventArgs, TextBoxComponent } from '@syncfusion/ej2-angular-inputs';
import { ChangeEventArgs as CheckBoxChangeEventArgs, ChangeArgs as ButtonChangeArgs } from '@syncfusion/ej2-buttons';
import { DropDownButtonComponent, MenuEventArgs } from '@syncfusion/ej2-angular-splitbuttons';
import { BeforeOpenCloseMenuEventArgs, ClickEventArgs, ContextMenuComponent, NodeEditEventArgs, NodeKeyPressEventArgs, ToolbarComponent, TreeViewComponent } from '@syncfusion/ej2-angular-navigations';
import { closest } from '@syncfusion/ej2-base';
import { AnimationSettingsModel, DialogComponent } from '@syncfusion/ej2-angular-popups';
Diagram.Inject(DataBinding, MindMap, HierarchicalTree);

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {

  @ViewChild('diagram')
  public diagram: DiagramComponent;

  @ViewChild('exportDialog')
  public exportDialog: DialogComponent;


  @ViewChild('radio1')
  public bezierRadioButton: RadioButtonComponent;

  @ViewChild('radio2')
  public straightRadioButton: RadioButtonComponent;

  @ViewChild('diagramradio')
  public diagramRadioButton: RadioButtonComponent;

  @ViewChild('treeviewradio')
  public textRadioButton: RadioButtonComponent;

  @ViewChild('horiZontalRadioBtn')
  public horiZontalRadioBtn: RadioButtonComponent;

  @ViewChild('verticalRadioBtn')
  public verticalRadioBtn: RadioButtonComponent;

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

  @ViewChild('mindmapTextStyleToolbar')
  public mindmapTextStyleToolbar: ToolbarComponent;

  @ViewChild('btnHideToolbar')
  public btnHideToolbar: ButtonComponent;

  @ViewChild('mindmapShape')
  public mindmapShape: DropDownListComponent;

  @ViewChild('expandable')
  public expandable: CheckBoxComponent;

  public diagramradioChecked: boolean = true;

  public textradioChecked: boolean = false;


  /* Global Member Variables */
  public dropDownDataSources: DropDownDataSources = new DropDownDataSources();
  public selectedItem: SelectorViewModel = new SelectorViewModel();
  public diagramEvents: DiagramClientSideEvents = new DiagramClientSideEvents(this.selectedItem);
  public mindmapPropertyBinding: MindMapPropertyBinding = new MindMapPropertyBinding(this.selectedItem);
  public utilityMethods: UtilityMethods = new UtilityMethods(this.selectedItem);
  public PropertyChange: PropertyChange = new PropertyChange(this.selectedItem);
  public printingButtons: Object[] = this.getDialogButtons('print');
  public exportingButtons: Object[] = this.getDialogButtons('export');
  public dialogVisibility: boolean = false;
  public dialogAnimationSettings: AnimationSettingsModel = { effect: 'None' };
  public dlgTarget: HTMLElement = document.body;

  ngAfterViewInit() {
    this.selectedItem.diagram = this.diagram;
    this.selectedItem.toolbarObj = this.toolbarEditor;
    this.selectedItem.textAreaObj = this.textAreaObj;
    this.selectedItem.btnWindowMenu = this.btnWindowMenu;
    this.selectedItem.btnZoomIncrement = this.btnZoomIncrement;
    this.selectedItem.treeObj = this.treeObj;
    this.selectedItem.exportDialog = this.exportDialog;

    this.selectedItem.btnHideToolbar = this.btnHideToolbar;
    this.selectedItem.mindmapShape = this.mindmapShape;

    document.getElementById('closeIconDiv').onclick = this.onHideNodeClick.bind(this);
    document.onmouseover = this.menumouseover.bind(this);
    let element: any = document.getElementsByClassName('e-control e-textbox e-lib');
    element[1].style.height = "365px";
  }

  // scrollsettings

  public scrollSettings: ScrollSettingsModel = { canAutoScroll: true, scrollLimit: 'Infinity'};

  // Datasource for the diagram and treeview

  public data = [
    { id: '1', Label: 'Root', branch: 'Root', hasChild: true, level: 0, fill: "#D0ECFF", strokeColor: "#80BFEA", orientation: 'Root' },
  ];

  public workingData = [
    { id: '1', Label: 'Root', branch: 'Root', hasChild: true, level: 0, fill: "#D0ECFF", strokeColor: "#80BFEA", orientation: 'Root' },
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

  public getDialogButtons(dialogType: string): Object[] {
    let buttons: Object[] = [];
    switch (dialogType) {
      case 'export':
        buttons.push({
          click: this.btnExportClick.bind(this), buttonModel: { content: 'Export', cssClass: 'e-flat e-db-primary', isPrimary: true }
        });
        break;
    }
    buttons.push({
      click: this.btnCancelClick.bind(this), buttonModel: { content: 'Cancel', cssClass: 'e-flat', isPrimary: true }
    });
    return buttons;
  }
  public diagramNameChange(args: any): void {
    (document.getElementById('diagramName') as any).innerHTML = (document.getElementById('diagramEditable') as HTMLInputElement).value;
    document.getElementsByClassName('db-diagram-name-container')[0].classList.remove('db-edit-name');
  }
  public diagramNameKeyDown(args: KeyboardEvent): void {
    if (args.which === 13) {
        (document.getElementById('diagramName') as any).innerHTML = (document.getElementById('diagramEditable') as HTMLInputElement).value;
        document.getElementsByClassName('db-diagram-name-container')[0].classList.remove('db-edit-name');
    }
  }
  public renameDiagram(args: MouseEvent): void {
    document.getElementsByClassName('db-diagram-name-container')[0].classList.add('db-edit-name');
    let element: HTMLInputElement = (document.getElementById('diagramEditable') as HTMLInputElement);
    element.value = (document.getElementById('diagramName') as any).innerHTML;
    element.focus();
  }
  private btnExportClick(): void {
    let diagram: Diagram = this.selectedItem.diagram;
    diagram.exportDiagram({
      fileName: (document.getElementById("exportfileName") as HTMLInputElement).value,
      format: this.selectedItem.exportSettings.format as FileFormats,
    });
    this.exportDialog.hide();
  };

  private btnCancelClick(args: MouseEvent): void {
    let ss: HTMLElement = args.target as HTMLElement;
    let key: string = ss.offsetParent.id;
    switch (key) {
      case 'exportDialog':
        this.exportDialog.hide();
        break;

    }
  };

  public zoomContent() {
    return Math.round(this.diagram.scrollSettings.currentZoom * 100) + ' %'
  }

  public diagramradioChange(args: any) {
    this.textRadioButton.checked = false;
    this.diagramradioChecked = true;
    this.textradioChecked = false;
    this.diagram.dataSourceSettings.dataSource = new DataManager(this.selectedItem.workingData);
    let conneectorType = this.diagram.connectors[0]?.type;
    this.diagram.dataBind();
    if(conneectorType) {this.updateConnectorType(conneectorType)};
    this.updateOrientation();
    this.diagram.nodes.forEach(node => {
      node.expandIcon.shape = this.expandable.checked ? 'Minus' : 'None';
      node.collapseIcon.shape = this.expandable.checked ? 'Plus' : 'None';
      this.selectedItem.workingData.forEach((data: any) => {
        if ((node.data as any).id === data.id) {
          node.shape.type = data.nodeShapeType;
          if (data.nodeShapeType === 'Basic') {
            (node.shape as any).shape = data.nodeShape;
            node.height = data.nodeHeight;
          }
          else {
            (node.shape as any).data = data.nodeShapeData;
            node.height = data.nodeHeight;
          }
          if(node.style.strokeWidth || node.style.strokeDashArray) {
            if ((node as Node).inEdges.length > 0) {
              var connector1 = this.selectedItem.utilityMethods.getConnector(this.diagram.connectors, (node as Node).inEdges[0]);
              if ((data as any).conStrokeColor) {
                connector1.style.strokeColor = (data as any).conStrokeColor;
              }
              if ((data as any).conStrokeWidth) {
                connector1.style.strokeWidth = (data as any).conStrokeWidth;
              }
              if ((data as any).conStrokeStyle) {
                connector1.style.strokeDashArray = (data as any).conStrokeStyle;
              }

            }
          }
          node.annotations[0].style.fontFamily = data.fontFamily ? data.fontFamily : node.annotations[0].style.fontFamily;
          node.annotations[0].style.fontSize = data.fontSize ? data.fontSize : node.annotations[0].style.fontSize;
          node.annotations[0].style.color = data.fontColor ? data.fontColor : node.annotations[0].style.color;
          node.annotations[0].style.opacity = data.textOpacity ? data.textOpacity : node.annotations[0].style.opacity;
          node.annotations[0].style.bold = data.bold ? data.bold : node.annotations[0].style.bold;
          node.annotations[0].style.italic = data.italic ? data.italic : node.annotations[0].style.italic;
          node.annotations[0].style.textDecoration = data.textDecoration ? data.textDecoration : node.annotations[0].style.textDecoration;
        }

      });

    });
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('treeview').style.display = 'none';
    if(this.btnWindowMenu.items[2].iconCss === 'sf-icon-check-tick'){
    document.getElementById('shortcutDiv').style.visibility = 'visible';
    }
    this.diagramEvents.maintainExpandState(this.diagram);
    this.diagram.doLayout();
    this.diagram.fitToPage();
    this.diagram.updateViewPort();
  }

  public treeviewradioChange(args: any) {
    this.diagramRadioButton.checked = false;
    this.diagramradioChecked = false;
    this.textradioChecked = true;
    this.diagram.clearSelection();
    this.selectedItem.treeObj.fields = {
      dataSource: this.selectedItem.workingData,
      id: 'id',
      text: 'Label',
      parentID: 'parentId',
      hasChildren: 'hasChild',
    };

    this.selectedItem.treeObj.refresh();
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('treeview').style.display = 'block';
    document.getElementById('shortcutDiv').style.visibility = 'hidden';
  }

  // Treeview intialization end

  // maps the appropriate column to fields property for Mindmaplevel dropdownlist
  public fields: Object = { text: 'text', value: 'value' };
  public dropdownListFields: Object = { text: 'text', value: 'value' };
  // set a value to Mindmaplevel dropdownlist prevalue
  public value: string = 'Level0';

  // set a value to Mindmapshape dropdownlist prevalue
  public shapeValue: string = 'Rectangle';

  // set a value to FontFamily dropdownlist prevalue
  public fontFamilyValue: string = 'Arial';

  public strokeStyleItemTemplate: string = '<div class="db-ddl-template-style"><span class="${className}"></span></div>';

  public strokeStyleTemplate: string = '<div class="db-ddl-template-style"><span class="${className}"></span></div>';

  public asyncSettings: Object = {
    saveUrl: 'https://services.syncfusion.com/angular/production/api/FileUploader/Save',
    removeUrl: 'https://services.syncfusion.com/angular/production/api/FileUploader/Remove'
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

  public tool: DiagramTools = DiagramTools.Default;

  public layout: Object = {
    type: 'MindMap', horizontalSpacing: 50, verticalSpacing: 50,
    getBranch: (node: NodeModel, nodes: NodeModel[]) => {
      if (node && node.addInfo) {
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
    if((obj.data as any).branch === 'Root') {
      obj.constraints = NodeConstraints.Default &~ NodeConstraints.Delete;
    }
    if (obj.id !== 'textNode' && (obj.data as any)) {
      obj.constraints = NodeConstraints.Default & ~NodeConstraints.Drag;
      let empInfo = (obj.data as any);
      obj.style = {
        fill: (obj.data as any).fill, strokeColor: (obj.data as any).strokeColor,
        strokeWidth: (obj.data as any).strokeWidth ? (obj.data as any).strokeWidth : 1,
        opacity: (obj.data as any).shapeOpacity, strokeDashArray: (obj.data as any).strokeStyle
      };
      if (empInfo.branch === 'Root') {
        obj.addInfo = { level: 0 };
        (obj.data as any).level = (obj.addInfo as any).level;
        (obj.data as any).orientation = empInfo.branch;
      }
      obj.addInfo = { level: (obj.data as any).level, orientation: (obj.data as any).orientation };
      if ((obj.data as any).orientation === "Left") {
        obj.expandIcon = { shape: this.selectedItem.isExpanded ? 'Minus' : 'None', height: 10, width: 10, fill: 'white', borderColor: 'black' };
        obj.collapseIcon = { shape: this.selectedItem.isExpanded ? 'Plus' : 'None', height: 10, width: 10, fill: 'white', borderColor: 'black'};
      } else if ((obj.data as any).orientation === "Root") {
        obj.expandIcon = { shape: this.selectedItem.isExpanded ? 'Minus' : 'None', height: 10, width: 10, fill: 'white', borderColor: 'black',};
        obj.collapseIcon = { shape: this.selectedItem.isExpanded ? 'Plus' : 'None', height: 10, width: 10, fill: 'white', borderColor: 'black',};
      } else {
        obj.expandIcon = { shape: this.selectedItem.isExpanded ? 'Minus' : 'None', height: 10, width: 10, fill: 'white', borderColor: 'black',};
        obj.collapseIcon = { shape: this.selectedItem.isExpanded ? 'Plus' : 'None', height: 10, width: 10, fill: 'white', borderColor: 'black',};
      }
      (obj.shape as BasicShapeModel).cornerRadius = empInfo.branch === 'Root' ? (obj.shape as any).shape === 'Ellipse' ? 5 : 0 : 0;
      if(obj.shape.type === 'Path' && (obj.data as any).nodeShapeData) {
          (obj.shape as any).data = (obj.data as any).nodeShapeData;
      }
      obj.width = empInfo.branch === 'Root' ? 150 : 100;
      obj.height = obj.data && (obj.data as any).nodeHeight ? (obj.data as any).nodeHeight : (empInfo.branch === 'Root' ? 75 : this.selectedItem.childHeight);
      obj.annotations = [{
        content: empInfo.Label,

      }];
      if (obj.data && (obj.data as any).annotation) {
        obj.annotations[0] = (obj.data as any).annotation;
      }
      if (obj.data && obj.annotations && obj.annotations.length > 0) {
        const data = obj.data;
        const annotation = obj.annotations[0];

        annotation.style = annotation.style || {};

        if ((data as any).fontFamily) {
          annotation.style.fontFamily = (data as any).fontFamily;
        }
        if ((data as any).fontSize) {
          annotation.style.fontSize = (data as any).fontSize;
        }
        if ((data as any).color) {
          annotation.style.color = (data as any).color;
        }
        if ((data as any).textOpacity !== undefined) {
          annotation.style.opacity = (data as any).textOpacity;
        }
        if ((data as any).bold !== undefined) {
          annotation.style.bold = (data as any).bold;
        }
        if ((data as any).italic !== undefined) {
          annotation.style.italic = (data as any).italic;
        }
        if ((data as any).textDecoration) {
          annotation.style.textDecoration = (data as any).textDecoration;
        }
      }
      let port = this.getPort();
      if (obj.ports && !obj.ports.length) {
        for (let i = 0; i < port.length; i++) {
          obj.ports.push(new PointPort(obj, 'ports', port[i], true));
        }
      }
      this.hideUserHandle('devare');
    }
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
      {
        id: 'topPort', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Hidden,
        style: { fill: 'black' }
      },
      {
        id: 'bottomPort', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Hidden,
        style: { fill: 'black' }
      }
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
      connector.style = { strokeWidth: (targetNode.data as any).conStrokeWidth ? (targetNode.data as any).conStrokeWidth : 1,
                strokeColor: (targetNode.data as any).conStrokeColor ? (targetNode.data as any).conStrokeColor : '#8E44AD' };
    }
    else if ((targetNode.data as any).branch === 'Left' || (targetNode.data as any).branch === 'subLeft') {
      connector.sourcePortID = sourceNode.ports[1].id;
      connector.targetPortID = targetNode.ports[0].id;
      connector.style = {  strokeWidth: (targetNode.data as any).conStrokeWidth ? (targetNode.data as any).conStrokeWidth : 1,
                strokeColor: (targetNode.data as any).conStrokeColor ? (targetNode.data as any).conStrokeColor :'#3498DB' };
    }
    connector.constraints = ConnectorConstraints.Default & ~ConnectorConstraints.Select;
    return connector;
  }

  public getCustomTool: Function = this.getTool.bind(this);
  //Tool for Userhandles.
  public getTool(action: string): ToolBase {
    let tool: ToolBase;
    if (action === 'leftHandle') {
      let leftTool: LeftExtendTool = new LeftExtendTool(this.diagram.commandHandler);
      leftTool.diagram = this.diagram;
      leftTool.selectedItem = this.selectedItem;
      return leftTool;
    } else if (action === 'rightHandle') {
      let rightTool: RightExtendTool = new RightExtendTool(this.diagram.commandHandler);
      rightTool.diagram = this.diagram;
      rightTool.selectedItem = this.selectedItem;
      return rightTool;
    } else if (action === 'devare') {
      let deleteTool: DeleteClick = new DeleteClick(this.diagram.commandHandler);
      deleteTool.diagram = this.diagram;
      deleteTool.selectedItem = this.selectedItem;
      return deleteTool;
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

  public updateConnectorType(connectorType: any): void {
    for (let i = 0; i < this.diagram.connectors.length; i++) {
      this.diagram.connectors[i].type = connectorType
    }
    this.diagram.dataBind();
  }

  public horiZontalRadioBtnChange(args: ChangeArgs): void {
    this.verticalRadioBtn.checked = false;
    this.verticalRadioBtn.dataBind();
    (this.diagram as any).layout.orientation = "Horizontal";
    this.updateOrientation();
    this.diagram.dataBind();
  }

  public verticalRadioBtnChange(args: ChangeArgs): void {
    this.horiZontalRadioBtn.checked = false;
    this.horiZontalRadioBtn.dataBind();
    (this.diagram as any).layout.orientation = "Vertical";
    this.updateOrientation();
    this.diagram.dataBind();
  }
  public updateOrientation(){
    for (var i = 0; i < this.diagram.connectors.length; i++) {
      var connector = this.diagram.connectors[i];
      if ((this.diagram as any).layout.orientation === "Vertical") {
        if (connector.sourcePortID === "rightPort" && connector.targetPortID === "leftPort") {
          connector.sourcePortID = 'bottomPort';
          connector.targetPortID = "topPort";
        }
        if (connector.sourcePortID === "leftPort" && connector.targetPortID === "rightPort") {
          connector.sourcePortID = 'topPort';
          connector.targetPortID = 'bottomPort';
        }
      } else if ((this.diagram as any).layout.orientation === "Horizontal") {
        if (connector.sourcePortID === "bottomPort" && connector.targetPortID === "topPort") {
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
        this.diagram.nodes[i].isExpanded=true;
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

  public levelBeforeOpen(args: any): void {
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

  public toolbarCreated() {
  }

  private buttonInstance: any;
  public menumouseover(args: any) {
    let target = args.target;
    if (target && (target.className === 'e-control e-dropdown-btn e-lib e-btn db-dropdown-menu' ||
      target.className === 'e-control e-dropdown-btn e-lib e-btn db-dropdown-menu e-ddb-active')) {
      if (this.buttonInstance && this.buttonInstance.id !== target.id) {
        if (this.buttonInstance.getPopUpElement() && this.buttonInstance.getPopUpElement().classList.contains('e-popup-open')) {
          this.buttonInstance.toggle();
          let buttonElement = document.getElementById(this.buttonInstance.element.id);
          buttonElement.classList.remove('e-btn-hover');
        }
      }
      let button1 = target.ej2_instances[0];
      this.buttonInstance = button1;
      if (button1.getPopUpElement() && button1.getPopUpElement().classList.contains('e-popup-close')) {
        button1.toggle();
        let buttonElement1 = document.getElementById(this.buttonInstance.element.id);
        buttonElement1.classList.add('e-btn-hover');
      }
    } else {
      if (closest(target, '.e-dropdown-popup') === null && closest(target, '.e-dropdown-btn') === null) {
        if (this.buttonInstance && this.buttonInstance.getPopUpElement() && this.buttonInstance.getPopUpElement().classList.contains('e-popup-open')) {
          this.buttonInstance.toggle();
          let buttonElement2 = document.getElementById(this.buttonInstance.element.id);
          buttonElement2.classList.remove('e-btn-hover');
        }
      }
    }
  }

  // Radio button events



  public onUploadSuccess(args:any) {
    var file1 = args.file;
    var file = file1.rawFile;
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = this.loadDiagram.bind(this);
    AppComponent.clearUploader();
    setTimeout(() => {
      let newDiagram = (document.getElementById('diagram') as any).ej2_instances[0];
      newDiagram.fitToPage({ mode: 'Page' });
      this.updateOrientation();
      this.selectedItem.workingData = [];
      if (newDiagram.dataSourceSettings.dataSource && newDiagram.dataSourceSettings.dataSource.dataSource.json && newDiagram.dataSourceSettings.dataSource.dataSource.json.length > 0) {
        for (let i = 0; i < newDiagram.dataSourceSettings.dataSource.dataSource.json.length; i++) {
          let treeData = newDiagram.dataSourceSettings.dataSource.dataSource.json[i];
          this.selectedItem.workingData.push(treeData);
        }
      }
    },2000);

  }


  public static  clearUploader(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
        fileInput.value = '';
    }}

  //Load the diagraming object.
  public loadDiagram(event:any) {
    let diagram = (document.getElementById('diagram') as any).ej2_instances[0];
    diagram.loadDiagram(event.target.result);
    diagram.nodes.forEach((node : NodeModel)=> {
        node.expandIcon.shape = this.expandable?.checked ? 'Minus' : 'None';
        node.collapseIcon.shape = this.expandable?.checked ? 'Plus' : 'None';
    });
    this.updateOrientation();
    diagram.fitToPage();
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
    if (item === 'Select Tool' || item === 'Pan Tool' || item === 'Add Child' || item === 'Add Sibling' || item === 'Add Multiple Child') {
      if (args.item.cssClass.indexOf('tb-item-selected') === -1) {
        this.selectedItem.utilityMethods.removeSelectedToolbarItem();
        args.item.cssClass += ' tb-item-selected';
      }
      diagram.dataBind();
    }
  };

  public textStyleClicked(args: ClickEventArgs) {
    this.PropertyChange.mindMapPropertyChange({ propertyName: args.item.tooltipText.toLowerCase(), propertyValue: false });
    if (args.item.cssClass.indexOf('tb-item-selected') === -1) {
      this.removeSelectedTextToolbarItem();
      args.item.cssClass += ' tb-item-selected';
    }
  }

  public removeSelectedTextToolbarItem() {
    let toolbarEditor = this.mindmapTextStyleToolbar;
    for (let i = 0; i < toolbarEditor.items.length; i++) {
      let item = toolbarEditor.items[i];
      if (item.cssClass.indexOf('tb-item-selected') !== -1) {
        item.cssClass = item.cssClass.replace(' tb-item-selected', '');
      }
    }
    toolbarEditor.dataBind();
  }
  public addMultichildFocus()
  {
    let textchildbox = (document.getElementById('multipleChildText') as any).ej2_instances[0];
    if (textchildbox.value !== null && textchildbox.value !== '') {
      (document.getElementById('addchild')as any).disabled = false;
    }
    else {
      (document.getElementById('addchild')as any).disabled = true;
    }
  }



}

class LeftExtendTool extends ToolBase {
  public diagram: Diagram = null;
  public selectedItem: SelectorViewModel = null;
  //mouseDown event
  public mouseDown(args: MouseEventArgs): void {
    super.mouseDown(args);
    this.inAction = true;
  }
  //mouseUp event
  public mouseUp(args: MouseEventArgs): void {
    if (this.inAction) {
      let selectedObject: any = this.commandHandler.getSelectedObject();
      if (selectedObject[0]) {
        if (selectedObject[0] instanceof Node) {
          this.selectedItem.utilityMethods.addNode('Right');
        }
      }
    }
  }
}

class RightExtendTool extends ToolBase {
  public diagram: Diagram = null;
  public selectedItem: SelectorViewModel = null;
  //mouseDown event
  public mouseDown(args: MouseEventArgs): void {
    super.mouseDown(args);
    this.inAction = true;
  }
  //mouseUp event
  public mouseUp(args: MouseEventArgs): void {
    if (this.inAction) {
      let selectedObject: any = this.commandHandler.getSelectedObject();
      if (selectedObject[0]) {
        if (selectedObject[0] instanceof Node) {
          this.selectedItem.utilityMethods.addNode('Left');
        }
      }
    }
  }
}

class DeleteClick extends ToolBase {
  public diagram: Diagram = null;
  public selectedItem: SelectorViewModel = null;
  //mouseDown event
  public mouseDown(args: MouseEventArgs): void {
    super.mouseDown(args);
    this.inAction = true;
  }
  //mouseup event
  public mouseUp(args: MouseEventArgs): void {
    if (this.inAction) {
      let selectedObject: any = this.commandHandler.getSelectedObject();
      if (selectedObject[0]) {
        if (selectedObject[0] instanceof Node) {
          let node: Node = selectedObject[0] as Node;
          this.selectedItem.utilityMethods.removeChild();
        }
        this.diagram.doLayout();
      }
    }
  }
}



