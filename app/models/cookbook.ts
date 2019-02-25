import * as Sequelize from 'sequelize';
import { Instance } from 'sequelize';
import sequelize from './index';

import { UserFields} from './user'



interface Fields {
  id?: number,
  createdAt?: Date,
  updatedAt?: Date
}

interface CookbookFields extends Fields {
  name?: string,
  pid?: number,
  userId?: number,
  categoryId?: number,
  covers?: string,
  description?: string,
  craft?: number,
  level?: number,
  taste?: number,
  needTime?: number,
  cookers?: string,
  ingredients?: string,
  steps?: string,
  tips?: string,
  favoriteCount?: number,
  commentCount?: number,
  user?: any,
  category?:any
}



export default sequelize.define<Instance<CookbookFields>, CookbookFields>("cookbook", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: ''
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    references:{
      model: 'user',
      key: 'id'
    }
  },
  categoryId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    references: {
      model: 'category',
      key: 'id'
    }
  },
  covers: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: '',
  },
  description: {
    type: Sequelize.STRING(2000),
    allowNull: false,
    defaultValue: '',
  },
  craft: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: '',
  },
  level: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: '',
  },
  taste: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: '',
  },
  needTime: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: '',
  },
  cookers: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: '',
  },
  ingredients: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: '',
  },
  steps: {
    type: Sequelize.STRING(2000),
    allowNull: false,
    defaultValue: '',
  },
  tips: {
    type: Sequelize.STRING(2000),
    allowNull: false,
    defaultValue: '',
  },
  favoriteCount: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  commentCount: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  createdAt: {
    allowNull: true,
    type: Sequelize.DATE,
    defaultValue: 0
  },
  updatedAt: {
    allowNull: true,
    type: Sequelize.DATE
  }
}, {
    //默认表的名称会是对应模型名称的复数形式  根据实际情况,当前应用表的名称和模型名称是一致的,所以这里可以单独的设置表名
    tableName: 'cookbook'
  })