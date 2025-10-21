import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  NbIconModule, 
  NbButtonModule, 
  NbInputModule, 
  NbContextMenuModule,
  NbTooltipModule,
  NbMenuService 
} from "@nebular/theme";

interface SearchResult {
  id: string;
  label: string;
  icon: string;
  type: 'strategy' | 'ai' | 'live' | 'analysis' | 'symbol';
  route?: string;
}

interface SearchCategory {
  name: string;
  items: SearchResult[];
}

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    FormsModule,
    NbIconModule,
    NbButtonModule,
    NbInputModule,
    NbContextMenuModule,
    NbTooltipModule
  ],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Output() sidebarToggle = new EventEmitter<void>();
  @Output() notificationsToggle = new EventEmitter<void>();

  // Search functionality
  searchQuery = '';
  showSearchResults = false;
  searchResults: SearchCategory[] = [];

  // Status indicators
  isLiveConnected = true;
  notificationCount = 3;

  // User menu configuration
  userMenu = [
    { title: 'Profilo', icon: 'person-outline' },
    { title: 'Impostazioni', icon: 'settings-outline' },
    { title: 'Aiuto', icon: 'question-mark-circle-outline' },
    { title: 'Logout', icon: 'log-out-outline' }
  ];

  // Mock search data
  private mockSearchData: SearchResult[] = [
    { id: '1', label: 'RSI Divergence Strategy', icon: 'trending-up-outline', type: 'strategy', route: '/strategies/1' },
    { id: '2', label: 'Bitcoin Analysis', icon: 'bar-chart-outline', type: 'analysis', route: '/analysis/btc' },
    { id: '3', label: 'EURUSD', icon: 'swap-outline', type: 'symbol', route: '/symbols/eurusd' },
    { id: '4', label: 'AI Sentiment Model', icon: 'cpu-outline', type: 'ai', route: '/ai/sentiment' },
    { id: '5', label: 'Live Trading Session', icon: 'radio-outline', type: 'live', route: '/live/trading' },
    { id: '6', label: 'Moving Average Cross', icon: 'trending-up-outline', type: 'strategy', route: '/strategies/2' },
    { id: '7', label: 'Ethereum Prediction', icon: 'cpu-outline', type: 'ai', route: '/ai/eth-prediction' }
  ];

  constructor(
    private router: Router,
    private menuService: NbMenuService
  ) {
    // Listen to user menu selections
    this.menuService.onItemClick()
      .subscribe((data: any) => {
        this.onUserMenuClick(data.item.title);
      });
  }

  toggleSidebar(): void {
    this.sidebarToggle.emit();
  }

  toggleNotifications(): void {
    this.notificationsToggle.emit();
  }

  goToHome(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/']);
  }

  onSearchFocus(): void {
    if (this.searchQuery) {
      this.showSearchResults = true;
    }
  }

  onSearchBlur(): void {
    // Delay hiding to allow click on results
    setTimeout(() => {
      this.showSearchResults = false;
    }, 200);
  }

  onSearchInput(): void {
    if (this.searchQuery.trim().length > 0) {
      this.performSearch();
      this.showSearchResults = true;
    } else {
      this.showSearchResults = false;
      this.searchResults = [];
    }
  }

  private performSearch(): void {
    const query = this.searchQuery.toLowerCase().trim();
    const filteredResults = this.mockSearchData.filter(item =>
      item.label.toLowerCase().includes(query)
    );

    // Group results by category
    const categories: { [key: string]: SearchResult[] } = {
      strategy: [],
      ai: [],
      live: [],
      analysis: [],
      symbol: []
    };

    filteredResults.forEach(result => {
      categories[result.type].push(result);
    });

    this.searchResults = Object.entries(categories)
      .filter(([_, items]) => items.length > 0)
      .map(([type, items]) => ({
        name: this.getCategoryDisplayName(type),
        items
      }));
  }

  private getCategoryDisplayName(type: string): string {
    const displayNames: { [key: string]: string } = {
      strategy: 'Strategie',
      ai: 'AI & Machine Learning',
      live: 'Live Trading',
      analysis: 'Analisi',
      symbol: 'Simboli'
    };
    return displayNames[type] || type;
  }

  selectSearchResult(item: SearchResult): void {
    this.searchQuery = '';
    this.showSearchResults = false;
    if (item.route) {
      this.router.navigate([item.route]);
    }
  }

  private onUserMenuClick(title: string): void {
    switch (title) {
      case 'Profilo':
        this.router.navigate(['/profile']);
        break;
      case 'Impostazioni':
        this.router.navigate(['/settings']);
        break;
      case 'Aiuto':
        this.router.navigate(['/help']);
        break;
      case 'Logout':
        this.logout();
        break;
    }
  }

  private logout(): void {
    // Implement logout logic
    console.log('Logout clicked');
    this.router.navigate(['/login']);
  }
}
