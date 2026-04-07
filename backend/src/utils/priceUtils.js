const priceUtils = {
  findCheapest: (medicines) => {
    if (!medicines || medicines.length === 0) return null;
    return medicines.reduce((prev, curr) => (prev.price < curr.price ? prev : curr));
  },

  sortByPrice: (medicines, order = 'asc') => {
    return [...medicines].sort((a, b) => 
      order === 'asc' ? a.price - b.price : b.price - a.price
    );
  }
};

module.exports = priceUtils;