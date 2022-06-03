import { FC, ReactNode, useReducer } from 'react';
import { UiContext, uiReducer } from './';

export interface UiState {
  isMenuOpen: boolean;
}

const UI_INITIAL_STATE: UiState = {
  isMenuOpen: false,
};

interface Props {
  children: ReactNode;
}

export const UiProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);

  const toogleSideMenu = () => {
    dispatch({ type: '[UI] - toogle menu' });
  };

  return (
    <UiContext.Provider value={{ ...state, toogleSideMenu }}>
      {children}
    </UiContext.Provider>
  );
};
