// Single place that reads the hat data.
// Pages import from here instead of reading hats.json directly, so if the
// data ever moves (a CMS, Stripe products, etc.) only this file changes.
import data from '../data/hats.json';

// import.meta.glob grabs every image in src/img at build time.
// `eager: true` loads them straight away; `import: 'default'` gives us the
// image object that astro:assets <Image /> expects.
const images = import.meta.glob('../img/*.{jpg,jpeg}', { eager: true, import: 'default' });

// hats.json only stores file names, so turn a name into the real image.
export function hatImage(fileName) {
  const image = images[`../img/${fileName}`];
  if (!image) throw new Error(`Image not found in src/img: ${fileName}`);
  return image;
}

export const hats = data.hats;
export const materials = data.materials;
export const sizes = data.sizes;
export const categories = data.categories;

// Turn "Barbed wire" into "barbed-wire" for data attributes and URLs
// Pricing: each material has a starting price, and each hat adds its own
// amount for its finish, skulls and so on. Bone Collector in rabbit = 397 + 215.
export const priceFor = (hat, material) => material.price + hat.addOn;
export const fromPrice = (hat) => Math.min(...data.materials.map((m) => priceFor(hat, m)));
export const toPrice = (hat) => Math.max(...data.materials.map((m) => priceFor(hat, m)));
export const formatPrice = (n) => `£${n.toLocaleString('en-GB')}`;

export const toSlug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
