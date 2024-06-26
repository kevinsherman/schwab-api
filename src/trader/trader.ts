import "dotenv/config";
import Base from "./base";

class Trader extends Base {
  hello() {
    const name = process.env.MY_NAME;
    return `Hello, ${name}!`;
  }

  getDummyData() {
    return this.axios.get("/64KB.json");
  }
  getDerp() {
    return this.derp;
  }

  foo = poop;
}

function poop(this: Base) {
  return "poop mah pants";
}

export default Trader;
