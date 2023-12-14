import { render, fireEvent } from "@testing-library/react";
import Form from "../Form";
import * as hooks from "../../ExpenseStoreContext";
import ExpensesStore from "../../stores/ExpensesStore";

describe("TEST Form", (): void => {
  it("should render properly", (): void => {
    const expenseStore = new ExpensesStore();
    jest.spyOn(hooks, "useExpenseStore").mockImplementation(() => expenseStore);
    const { getByTestId } = render(<Form />);

    expect(getByTestId("title")).toBeDefined();
  });

  it("should add new expense", (): void => {
    const expenseStore = new ExpensesStore();
    jest.spyOn(hooks, "useExpenseStore").mockImplementation(() => expenseStore);
    const { getByTestId } = render(<Form />);

    fireEvent.change(getByTestId("title"), { target: { value: "test1" } });
    fireEvent.change(getByTestId("amountPln"), { target: { value: "50" } });
    fireEvent.click(getByTestId("submit"));
    expect(expenseStore.expenses[0].title).toEqual("test1");
    expect(expenseStore.expenses[0].amountPln).toEqual(50);
    expect(expenseStore.expenses[0].amountEur).toEqual(12.5);
  });

  it("should show alert because of too short title", (): void => {
    const alertMock = jest.spyOn(window, "alert").mockImplementation();
    const expenseStore = new ExpensesStore();
    jest.spyOn(hooks, "useExpenseStore").mockImplementation(() => expenseStore);
    const { getByTestId } = render(<Form />);

    fireEvent.change(getByTestId("title"), { target: { value: "test" } });
    fireEvent.change(getByTestId("amountPln"), { target: { value: "50" } });
    fireEvent.click(getByTestId("submit"));
    expect(alertMock).toHaveBeenCalledWith("Title is too short!");
  });

  it("should show alert because of too little amount", (): void => {
    const alertMock = jest.spyOn(window, "alert").mockImplementation();
    const expenseStore = new ExpensesStore();
    jest.spyOn(hooks, "useExpenseStore").mockImplementation(() => expenseStore);
    const { getByTestId } = render(<Form />);

    fireEvent.change(getByTestId("title"), { target: { value: "test1" } });
    fireEvent.change(getByTestId("amountPln"), { target: { value: "5" } });
    fireEvent.click(getByTestId("submit"));
    expect(alertMock).toHaveBeenCalledWith("Amount is too low!");
  });
});
