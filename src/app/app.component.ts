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

type QuoteSelection = {
  flavor: string;
  category: ProductCategory;
  unitPrice: number;
  quantity: number;
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

  readonly quoteSelections: QuoteSelection[] = this.products.map((product) => ({
    flavor: product.flavor,
    category: product.category,
    unitPrice: product.price,
    quantity: 0
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

  quoteDelivery = true;

  get saltyPrice(): number {
    return this.config.productPrices.salty;
  }

  get sweetPrice(): number {
    return this.config.productPrices.sweet;
  }

  get selectedQuoteItems(): QuoteSelection[] {
    return this.quoteSelections.filter((selection) => selection.quantity > 0);
  }

  get totalQuantity(): number {
    return this.selectedQuoteItems.reduce((total, selection) => total + selection.quantity, 0);
  }

  get saltyQuoteQuantity(): number {
    return this.selectedQuoteItems
      .filter((selection) => selection.category === 'salada')
      .reduce((total, selection) => total + selection.quantity, 0);
  }

  get sweetQuoteQuantity(): number {
    return this.selectedQuoteItems
      .filter((selection) => selection.category === 'dulce')
      .reduce((total, selection) => total + selection.quantity, 0);
  }

  get saltySubtotal(): number {
    return this.selectedQuoteItems
      .filter((selection) => selection.category === 'salada')
      .reduce((total, selection) => total + selection.quantity * selection.unitPrice, 0);
  }

  get sweetSubtotal(): number {
    return this.selectedQuoteItems
      .filter((selection) => selection.category === 'dulce')
      .reduce((total, selection) => total + selection.quantity * selection.unitPrice, 0);
  }

  get subtotal(): number {
    return this.selectedQuoteItems.reduce(
      (total, selection) => total + selection.quantity * selection.unitPrice,
      0
    );
  }

  get deliveryFee(): number {
    return this.quoteDelivery ? 180 : 0;
  }

  get total(): number {
    return this.subtotal + this.deliveryFee;
  }

  get quoteSummaryText(): string {
    if (this.selectedQuoteItems.length === 0) {
      return 'Aun no has seleccionado sabores para cotizar.';
    }

    const selectedFlavors = this.selectedQuoteItems
      .map(
        (selection) =>
          `${selection.flavor}: ${selection.quantity} pza${selection.quantity === 1 ? '' : 's'} x ${this.formatCurrency(selection.unitPrice)}`
      )
      .join('\n');

    return [
      'Hola, quiero cotizar palomitas con esta selección:',
      selectedFlavors,
      '',
      `Total de piezas: ${this.totalQuantity}`,
      `Subtotal saladas: ${this.formatCurrency(this.saltySubtotal)}`,
      `Subtotal dulces: ${this.formatCurrency(this.sweetSubtotal)}`,
      `Entrega: ${this.quoteDelivery ? this.formatCurrency(this.deliveryFee) : 'Sin entrega'}`,
      `Total estimado: ${this.formatCurrency(this.total)}`
    ].join('\n');
  }

  get whatsappLink(): string {
    const message = encodeURIComponent('Hola, me interesa una cotización de palomitas gourmet para mi evento.');

    return `https://wa.me/${this.contact.whatsappNumber}?text=${message}`;
  }

  get quoteWhatsappLink(): string {
    const message = encodeURIComponent(this.quoteSummaryText);

    return `https://wa.me/${this.contact.whatsappNumber}?text=${message}`;
  }

  getCatalogPrice(category: ProductCategory): number {
    return category === 'dulce' ? this.sweetPrice : this.saltyPrice;
  }

  getCategoryLabel(category: ProductCategory): string {
    return category === 'dulce' ? 'Dulce' : 'Salada';
  }

  normalizeSelectionQuantity(selection: QuoteSelection): void {
    if (!Number.isFinite(selection.quantity) || selection.quantity < 0) {
      selection.quantity = 0;
      return;
    }

    selection.quantity = Math.round(selection.quantity);
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
}
