import got, { Got } from "got";
import HttpAgent from "agentkeepalive";

const { HttpsAgent } = HttpAgent;

const getGotClient = (): Got => {
  const httpAgent = new HttpAgent();
  const httpsAgent = new HttpsAgent();

  return got.extend({
    responseType: "json",
    agent: {
      http: httpAgent,
      https: httpsAgent,
    },
  });
};

export { getGotClient };
