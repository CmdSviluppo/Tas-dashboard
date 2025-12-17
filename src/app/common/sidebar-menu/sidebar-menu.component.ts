import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {NbIconModule, NbMenuItem, NbMenuModule, NbMenuService} from '@nebular/theme';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {UserStoreService} from '../../utils/service/user-store.service';

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
      .subscribe(({item}) => {
        this.selectedItem = item.title;
      });
  }

  public buildMenu() {
    this.menuItems = [
      {
        title: 'Dashboard',
        icon: 'home-outline',
        expanded: true,
        children: [],
      },
      {
        title: 'Strategie',
        icon: 'flash-outline',
        expanded: true,
        children: [
          {
            title: 'Catalogo strategie',
            link: '/pages/strategies',
            icon: 'list-outline',
          },
          {
            title: 'Crea strategia',
            link: '/pages/strategies/new',
            icon: 'plus-circle-outline',
          },
        ],
      },
      {
        title: 'Profili',
        icon: 'person-outline',
        expanded: false,
        children: [
          {
            title: 'Configurazione profili',
            link: '/pages/profiles',
            icon: 'settings-2-outline',
          },
        ],
      },
      {
        title: 'Simboli',
        icon: 'trending-up-outline',
        expanded: false,
        children: [
          {
            title: 'Monitoraggio simboli',
            link: '/pages/symbols',
            icon: 'activity-outline',
          },
        ],
      },
      {
        title: 'Segnali',
        icon: 'bell-outline',
        expanded: false,
        children: [
          {
            title: 'Gestione segnali',
            link: '/pages/signals',
            icon: 'alert-circle-outline',
          },
        ],
      },
      {
        title: 'Analytics',
        icon: 'bar-chart-outline',
        expanded: false,
        children: [
          {
            title: 'Analytics',
            link: '/pages/analytics',
            icon: 'pie-chart-outline',
          },
        ],
      },
      {
        title: 'Impostazioni',
        icon: 'settings-outline',
        expanded: false,
        children: [
          {
            title: 'Settings',
            link: '/pages/settings',
            icon: 'options-2-outline',
          },
        ],
      },
    ];
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
