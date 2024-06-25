import "dotenv/config";
import Trader from "../trader";

describe("trader", () => {
  it("hello", () => {
    const name = process.env.MY_NAME;
    const foo = new Trader({});
    expect(foo.hello()).toBe(`Hello, ${name}!`);
  });
});
