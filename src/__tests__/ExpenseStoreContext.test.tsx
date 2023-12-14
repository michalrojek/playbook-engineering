import { render, fireEvent } from "@testing-library/react";
import { useExpenseStore, ExpensesStoreProvider } from "../ExpenseStoreContext";
import { observer } from "mobx-react";

const MockComponent = observer(() => {
  const { updateExchangeRate, exchangeRate } = useExpenseStore();

  return (
    <>
      <span data-testid="exchangeRate">1 EUR = {exchangeRate} PLN </span>
      <button
        data-testid="testButton"
        onClick={() => {
          updateExchangeRate(5);
        }}
      >
        Test
      </button>
    </>
  );
});

describe("TEST ExpensesStoreContext", (): void => {
  it("should render properly and have ability to use ExpenseStore methods", (): void => {
    const { getByTestId } = render(
      <ExpensesStoreProvider>
        <MockComponent />
      </ExpensesStoreProvider>
    );

    expect(getByTestId("exchangeRate").textContent).toContain("1 EUR = 4 PLN");
    fireEvent.click(getByTestId("testButton"));
    expect(getByTestId("exchangeRate").textContent).toContain("1 EUR = 5 PLN");
  });
});
