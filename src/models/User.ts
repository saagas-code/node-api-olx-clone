import { DataTypes, Model } from 'sequelize'
import { sequelize } from './../instances/mysql';
import { Ad } from './Ad';

export interface UserInstance extends Model {
    id: number,
    name: string,
    email: string,
    idState: number
    password: string,
    token: string
}

export const User = sequelize.define<UserInstance>('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    idState: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: true,
    },

}, {
    tableName: 'users',
    timestamps: false
})



