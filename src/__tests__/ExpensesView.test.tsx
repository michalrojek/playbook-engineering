import { render, fireEvent } from "@testing-library/react";
import * as hooks from "../ExpenseStoreContext";
import ExpensesStore from "../stores/ExpensesStore";
import ExpensesView from "../ExpensesView";

describe("TEST ExpensesView", (): void => {
  it("should render properly", (): void => {
    const expenseStore = new ExpensesStore();
    jest.spyOn(hooks, "useExpenseStore").mockImplementation(() => expenseStore);
    expenseStore.addExpense("test1", 50);
    expenseStore.addExpense("test2", 50);
    const { getByTestId } = render(<ExpensesView />);

    expect(getByTestId("exchangeRate")).toBeDefined();
    expect(getByTestId("sum")).toBeDefined();
    expect(getByTestId("sum").textContent).toContain("Sum: 100 PLN (25 EUR)");
  });

  it("should update exchange rate", (): void => {
    const promptMock = jest.spyOn(window, "prompt").mockImplementation(() => "5");
    const expenseStore = new ExpensesStore();
    jest.spyOn(hooks, "useExpenseStore").mockImplementation(() => expenseStore);
    expenseStore.addExpense("test1", 50);
    const { getByTestId } = render(<ExpensesView />);

    expect(getByTestId("exchangeRate").textContent).toContain("1 EUR = 4 PLN");
    fireEvent.click(getByTestId("exchangeRateButton"));
    expect(promptMock).toHaveBeenCalled();
    expect(getByTestId("exchangeRate").textContent).toContain("1 EUR = 5 PLN");
  });
});
