/**
 * Selector Handler
 */
import {
    Diagram, NodeModel, Node, NodeConstraints,
    ConnectorModel, Connector, Segments, DecoratorShapes, ConnectorConstraints, TextStyleModel
} from '@syncfusion/ej2-diagrams';
import { Input, Injectable, Component } from '@angular/core';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { UtilityMethods } from './utilitymethods';
import { Toolbar, TreeView } from '@syncfusion/ej2-angular-navigations';
import { TextBoxComponent } from '@syncfusion/ej2-angular-inputs';
import { DropDownButtonComponent } from '@syncfusion/ej2-angular-splitbuttons';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { ButtonComponent } from '@syncfusion/ej2-angular-buttons';


@Injectable()
export class SelectorViewModel {

    public diagram: Diagram;
    public toolbarObj: Toolbar;
    public treeObj: TreeView;
    public textAreaObj: TextBoxComponent;
    public btnWindowMenu: DropDownButtonComponent;
    public btnZoomIncrement: DropDownButtonComponent;
    public exportDialog: DialogComponent;
    public printDialog: DialogComponent;
    public btnHideToolbar: ButtonComponent;
    public isCopyLayoutElement: boolean = false;
    public index: number = 1;
    public mindMapPatternTarget: any;
    public childHeight: number = 20;
    public connectorType: string = 'Bezier';
    public templateType: string = "template1";
    public levelType: string = "Level0";
    public stroke: string;

    public fill: string;

    public strokeWidth: number;

    public strokeStyle: string;

    public shapeOpacity: number;

    public fontColor: string;

    public fontSize: number;

    public fontFamily: string;

    public nodeShape: string;

    public textOpacity: number;

    public isExpanded: boolean = false;

    public isToolbarClicked: boolean = false;

    public bounds: any;

    public exportSettings: ExportSettings = new ExportSettings();
    public printSettings: PrintSettings = new PrintSettings();
    public pageSettings: PageSettings = new PageSettings();


    public workingData: any = [
        { id: '1', Label: 'Creativity', branch: 'Root', hasChild: true, level: 0, fill: "#D0ECFF", strokeColor: "#80BFEA", orientation: 'Root' },
    ]


    public randomIdGenerator() {
        return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
    }

    public getAbsolutePath() {
        return window.location.pathname;
    }

    public utilityMethods: UtilityMethods = new UtilityMethods(this);

    constructor() {
        // this.nodeProperties.propertyChange = this.nodePropertyChange.bind(this);
        // this.connectorProperties.propertyChange = this.connectorPropertyChange.bind(this);
        // this.textProperties.propertyChange = this.textPropertyChange.bind(this);
        // this.mindmapSettings.propertyChange = this.mindMapPropertyChange.bind(this);
    }


}

@Component({
    template: ''
  })
export class ExportSettings {
    private m_fileName: string = 'Diagram';
    public get fileName(): string {
        return this.m_fileName;
    }

    @Input()
    public set fileName(fileName: string) {
        this.m_fileName = fileName;
    }

    private m_format: string = 'JPG';
    public get format(): string {
        return this.m_format;
    }

    @Input()
    public set format(format: string) {
        this.m_format = format;
    }

    private m_region: string = 'PageSettings';
    public get region(): string {
        return this.m_region;
    }

    @Input()
    public set region(region: string) {
        this.m_region = region;
    }
}
@Component({
    template: ''
  })
export class PrintSettings {
    private m_region: string = 'PageSettings';
    public get region(): string {
        return this.m_region;
    }

    @Input()
    public set region(region: string) {
        this.m_region = region;
    }

    private m_pageWidth: number = 100;
    public get pageWidth(): number {
        return this.m_pageWidth;
    }

    @Input()
    public set pageWidth(pageWidth: number) {
        this.m_pageWidth = pageWidth;
    }

    private m_pageHeight: number = 100;
    public get pageHeight(): number {
        return this.m_pageHeight;
    }

    @Input()
    public set pageHeight(pageHeight: number) {
        this.m_pageHeight = pageHeight;
    }

    private m_isPortrait: boolean = true;
    public get isPortrait(): boolean {
        return this.m_isPortrait;
    }

    @Input()
    public set isPortrait(isPortrait: boolean) {
        this.m_isPortrait = isPortrait;
    }

    private m_isLandscape: boolean = false;
    public get isLandscape(): boolean {
        return this.m_isLandscape;
    }

    @Input()
    public set isLandscape(isLandscape: boolean) {
        this.m_isLandscape = isLandscape;
    }

    private m_multiplePage: boolean = false;
    public get multiplePage(): boolean {
        return this.m_multiplePage;
    }

    @Input()
    public set multiplePage(multiplePage: boolean) {
        this.m_multiplePage = multiplePage;
    }

    private m_paperSize: string = 'Letter';
    public get paperSize(): string {
        return this.m_paperSize;
    }

    @Input()
    public set paperSize(paperSize: string) {
        this.m_paperSize = paperSize;
        document.getElementById('printCustomSize').style.display = 'none';
        document.getElementById('printOrientation').style.display = 'none';
        if (paperSize === 'Custom') {
            document.getElementById('printCustomSize').style.display = '';
        } else {
            document.getElementById('printOrientation').style.display = '';
        }
    }

}

export class PageSettings {
    public pageWidth: number = 1056;
    public pageHeight: number = 816;
    public showPageBreaks: boolean;
    public backgroundColor: string = '#ffffff';
    public isPortrait: boolean = false;
    public isLandscape: boolean = true;
    public paperSize: string = 'Letter';
    public pageBreaks: boolean = false;
}