import { registerAs } from "@nestjs/config";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export default registerAs("dbConfig.dev", (): PostgresConnectionOptions =>
    ({
        url: process.env.URL,
        port: +(process.env.DB_PORT ?? 1111),
        type: "postgres",
        entities: [__dirname + "/../**/*.entity.{ts,js}"],
        synchronize: true,
    })
);