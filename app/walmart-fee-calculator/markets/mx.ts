import {
  type WalmartMarketConfig,
  flat,
} from "../walmart-config";
import { withSuiteBrand } from "@/lib/brand";

function keyFromLabel(label: string): string {
  return label
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

const MX_ROWS: Array<[string, number, number]> = [
  ["Abarrotes Basicos y Procesados", 12, 16.5],
  ["Vinos y Licores", 8, 12.5],
  ["Arte y Manualidades", 15, 19.5],
  ["Vehiculos terrestres", 12, 16.5],
  ["Piezas y Accesorios de Autos", 12, 16.5],
  ["Otros Vehiculos", 12, 16.5],
  ["Llantas", 10, 14.5],
  ["Rines y Componentes de llantas", 10, 14.5],
  ["Panales, Cuidado del Bebe y Otros", 15, 19.5],
  ["Alimentacion del Bebe", 15, 19.5],
  ["Muebles del Bebe", 15, 19.5],
  ["Juguetes del Bebe", 15, 19.5],
  ["Transporte del Bebe", 15, 19.5],
  ["Ciclismo", 15, 19.5],
  ["Optica", 15, 19.5],
  ["Embarcaciones", 12, 16.5],
  ["Otros Deportes y Recreacion", 15, 19.5],
  ["Componentes de Computadoras", 15, 19.5],
  ["Cables", 15, 19.5],
  ["Software", 15, 19.5],
  ["Accesorios Electronicos", 15, 19.5],
  ["Otros Electronicos", 15, 19.5],
  ["Videojuegos", 10, 14.5],
  ["Computadoras", 10, 14.5],
  ["Impresoras y Escaneres", 10, 14.5],
  ["Proyectores", 10, 14.5],
  ["TV y Video", 10, 14.5],
  ["Celulares", 10, 14.5],
  ["Hardware", 15, 19.5],
  ["Plomeria y Bano", 15, 19.5],
  ["Herramientas", 15, 19.5],
  ["Otras Herramientas y Hardware", 15, 19.5],
  ["Suministros para la Construccion", 15, 19.5],
  ["Electricas", 12, 16.5],
  ["Accesorios de Fotografia", 15, 19.5],
  ["Camara y Lentes", 10, 14.5],
  ["Blancos", 12.5, 17],
  ["Electrodomesticos", 15, 19.5],
  ["Cocina, Decoracion y Otros", 15, 19.5],
  ["Instrumentos Musicales", 15, 19.5],
  ["Accesorios de Instrumentos", 15, 19.5],
  ["Fundas y Maletines", 15, 19.5],
  ["Amplificadores de Audio", 10, 14.5],
  ["Joyeria", 20, 24.5],
  ["Juguetes", 15, 19.5],
  ["Peliculas", 15, 19.5],
  ["Libros y Revistas", 15, 19.5],
  ["Series", 15, 19.5],
  ["Combustibles y Lubricantes", 15, 19.5],
  ["Productos y Suministros de Limpieza para el Hogar", 12, 16.5],
  ["Salud y Aseo de Mascotas", 15, 19.5],
  ["Accesorios de Mascotas", 15, 19.5],
  ["Otras Mascotas", 15, 19.5],
  ["Comida de Mascotas", 10, 14.5],
  ["Muebles", 15, 19.5],
  ["Papeleria", 15, 19.5],
  ["Patio y Jardin", 15, 19.5],
  ["Asadores y Accesorios", 15, 19.5],
  ["Estuches y Bolsos", 15, 19.5],
  ["Relojes", 15, 19.5],
  ["Ropa", 15, 19.5],
  ["Belleza, Cuidado e Higiene", 15, 19.5],
  ["Equipo Medico", 15, 19.5],
  ["Lentes", 15, 19.5],
  ["Electronicos", 15, 19.5],
  ["Medicina y Suplementos", 12, 16.5],
  ["Disfraces", 15, 19.5],
  ["Adornos y Decoraciones", 15, 19.5],
  ["Regalos y Premios", 15, 19.5],
  ["Zapatos", 15, 19.5],
];

const CATEGORIES = MX_ROWS.map(([label]) => ({ label, value: keyFromLabel(label) }));

const REFERRAL_RULES = {
  default: flat(15),
  ...Object.fromEntries(MX_ROWS.map(([label, rate]) => [keyFromLabel(label), flat(rate)])),
};

const PREMIUM_REFERRAL_RULES = {
  default: flat(19.5),
  ...Object.fromEntries(MX_ROWS.map(([label, _rate, premium]) => [keyFromLabel(label), flat(premium)])),
};

export const MX_MARKET: WalmartMarketConfig = {
  id: "mx",
  name: "MX",
  fullName: "Mexico",
  flag: "🇲🇽",
  domain: "marketplace.walmart.com.mx",
  currency: { code: "MXN", symbol: "$", locale: "es-MX", decimals: 2 },
  units: {
    weightLabel: "kg",
    dimensionLabel: "cm",
    cubicDivisor: 1_000_000,
    cubicUnitLabel: "m3",
  },
  wfs: {
    mode: "manual",
    label: "WFS / Logistica (manual)",
    helpText: "Mexico WFS public tariff cards are not fully machine-readable in all sections. Enter fulfillment/shipping/storage values manually from your active tariff card.",
  },
  categories: [...CATEGORIES, { label: "Todo lo demas", value: "default" }],
  referralRules: REFERRAL_RULES,
  premiumReferralRules: PREMIUM_REFERRAL_RULES,
  premiumReferralLabel: "Premium MSI referral mode",
  defaults: {
    category: keyFromLabel("Cocina, Decoracion y Otros"),
    fulfillmentMethod: "seller",
    soldPrice: 499,
    shippingCharged: 0,
    itemCost: 220,
    shippingCost: 85,
    otherCosts: 0,
    paymentProcessingRate: 0,
    usePremiumReferralRate: false,
    unitWeight: 2,
    dimensionLength: 30,
    dimensionWidth: 20,
    dimensionHeight: 10,
    isApparel: false,
    isHazmat: false,
    storageMonths: 0,
    storageSeason: "jan_sep",
    manualWfsFulfillmentFee: 0,
    manualWfsShippingRecoveryFee: 0,
    manualWfsStorageFee: 0,
  },
  seo: {
    title: withSuiteBrand("Mexico Walmart Fee Calculator"),
    description: "Calculate Walmart Mexico referral fees by category with optional Premium MSI mode and full profit breakdown.",
    h1: "Mexico Walmart Fee Calculator",
    subtitle: "Source-based referral fee model for Walmart Mexico categories, including Premium MSI toggle.",
  },
  summary: {
    shortFeeSummary: "Walmart Mexico referral fees are category-based, with standard and Premium MSI commission schedules.",
    referralSummary: "Referral fee uses category commission from Walmart Mexico table; toggle Premium MSI when that mode applies.",
    wfsSummary: "WFS costs are manual inputs in this version to avoid assumptions where public tariff cards are not fully machine-readable.",
    paymentSummary: "Payment processing is 0% by default unless external cost needs to be modeled.",
    disclaimer: "Always validate your category mapping and whether Premium MSI applies to your SKU before operational pricing.",
  },
  docs: [
    {
      title: "Walmart Marketplace Mexico - Comisiones Marketplace",
      url: "https://marketplacelearn.walmart.com/mx/guides/Pagos/Comisiones/comisiones-marketplace",
      asOf: "2026-03-25",
      scope: "Mexico category commission and Premium MSI table",
    },
    {
      title: "Walmart Marketplace Mexico - WFS overview",
      url: "https://marketplacelearn.walmart.com/mx/guides/WFS/Bases%20WFS/walmart-fulfillment-services-wfs-descripci-n-general",
      asOf: "2026-03-25",
      scope: "Mexico WFS structure and methodology context",
    },
  ],
  notes: [
    "Use the Premium MSI toggle only for SKUs/orders where Premium MSI commission is contractually applicable.",
    "WFS in Mexico is modeled with manual fee inputs to avoid guessing non-text tariff cards.",
  ],
};
