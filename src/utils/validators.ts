export const isTitleValid = (title: string) => {
  if (title.length < 5) {
    alert("Title is too short!");
    return false;
  }
  return true;
};

export const isAmountValid = (amount: number) => {
  if (Number.isNaN(amount) || amount < 10) {
    alert("Amount is too low!");
    return false;
  }
  return true;
};
