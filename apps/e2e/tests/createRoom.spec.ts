import { test, expect } from "@playwright/test";

test.describe("部屋作成画面 (CreateRoom)", () => {
  test.beforeEach(async ({ page }) => {
    // baseURL が設定されているのでパスだけでOK
    await page.goto("/");
  });

  test("初期表示: タイトルと作成ボタンが表示される", async ({ page }) => {
    // 実際の画面には <title> タグがない可能性があるため、h1要素を確認
    await expect(page.locator("h1")).toHaveText("Planning Poker");

    // 「部屋を作成する」ボタンが表示されていることを確認
    await expect(
      page.getByRole("button", { name: "部屋を作成する" })
    ).toBeVisible();
  });

  test("部屋作成ボタンをクリックすると、ローディング表示になり、その後元に戻る", async ({
    page,
  }) => {
    const createButton = page.getByRole("button", { name: "部屋を作成する" });
    const loadingButton = page.getByRole("button", { name: "作成中..." });

    // ボタンをクリック
    await createButton.click();

    // ボタンのテキストが「作成中...」になり、非活性化されていることを確認
    await expect(loadingButton).toBeVisible();
    await expect(loadingButton).toBeDisabled();
    await expect(createButton).not.toBeVisible(); // 元のボタンは非表示になるはず

    // 処理完了を待つ (タイムアウトを長めに設定)
    await expect(createButton).toBeVisible({ timeout: 10000 }); // タイムアウトを10秒に延長

    // ボタンが再び活性化し、テキストが元に戻っていることを確認
    await expect(createButton).toBeEnabled();
    await expect(loadingButton).not.toBeVisible();
  });

  // TODO: エラー発生時のテストケースを追加
  // TODO: 部屋作成成功時のテストケースを追加 (画面遷移や結果表示)
});
