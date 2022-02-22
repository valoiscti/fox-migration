import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rolelist',
  templateUrl: './rolelist.component.html',
  styleUrls: ['./rolelist.component.css']
})
export class RolelistComponent implements OnInit {
  roleList : string[] = [
    '01', 
    '02', 
    '03', 
    '04', 
    '06', 
    '07', 
    '08', 
    '09', 
    '10', 
    '11', 
    '12', 
  ];

  selectedRole = this.roleList[0];

  constructor() { }

  ngOnInit(): void {
  }

  onRoleChanged() : void{
    console.log('role changed');
    console.log(this.selectedRole);
  }

}
