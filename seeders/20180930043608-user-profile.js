const md5 = require('md5');
const moment = require('moment');

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    return queryInterface.bulkInsert('user-profile', [
      {
        id: 1,
        userId: 1,
        avatar: '',
        mobile: '',
        email: 'mt@mt.com',
        nickname: '',
        realname: '',
        gender: '男',
        birthday: moment('1990-10-10').format('YYYY-MM-DD HH:mm:ss'),
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
      },
      {
        id: 2,
        userId: 2,
        avatar: '2.jpg',
        mobile: '13000000001',
        email: 'zmouse@miaov.com',
        nickname: 'zMouse',
        realname: '钟毅',
        gender: '男',
        birthday: moment('1984-10-10').format('YYYY-MM-DD HH:mm:ss'),
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
      },
      {
        id: 3,
        userId: 3,
        avatar: '1.jpg',
        mobile: '13000000003',
        email: 'reci@reci.com',
        nickname: 'reci',
        realname: '',
        gender: '男',
        birthday: moment('1994-10-10').format('YYYY-MM-DD HH:mm:ss'),
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
      },
      {
        id: 4,
        userId: 4,
        avatar: '',
        mobile: '13000000004',
        email: 'kimoo@kimoo.com',
        nickname: 'kimoo',
        realname: '',
        gender: '男',
        birthday: moment('1994-10-10').format('YYYY-MM-DD HH:mm:ss'),
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('user-profile', null, {});
  }
};
