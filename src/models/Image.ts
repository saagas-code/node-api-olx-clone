import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../instances/mysql';

export interface ImageInstance extends Model {
    id: number,
    idAd: number,
    url: string,
    default: boolean,
    location: string
}

export const Image = sequelize.define<ImageInstance>('Image', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    idAd: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    default: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull:false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    }

}, {
    tableName: 'images',
    timestamps: false
})


