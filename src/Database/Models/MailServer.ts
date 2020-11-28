import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";

export interface IMailServer {
  id: number;
  user: string;
  password: string;
  server: string;
  port: number;
  secure: boolean;
}

export class MailServer extends Model implements IMailServer {
  public id: number;
  public user: string;
  public password: string;
  public server: string;
  public port: number;
  public secure: boolean;
}

/* istanbul ignore next */
export const initializeModel = async (database: Sequelize) => {
  MailServer.init(
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
      tableName: "mail_servers",
      sequelize: database,
      charset: 'utf8',
      collate: 'utf8_general_ci'
    }
  );

  await MailServer.sync({ force: false });
}
