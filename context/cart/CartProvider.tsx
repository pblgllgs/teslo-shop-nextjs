import Cookies from 'js-cookie';
import Cookie from 'js-cookie';
import { FC, ReactNode, useEffect, useReducer } from 'react';
import { ICartProduct } from '../../interfaces';
import { cartReducer, CartContext } from './';

export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
  shippingAddress?: ShippingAddress;
}

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
    if(Cookies.get('firstName')){
      const shippingAddress = {
        firstName: Cookies.get('firstName') || '',
        lastName: Cookies.get('lastName') || '',
        address: Cookies.get('address') || '',
        address2: Cookies.get('address2') || '',
        zip: Cookies.get('zip') || '',
        city: Cookies.get('city') || '',
        country: Cookies.get('country') || '',
        phone: Cookies.get('phone') || '',
      };
      dispatch({
        type: '[Cart] - Load addres from cookies',
        payload: shippingAddress,
      });
    }
  }, [])
  

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

  const updateAddress = (data: ShippingAddress) => {
    Cookies.set('firstName', data.firstName);
    Cookies.set('lastName', data.lastName);
    Cookies.set('address', data.address);
    Cookies.set('address2', data.address2 || '');
    Cookies.set('zip', data.zip);
    Cookies.set('city', data.city);
    Cookies.set('country', data.country);
    Cookies.set('phone', data.phone);
    dispatch({
      type: '[Cart] - Update shipping address',
      payload: data,
    });
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
