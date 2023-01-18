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
import { Toolbar } from '@syncfusion/ej2-angular-navigations';
import { TextBoxComponent } from '@syncfusion/ej2-angular-inputs';
import { DropDownButtonComponent } from '@syncfusion/ej2-angular-splitbuttons';


@Injectable()
export class SelectorViewModel {

    public diagram: Diagram;
    public toolbarObj: Toolbar;
    public textAreaObj: TextBoxComponent;
    public btnWindowMenu: DropDownButtonComponent;
    public btnZoomIncrement: DropDownButtonComponent;
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