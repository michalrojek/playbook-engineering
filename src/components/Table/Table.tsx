import { useCallback, useState } from "react";
import { observer } from "mobx-react";
import { FaEdit } from "react-icons/fa";
import Expense from "../../stores/Expense";
import { useExpenseStore } from "../../ExpenseStoreContext";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import SortIcon from "./SortIcon";
import SearchInput, { SEARCH } from "./SearchInput";
import { EXPENSE_PROPERTY } from "../../types/ExpenseTypes";
import { isAmountValid, isTitleValid } from "../../utils/validators";

const table = css({
  width: "100%",
  borderCollapse: "collapse",
});

const Th = styled.th`
  height: 40px;
  border: 1px solid;
  text-align: left;
  background-color: #d4d4d4;
`;

const Td = styled.td`
  height: 40px;
  border: 1px solid;
`;

const Tbody = styled.tbody`
  tr:nth-of-type(even) {
    background-color: #e5e5e5;
  }
`;

const Table = () => {
  const [searchText, setSearchText] = useState<string>("");
  const { exchangeRate, expenses, deleteExpense, updateExpenseInPln, updateExpenseInEur } = useExpenseStore();

  const handleSearch = useCallback(
    (searchText: string) => {
      setSearchText(searchText);
    },
    [searchText, setSearchText]
  );

  const highlightText = useCallback(
    (text: string) => {
      const splitText = text.split(new RegExp(`(${searchText})`, "gi"));
      return (
        <span>
          {splitText.map((textPart, index) =>
            textPart === searchText ? (
              <mark data-testid={SEARCH + index} key={SEARCH + index}>
                {textPart}
              </mark>
            ) : (
              textPart
            )
          )}
        </span>
      );
    },
    [searchText]
  );

  const handleUpdateTitle = (expense: Expense) => {
    const title = prompt("Enter new title") as string;
    if (isTitleValid(title)) {
      expense.updateTitle(title || expense.title);
    }
  };

  const handleUpdateAmountPln = (expense: Expense) => {
    const amountPln = parseInt(prompt("Enter new amount in PLN") as string);
    if (isAmountValid(amountPln)) {
      updateExpenseInPln(expense, amountPln || expense.amountPln);
    }
  };

  const handleUpdateAmountEur = (expense: Expense) => {
    const amountEur = parseInt(prompt("Enter new amount in Eur") as string);
    if (isAmountValid(amountEur * exchangeRate)) {
      updateExpenseInEur(expense, amountEur || expense.amountEur);
    }
  };

  const getEditIcon = (
    expense: Expense,
    expenseIndex: number,
    handler: (expense: Expense) => void,
    testIdSuffix: string
  ) => {
    return (
      <FaEdit
        data-testid={expense.title + expenseIndex + "Edit" + testIdSuffix}
        onClick={() => {
          handler(expense);
        }}
      />
    );
  };

  const renderTableBody = useCallback(
    (expenses: Expense[]) => {
      return expenses.map((expense, expenseIndex: number) => {
        return (
          <tr data-testid={expense.title + expenseIndex} key={expense.title}>
            <Td data-testid={expense.title + expenseIndex + EXPENSE_PROPERTY.TITLE}>
              {highlightText(expense.title)}{" "}
              {getEditIcon(expense, expenseIndex, handleUpdateTitle, EXPENSE_PROPERTY.TITLE)}
            </Td>
            <Td data-testid={expense.title + expenseIndex + EXPENSE_PROPERTY.AMOUNT_PLN}>
              {highlightText(expense.amountPln.toString())}{" "}
              {getEditIcon(expense, expenseIndex, handleUpdateAmountPln, EXPENSE_PROPERTY.AMOUNT_PLN)}
            </Td>
            <Td data-testid={expense.title + expenseIndex + EXPENSE_PROPERTY.AMOUNT_EUR}>
              {highlightText(expense.amountEur.toString())}{" "}
              {getEditIcon(expense, expenseIndex, handleUpdateAmountEur, EXPENSE_PROPERTY.AMOUNT_EUR)}
            </Td>
            <Td>
              <button data-testid={expense.title + expenseIndex + "Delete"} onClick={() => deleteExpense(expenseIndex)}>
                Delete
              </button>
            </Td>
          </tr>
        );
      });
    },
    [highlightText]
  );

  return (
    <div>
      <SearchInput handleSearch={handleSearch} searchText={searchText} />
      <table css={table}>
        <thead>
          <tr>
            <Th>
              <SortIcon propertyName={EXPENSE_PROPERTY.TITLE} /> Title
            </Th>
            <Th>
              <SortIcon propertyName={EXPENSE_PROPERTY.AMOUNT_PLN} /> Amount (PLN)
            </Th>
            <Th>
              <SortIcon propertyName={EXPENSE_PROPERTY.AMOUNT_EUR} /> Amount (EUR)
            </Th>
            <Th>Options</Th>
          </tr>
        </thead>
        <Tbody>{renderTableBody(expenses)}</Tbody>
      </table>
    </div>
  );
};

export default observer(Table);
