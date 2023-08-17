import { createClient, RedisClientType } from "redis";

class Redis {
  public client: RedisClientType | undefined;

  constructor() {}

  public async getClient() {
    if (!this.client) {
      this.client = createClient();
      await this.client.connect();
    }
    return this.client;
  }
}

export const redis = new Redis();
