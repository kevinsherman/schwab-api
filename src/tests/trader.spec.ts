import "dotenv/config";
import Trader from "../trader";

describe("trader", () => {
  it("can read from .env file", async () => {
    const name = process.env.MY_NAME;
    expect(name).toBe("Kevin");
  });

  it("trader can read from .env file", async () => {
    const name = process.env.MY_NAME;
    const foo = new Trader({});
    expect(foo.hello()).toBe(`Hello, ${name}!`);
  });

  it("sets auth header", async () => {
    const foo = new Trader({
      accessToken: "JRR Tolkien",
      returnFullResponse: true,
    });
    const dd = await foo.getDummyData();
    const headers = dd.request.getHeaders()["authorization"];
    expect(headers).toEqual("Bearer JRR Tolkien");
  });

  it("returns data", async () => {
    const foo = new Trader({
      accessToken: "JRR Tolkien",
      returnFullResponse: true,
    });
    const dd = await foo.getDummyData();
    const dd_data = dd.data;
    // console.log(foo.getDerp()); // what is this?

    expect(dd_data.length).toBeTruthy();
  });
});
