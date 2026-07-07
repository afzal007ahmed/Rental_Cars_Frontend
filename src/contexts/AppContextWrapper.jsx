import React, { createContext, useReducer } from "react";

export const AppContext = createContext(null);

const AppContextWrapper = ({ children }) => {
  const initialState = {
    loading: false,
    data: null,
  };
  const reducer = (state, action) => {
    switch (action.type) {
      case "LOADING":
        return { ...state, loading: true };
      case "FETCH_USER_DETAILS":
        return { ...state, data: { user: action.payload }, loading: false };
      default:
        return { ...state, loading: false };
    }

  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextWrapper;
