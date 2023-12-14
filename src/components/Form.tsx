import { observer } from "mobx-react";
import { action } from "mobx";
import { useState, ChangeEvent, useCallback } from "react";
import { useExpenseStore } from "../ExpenseStoreContext";
import { css } from "@emotion/react";
import { EXPENSE_PROPERTY } from "../types/ExpenseTypes";
import { isAmountValid, isTitleValid } from "../utils/validators";

const form = css({
  display: "grid",
  gridTemplateColumns: "max-content max-content",
  gridGap: 20,
});

const label = css({
  gridColumn: 1,
  textAlign: "right",
  alignSelf: "center",
});

const input = css({
  width: 200,
  height: 30,
  gridColumn: 2,
});

const button = css({
  width: 60,
  height: 40,
  borderWidth: 1,
  borderRadius: 5,
  gridColumn: 3,
  justifySelf: "end",
  backgroundColor: "#d4d4d4",
});

const Form = () => {
  const { addExpense } = useExpenseStore();
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);

  const handleTitleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      setTitle(event.target.value);
    },
    [setTitle]
  );

  const handleAmountChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      setAmount(parseInt(event.target.value));
    },
    [setAmount]
  );

  const handleSubmit = useCallback(() => {
    if (isTitleValid(title) && isAmountValid(amount)) {
      addExpense(title, amount);
      setTitle("");
      setAmount(0);
    }
  }, [title, setTitle, amount, setAmount, addExpense]);

  return (
    <div css={form}>
      <label css={label} htmlFor={EXPENSE_PROPERTY.TITLE}>
        Title of transaction
      </label>
      <input
        css={input}
        data-testid={EXPENSE_PROPERTY.TITLE}
        id={EXPENSE_PROPERTY.TITLE}
        name={EXPENSE_PROPERTY.TITLE}
        onChange={handleTitleChange}
        type="text"
        value={title}
      />
      <label css={label} htmlFor={EXPENSE_PROPERTY.AMOUNT_PLN}>
        Amount (in PLN)
      </label>
      <input
        css={input}
        data-testid={EXPENSE_PROPERTY.AMOUNT_PLN}
        id={EXPENSE_PROPERTY.AMOUNT_PLN}
        name={EXPENSE_PROPERTY.AMOUNT_PLN}
        onChange={handleAmountChange}
        type="number"
        value={amount}
      />
      <button css={button} data-testid="submit" onClick={action(handleSubmit)}>
        Add
      </button>
    </div>
  );
};

export default observer(Form);
