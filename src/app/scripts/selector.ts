/**
 * Selector Handler
 */
import {
    Diagram, NodeModel, Node, NodeConstraints,
    ConnectorModel, Connector, Segments, DecoratorShapes, ConnectorConstraints, TextStyleModel,
    TextStyle
} from '@syncfusion/ej2-diagrams';
import { Input, Injectable, Component } from '@angular/core';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { UtilityMethods } from './utilitymethods';
import { Toolbar, TreeView } from '@syncfusion/ej2-angular-navigations';
import { TextBoxComponent } from '@syncfusion/ej2-angular-inputs';
import { DropDownButtonComponent } from '@syncfusion/ej2-angular-splitbuttons';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { ButtonComponent } from '@syncfusion/ej2-angular-buttons';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';


@Injectable()
export class SelectorViewModel {
    public selectedDiagram: Diagram;
    public diagram: Diagram;
    public toolbarObj: Toolbar;
    public treeObj: TreeView;
    public textAreaObj: TextBoxComponent;
    public btnWindowMenu: DropDownButtonComponent;
    public btnZoomIncrement: DropDownButtonComponent;
    public exportDialog: DialogComponent;
    public btnHideToolbar: ButtonComponent;
    public mindmapShape: DropDownListComponent;
    public isCopyLayoutElement: boolean = false;
    public preventPropertyChange: boolean = false;
    public isModified: boolean = false;
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

    public mindmapSettings: MindMapSettings = new MindMapSettings();
    public workingData: any = [
        { id: '1', Label: 'Root', branch: 'Root', hasChild: true, level: 0, fill: "#D0ECFF", strokeColor: "#80BFEA", orientation: 'Root' },
    ]
    textProperties: any;


    public randomIdGenerator() {
        return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
    }

    public getAbsolutePath() {
        return window.location.pathname;
    }

    public utilityMethods: UtilityMethods = new UtilityMethods(this);

    constructor() {

    }
    public getColor(colorName: string): string {
        if ((window.navigator as any).msSaveBlob && colorName.length === 9) {
            return colorName.substring(0, 7);
        }
        return colorName;
    }

}
@Injectable()
export class MindMapSettings {
    private m_levelType: string = 'Level0';
    public get levelType(): string {
        return this.m_levelType;
    }

    @Input()
    public set levelType(levelType: string) {
        if (this.m_levelType !== levelType) {
            this.m_levelType = levelType;
            this.triggerPropertyChange('levelType', levelType);
        }
    }

    private m_fill: string = 'white';
    public get fill(): string {
        return this.m_fill;
    }

    @Input()
    public set fill(fill: string) {
        if (this.m_fill !== fill) {
            this.m_fill = fill;
            this.triggerPropertyChange('fill', fill);
        }
    }

    private m_stroke: string = 'white';
    public get stroke(): string {
        return this.m_stroke;
    }

    @Input()
    public set stroke(stroke: string) {
        if (this.m_stroke !== stroke) {
            this.m_stroke = stroke;
            this.triggerPropertyChange('stroke', stroke);
        }
    }

    private m_strokeStyle: string = 'None';
    public get strokeStyle(): string {
        return this.m_strokeStyle;
    }

    @Input()
    public set strokeStyle(strokeStyle: string) {
        if (this.m_strokeStyle !== strokeStyle) {
            this.m_strokeStyle = strokeStyle;
            this.triggerPropertyChange('strokeStyle', strokeStyle);
        }
    }

    private m_strokeWidth: number = 1;
    public get strokeWidth(): number {
        return this.m_strokeWidth;
    }

    @Input()
    public set strokeWidth(strokeWidth: number) {
        if (this.m_strokeWidth !== strokeWidth) {
            this.m_strokeWidth = strokeWidth;
            this.triggerPropertyChange('strokeWidth', strokeWidth);
        }
    }

    private m_opacity: number;
    public get opacity(): number {
        return this.m_opacity;
    }

    @Input()
    public set opacity(opacity: number) {
        if (this.m_opacity !== opacity) {
            this.m_opacity = opacity;
            this.triggerPropertyChange('opacity', opacity);
        }
    }
    public opacityText: string;


    private m_fontFamily: string = 'Arial';
    public get fontFamily(): string {
        return this.m_fontFamily;
    }

    @Input()
    public set fontFamily(fontFamily: string) {
        if (this.m_fontFamily !== fontFamily) {
            this.m_fontFamily = fontFamily;
            this.triggerPropertyChange('fontFamily', fontFamily);
        }
    }

    private m_fontSize: number;
    public get fontSize(): number {
        return this.m_fontSize;
    }

    @Input()
    public set fontSize(fontSize: number) {
        if (this.m_fontSize !== fontSize) {
            this.m_fontSize = fontSize;
            this.triggerPropertyChange('fontSize', fontSize);
        }
    }

    private m_fontColor: string = '#ffffff';
    public get fontColor(): string {
        return this.m_fontColor;
    }

    @Input()
    public set fontColor(fontColor: string) {
        if (this.m_fontColor !== fontColor) {
            this.m_fontColor = fontColor;
            this.triggerPropertyChange('fontColor', fontColor);
        }
    }

    private m_textOpacity: number;
    public get textOpacity(): number {
        return this.m_textOpacity;
    }

    @Input()
    public set textOpacity(textOpacity: number) {
        if (this.m_textOpacity !== textOpacity) {
            this.m_textOpacity = textOpacity;
            this.triggerPropertyChange('textOpacity', textOpacity);
        }
    }

    public textOpacityText: string;

    public propertyChange: Function;

    public triggerPropertyChange(propertyName: string, propertyValue: Object): void {
        if (!isNullOrUndefined(this.propertyChange)) {
            this.propertyChange.call(this, { propertyName: propertyName, propertyValue: propertyValue });
        }
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

    private m_region: string = 'Content';
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
       
    }

}

export class PageSettings {
    public pageWidth: number = 1100;
    public pageHeight: number = 800;
    public showPageBreaks: boolean;
    public backgroundColor: string = '#ffffff';
    public isPortrait: boolean = false;
    public isLandscape: boolean = true;
    public paperSize: string = 'Letter';
    public pageBreaks: boolean = false;
}