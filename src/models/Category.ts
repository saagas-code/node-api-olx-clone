import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../instances/mysql';

export interface CategoryInstance extends Model {
    id: number,
    name: string,
    slug: string
}

export const Category = sequelize.define<CategoryInstance>('Category', {
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
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: 'categories',
    timestamps: false
})


