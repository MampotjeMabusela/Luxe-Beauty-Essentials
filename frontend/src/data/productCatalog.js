import { findHairProduct } from './hairCatalog';
import { findEssentialProduct } from './essentialsCatalog';

export function findCatalogProduct(id) {
  if (!id) return null;
  if (String(id).startsWith('hair-')) return findHairProduct(id);
  if (String(id).startsWith('ess-')) return findEssentialProduct(id);
  return null;
}

export function isCatalogProductId(id) {
  return String(id).startsWith('hair-') || String(id).startsWith('ess-');
}
