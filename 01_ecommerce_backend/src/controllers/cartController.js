import Cart from '../models/cart.model.js';

// Get cart for a user
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ user: userId })
      .populate('user', 'fullname email')
      .populate('items.product', 'name price image');

    if (!cart) {
      return res.json({ user: userId, items: [] }); // return empty cart if not found
    }

    res.json(cart);
  } catch (err) {
    console.error('Get Cart Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    // req.user comes from protect middleware
    const userId = req.user._id;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [{ product: productId, quantity }] });
    } else {
      const itemIndex = cart.items.findIndex(i => i.product.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// Update item quantity
export const updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;

  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(i => i.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      res.json(cart);
    } else {
      res.status(404).json({ message: 'Product not in cart' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// remove
export const removeFromCart = async (req, res) => {
  const { productId } = req.params;

  try {
    const userId = req.user._id; // same as other methods

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(i => i.product.toString() !== productId);
    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};