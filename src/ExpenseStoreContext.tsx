import React, { useContext, useRef } from "react";
import ExpensesStore from "./stores/ExpensesStore";

const ExpensesStoreContext = React.createContext<ExpensesStore>(
  null as unknown as ExpensesStore
);

export const useExpenseStore = () => useContext(ExpensesStoreContext);

type Props = {
  children: React.ReactNode;
};

export function ExpensesStoreProvider({ children }: Props) {
  const store = useRef(new ExpensesStore());

  return (
    <ExpensesStoreContext.Provider value={store.current}>
      {children}
    </ExpensesStoreContext.Provider>
  );
}
