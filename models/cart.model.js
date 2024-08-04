class Cart {
  constructor(items = [], totalQuantity = 0, totalPrice = 0) {
    this.items = items;
    this.totalQuantity = totalQuantity;
    this.totalPrice = totalPrice;
  }

  addItem(product) {
    console.log("Adding item:", product);
    const cartItemIndex = this.items.findIndex(item => item.product && item.product.id === product.id);
    if (cartItemIndex >= 0) {
      this.items[cartItemIndex].quantity += 1;
      this.items[cartItemIndex].totalPrice += product.price;
    } else {
      this.items.push({
        product: {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image, // This should be the Cloudinary URL
        },
        quantity: 1,
        totalPrice: product.price
      });
    }

    this.totalQuantity += 1;
    this.totalPrice += product.price;
    console.log("Cart after adding item:", this);
  }

  updateItem(productId, newQuantity) {
    console.log("Updating item:", productId, "with quantity:", newQuantity);
    const cartItemIndex = this.items.findIndex(item => item.product && item.product.id === productId);
    if (cartItemIndex < 0) {
      return { updatedItemPrice: 0 };
    }

    const cartItem = this.items[cartItemIndex];
    if (newQuantity <= 0) {
      this.items.splice(cartItemIndex, 1);
      this.totalQuantity -= cartItem.quantity;
      this.totalPrice -= cartItem.totalPrice;
      return { updatedItemPrice: 0 };
    }

    this.totalQuantity += newQuantity - cartItem.quantity;
    this.totalPrice += (newQuantity - cartItem.quantity) * cartItem.product.price;

    cartItem.quantity = newQuantity;
    cartItem.totalPrice = newQuantity * cartItem.product.price;

    console.log("Cart after updating item:", this);
    return { updatedItemPrice: cartItem.totalPrice };
  }

  updatePrices(products) {
    console.log("Updating prices with products:", products);
    for (const item of this.items) {
      if (item.product) {
        const product = products.find(p => p.id === item.product.id);
        if (product) {
          item.product = {
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image, // This should be the Cloudinary URL
          };
          item.totalPrice = item.quantity * product.price;
        } else {
          console.error(`Product with id ${item.product.id} not found`);
        }
      } else {
        console.error(`Cart item missing product: ${JSON.stringify(item)}`);
      }
    }

    this.totalPrice = this.items.reduce((total, item) => total + item.totalPrice, 0);
    console.log("Cart after updating prices:", this);
  }

  getProductIds() {
    return this.items.map(item => item.product.id);
  }
}

module.exports = Cart;