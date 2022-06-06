import Cookies from 'js-cookie';
import Cookie from 'js-cookie';
import { FC, ReactNode, useEffect, useReducer } from 'react';
import { ICartProduct } from '../../interfaces';
import { cartReducer, CartContext } from './';

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
}

export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
  shippingAddress?: ShippingAddress;
}

const CART_INITIAL_STATE: CartState = {
  isLoaded: false,
  cart: [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
  shippingAddress: undefined,
};

interface Props {
  children: ReactNode;
}

export const CartProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  useEffect(() => {
    if (Cookie.get('firstName')) {
      const shippingAddress = {
        firstName: Cookie.get('firstName') || '',
        lastName: Cookie.get('lastName') || '',
        address: Cookie.get('address') || '',
        address2: Cookie.get('address2') || '',
        zip: Cookie.get('zip') || '',
        city: Cookie.get('city') || '',
        country: Cookie.get('country') || '',
        phone: Cookie.get('phone') || '',
      };
      dispatch({
        type: '[Cart] - Load Address from cookies',
        payload: shippingAddress,
      });
    }
  }, []);

  useEffect(() => {
    try {
      const cookieProducts = Cookie.get('cart')
        ? JSON.parse(Cookie.get('cart')!)
        : [];
      dispatch({
        type: '[Cart] - Loadcart from cookies | storage',
        payload: cookieProducts,
      });
    } catch (error) {
      dispatch({
        type: '[Cart] - Loadcart from cookies | storage',
        payload: [],
      });
    }
  }, []);

  // useEffect(() => {
  //   if (state.cart.length > 0) Cookie.set('cart', JSON.stringify(state.cart));
  //   Cookie.set('cart', JSON.stringify(state.cart));
  // }, [state.cart]);

  useEffect(() => {
    Cookie.set('cart', JSON.stringify(state.cart));
  }, [state.cart]);

  useEffect(() => {
    const numberOfItems = state.cart.reduce(
      (prev, current) => current.quantity + prev,
      0
    );
    const subTotal = state.cart.reduce(
      (prev, current) => prev + current.price * current.quantity,
      0
    );
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE);
    const orderSummary = {
      numberOfItems,
      subTotal,
      tax: subTotal * taxRate,
      total: subTotal + subTotal * taxRate,
    };
    dispatch({
      type: '[Cart] - Update order summary',
      payload: orderSummary,
    });
  }, [state.cart]);

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
      (product) =>
        product._id === newProduct._id && product.size === newProduct.size
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
  const updateAddress = (newAddress: ShippingAddress) => {
     Cookies.set('firstName', newAddress.firstName);
     Cookies.set('lastName', newAddress.lastName);
     Cookies.set('address', newAddress.address);
     Cookies.set('address2', newAddress.address2 || '');
     Cookies.set('zip', newAddress.zip);
     Cookies.set('city', newAddress.city);
     Cookies.set('country', newAddress.country);
     Cookies.set('phone', newAddress.phone);
    dispatch({
      type: '[Cart] - Update Address',
      payload: newAddress,
    })
  };

  const updateCartQuantity = (product: ICartProduct) => {
    dispatch({ type: '[Cart] - Change cart quantity', payload: product });
  };
  const removeCartProduct = (product: ICartProduct) => {
    dispatch({ type: '[Cart] - Remove product in cart', payload: product });
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addProductsToCart,
        removeCartProduct,
        updateCartQuantity,
        updateAddress,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
