export function searchProducts(products, query) {
  if (!query) return products;
  const lowerQuery = query.toLowerCase();

  return products.filter(product =>
    product.name.toLowerCase().includes(lowerQuery) ||
    (product.description && product.description.toLowerCase().includes(lowerQuery))
  );
}
