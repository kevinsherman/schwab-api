import "dotenv/config";
import Trader from "../trader";

describe("trader", () => {
  it("hello", async () => {
    const name = process.env.MY_NAME;
    const foo = new Trader({});
    foo.config.accessToken = "JRR Tolkien";
    expect(foo.hello()).toBe(`Hello, ${name}!`);

    const dd = await foo.getDummyData();

    const ddd = foo.getDerp();

    console.log(JSON.stringify(dd.length, null, 2));
  });
});
