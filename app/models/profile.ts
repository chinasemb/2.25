import * as Sequelize from 'sequelize';
import { Instance } from 'sequelize';
import sequelize from './index';



interface Fields {
  id?: number,
  createdAt?: Date,
  updatedAt?: Date
}

interface ProfileFields extends Fields {
  userId?: number,
  mobile?: string,
  email?: string,
  nickname?: string,
  realname?: string,
  gender?: string,
  birthday?: string,
  createdAt?: Date,
  updatedAt?: Date,
  avatar?: string
}



export default sequelize.define<Instance<ProfileFields>, ProfileFields>("user-profile", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  nickname: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: ''
  },
  userId: {
    type: Sequelize.INTEGER,
    unique: true,
    allowNull: false,
    defaultValue: 0,
    references:{
      model: 'user',
      key: 'id'
    }
  },
  avatar: {
    type: Sequelize.CHAR(20),
    allowNull: true,
    defaultValue: ''
  },
  mobile: {
    type: Sequelize.CHAR(12),
    unique: true,
    allowNull: false,
    defaultValue: ''
  },
  email: {
    type: Sequelize.STRING(50),
    unique: true,
    allowNull: false,
    defaultValue: ''
  },
  realname: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: ''
  },
  gender: {
    type: Sequelize.ENUM(['男', '女', '保密']),
    allowNull: false,
    defaultValue: '保密'
  },
  birthday: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE,
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE,
  }
}, {
    //默认表的名称会是对应模型名称的复数形式  根据实际情况,当前应用表的名称和模型名称是一致的,所以这里可以单独的设置表名
    tableName: 'user-profile'
  })