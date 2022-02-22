import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  menuCategories : string [] = [
    'Administration',
    'Authorization',
    'Bank Master',
    'Card Renewals',
    'Cards',
    'Chargeback',
    'Fraud',
    'Home',
    'KE Manager',
    'Merchant',
    'Order Mgmt',
    'System Admin',
    'Terminal',
    'Transactions',
    'TWINT',
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
