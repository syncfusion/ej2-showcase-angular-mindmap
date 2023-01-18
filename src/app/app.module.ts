import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import the DiagramMOdule for the Diagram component
import { DiagramAllModule } from '@syncfusion/ej2-angular-diagrams';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContextMenuModule, ToolbarModule, TreeViewAllModule } from '@syncfusion/ej2-angular-navigations';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { DropDownButtonModule } from '@syncfusion/ej2-angular-splitbuttons';
import { DropDownListModule, MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { ButtonModule, RadioButtonModule, CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { NumericTextBoxModule, SliderModule, UploaderModule, ColorPickerModule, TextBoxModule } from '@syncfusion/ej2-angular-inputs';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DiagramAllModule,
    ToolbarModule,
    DialogModule,
    DropDownButtonModule,
    DropDownListModule,
    RadioButtonModule,
    CheckBoxModule,
    ColorPickerModule,
    NumericTextBoxModule,
    SliderModule,
    ToolbarModule,
    ButtonModule,
    UploaderModule,
    TextBoxModule,
    TreeViewAllModule,
    ContextMenuModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
