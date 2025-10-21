import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NbSpinnerModule, NbLayoutModule, NbIconModule, NbSidebarModule, NbButtonModule, NbSidebarService } from "@nebular/theme";
import { HeaderComponent } from "../common/header/header.component";
import { SidebarMenuComponent } from "../common/sidebar-menu/sidebar-menu.component";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  time: string;
  read: boolean;
}

@Component({
  selector: 'app-pages',
  templateUrl: './pages.html',
  standalone: true,
  styleUrl: './pages.scss',
  imports: [
    CommonModule,
    RouterOutlet,
    NbSpinnerModule,
    NbLayoutModule,
    NbIconModule,
    NbSidebarModule,
    NbButtonModule,
    HeaderComponent,
    SidebarMenuComponent
  ]
})
export class Pages {
  sidebarState: 'expanded' | 'collapsed' = 'expanded';
  notificationSidebarState: 'expanded' | 'collapsed' = 'collapsed';

  // Mock notifications data
  notifications: Notification[] = [
    {
      id: '1',
      title: 'Nuovo segnale BTC',
      message: 'Strategia RSI ha generato un segnale di acquisto per Bitcoin',
      type: 'success',
      time: '2 min fa',
      read: false
    },
    {
      id: '2',
      title: 'Stop Loss attivato',
      message: 'Position EURUSD chiusa automaticamente',
      type: 'warning',
      time: '15 min fa',
      read: false
    },
    {
      id: '3',
      title: 'AI Model completato',
      message: 'Training del modello di sentiment analysis terminato',
      type: 'info',
      time: '1 ora fa',
      read: true
    }
  ];

  constructor(private sidebarService: NbSidebarService) {}

  onSidebarToggle(): void {
    this.sidebarService.toggle(false, 'menu-sidebar');
    this.sidebarState = this.sidebarState === 'expanded' ? 'collapsed' : 'expanded';
  }

  onNotificationsToggle(): void {
    this.sidebarService.toggle(false, 'notification-sidebar');
    this.notificationSidebarState = this.notificationSidebarState === 'expanded' ? 'collapsed' : 'expanded';
  }

  closeNotifications(): void {
    this.sidebarService.collapse('notification-sidebar');
    this.notificationSidebarState = 'collapsed';
  }

  markAsRead(notification: Notification): void {
    notification.read = true;
  }

  getNotificationIcon(type: string): string {
    const icons = {
      info: 'info-outline',
      success: 'checkmark-circle-outline',
      warning: 'alert-triangle-outline',
      error: 'close-circle-outline'
    };
    return icons[type as keyof typeof icons] || 'bell-outline';
  }
}
