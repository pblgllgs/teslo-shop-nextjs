import { UiState } from './UiProvider';

type UiActionType =
  | { type: '[UI] - toogle menu' }

export const uiReducer = (state: UiState, action: UiActionType): UiState => {
  switch (action.type) {
    case '[UI] - toogle menu':
      return {
        ...state,
        isMenuOpen: !state.isMenuOpen,
      }
    default:
      return state;
  }
}