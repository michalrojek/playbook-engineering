import { ExpensesStoreProvider } from "./ExpenseStoreContext";
import ExpensesView from "./ExpensesView";

function App() {
  return (
    <>
      <ExpensesStoreProvider>
        <ExpensesView />
      </ExpensesStoreProvider>
    </>
  );
}

export default App;
