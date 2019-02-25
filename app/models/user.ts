import * as Sequelize from 'sequelize';
import { Instance } from 'sequelize';
import sequelize from './index';



interface Fields {
  id?: number,
  createdAt?: Date,
  updatedAt?: Date
}

export interface UserFields extends Fields {
  name?: string,
  pid?: number,
  username?: string,
  password?: string,
  disabled?: boolean,
  createdIpAt?: string,
  updatedIpAt?: string,
  createdAt?: Date,
  updatedAt?: Date,
  avatar?: string
}



export default sequelize.define<Instance<UserFields>, UserFields>("user", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  username: {
    type: Sequelize.STRING(50),
    unique: true,
    allowNull: false,
    defaultValue: ''
  },
  password: {
    type: Sequelize.CHAR(32),
    allowNull: false,
    defaultValue: ''
  },
  disabled: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  createdIpAt: {
    type: Sequelize.CHAR(15),
    allowNull: false,
    defaultValue: ''
  },
  updatedIpAt: {
    type: Sequelize.CHAR(15),
    allowNull: false,
    defaultValue: ''
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE
  }
}, {
    //默认表的名称会是对应模型名称的复数形式  根据实际情况,当前应用表的名称和模型名称是一致的,所以这里可以单独的设置表名
    tableName: 'user'
  })