export const EXPENSE_PROPERTY = {
  TITLE: "title",
  AMOUNT_PLN: "amountPln",
  AMOUNT_EUR: "amountEur",
} as const;

export const SORT = {
  ASC: "asc",
  DESC: "desc",
  DEFAULT: "default",
} as const;

type PropertyKeys = keyof typeof EXPENSE_PROPERTY;
export type ExpenseProperty = (typeof EXPENSE_PROPERTY)[PropertyKeys];
type SortKeys = keyof typeof SORT;
export type SortedBy = (typeof SORT)[SortKeys];
