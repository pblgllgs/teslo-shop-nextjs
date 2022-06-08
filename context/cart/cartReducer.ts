import { ICartProduct } from '../../interfaces';
import { CartState, ShippingAddress } from './CartProvider';

type CartActionType =
    | { type: '[Cart] - Update products in cart', payload: ICartProduct[] }
    | { type: '[Cart] - Loadcart from cookies | storage', payload: ICartProduct[] }
    | { type: '[Cart] - Change cart quantity', payload: ICartProduct }
    | { type: '[Cart] - Remove product in cart', payload: ICartProduct }
<<<<<<< HEAD
    | { type: '[Cart] - Load Address from cookies', payload: ShippingAddress }
    | { type: '[Cart] - Update Address', payload: ShippingAddress }
=======
    | { type: '[Cart] - Load addres from cookies', payload: ShippingAddress }
    | { type: '[Cart] - Update shipping address', payload: ShippingAddress }
>>>>>>> fase-3
    | {
        type: '[Cart] - Update order summary', payload: {
            numberOfItems: number;
            subTotal: number;
            tax: number;
            total: number;
        }
    }

export const cartReducer = (state: CartState, action: CartActionType): CartState => {
    switch (action.type) {
        case '[Cart] - Update products in cart':
            return {
                ...state,
                cart: [...action.payload]
            }
        case '[Cart] - Loadcart from cookies | storage':
            return {
                ...state,
                isLoaded: true,
                cart: [...action.payload]
            }
        case '[Cart] - Change cart quantity':
            return {
                ...state,
                cart: state.cart.map(product => {
                    if (product._id !== action.payload._id) return product;
                    if (product.size !== action.payload.size) return product;
                    return action.payload;
                })
            }
        case '[Cart] - Remove product in cart':
            return {
                ...state,
                cart: state.cart.filter(product =>
                    !(product._id === action.payload._id && product.size === action.payload.size)
                    // if(product._id !== action.payload._id) return product;
                    // if(product._id === action.payload._id && product.size !== action.payload.size) return product;
                )
            }
        case '[Cart] - Update order summary':
            return {
                ...state,
                ...action.payload
            }
        case '[Cart] - Update Address':
        case '[Cart] - Load Address from cookies':
            return {
                ...state,
                shippingAddress: action.payload
            }
        default:
            return state;
    }
}