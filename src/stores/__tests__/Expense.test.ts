import Expense from "../Expense";

describe("TEST Expense", () => {
  it("should create Expense", () => {
    const testExpense = new Expense("testExpense", 200, 50);

    expect(testExpense.title).toEqual("testExpense");
    expect(testExpense.amountPln).toEqual(200);
    expect(testExpense.amountEur).toEqual(50);
  });

  it("should update title of Expense", () => {
    const testExpense = new Expense("testExpense", 200, 50);

    expect(testExpense.title).toEqual("testExpense");
    testExpense.updateTitle("new title");
    expect(testExpense.title).toEqual("new title");
  });

  it("should update amountPln of Expense", () => {
    const testExpense = new Expense("testExpense", 200, 50);

    expect(testExpense.amountPln).toEqual(200);
    testExpense.updateAmountPln(300);
    expect(testExpense.amountPln).toEqual(300);
  });

  it("should update amountEur of Expense", () => {
    const testExpense = new Expense("testExpense", 200, 50);

    expect(testExpense.amountEur).toEqual(50);
    testExpense.updateAmountEur(100);
    expect(testExpense.amountEur).toEqual(100);
  });
});
