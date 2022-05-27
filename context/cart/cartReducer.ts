import { PlaylistAddOutlined } from '@mui/icons-material';
import { ICartProduct } from '../../interfaces';
import { CartState } from './CartProvider';

type CartActionType =
    | { type: '[Cart] - Update products in cart', payload: ICartProduct[] }
    | { type: '[Cart] - Loadcart from cookies | storage', payload: ICartProduct[] }
    | { type: '[Cart] - remove product', payload: ICartProduct }

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
                cart: action.payload
            }
        case '[Cart] - remove product':
            return {
                ...state,
                cart: state.cart.filter(product => product._id !== action.payload._id && product.size !== action.payload.size || product._id === action.payload._id && product.size !== action.payload.size)
            }
        default:
            return state;
    }
}