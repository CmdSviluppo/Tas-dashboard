import { Component, Input, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NbMenuModule, NbIconModule, NbMenuItem, NbMenuService } from '@nebular/theme';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserStoreService } from '../../utils/service/user-store.service';

@Component({
  selector: 'app-sidebar-menu',
  imports: [CommonModule, NbMenuModule, NbIconModule],
  standalone: true,
  templateUrl: './sidebar-menu.component.html',
  styleUrl: './sidebar-menu.component.scss',
})
export class SidebarMenuComponent implements OnInit, OnDestroy {
  @Input() collapsed = false;
  menuItems!: NbMenuItem[];
  selectedItem!: string;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private menuService: NbMenuService,
    private userStoreService: UserStoreService
  ) {
    this.buildMenu();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.buildMenu();

    this.menuService
      .onItemClick()
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ item }) => {
        this.selectedItem = item.title;
      });
  }

  public buildMenu() {
    this.menuItems = [
      {
        title: 'Dashboard',
        icon: 'home-outline',
        expanded: true,
        children: [
          {
            title: 'Home',
            link: '/pages/dashboard/home',
            icon: 'grid-outline',
          },
          {
            title: 'Panoramica segnali',
            link: '/pages/dashboard/signals',
            icon: 'activity-outline',
          },
          {
            title: 'Sentiment crypto',
            link: '/pages/dashboard/sentiment',
            icon: 'trending-up-outline',
          },
        ],
      },
      {
        title: 'Strategie',
        icon: 'flash-outline',
        expanded: true,
        children: [
          {
            title: 'Gestione strategie',
            link: '/pages/strategies/manage',
            icon: 'settings-outline',
          },
          {
            title: 'Backtesting',
            link: '/pages/strategies/backtest',
            icon: 'bar-chart-outline',
          },
          {
            title: 'Debug step-by-step',
            link: '/pages/strategies/debug',
            icon: 'bug-outline',
          },
          {
            title: 'Confronto strategie',
            link: '/pages/strategies/compare',
            icon: 'swap-outline',
          },
        ],
      },
    ];

    // Sottoscrivi ai ruoli utente e filtra il menu
    this.userStoreService.getUserRoles().pipe(takeUntil(this.destroy$)).subscribe((userRoles) => {
      if (userRoles) {
        this.menuItems = this.menuItems
          .map((item) => {
            if (item.children) {
              // Filtra solo le children in base ai ruoli
              item.children = item.children.filter(
                (child) =>
                  !child.data?.roles ||
                  child.data.roles.some((role: string) => userRoles.includes(role))
              );
            }
            return item;
          });
          // Mostra la sezione se ha almeno una child visibile, oppure se non ha children
         // .filter((item) => !item.children || item.children.length > 0);
      }
    });
  }

  getSelectedItem(): void {
    if (!this.menuItems) return;

    this.menuItems.forEach((item) => {
      if (item.selected) {
        this.selectedItem = item.title;
      }
    });
  }
}
