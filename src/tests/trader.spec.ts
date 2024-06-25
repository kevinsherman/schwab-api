import "dotenv/config";
import Trader from "../trader";

describe("trader", () => {
  it("hello", () => {
    const name = process.env.MY_NAME;
    expect(Trader.hello()).toBe(`Hello, ${name}!`);
  });
});
