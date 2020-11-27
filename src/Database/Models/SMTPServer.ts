import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";

export interface ISMTPServer {
  id: number;
  user: string;
  password: string;
  server: string;
  port: number;
  secure: boolean;
}

export class SMTPServer extends Model implements ISMTPServer {
  public id: number;
  public user: string;
  public password: string;
  public server: string;
  public port: number;
  public secure: boolean;
}

export const initializeModel = async (database: Sequelize) => {
  SMTPServer.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user: {
        type: new DataTypes.STRING(256),
        allowNull: false,
      },
      password: {
        type: new DataTypes.STRING(256),
        allowNull: false,
      },
      server: {
        type: new DataTypes.STRING(256),
        allowNull: false,
      },
      port: {
        type: new DataTypes.INTEGER,
        allowNull: false,
      },
      secure: {
        type: new DataTypes.TINYINT,
        allowNull: false,
        defaultValue: true
      }
    },
    {
      tableName: "smtp_servers",
      sequelize: database,
    }
  );

  await SMTPServer.sync({ force: false });
}
