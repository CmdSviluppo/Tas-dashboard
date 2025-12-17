# TAS Dashboard - AI Coding Agent Instructions

## Project Overview
TAS (Trading Automation System) Dashboard is an Angular 19 standalone component application for managing trading strategies, profiles, signals, and market monitoring. The application uses Nebular UI framework, Angular Signals for state management, and follows a modular feature-based architecture.

## Architecture & Structure

### Core Technology Stack
- **Angular 19** with standalone components (no NgModules)
- **Nebular Theme** (@nebular/theme v15) for UI components
- **Angular Material** for additional UI elements
- **RxJS 7.8** for reactive programming
- **TypeScript 5.5** with strict mode
- **SCSS** for styling with theme variables in `src/styles/_variables.scss`

### Application Structure
```
src/app/
├── app.ts                    # Root component (NOT app.component.ts)
├── app.config.ts             # Application-level providers & config
├── app.routes.ts             # Root routing with lazy loading
├── pages/                    # Feature modules (lazy-loaded)
│   ├── pages.ts              # Layout wrapper for authenticated pages
│   ├── dashboard/
│   ├── strategy-management/
│   ├── profile-configuration/
│   ├── signal-management/
│   ├── symbol-monitoring/
│   ├── analytics/
│   └── settings/
├── common/                   # Layout components (header, sidebar)
├── shared/                   # Reusable components & assets
│   ├── components/
│   │   ├── ui/               # Generic UI components (spinners, badges)
│   │   └── [domain]/         # Domain-specific components (signal-card)
│   └── assets/
└── utils/
    ├── constants/            # API endpoints & app constants
    ├── guard/                # Route guards (role-based access)
    ├── interceptor/          # HTTP interceptors
    ├── model/                # TypeScript interfaces & enums
    │   ├── enum.ts           # Shared enums (SignalStatus, StrategyType, etc.)
    │   └── rest/             # API DTOs mirroring backend contracts
    ├── service/              # API services & utilities
    └── utility/              # Helper functions
```

## Development Conventions

### Component Naming
- Files: `*.component.ts` (e.g., `signal-card.component.ts`)
- Classes: Remove `.component` suffix (e.g., `SignalCardComponent`)
- Root component is `App` in `app.ts` (historical naming)
- Selectors: `app-{name}` prefix (e.g., `app-signal-card`)

### Standalone Components Pattern
All components are standalone. Import dependencies directly:
```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, NbCardModule, ReactiveFormsModule],
  templateUrl: './example.component.html'
})
export class ExampleComponent { }
```

### Routing Architecture
- **Lazy loading** for all feature modules via `loadChildren`
- Routes defined in `*.routes.ts` files exporting named constants (e.g., `PAGES_ROUTES`)
- Role-based protection via `roleGuard` with `data: { roles: ['ROLE_ADMIN', 'ROLE_USER'] }`
```typescript
{
  path: 'strategies',
  loadChildren: () => import('./strategy-management/strategy-management.routes')
    .then(m => m.STRATEGY_MANAGEMENT_ROUTES),
  canActivate: [roleGuard],
  data: { roles: ['ROLE_ADMIN', 'ROLE_USER'] }
}
```

### State Management with Angular Signals
**Primary pattern** for reactive state - avoid BehaviorSubject/Observable unless integration required.

#### State Class Pattern
Feature states use dedicated state classes with signals and computed values:
```typescript
export class StrategyListState {
  // Writable signals
  private _strategies = signal<StrategySummary[]>([]);
  public searchText = signal('');
  public loading = signal(false);
  
  // Computed signals for derived state
  public filteredStrategies = computed(() => {
    const search = this.searchText().toLowerCase();
    return this._strategies().filter(s => 
      s.name.toLowerCase().includes(search)
    );
  });
  
  public strategyCount = computed(() => this.filteredStrategies().length);
}
```

#### Component State Pattern
```typescript
export class MyComponent {
  public loading = signal(false);
  public data = signal<Item[]>([]);
  
  // Use effect for side effects
  constructor() {
    effect(() => {
      console.log('Data changed:', this.data());
    });
  }
}
```

### API Service Pattern
All API services extend `BaseApiService` which provides typed HTTP methods:
```typescript
@Injectable({ providedIn: 'root' })
export class StrategyApiService extends BaseApiService {
  getAll(): Observable<StrategySummary[]> {
    return this.get<StrategySummary[]>('/strategies');
  }
  
  create(request: CreateStrategyRequest): Observable<Strategy> {
    return this.post<Strategy>('/strategies', request);
  }
}
```

**BaseApiService methods**: `get()`, `post()`, `put()`, `patch()`, `delete()` with automatic error handling and param building.

### API Response Structure
Backend returns wrapped responses - services should handle unwrapping:
```typescript
export type ApiResponse<T> = {
  success: boolean;
  code: string;
  message: string;
  data: T;           // Actual payload
  traceId: string;
  errors?: string[];
}

export interface Page<T> {
  content: T[];       // Array of items
  totalElements: number;
  totalPages: number;
  number: number;     // 0-indexed page number
  size: number;
}
```

### HTTP Interceptors (Sequential Order)
Defined in `app.config.ts` - **order matters**:
1. `authInterceptor` - Adds JWT token
2. `loadingInterceptor` - Shows/hides global spinner
3. `apiErrorInterceptor` - Handles errors and notifications
4. `headerInterceptor` - Adds custom headers

**Skip loading spinner**: Add `X-Skip-Loading` header to request (interceptor removes it before sending).

### Environment Configuration
- **Dev**: `src/environments/environment.ts` - local API, feature flags, debug mode
- **Prod**: `src/environments/environment.prod.ts` - production API, optimized settings
- **Runtime config**: `src/assets/environment.json` (optional runtime overrides)

Key environment properties:
```typescript
{
  apiUrl: 'http://localhost:8080/api',
  wsUrl: 'ws://localhost:8080/ws',
  features: { enableWebSocket: true, enableDebugMode: true },
  pagination: { defaultPageSize: 20 }
}
```

### Shared Components Export Pattern
Use barrel export in `src/app/shared/components/index.ts`:
```typescript
// UI Components
export * from './ui/tas-spinner/tas-spinner.component';
export * from './ui/state-badge/state-badge.component';

// Domain Components  
export * from './signal-card/signal-card.component';
```
Import: `import { SignalCardComponent, StateBadgeComponent } from '@app/shared/components';`

### Styling Conventions
- **Global styles**: `src/styles.scss` (Nebular theme, FontAwesome)
- **Theme variables**: `src/styles/_variables.scss` (colors, spacing)
- **Nebular theme**: `corporate` theme configured in `app.config.ts`
- **Component styles**: Scoped SCSS files, use Nebular variables (`$nb-theme`)

## Domain-Specific Patterns

### Trading Domain Enums
Critical enums in `src/app/utils/model/enum.ts`:
- `SignalStatus`: PENDING, EXECUTED, CLOSED, SKIPPED, EXPIRED
- `SignalDirection`: LONG, SHORT, NEUTRAL
- `StrategyType`: TECHNICAL, FUNDAMENTAL, PATTERN_RECOGNITION, SENTIMENT, MACHINE_LEARNING, HYBRID
- `TradingState`: IDLE, ANALYZING, SIGNAL_PENDING, POSITION_OPEN, POSITION_CLOSING
- `Timeframe`: M1, M5, M15, M30, H1, H4, D1, W1

### Model Organization
- `src/app/utils/model/rest/` - DTOs organized by domain (strategy, signal, profile, etc.)
- DTOs mirror Spring Boot backend contracts exactly
- Use `BaseEntity` for entities with `id`, `createdAt`, `updatedAt`

### WebSocket Services
- `WebSocketService` - Generic WebSocket wrapper
- `BitgetWsService` - Bitget exchange WebSocket integration
- Feature flag: `environment.features.enableWebSocket`

## Development Workflow

### Commands
```bash
# Development server (http://localhost:4200)
npm start          # or: ng serve

# Build for production
npm run build      # Output: dist/tas-dashboard

# Run tests
npm test           # Karma + Jasmine

# Watch mode build
npm run watch
```

### Testing
- **Framework**: Jasmine + Karma
- **File naming**: `*.spec.ts`
- **Location**: Co-located with source files
- Run specific test: `ng test --include='**/strategy-list.component.spec.ts'`

### Code Generation
Use Angular CLI with project defaults:
```bash
ng generate component pages/my-feature/my-component
# Creates: standalone component with SCSS in correct directory
```

## Key Integration Points

### Authentication Flow
- Login via `NbAuthModule` with JWT strategy
- Token stored as `NbAuthJWTToken` with key `accessToken`
- Auth endpoint: `http://localhost:8080/api/auth/login`
- Refresh endpoint: `http://localhost:8080/api/auth/refresh`

### Translation (i18n)
- `@ngx-translate` with multi-http-loader
- Default language: `it` (Italian)
- Files: `assets/i18n/it.json`, `assets/i18n/errorcode/it.json`

### Lazy Loading Pattern
Features load independently to reduce initial bundle:
- Each feature has `*.routes.ts` with exported const
- Import via dynamic `import()` in parent routes
- Example: `() => import('./dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)`

## Common Pitfalls & Solutions

### Nebular Theme Setup
Nebular requires `NbThemeModule.forRoot()` in `app.config.ts` - already configured globally.
Don't add `forRoot()` in feature modules.

### Signal vs Observable
- **Use signals** for component state, UI reactivity, computed values
- **Use observables** for HTTP calls, async streams, RxJS operators
- Convert Observable to Signal: `toSignal(observable$, { initialValue: [] })`

### Route Guard Placeholder
`roleGuard` currently returns `true` (not implemented). Real implementation should check user roles from `UserStoreService`.

### API Constants Usage
API endpoints in `src/app/utils/constants/ApiConstants.ts` are class-based:
```typescript
const apiConstants = new ApiConstants();
const url = apiConstants.STRATEGIES; // 'http://localhost:8080/api/v1/strategies'
```

### Prettier Configuration
Project uses Prettier with specific settings (in `package.json`):
- Print width: 100
- Single quotes: true
- Angular parser for HTML files

## Anti-Patterns to Avoid
- ❌ Creating NgModules (use standalone components)
- ❌ Using BehaviorSubject for component state (prefer signals)
- ❌ Importing `app.component.ts` (file is `app.ts`)
- ❌ Hardcoding API URLs (use environment config)
- ❌ Adding `.component` suffix to class names
- ❌ Circular dependencies between services
- ❌ Mutating signal values directly (use `.set()`, `.update()`)

## Quick Reference

### Import Aliases
Not configured - use relative paths or full paths from `src/`

### Key Files for Context
- `src/app/app.config.ts` - Global providers, interceptors, Nebular config
- `src/app/pages/pages.routes.ts` - Main feature routing
- `src/app/utils/service/base-api.service.ts` - HTTP wrapper pattern
- `src/environments/environment.ts` - Configuration & feature flags
- `src/app/utils/model/enum.ts` - Domain enums

### Backend Integration
Backend runs on `http://localhost:8080` (Spring Boot assumed from API patterns).
API versioning: `/api/v1/...` (defined in ApiConstants)
