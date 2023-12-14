import { render, fireEvent } from "@testing-library/react";
import Table from "../Table/Table";
import * as hooks from "../../ExpenseStoreContext";
import ExpensesStore from "../../stores/ExpensesStore";

describe("TEST Table", (): void => {
  it("should render properly", (): void => {
    const expenseStore = new ExpensesStore();
    jest.spyOn(hooks, "useExpenseStore").mockImplementation(() => expenseStore);
    expenseStore.addExpense("test1", 50);
    const { getByTestId } = render(<Table />);

    expect(getByTestId("test10")).toBeDefined();
  });

  it("should delete expense", (): void => {
    const expenseStore = new ExpensesStore();
    jest.spyOn(hooks, "useExpenseStore").mockImplementation(() => expenseStore);
    expenseStore.addExpense("test1", 50);
    const { getByTestId, queryAllByTestId } = render(<Table />);

    expect(getByTestId("test10Delete")).toBeDefined();
    fireEvent.click(getByTestId("test10Delete"));
    expect(queryAllByTestId("test10Delete").length).toEqual(0);
  });

  it("should search text", (): void => {
    const expenseStore = new ExpensesStore();
    jest.spyOn(hooks, "useExpenseStore").mockImplementation(() => expenseStore);
    expenseStore.addExpense("test1", 50);
    const { getByTestId } = render(<Table />);

    fireEvent.change(getByTestId("search"), { target: { value: "est" } });
    expect(getByTestId("search1").textContent).toEqual("est");
  });

  it("should update title", (): void => {
    const promptMock = jest.spyOn(window, "prompt").mockImplementation(() => "test2");
    const expenseStore = new ExpensesStore();
    jest.spyOn(hooks, "useExpenseStore").mockImplementation(() => expenseStore);
    expenseStore.addExpense("test1", 50);
    const { getByTestId } = render(<Table />);

    fireEvent.click(getByTestId("test10Edittitle"));
    expect(promptMock).toHaveBeenCalled();
    expect(expenseStore.expenses[0].title).toEqual("test2");
  });

  it("should update amount in PLN", (): void => {
    const promptMock = jest.spyOn(window, "prompt").mockImplementation(() => "100");
    const expenseStore = new ExpensesStore();
    jest.spyOn(hooks, "useExpenseStore").mockImplementation(() => expenseStore);
    expenseStore.addExpense("test1", 50);
    const { getByTestId } = render(<Table />);

    fireEvent.click(getByTestId("test10EditamountPln"));
    expect(promptMock).toHaveBeenCalled();
    expect(expenseStore.expenses[0].amountPln).toEqual(100);
  });

  it("should update amount in EUR", (): void => {
    const promptMock = jest.spyOn(window, "prompt").mockImplementation(() => "100");
    const expenseStore = new ExpensesStore();
    jest.spyOn(hooks, "useExpenseStore").mockImplementation(() => expenseStore);
    expenseStore.addExpense("test1", 50);
    const { getByTestId } = render(<Table />);

    fireEvent.click(getByTestId("test10EditamountEur"));
    expect(promptMock).toHaveBeenCalled();
    expect(expenseStore.expenses[0].amountEur).toEqual(100);
  });

  it("should show alert because of too short title", (): void => {
    const promptMock = jest.spyOn(window, "prompt").mockImplementation(() => "test");
    const alertMock = jest.spyOn(window, "alert").mockImplementation();
    const expenseStore = new ExpensesStore();
    jest.spyOn(hooks, "useExpenseStore").mockImplementation(() => expenseStore);
    expenseStore.addExpense("test1", 50);
    const { getByTestId } = render(<Table />);

    fireEvent.click(getByTestId("test10Edittitle"));
    expect(promptMock).toHaveBeenCalled();
    expect(alertMock).toHaveBeenCalledWith("Title is too short!");
    expect(expenseStore.expenses[0].title).toEqual("test1");
  });

  it("should show alert because of too little amount", (): void => {
    const promptMock = jest.spyOn(window, "prompt").mockImplementation(() => "5");
    const alertMock = jest.spyOn(window, "alert").mockImplementation();
    const expenseStore = new ExpensesStore();
    jest.spyOn(hooks, "useExpenseStore").mockImplementation(() => expenseStore);
    expenseStore.addExpense("test1", 50);
    const { getByTestId } = render(<Table />);

    fireEvent.click(getByTestId("test10EditamountPln"));
    expect(promptMock).toHaveBeenCalled();
    expect(alertMock).toHaveBeenCalledWith("Amount is too low!");
    expect(expenseStore.expenses[0].amountPln).toEqual(50);
  });

  it("should sort expenses by title", (): void => {
    const expenseStore = new ExpensesStore();
    jest.spyOn(hooks, "useExpenseStore").mockImplementation(() => expenseStore);
    expenseStore.addExpense("b", 50);
    expenseStore.addExpense("a", 50);
    expenseStore.addExpense("c", 50);
    const { getByTestId } = render(<Table />);

    fireEvent.click(getByTestId("sorttitle"));
    expect(expenseStore.expenses[0].title).toEqual("a");
    expect(expenseStore.expenses[1].title).toEqual("b");
    expect(expenseStore.expenses[2].title).toEqual("c");
  });

  it("should sort expenses by amount in PLN", (): void => {
    const expenseStore = new ExpensesStore();
    jest.spyOn(hooks, "useExpenseStore").mockImplementation(() => expenseStore);
    expenseStore.addExpense("b", 20);
    expenseStore.addExpense("a", 100);
    expenseStore.addExpense("c", 50);
    const { getByTestId } = render(<Table />);

    fireEvent.click(getByTestId("sortamountPln"));
    expect(expenseStore.expenses[0].title).toEqual("b");
    expect(expenseStore.expenses[1].title).toEqual("c");
    expect(expenseStore.expenses[2].title).toEqual("a");
  });

  it("should sort expenses by amount in EUR", (): void => {
    const expenseStore = new ExpensesStore();
    jest.spyOn(hooks, "useExpenseStore").mockImplementation(() => expenseStore);
    expenseStore.addExpense("b", 200);
    expenseStore.addExpense("a", 100);
    expenseStore.addExpense("c", 50);
    const { getByTestId } = render(<Table />);

    fireEvent.click(getByTestId("sortamountEur"));
    expect(expenseStore.expenses[0].title).toEqual("c");
    expect(expenseStore.expenses[1].title).toEqual("a");
    expect(expenseStore.expenses[2].title).toEqual("b");
  });
});
