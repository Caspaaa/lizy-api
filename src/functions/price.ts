export const formatPriceRange = (priceRange: number) => {
  const newPriceRange = [...Array(priceRange + 1).keys()].slice(1);
  return newPriceRange.join();
};
