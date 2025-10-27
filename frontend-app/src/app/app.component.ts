import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="layout">
      <header>
        <h1>Retail Analytics Dashboard</h1>
        <nav>
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Overview</a>
          <a routerLink="/sentiment" routerLinkActive="active">Sentiment</a>
          <a routerLink="/forecast" routerLinkActive="active">Forecast</a>
        </nav>
      </header>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .layout { min-height:100vh; display:flex; flex-direction:column; }
    header { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; padding:0.75rem 1.25rem; background:#0d47a1; color:#fff; }
    header h1 { font-size:1.15rem; margin:0; }
    nav a { color:#fff; text-decoration:none; margin-right:1rem; position:relative; }
    nav a.active:after { content:''; position:absolute; left:0; bottom:-4px; height:3px; width:100%; background:#ffca28; border-radius:2px; }
    main { flex:1; padding:1.25rem; background:#f6f8fa; }
  `]
})
export class AppComponent {}
