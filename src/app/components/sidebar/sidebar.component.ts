import { Component, Input } from '@angular/core';
import Swal from 'sweetalert2';
import { LoginService } from '../../shared/service/LoginService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}
  @Input() withOverflow: boolean = false;
  @Input() menuItems: {
[x: string]: any; label: string; route: string
}[] = [];
  isOpen: boolean = false; 

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  logoutUser() {
    Swal.fire({
      icon: 'success',
      title: 'Logout realizado com sucesso',
      showConfirmButton: false,
      timer: 2000
    }).then(() => {
      this.router.navigate(['/']); 
      this.loginService.logout();
    });
  }
}
