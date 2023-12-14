import { test, expect, Page } from "@playwright/test";

const PAGE_ADDRESS = "http://localhost:5173/";

const createExpense = async (page: Page, title: string, amountPln: string) => {
  await expect(page.getByTestId("title")).toBeVisible();
  await page.getByTestId("title").fill(title);

  await expect(page.getByTestId("amountPln")).toBeVisible();
  await page.getByTestId("amountPln").fill(amountPln);

  await expect(page.getByTestId("submit")).toBeVisible();
  await page.getByTestId("submit").click();
};

const getTextContents = async (page: Page, testId: string) => {
  return await page.getByTestId(testId).allTextContents();
};

const handleDialog = (page: Page, type: string, message: string, value: string | undefined) => {
  page.on("dialog", async (dialog) => {
    expect(dialog.type()).toBe(type);
    expect(dialog.message()).toEqual(message);
    await dialog.accept(value);
  });
};

const checkamounts = async (
  page: Page,
  plnTestId: string,
  eurTestId: string,
  expectedAmountPln: string,
  expectedAmountEur: string
) => {
  const amountPln = await getTextContents(page, plnTestId);
  expect(amountPln[0]).toContain(expectedAmountPln);
  const amountEur = await getTextContents(page, eurTestId);
  expect(amountEur[0]).toContain(expectedAmountEur);
};

const checkEurSum = async (page: Page, eurTestId: string, expectedAmountEur: string, expectedSum: string) => {
  const amountEurBefore = await page.getByTestId(eurTestId).allTextContents();
  expect(amountEurBefore[0]).toContain(expectedAmountEur);
  const sumBefore = await page.getByTestId("sum").textContent();
  await expect(sumBefore).toBe(expectedSum);
};

const checkSort = async (
  page: Page,
  sortBy: string,
  firstTestId: string,
  secondTestId: string,
  thirdTestId: string
) => {
  await page.getByTestId(sortBy).click();
  await expect(page.getByTestId(firstTestId)).toBeVisible();
  await expect(page.getByTestId(secondTestId)).toBeVisible();
  await expect(page.getByTestId(thirdTestId)).toBeVisible();
};

test("add new expense", async ({ page }) => {
  await page.goto(PAGE_ADDRESS);
  await createExpense(page, "playwright-test", "55");

  await expect(page.getByTestId("playwright-test0")).toBeVisible();
});

test("delete expense", async ({ page }) => {
  await page.goto(PAGE_ADDRESS);
  await createExpense(page, "playwright-test", "55");

  await expect(page.getByTestId("playwright-test0Delete")).toBeVisible();
  await page.getByTestId("playwright-test0Delete").click();
  await expect(page.getByTestId("playwright-test0Delete")).toHaveCount(0);
});

test("show alert for too short title", async ({ page }) => {
  await page.goto(PAGE_ADDRESS);
  handleDialog(page, "alert", "Title is too short!", undefined);
  await createExpense(page, "test", "55");
});

test("show alert for too little amount", async ({ page }) => {
  await page.goto(PAGE_ADDRESS);
  handleDialog(page, "alert", "Amount is too low!", undefined);
  await createExpense(page, "playwright-test", "5");
});

test("calculate amount in euro based on exchange rate", async ({ page }) => {
  await page.goto(PAGE_ADDRESS);
  await createExpense(page, "playwright-test", "200");
  await expect(page.getByTestId("playwright-test0amountEur")).toBeVisible();

  const text = await getTextContents(page, "playwright-test0amountEur");
  expect(text[0]).toContain("50");
});

test("edit title", async ({ page }) => {
  await page.goto(PAGE_ADDRESS);
  handleDialog(page, "prompt", "Enter new title", "new-title");
  await createExpense(page, "playwright-test", "200");

  const title = await getTextContents(page, "playwright-test0title");
  expect(title[0]).toContain("playwright-test");
  await expect(page.getByTestId("playwright-test0Edittitle")).toBeVisible();
  await page.getByTestId("playwright-test0Edittitle").click();
  const newTitle = await getTextContents(page, "new-title0title");
  expect(newTitle[0]).toContain("new-title");
});

test("edit amount in PLN and recalculate amount in euro", async ({ page }) => {
  await page.goto(PAGE_ADDRESS);
  handleDialog(page, "prompt", "Enter new amount in PLN", "500");
  await createExpense(page, "playwright-test", "200");

  await expect(page.getByTestId("playwright-test0amountPln")).toBeVisible();
  await checkamounts(page, "playwright-test0amountPln", "playwright-test0amountEur", "200", "50");

  await page.getByTestId("playwright-test0EditamountPln").click();
  await checkamounts(page, "playwright-test0amountPln", "playwright-test0amountEur", "500", "125");
});

test("edit amount in euro and recalculate amount in PLN", async ({ page }) => {
  await page.goto(PAGE_ADDRESS);
  handleDialog(page, "prompt", "Enter new amount in Eur", "500");
  await createExpense(page, "playwright-test", "200");

  await expect(page.getByTestId("playwright-test0amountPln")).toBeVisible();
  await checkamounts(page, "playwright-test0amountPln", "playwright-test0amountEur", "200", "50");

  await page.getByTestId("playwright-test0EditamountEur").click();
  await checkamounts(page, "playwright-test0amountPln", "playwright-test0amountEur", "2000", "500");
});

test("calculate sum", async ({ page }) => {
  await page.goto(PAGE_ADDRESS);
  await createExpense(page, "playwright-test1", "100");
  await createExpense(page, "playwright-test2", "100");

  await expect(page.getByTestId("playwright-test10")).toBeVisible();
  await expect(page.getByTestId("playwright-test21")).toBeVisible();
  const text = await page.getByTestId("sum").textContent();
  await expect(text).toBe("Sum: 200 PLN (50 EUR)");
});

test("change exchange rate and recalcute amount in euro and sum", async ({ page }) => {
  await page.goto(PAGE_ADDRESS);
  handleDialog(page, "prompt", "Enter new exchange rate in PLN", "5");
  await createExpense(page, "playwright-test1", "100");
  await createExpense(page, "playwright-test2", "100");

  await expect(page.getByTestId("playwright-test10")).toBeVisible();
  await expect(page.getByTestId("playwright-test21")).toBeVisible();

  await expect(page.getByTestId("playwright-test10amountEur")).toBeVisible();
  await checkEurSum(page, "playwright-test10amountEur", "25", "Sum: 200 PLN (50 EUR)");

  await expect(page.getByTestId("exchangeRateButton")).toBeVisible();
  await page.getByTestId("exchangeRateButton").click();

  await checkEurSum(page, "playwright-test10amountEur", "20", "Sum: 200 PLN (40 EUR)");
});

test("sorting", async ({ page }) => {
  await page.goto(PAGE_ADDRESS);
  await createExpense(page, "aplaywright-test", "300");
  await createExpense(page, "cplaywright-test", "500");
  await createExpense(page, "bplaywright-test", "100");

  await expect(page.getByTestId("aplaywright-test0")).toBeVisible();
  await expect(page.getByTestId("cplaywright-test1")).toBeVisible();
  await expect(page.getByTestId("bplaywright-test2")).toBeVisible();

  await expect(page.getByTestId("sorttitle")).toBeVisible();
  await checkSort(page, "sorttitle", "aplaywright-test0", "bplaywright-test1", "cplaywright-test2");
  await checkSort(page, "sorttitle", "cplaywright-test0", "bplaywright-test1", "aplaywright-test2");
  await checkSort(page, "sorttitle", "aplaywright-test0", "cplaywright-test1", "bplaywright-test2");

  await checkSort(page, "sortamountPln", "bplaywright-test0", "aplaywright-test1", "cplaywright-test2");
  await checkSort(page, "sortamountPln", "cplaywright-test0", "aplaywright-test1", "bplaywright-test2");
  await checkSort(page, "sortamountPln", "aplaywright-test0", "cplaywright-test1", "bplaywright-test2");

  await checkSort(page, "sortamountEur", "bplaywright-test0", "aplaywright-test1", "cplaywright-test2");
  await checkSort(page, "sortamountEur", "cplaywright-test0", "aplaywright-test1", "bplaywright-test2");
  await checkSort(page, "sortamountEur", "aplaywright-test0", "cplaywright-test1", "bplaywright-test2");
});

test("searching and highlighting text", async ({ page }) => {
  await page.goto(PAGE_ADDRESS);
  await createExpense(page, "playwright-test1", "100");

  await expect(page.getByTestId("playwright-test10")).toBeVisible();
  await expect(page.getByTestId("search")).toBeVisible();
  await page.getByTestId("search").fill("wri");
  const markedText = await page.getByTestId("search1").textContent();
  await expect(markedText).toBe("wri");
});
