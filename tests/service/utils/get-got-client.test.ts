import { getGotClient } from "../../../src";
import nock from "nock";

afterAll(async () => {
  await nock.cleanAll();
});

test("should get got client", async () => {
  nock("http://localhost:80").get("/test").reply(200);
  const response = await getGotClient().get("http://localhost:80/test");
  expect(response.statusCode).toEqual(200);
});
