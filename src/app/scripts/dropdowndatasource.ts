import { ItemModel } from '@syncfusion/ej2-splitbuttons';
import { MenuItemModel } from '@syncfusion/ej2-navigations';

export class DropDownDataSources {

    public fileMenuItems: ItemModel[] = this.getFileMenuItems();
    public editMenuItems: ItemModel[] = this.getEditMenuItems();
    public viewMenuItems: ItemModel[] = this.getViewMenuItems();

    public windowMenuItems: ItemModel[] = this.getWindowMenuItems();


    public getFileMenuItems(): ItemModel[] {
        let menuItems: ItemModel[] = [
            { text: 'New' , iconCss: 'sf-icon-new'}, { text: 'Open', iconCss: 'sf-icon-open' }, { separator: true },
            { text: 'Save', iconCss: 'sf-icon-save' },
            // { text: 'Rename' }, { separator: true },
            { text: 'Export', iconCss: 'sf-icon-export' }, { separator: true },
            { text: 'Print', iconCss: 'sf-icon-print' }
        ];
        return menuItems;
    }

    public getEditMenuItems(): ItemModel[] {
        let menuItems: ItemModel[] = [
            { text: 'Undo', iconCss: 'sf-icon-undo' }, { text: 'Redo', iconCss: 'sf-icon-redo' }, { separator: true },
            { text: 'Cut', iconCss: 'sf-icon-cut' }, { text: 'Copy', iconCss: 'sf-icon-copy' },
            { text: 'Paste', iconCss: 'sf-icon-paste' }, { text: 'Delete', iconCss: 'sf-icon-delete' }, { separator: true },
            { text: 'Select All' },
        ];
        return menuItems;
    }

    public getViewMenuItems(): ItemModel[] {
        let menuItems: ItemModel[] = [
            { text: 'Zoom In', iconCss: 'sf-icon-zoom-in' }, { text: 'Zoom Out', iconCss: 'sf-icon-zoom-out' }, { separator: true },
            { text: 'Fit To Screen' }, { separator: true },
            { text: 'Show Rulers', iconCss: 'sf-icon-check-tick' },
            { text: 'Show Lines' },
        ];
        return menuItems;
    }

    public getWindowMenuItems(): ItemModel[] {
        let menuItems: ItemModel[] = [
            { text: 'Show Toolbar', iconCss: 'sf-icon-check-tick' },
            { text: 'Show Properties', iconCss: 'sf-icon-check-tick' },
            { text: 'Show Shortcuts', iconCss: 'sf-icon-check-tick' },
        ];
        return menuItems;
    }


    public fileFormats: { [key: string]: Object }[] = [
        { text: 'JPG', value: 'JPG' }, { text: 'PNG', value: 'PNG' },
        { text: 'BMP', value: 'BMP' }, { text: 'SVG', value: 'SVG' }
    ];

    public diagramRegions: { [key: string]: Object }[] = [
        { text: 'Content', value: 'Content' }, { text: 'PageSettings', value: 'PageSettings' }
    ];

    public borderStyles: { [key: string]: Object }[] = [
        { text: 'None', value: 'None', className: 'ddl-svg-style ddl_linestyle_none' },
        { text: '1,2', value: '1,2', className: 'ddl-svg-style ddl_linestyle_one_two' },
        { text: '3,3', value: '3,3', className: 'ddl-svg-style ddl_linestyle_three_three' },
        { text: '5,3', value: '5,3', className: 'ddl-svg-style ddl_linestyle_five_three' },
        { text: '4,4,1', value: '4,4,1', className: 'ddl-svg-style ddl_linestyle_four_four_one' }
    ];

    public fontFamilyList: { [key: string]: Object }[] = [
        { text: 'Arial', value: 'Arial' },
        { text: 'Aharoni', value: 'Aharoni' },
        { text: 'Bell MT', value: 'Bell MT' },
        { text: 'Fantasy', value: 'Fantasy' },
        { text: 'Times New Roman', value: 'Times New Roman' },
        { text: 'Segoe UI', value: 'Segoe UI' },
        { text: 'Verdana', value: 'Verdana' },
    ];



    public mindmapLevelDatasource: { [key: string]: Object }[] = [
        { text: 'Root', value: 'Level0' }, { text: 'Level1', value: 'Level1' },
        { text: 'Level2', value: 'Level2' }, { text: 'Level3', value: 'Level3' },
        { text: 'Level4', value: 'Level4' }, { text: 'Level5', value: 'Level5' },
        { text: 'Selected Item', value: 'Selected Item' },
    ];

    public mindmapShapeDatasource: { [key: string]: Object }[] = [
        { text: 'Rectangle', value: 'Rectangle' }, { text: 'Ellipse', value: 'Ellipse' },
        { text: 'Star', value: 'Star' }, { text: 'Cloud', value: 'Cloud' },
        { text: 'Free hand', value: 'Free hand' }, { text: 'Line', value: 'Line' }
    ];

    public zoomMenuItems: { [key: string]: Object }[] = [
        { text: 'Zoom In' }, { text: 'Zoom Out' }, { text: 'Zoom to Fit' }, { text: 'Zoom to 50%' },
        { text: 'Zoom to 100%' }, { text: 'Zoom to 200%' }
    ];

    public toolbarItems: { [key: string]: Object }[] = [
        { prefixIcon: 'sf-icon-undo', tooltipText: 'Undo', disabled: false },
        { prefixIcon: 'sf-icon-redo', tooltipText: 'Redo', disabled: true },
        {
            type: 'Separator'
        },
        { prefixIcon: 'sf-icon-pointer tb-icons', tooltipText: 'Select Tool', cssClass: 'tb-item-middle tb-item-selected' },
        { prefixIcon: 'sf-icon-Pan tb-icons', tooltipText: 'Pan Tool', cssClass: 'tb-item-start' },
        {
            type: 'Separator'
        },
        {
            prefixIcon: 'sf-icon-add-child', tooltipText: 'Add Child', disabled: true
        },
        {
            prefixIcon: 'sf-icon-add-sibling', tooltipText: 'Add Sibling', disabled: true
        },
        {
            prefixIcon: 'sf-icon-multiple-child', tooltipText: 'Add Multiple Child', disabled: true
        },
        {
            tooltipText: 'Diagram View', template: "<input id='diagramView' type='radio' >", align: "Right"
        },

        {
            tooltipText: 'Text View', template: "<input id='textView' type='radio' style='margin-left:2px'>", align: "Right"
        },
        {
            type: 'Separator', align: "Right"
        },
        {
            cssClass: 'tb-item-end tb-zoom-dropdown-btn', template: '<button id="btnZoomIncrement"></button>', align: "Right"
        },
        {
            type: 'Separator', align: "Right"
        },
    ];


}