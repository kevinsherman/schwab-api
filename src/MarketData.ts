import Base, { Config } from "./Base";

class MarketData extends Base {
  constructor(config: Config) {
    config.baseURL = "https://api.schwabapi.com/marketdata/v1";
    super(config);
  }

  async getPriceHistory(symbol: string) {
    return this.axios.get(`/pricehistory?symbol=${symbol}`);
  }
}

export default MarketData;
