import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { siteConfig, type ProductCategory } from './site.config';

type Product = {
  image: string;
  flavor: string;
  description: string;
  price: number;
  category: ProductCategory;
};

type Service = {
  title: string;
  description: string;
  badge: string;
  details: string[];
};

@Component({
  selector: 'app-root',
  imports: [CurrencyPipe, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly config = siteConfig;

  readonly brand = this.config.companyName;

  readonly contact = {
    person: this.config.contactName,
    email: this.config.contactEmail,
    whatsappNumber: this.config.whatsappNumber
  };

  readonly products: Product[] = this.config.products.map((product) => ({
    ...product,
    price: this.getCatalogPrice(product.category)
  }));

  readonly featuredProduct = this.products[6] ?? this.products[0];

  readonly services: Service[] = [
    {
      title: 'Venta por pieza',
      badge: 'Entrega rápida',
      description: 'Bolsas individuales listas para regalar, vender o acompañar una mesa de postres.',
      details: [
        'Sabores de temporada y clásicos',
        'Presentacion individual premium',
        'Pedidos desde 6 piezas'
      ]
    },
    {
      title: 'Eventos y mayoreo',
      badge: 'Cotización flexible',
      description: 'Armamos pedidos para bodas, corporativos, lanzamientos y celebraciones familiares.',
      details: [
        'Descuento por volumen',
        'Etiquetado personalizado con precio extra',
        'Opción con entrega a domicilio'
      ]
    }
  ];

  quoteQuantity = 80;
  quoteDelivery = true;

  get saltyPrice(): number {
    return this.config.productPrices.salty;
  }

  get sweetPrice(): number {
    return this.config.productPrices.sweet;
  }

  get unitPrice(): number {
    if (this.quoteQuantity >= 250) {
      return 24;
    }

    if (this.quoteQuantity >= 120) {
      return 26;
    }

    if (this.quoteQuantity >= 50) {
      return 29;
    }

    return 32;
  }

  get subtotal(): number {
    return this.quoteQuantity * this.unitPrice;
  }

  get deliveryFee(): number {
    return this.quoteDelivery ? 180 : 0;
  }

  get total(): number {
    return this.subtotal + this.deliveryFee;
  }

  get quoteTierLabel(): string {
    if (this.quoteQuantity >= 250) {
      return 'Tarifa mayoreo para eventos grandes';
    }

    if (this.quoteQuantity >= 120) {
      return 'Tarifa preferente para eventos medianos';
    }

    if (this.quoteQuantity >= 50) {
      return 'Tarifa base para eventos';
    }

    return 'Tarifa minima para pedidos pequenos';
  }

  get whatsappLink(): string {
    const message = encodeURIComponent(
      'Hola, me interesa una cotización de palomitas gourmet para mi evento.'
    );

    return `https://wa.me/${this.contact.whatsappNumber}?text=${message}`;
  }

  getCatalogPrice(category: ProductCategory): number {
    return category === 'dulce' ? this.sweetPrice : this.saltyPrice;
  }

  getCategoryLabel(category: ProductCategory): string {
    return category === 'dulce' ? 'Dulce' : 'Salada';
  }

  normalizeQuantity(): void {
    if (!Number.isFinite(this.quoteQuantity) || this.quoteQuantity < 20) {
      this.quoteQuantity = 20;
      return;
    }

    this.quoteQuantity = Math.round(this.quoteQuantity);
  }
}
