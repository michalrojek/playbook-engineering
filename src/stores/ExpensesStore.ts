import { makeAutoObservable } from "mobx";
import Expense from "./Expense";
import {
  EXPENSE_PROPERTY,
  SORT,
  SortedBy,
  ExpenseProperty,
} from "../types/ExpenseTypes";

export default class ExpensesStore {
  expenses: Expense[] = [];
  expensesCopy: Expense[] = [];
  exchangeRate: number = 4;
  sortedBy: SortedBy = SORT.DEFAULT;
  sortedProperty: ExpenseProperty = EXPENSE_PROPERTY.TITLE;

  constructor() {
    makeAutoObservable(this);
  }

  addExpense = (title: string, amountPln: number) => {
    this.expenses.push(
      new Expense(title, amountPln, amountPln / this.exchangeRate)
    );
  };

  deleteExpense = (expenseIndex: number) => {
    const expensesCopy = [...this.expenses];
    expensesCopy.splice(expenseIndex, 1);
    this.expenses = expensesCopy;
  };

  updateExpenseInPln = (expense: Expense, amountPln: number) => {
    expense.updateAmountPln(amountPln);
    expense.updateAmountEur(amountPln / this.exchangeRate);
  };

  updateExpenseInEur = (expense: Expense, amountEur: number) => {
    expense.updateAmountEur(amountEur);
    expense.updateAmountPln(amountEur * this.exchangeRate);
  };

  updateExchangeRate = (exchangeRate: number) => {
    this.exchangeRate = exchangeRate;
    this.expenses.forEach((expense) =>
      expense.updateAmountEur(expense.amountPln / exchangeRate)
    );
  };

  private stringSort = (a: Expense, b: Expense) => {
    const titleA = a.title.toUpperCase();
    const titleB = b.title.toUpperCase();
    if (titleA < titleB) {
      return -1;
    }
    if (titleA > titleB) {
      return 1;
    }

    return 0;
  };

  private sortTitle = (sortBy: SortedBy) => {
    this.sortedProperty = EXPENSE_PROPERTY.TITLE;
    if (sortBy === SORT.ASC) {
      this.sortedBy = SORT.ASC;
      this.expenses.sort((a, b) => {
        return this.stringSort(a, b);
      });
    }
    if (sortBy === SORT.DESC) {
      this.sortedBy = SORT.DESC;
      this.expenses.sort((a, b) => {
        return this.stringSort(b, a);
      });
    }
  };

  private sortAmountPln = (sortBy: SortedBy) => {
    this.sortedProperty = EXPENSE_PROPERTY.AMOUNT_PLN;
    if (sortBy === SORT.ASC) {
      this.sortedBy = SORT.ASC;
      this.expenses.sort((a, b) => a.amountPln - b.amountPln);
    }
    if (sortBy === SORT.DESC) {
      this.sortedBy = SORT.DESC;
      this.expenses.sort((a, b) => b.amountPln - a.amountPln);
    }
  };

  private sortAmountEur = (sortBy: SortedBy) => {
    this.sortedProperty = EXPENSE_PROPERTY.AMOUNT_EUR;
    if (sortBy === SORT.ASC) {
      this.sortedBy = SORT.ASC;
      this.expenses.sort((a, b) => a.amountEur - b.amountEur);
    }
    if (sortBy === SORT.DESC) {
      this.sortedBy = SORT.DESC;
      this.expenses.sort((a, b) => b.amountEur - a.amountEur);
    }
  };

  sortExpenses = (property: ExpenseProperty, sortBy: SortedBy) => {
    if (this.sortedBy === SORT.DEFAULT) {
      this.expensesCopy = [...this.expenses];
    }
    if (sortBy === SORT.DEFAULT) {
      this.sortedBy = SORT.DEFAULT;
      this.expenses = [...this.expensesCopy];
    }
    if (property === EXPENSE_PROPERTY.TITLE) {
      this.sortTitle(sortBy);
    }

    if (property === EXPENSE_PROPERTY.AMOUNT_PLN) {
      this.sortAmountPln(sortBy);
    }

    if (property === EXPENSE_PROPERTY.AMOUNT_EUR) {
      this.sortAmountEur(sortBy);
    }
  };

  get expenseSumPln(): number {
    return this.expenses.reduce((sum, { amountPln }) => {
      return (sum += amountPln);
    }, 0);
  }

  get expenseSumEur(): number {
    return this.expenses.reduce((sum, { amountEur }) => {
      return (sum += amountEur);
    }, 0);
  }
}
