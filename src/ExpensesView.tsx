import { observer } from "mobx-react";
import { FaEdit } from "react-icons/fa";
import Form from "./components/Form";
import Table from "./components/Table/Table";
import { useExpenseStore } from "./ExpenseStoreContext";
import { css } from "@emotion/react";

const outerDiv = css({
  maxWidth: 600,
});

const clearDiv = css({
  clear: "both",
});

const listHeading = css({
  float: "left",
});

const exchangeRateHeading = css({
  float: "right",
  marginTop: 25,
});

const ExpensesView = () => {
  const { updateExchangeRate, exchangeRate, expenseSumPln, expenseSumEur } = useExpenseStore();

  return (
    <div css={outerDiv}>
      <div css={clearDiv}>
        <h1 css={listHeading}>List of expenses</h1>
        <h2 css={exchangeRateHeading} data-testid="exchangeRate">
          1 EUR = {exchangeRate} PLN{" "}
          <FaEdit
            data-testid="exchangeRateButton"
            onClick={() => {
              updateExchangeRate(parseInt(prompt("Enter new exchange rate in PLN") as string) || exchangeRate);
            }}
          />
        </h2>
      </div>
      <div css={clearDiv}>
        <Form />
        <Table />
        <p data-testid="sum">
          Sum: {expenseSumPln} PLN ({expenseSumEur} EUR)
        </p>
      </div>
    </div>
  );
};

export default observer(ExpensesView);
