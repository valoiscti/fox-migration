import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { BodyComponent } from './components/body/body.component';
import { MandantlistComponent } from './components/header/mandantlist/mandantlist.component';
import { FormsModule } from '@angular/forms';
import { RolelistComponent } from './components/header/rolelist/rolelist.component';
import { MenuComponent } from './components/header/menu/menu.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BodyComponent,
    MandantlistComponent,
    RolelistComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
