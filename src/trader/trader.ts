import "dotenv/config";

class Trader {
  public static hello() {
    const name = process.env.MY_NAME;
    return `Hello, ${name}!`;
  }
}

export default Trader;
