import "dotenv/config";
import Base from "./base";

class Trader extends Base {
  hello() {
    const name = process.env.MY_NAME;
    return `Hello, ${name}!`;
  }
}

export default Trader;
