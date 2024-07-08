import Base from "./Base";

class Trader extends Base {
  constructor(config: any) {
    config.baseURL = "https://api.schwabapi.com/trader/v1";
    super(config);
  }

  async getAccounts() {
    return this.axios.get("/accounts");
  }

  async getAccount(accountNumber: string) {
    return this.axios.get(`/accounts/${accountNumber}`);
  }

  async getAccountNumbers() {
    return this.axios.get("/accounts/accountNumbers");
  }
}

export default Trader;
