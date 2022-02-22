import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mandantlist',
  templateUrl: './mandantlist.component.html',
  styleUrls: ['./mandantlist.component.css']
})
export class MandantlistComponent implements OnInit {
  mandantList : string[] = [
    '0', 
    '100022',
    '100031',
    '100120',
    '100200',
    '100203',
    '100360',
    '100370',
    '100470',
    '100700',
    '100801',
    '100805',
    'bpy',
    'cs',
    'raiffeisen',
    'ubsag'
  ];
  selectedMandant = this.mandantList[2]


  constructor() { }

  ngOnInit(): void {
  }

  onMandantChanged() : void{
    console.log('mandant changed');
    console.log(this.selectedMandant);
  }

}
