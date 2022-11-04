import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../instances/mysql';
import { Category } from './Category';
import { Image } from './Image';
import { State } from './State';
import { User } from './User';

export type AdType = {
    id: number,
    idUser: number,
    idState: number,
    idCategory: number,
    dateCreated: Date,
    title: string,
    price: number,
    priceNegotiable: boolean,
    description: string,
    views: number,
    status: string
    Images: [{
        id: number,
        idAd: number,
        url: string,
        default: boolean

    }]
}

export interface AdInstance extends Model {
    id: number,
    idUser: number,
    idState: number,
    idCategory: number,
    dateCreated: Date,
    title: string,
    price: number,
    priceNegotiable: boolean,
    description: string,
    views: number,
    status: string
}

export const Ad = sequelize.define<AdInstance>('Ad', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    idUser: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    idState: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    idCategory: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    dateCreated: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    priceNegotiable: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    views: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true,
    },

}, {
    tableName: 'ads',
    timestamps: false
})


User.hasMany(Ad, {

    hooks: true,
    onDelete: 'CASCADE',
    foreignKey: 'idUser'
})

Category.hasMany(Ad, {

    hooks: true,
    onDelete: 'CASCADE',
    foreignKey: 'idCategory'
})

Ad.hasMany(Image, {

    hooks: true,
    onDelete: 'CASCADE',
    foreignKey: 'idAd'
})

Ad.belongsTo(User, {

    onDelete: 'CASCADE',
    hooks: true,
    foreignKey: 'idUser'
})
Ad.belongsTo(Category, {

    hooks: true,
    onDelete: 'CASCADE',
    foreignKey: 'idCategory'
})
Ad.belongsTo(State, {

    hooks: true,
    onDelete: 'CASCADE',
    foreignKey: 'idState'
})
User.belongsTo(State, {

    hooks: true,
    onDelete: 'CASCADE',
    foreignKey: 'idState'
})

Image.belongsTo(Ad, {

    hooks: true,
    onDelete: 'CASCADE',
    foreignKey: 'idAd',
})
