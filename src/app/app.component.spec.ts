import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { siteConfig } from './site.config';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should expose the brand name', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.brand).toEqual(siteConfig.companyName);
  });

  it('should render the hero headline', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Sabores premium');
  });

  it('should compute config-based prices for product categories', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.getCatalogPrice('salada')).toBe(siteConfig.productPrices.salty);
    expect(app.getCatalogPrice('dulce')).toBe(siteConfig.productPrices.sweet);
  });
});
