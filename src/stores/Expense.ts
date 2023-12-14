import { makeObservable, observable, action } from "mobx";

class Expense {
  title: string;
  amountPln: number;
  amountEur: number;

  constructor(title: string, amountPln: number, amountEur: number) {
    this.title = title;
    this.amountPln = amountPln;
    this.amountEur = amountEur;

    makeObservable(this, {
      title: observable,
      amountEur: observable,
      amountPln: observable,
      updateTitle: action,
      updateAmountPln: action,
      updateAmountEur: action,
    });

    this.updateTitle = this.updateTitle.bind(this);
    this.updateAmountPln = this.updateAmountPln.bind(this);
    this.updateAmountEur = this.updateAmountEur.bind(this);
  }

  updateTitle(title: string) {
    this.title = title;
  }

  updateAmountPln(amountPln: number) {
    this.amountPln = amountPln;
  }

  updateAmountEur(amountEur: number) {
    this.amountEur = amountEur;
  }
}

export default Expense;
