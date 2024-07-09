import Base, { Config } from "./Base";

class MarketData extends Base {
  constructor(config: Config) {
    config.baseURL = "https://api.schwabapi.com/marketdata/v1";
    super(config);
  }

  async getPriceHistory() {
    return this.axios.get("/pricehistory?symbol=AAPL");
  }
}

export default MarketData;
