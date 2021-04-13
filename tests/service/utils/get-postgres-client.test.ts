import { getPostgresClient } from "../../../src";
import { GenericContainer } from "testcontainers";

let container;

beforeAll(async () => {
  jest.setTimeout(300000);
  container = await new GenericContainer("postgres:10.16")
    .withEnv("POSTGRES_USER", "test")
    .withEnv("POSTGRES_PASSWORD", "test")
    .withExposedPorts(5432)
    .start();
});

afterAll(async () => {
  await container.stop();
  jest.setTimeout(5000);

});

test("should get postgres client", async () => {
  const dbUrl = `postgres://test:test@localhost:${container.getMappedPort(
    5432
  )}/test`;
  const db = await getPostgresClient(dbUrl, false, false);
  let response = await db.raw("select 1.2 as test_value_1, 1.2::float as test_value_2");
  expect(response.rows).toMatchSnapshot();
  await db.schema.createTable('test', function (table) {
    table.increments();
    table.string('name');
  });
  const insertResult = await db('test').insert([{name: 'test'}, {name: 'test2'}]).returning('*');
  expect(insertResult).toMatchSnapshot();
  response = await db.raw("select * from test");
  expect(response.rows).toMatchSnapshot();
});


test("should get postgres client with ssl", async () => {
  await expect(async () => {
    const dbUrl = `postgres://test:test@localhost:${container.getMappedPort(
      5432
    )}/test`;
    const db = await getPostgresClient(dbUrl, true, false);
    await db.raw('SELECT 1');
  })
    .rejects
    .toThrow('The server does not support SSL connections');
});
