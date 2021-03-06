import { createContext } from 'react';
import { ICartProduct, ShippingAddress } from '../../interfaces';
import { PropsCreateOrder } from './CartProvider';

interface ContextProps {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
  shippingAddress?: ShippingAddress;

  addProductsToCart: (product: ICartProduct) => void;
  updateCartQuantity: (product: ICartProduct) => void;
  removeCartProduct: (product: ICartProduct) => void;
  updateAddress: (newAddress: ShippingAddress) => void;
  createOrder: () => Promise<PropsCreateOrder>;
}

export const CartContext = createContext({} as ContextProps);
