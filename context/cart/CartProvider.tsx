import { FC, ReactNode, useReducer } from 'react';
import { ICartProduct } from '../../interfaces';
import { cartReducer, CartContext } from './';

export interface CartState {
  cart: ICartProduct[];
}

const CART_INITIAL_STATE: CartState = {
  cart: [],
};

interface Props {
  children: ReactNode;
}

export const CartProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  const addProductsToCart = (newProduct: ICartProduct) => {
    const productInCart = state.cart.some(
      (product) => product._id === newProduct._id
    );
    if (!productInCart)
      return dispatch({
        type: '[Cart] - Update products in cart',
        payload: [...state.cart, newProduct],
      });

    const productInCartButDifferentSize = state.cart.some(
      (product) => product._id === newProduct._id && product.size === newProduct.size
    );
    if (!productInCartButDifferentSize)
      return dispatch({
        type: '[Cart] - Update products in cart',
        payload: [...state.cart, newProduct],
      });

    const updatedProducts = state.cart.map((product) => {
      if (product._id !== newProduct._id) return product;
      if (product.size !== newProduct.size) return product;

      product.quantity += newProduct.quantity;
      return product;
    });
    dispatch({
      type: '[Cart] - Update products in cart',
      payload: updatedProducts,
    });
  };

  const removeCartProduct = (product: ICartProduct) => {
    dispatch({ type: '[Cart] - remove product', payload: product });
  };

  return (
    <CartContext.Provider
      value={{ ...state, addProductsToCart, removeCartProduct }}
    >
      {children}
    </CartContext.Provider>
  );
};
