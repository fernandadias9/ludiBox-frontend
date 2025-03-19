import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() withOverflow: boolean = false;
  @Input() menuItems: { label: string; route: string }[] = [];
  isOpen: boolean = false; 

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }
}
