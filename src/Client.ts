import { Config } from "./Base";
import MarketData from "./MarketData";
import Trader from "./Trader";

// wrapper for Data and Trader
class Client {
  MarketData: MarketData;
  Trader: Trader;

  constructor(config: Partial<Config>) {
    this.MarketData = new MarketData(config);
    this.Trader = new Trader(config);

    if (config.onNewTokenFunc) {
      this.Trader.on("token", config.onNewTokenFunc);
      this.MarketData.on("token", config.onNewTokenFunc);
    }
  }
}

export default Client;
