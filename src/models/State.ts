import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../instances/mysql';

export interface StateInstance extends Model {
    id: number,
    name: string
}

export const State = sequelize.define<StateInstance>('State', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: 'states',
    timestamps: false
})


