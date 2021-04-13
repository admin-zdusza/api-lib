import pg from "pg";
import Knex, { Knex as KnexType } from "knex";
import { camelcase, snakecase } from "stringcase";

const getPostgresClient = (
  databaseUrl: string,
  databaseSsl: boolean,
  databaseRejectUnauthorized: boolean
): KnexType => {
  pg.types.setTypeParser(pg.types.builtins.INT8, (value: string) => {
    return parseInt(value);
  });
  pg.types.setTypeParser(pg.types.builtins.FLOAT8, (value: string) => {
    return parseFloat(value);
  });
  pg.types.setTypeParser(pg.types.builtins.NUMERIC, (value: string) => {
    return parseFloat(value);
  });
  return Knex({
    client: "pg",
    connection: {
      connectionString: databaseUrl,
      ...(databaseSsl
        ? {
          ssl: {
            rejectUnauthorized: databaseRejectUnauthorized,
          },
        }
        : {}),
    },
    pool: {
      afterCreate: function (connection, callback) {
        connection.query("SET TIME ZONE 'Europe/Warsaw';", function (err) {
          callback(err, connection);
        });
      },
    },
    wrapIdentifier: (value, origImpl) => origImpl(snakecase(value)),
    postProcessResponse: (result) => {
      if (Array.isArray(result)) {
        return result;
      } else {
        if (result.rows.length) {
          result.rows = result.rows.map((row) => {
            const newRow = {};
            Object.keys(row).map((key) => {
              newRow[camelcase(key)] = row[key];
            });
            return newRow;
          });
        }
        if (result.fields) {
          result.fields = result.fields.map((field) => {
            field.name = camelcase(field.name);
            return field;
          });
        }
        return result;
      }
    },
  });
};

export { getPostgresClient };
