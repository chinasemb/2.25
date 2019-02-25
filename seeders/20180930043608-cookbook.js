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

    return queryInterface.bulkInsert('cookbook', [
      {
        id: 1,
        name: '猪脚姜',
        userId: 1,
        categoryId: 11,
        covers: '["cover-1.jpg"]',
        description: '据说猪脚姜是广东产妇坐月子必吃的一道菜，有祛风驱寒、恢复身体、补气血的功效，也适合女人滋补的特色菜品，可以长期食用！',
        craft: '炖',
        level: '普通',
        taste: '酸甜',
        needTime: '数小时',
        cookers: '["瓦煲"]',
        favoriteCount: 1,
        commentCount: 5,
        ingredients: '{"m": [{"k":"新鲜猪蹄","v":"600g"},{"k":"水煮蛋","v":"2个"}],"s":[{"k":"添丁醋","v":"900ml"}]}',
        steps: '[{"p":"pic-1.jpg","d":"买新鲜猪蹄的时候喊老板砍成大小差不多的块，拿回家边洗边用刀刮掉表皮的脏东西，并把细毛夹干净。"},{"p":"pic-2.jpg","d":"煮好的鸡蛋去壳备用。"},{"p":"pic-3.jpg","d":"制作猪脚姜的添丁醋。（成都这边没有卖，我在网上买的)"},{"p":"pic-4.jpg","d":"小黄姜已经去皮，剁碎备用。"},{"p":"pic-5.jpg","d":"洗干净的猪蹄放开水里（加花椒去腥味）焯血水（大约两分钟）后用水冲洗干净备用。"},{"p":"pic-6.jpg","d":"平底锅内不加油，放入小黄姜小火翻炒掉水分盛出备用。"},{"p":"pic-7.jpg","d":"把大约900毫升的添丁醋倒入砂锅里烧开。"},{"p":"pic-8.jpg","d":"把醋烧开的时间，把猪蹄放平底锅里煎一下。"},{"p":"pic-9.jpg","d":"煎到没有水分出来就可以了。"},{"p":"pic-10.jpg","d":"醋开了之后，把炒好的小黄姜、鸡蛋和猪蹄放进去，盖上盖子细火慢炖一个半小时左右。"},{"p":"pic-11.jpg","d":"香溢软糯的猪脚姜就做好了！"},{"p":"pic-12.jpg","d":"看着是不是很有食欲？"}]',
        tips: '1、如果口味重的可以加点盐，我只放了添丁醋！2、没有砂锅就用普通锅。'
      },
      {
        id: 2,
        name: '家常炒葫芦',
        userId: 1,
        categoryId: 11,
        covers: '["cover-2.jpg","cover-3.jpg"]',
        description: '儿子超级喜欢炒葫芦，用汁来拌饭很鲜美！今来一款：家常炒葫芦，美味快手菜，低脂更健康。',
        craft: '炒',
        level: '简单',
        taste: '清淡',
        needTime: '廿分钟',
        cookers: '["炒锅"]',
        favoriteCount: 1,
        commentCount: 3,
        ingredients: '{"m": [{"k":"西葫芦","v":"一个"},{"k":"番茄","v":"两个"}],"s":[{"k":"油","v":"适量"}]}',
        steps: '[{"p":"pic-13.jpg","d":"所需食材准备就绪。"},{"p":"pic-14.jpg","d":"葱姜蒜，番茄改刀。"},{"p":"pic-15.jpg","d":"葫芦青椒改刀备用。"},{"p":"pic-16.jpg","d":"锅中入油炒香葱姜蒜。"},{"p":"pic-17.jpg","d":"倒入葫芦和青椒翻炒。"},{"p":"pic-18.jpg","d":"放入番茄和五香粉，生抽。"},{"p":"pic-19.jpg","d":"出锅加盐调味即可。"},{"p":"pic-20.jpg","d":"家常小菜，请您品鉴。"},{"p":"pic-21.jpg","d":"成品图。"}]',
        tips: '大火快炒，锁住营养！祝您愉快！'
      },
      {
        id: 3,
        name: '蝴蝶结翻糖蛋糕',
        userId: 3,
        categoryId: 17,
        covers: '["cover-4.jpg"]',
        description: '翻糖蛋糕是起源于英国的艺术蛋糕，具有很强的欣赏价值，还可以收藏，据说翻糖蛋糕的吃法，是先把里面的蛋糕吃完，然后把翻糖包上保鲜膜放到饼箱里七天时间,等水份蒸发干以后，翻糖可保存十年，聚会，生日，婚礼上漂亮的翻糖蛋糕都可以收藏，以后每当看到这翻糖都会给人留下美好温馨的回忆，是可甄藏的纪念品',
        craft: '["烘焙"]',
        level: '普通',
        taste: '甜味',
        needTime: '数小时',
        cookers: '电烤箱',
        favoriteCount: 2,
        commentCount: 2,
        ingredients: '{"m": [{"k":"六寸蛋糕","v":"一个"},{"k":"打发奶油","v":"适量"}],"s":[{"k":"蜂蜜","v":"适量"}]}',
        steps: '[{"p":"pic-22.jpg","d":"准备六寸蛋糕一个"},{"p":"pic-23.jpg","d":"奶油打发好"},{"p":"pic-24.jpg","d":"在蛋糕表面削平，表面及侧面都涂一层奶油，用刮刀抹平"},{"p":"pic-25.jpg","d":"操做垫和手上抹点白油防沾，取翻糖膏(能盖住蛋糕表面及侧面)适量，搓圆，按扁后擀片"},{"p":"pic-26.jpg","d":"盖在蛋糕上，多余的切掉，用抹平工具把表面和侧面都抹平整"},{"p":"pic-27.jpg","d":"取干佩斯，用牙签沾上一点蓝色素，揉匀，擀成长条，两边裁齐"},{"p":"pic-28.jpg","d":"翻蛋糕底部刷蜂蜜，把条围一圈沾在上面"},{"p":"pic-29.jpg","d":"用小花膜具在条上挨排印上花形印"},{"p":"pic-30.jpg","d":"再擀一条，裁齐，断两截"},{"p":"pic-31.jpg","d":"交差沾上蛋糕上面，要刷蜂蜜粘合"},{"p":"pic-32.jpg","d":"用餐巾纸卷个卷，边缘沾上，卷两只"},{"p":"pic-33.jpg","d":"再擀长方形片，四边裁掉，大小要根据蛋糕来定，从中间一断两片"},{"p":"pic-34.jpg","d":"取一片包在纸卷上，边缘齐沾好"},{"p":"pic-35.jpg","d":"底边处捏上褶"},{"p":"pic-36.jpg","d":"用小刷沾蜂蜜在褶皱位置刷好沾上，两片都弄好"},{"p":"pic-37.jpg","d":"用裁刀把边缘切齐"},{"p":"pic-38.jpg","d":"两个中间抹蜂蜜"},{"p":"pic-39.jpg","d":"沾在一起"},{"p":"pic-40.jpg","d":"再擀一长片，裁长条形"},{"p":"pic-41.jpg","d":"用手捏出褶"},{"p":"pic-42.jpg","d":"结接口处抹蜂蜜，竖起来摆在中间，两边多余的切掉，两边往里围一下"},{"p":"pic-43.jpg","d":"再裁两片长方形"},{"p":"pic-44.jpg","d":"取一片在边缘处捏褶，也同样把褶沾上，两个都沾好"},{"p":"pic-45.jpg","d":"在蝴蝶结的中间刷蜂蜜，把两个摆带沾在上面，摆带底部斜裁一刀，做好后不能动，等待晾干"},{"p":"pic-46.jpg","d":"蝴蝶结晾干后抽出餐巾纸，蛋糕上刷蜂蜜把它沾在上面就好"},{"p":"pic-47.jpg","d":"晾干过程中"},{"p":"pic-48.jpg","d":"成品图"},{"p":"pic-49.jpg","d":"再来一张"}]',
        tips: '粘合剂我认为蜂蜜比较好，又方便，蛋糕胚用海绵能承重即可，翻糖干佩斯在制做过程中要盖保鲜膜，以免风干，加色素后要以搓的方法揉匀，弄到手上要洗净再弄下中颜色，以免混色不好看'
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
    return queryInterface.bulkDelete('cookbook', null, {});
  }
};
