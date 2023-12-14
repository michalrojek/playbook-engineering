import ExpensesStore from "../ExpensesStore";

describe("TEST ExpensesStore", () => {
  it("should create new default ExpensesStore", () => {
    const store = new ExpensesStore();

    expect(store.expenses.length).toEqual(0);
    expect(store.expensesCopy.length).toEqual(0);
    expect(store.exchangeRate).toEqual(4);
    expect(store.sortedProperty).toEqual("title");
    expect(store.sortedBy).toEqual("default");
  });

  it("should add expense", () => {
    const store = new ExpensesStore();
    store.addExpense("test1", 50);

    expect(store.expenses.length).toEqual(1);
    expect(store.expenses[0].title).toEqual("test1");
  });

  it("should delete expense", () => {
    const store = new ExpensesStore();
    store.addExpense("test1", 50);
    store.addExpense("test2", 50);

    expect(store.expenses.length).toEqual(2);
    expect(store.expenses[0].title).toEqual("test1");

    store.deleteExpense(0);
    expect(store.expenses.length).toEqual(1);
    expect(store.expenses[0].title).toEqual("test2");
  });

  it("should update expense in PLN", () => {
    const store = new ExpensesStore();
    store.addExpense("test1", 50);

    expect(store.expenses[0].amountPln).toEqual(50);
    expect(store.expenses[0].amountEur).toEqual(12.5);

    store.updateExpenseInPln(store.expenses[0], 100);
    expect(store.expenses[0].amountPln).toEqual(100);
    expect(store.expenses[0].amountEur).toEqual(25);
  });

  it("should update expense in EUR", () => {
    const store = new ExpensesStore();
    store.addExpense("test1", 50);

    expect(store.expenses[0].amountPln).toEqual(50);
    expect(store.expenses[0].amountEur).toEqual(12.5);

    store.updateExpenseInEur(store.expenses[0], 100);
    expect(store.expenses[0].amountPln).toEqual(400);
    expect(store.expenses[0].amountEur).toEqual(100);
  });

  it("should update exchange rate", () => {
    const store = new ExpensesStore();
    store.addExpense("test1", 50);

    expect(store.expenses[0].amountPln).toEqual(50);
    expect(store.expenses[0].amountEur).toEqual(12.5);

    store.updateExchangeRate(5);
    expect(store.expenses[0].amountPln).toEqual(50);
    expect(store.expenses[0].amountEur).toEqual(10);
  });

  it("should sort expenses by title", () => {
    const store = new ExpensesStore();
    store.addExpense("c", 50);
    store.addExpense("a", 50);
    store.addExpense("b", 50);

    store.sortExpenses("title", "asc");
    expect(store.expenses[0].title).toEqual("a");
    expect(store.expenses[1].title).toEqual("b");
    expect(store.expenses[2].title).toEqual("c");

    store.sortExpenses("title", "desc");
    expect(store.expenses[0].title).toEqual("c");
    expect(store.expenses[1].title).toEqual("b");
    expect(store.expenses[2].title).toEqual("a");

    store.sortExpenses("title", "default");
    expect(store.expenses[0].title).toEqual("c");
    expect(store.expenses[1].title).toEqual("a");
    expect(store.expenses[2].title).toEqual("b");
  });

  it("should sort expenses by amount in PLN", () => {
    const store = new ExpensesStore();
    store.addExpense("c", 150);
    store.addExpense("a", 520);
    store.addExpense("b", 50);

    store.sortExpenses("amountPln", "asc");
    expect(store.expenses[0].amountPln).toEqual(50);
    expect(store.expenses[1].amountPln).toEqual(150);
    expect(store.expenses[2].amountPln).toEqual(520);

    store.sortExpenses("amountPln", "desc");
    expect(store.expenses[0].amountPln).toEqual(520);
    expect(store.expenses[1].amountPln).toEqual(150);
    expect(store.expenses[2].amountPln).toEqual(50);

    store.sortExpenses("amountPln", "default");
    expect(store.expenses[0].amountPln).toEqual(150);
    expect(store.expenses[1].amountPln).toEqual(520);
    expect(store.expenses[2].amountPln).toEqual(50);
  });

  it("should sort expenses by amount in EUR", () => {
    const store = new ExpensesStore();
    store.addExpense("c", 150);
    store.addExpense("a", 520);
    store.addExpense("b", 50);

    store.sortExpenses("amountEur", "asc");
    expect(store.expenses[0].amountEur).toEqual(12.5);
    expect(store.expenses[1].amountEur).toEqual(37.5);
    expect(store.expenses[2].amountEur).toEqual(130);

    store.sortExpenses("amountPln", "desc");
    expect(store.expenses[0].amountEur).toEqual(130);
    expect(store.expenses[1].amountEur).toEqual(37.5);
    expect(store.expenses[2].amountEur).toEqual(12.5);

    store.sortExpenses("amountPln", "default");
    expect(store.expenses[0].amountEur).toEqual(37.5);
    expect(store.expenses[1].amountEur).toEqual(130);
    expect(store.expenses[2].amountEur).toEqual(12.5);
  });

  it("should sum expenses", () => {
    const store = new ExpensesStore();
    store.addExpense("c", 150);
    store.addExpense("a", 520);
    store.addExpense("b", 50);

    expect(store.expenseSumPln).toEqual(720);
    expect(store.expenseSumEur).toEqual(180);
  });
});
