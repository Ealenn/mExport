import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";

export interface IEmail {
  serverId: number
  from: string
  to: string
  subject: string
  html: string
  text: string
}

export class Email extends Model implements IEmail {
  public serverId: number
  public from: string
  public to: string
  public subject: string
  public html: string
  public text: string
}

/* istanbul ignore next */
export const initializeModel = async (database: Sequelize) => {
  Email.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      serverId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      from: {
        type: new DataTypes.STRING(256),
        allowNull: false,
      },
      to: {
        type: new DataTypes.STRING(256),
        allowNull: false,
      },
      subject: {
        type: new DataTypes.STRING(256),
        allowNull: false,
      },
      html: {
        type: new DataTypes.STRING,
        allowNull: true,
      },
      text: {
        type: new DataTypes.STRING,
        allowNull: true,
      }
    },
    {
      tableName: "emails",
      sequelize: database,
      charset: 'utf8',
      collate: 'utf8_general_ci'
    }
  );

  await Email.sync({ force: false });
}
