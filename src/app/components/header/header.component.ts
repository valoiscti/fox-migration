import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  unsaved: boolean = false;
  pageLoadTime: string = '';

  currentDate : string = '';
  userId: string = '';
  mandantId: string = '';
  role: string = '';
  foxinstance: string = '';
  foxversion: string = '';

  constructor() { }

  ngOnInit(): void {
    this.updatePageLoadTime();
    this.initializeHeader();
  }

  updatePageLoadTime() {
    var currentDate = new Date();

    var dayOfMonth = this.getValueWithPrefix(currentDate.getDate());
    var month = this.getValueWithPrefix(currentDate.getMonth()+1);
    var year = this.getValueWithPrefix(currentDate.getFullYear());

    var hours = this.getValueWithPrefix(currentDate.getHours());
    var minutes = this.getValueWithPrefix(currentDate.getMinutes());
    var seconds = this.getValueWithPrefix(currentDate.getSeconds());

    var dateToDisplay = dayOfMonth + '.' + month + '.' + year + ' '
    + hours + ':' + minutes + ':' + seconds;

    this.pageLoadTime = dateToDisplay;
  }

  initializeHeader(){
    const now = new Date();
    this.currentDate = now.toDateString();
    this.userId = 'TKTIW';
    this.mandantId = 'SPS'
    this.role = '01';
    this.foxinstance = 'DEV';
    this.foxversion = '89';
  }

  // confirmNavigate(object) {
  //   if (!this.unsaved || confirm("<dbI18n:text>CONFIRM_UNSAVED_NAVIGATE</dbI18n:text>")) {
  //   cocoon.forms.submitForm(object, object.id);
  //   }
  //   return false;
  // }

  getValueWithPrefix(value: number) {
    var strValue = '' + value;
    if (strValue.length < 2) {
      return '0' + strValue;
    } else {
      return strValue;
    }
  }

}
