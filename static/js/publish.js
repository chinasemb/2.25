/* 
  提交发布新的菜谱
  content-type 不应该是这样的
  Content - Type: application / x - www - form - urlencoded;
  charset = UTF - 8
  content - type 应该是这样的
  contentType: 'application/json;chatset=utf-8'

*/



$('.submit').on('click', function () {

  let id = $('#id').val()
  // console.log(id);
  // return



  /* 
    收集整理材料组的数据
   */
  let ingredientsM = []
  $('.foodlist.m li').each(function (index, li) {
    // console.log(index, li);
    let inputs = $(li).find('input')
    // console.log(inputs[0].value);
    ingredientsM.push({
      k: inputs.eq(0).val(),
      v: inputs.eq(1).val()
    })
  })

  let ingredientsS = []
  $('.foodlist.s li').each(function (index, li) {
    // console.log(index, li);
    let inputs = $(li).find('input')
    // console.log(inputs[0].value);
    ingredientsS.push({
      k: inputs.eq(0).val(),
      v: inputs.eq(1).val()
    })
  })


  /* 
    收集成品图
  */
  let covers = []
  $('.thumb_list img').each((index, img) => {
    covers.push($(img).attr('_src'))
  })


  /* 
  步骤
*/
  let steps = []
  $('.piclist li').each((index, li) => {
    steps.push({
      p: $(li).find('img').attr('_src'),
      d: $(li).find('textarea').val()
    })
  })




  let data = JSON.stringify({
    id: id,
    categoryId: $('#categoryId').val(),
    name: $('#name').val(),
    description: $('#description').val(),
    tips: $('#tips').val(),

    taste: $('#taste').text(),
    craft: $('#craft').text(),
    needTime: $('#needTime').text(),
    cookers: $('#cookers').text() == '' ? [] : $('#cookers').text().split(','),
    ingredients: {
      m: ingredientsM,
      s: ingredientsS
    },
    covers,
    steps
  })

  // console.log(JSON.parse(data));


  // return

  let url = '/user/publish'
  if (id) {
    //代表修改页面
    url= '/user/cookbook/edit/'
  }

  $.ajax({
    method: 'post',
    url,
    contentType: 'application/json;chatset=utf-8',
    data
  }).done(data => {
    // console.log(data);
    if (data.data.code) {
      $('.message').html(data.data.message).css('color','red');
    }else{
      if (id) {
        //修改
        $('.message').html('修改成功').css('color', 'green');
        window.location.reload()
      }else{
        //新增
        $('.message').html('success').css('color', 'yellow');
        setTimeout(() => {
          window.location = '/user/cookbook'
        }, 1000);
      }
      
    }
  })
})

$(document).on('click', function () {
  $('.selectoption').addClass('hidden')
})




$('.optionlist li i').on('click', function (e) {

  e.stopPropagation()

  // console.log(0);
  // console.log(  $(this).parent().next()  );

  $('.optionlist .selectoption').addClass('hidden')

  $(this).parent().next().removeClass('hidden')


})


$('.selectoption span').on('click', function (e) {

  e.stopPropagation()

  let $em = $(this).parent().prev().find('em')
  /* 
    判断当前是否是 已经选择的项

    如果是多选的话,判断的条件是$em.text() 里面是否包含而不是相等
  */

  if ($em.hasClass('more_option')) {
    //多选
    let arr = $em.text() != '' ? $em.text().split(',') : []
    if (arr.includes($(this).text())) {
      //如果被包含,当前已经被选中了,就去除掉
      $(this).css({
        backgroundColor: '',
        color: ''
      })
      arr = arr.filter(v => v != $(this).text())
    } else {
      $(this).css({
        backgroundColor: 'red',
        color: 'white'
      })
      arr.push($(this).text())
    }
    $em.text(arr.join(','))
  } else {
    //清除所有的
    $(this).siblings().css({
      backgroundColor: '',
      color: ''
    })
    //单选
    if ($em.text() == $(this).text()) {
      //和当前的相同,则清空
      $(this).css({
        backgroundColor: '',
        color: ''
      })
      $em.text('')
    } else {
      $em.text($(this).text())
      $(this).css({
        backgroundColor: 'red',
        color: 'white'
      })
    }




  }


})


/* 
  主料与辅料
*/

$('.addfood .button').on('click', function () {
  // console.log('...');
  let $li = $('<li>').addClass('foodnum clearfix')
  let input1 = $('<input type="text">').attr('placeholder', '食材名').appendTo($li)
  let input2 = $('<input type="text">').attr('placeholder', '用量').appendTo($li)
  let button = $('<button>').appendTo($li).html('X').on('click', function () {
    $li.remove()
  })

  $(this).prev().append($li)
})


/* 
  上传成品图片
*/

$('#thumb').on('change', function () {
  // console.log(this.files);

  let arr = [...this.files]
  // console.log(arr);
  arr.forEach(file => {
    //每一张图片上传
    let fd = new FormData(); //js当中原生的对象

    fd.append('cover', file)


    $.ajax({
      method: 'post',
      url: '/user/publish/cover?type=cookbooks',
      processData: false,
      contentType: false,
      data: fd
    }).done(data => {
      if (!data.code) {
        //success
        console.log('success');

        // console.log(data);
        /* $('.avatar').attr('src', '/public/uploads/avatar/' + data.data.url) */
        let $li = $('<li>')
        let $img = $('<img>').attr('src', '/public/uploads/cookbooks/' + data.data.url).attr('_src', data.data.url).appendTo($li)
        let $span = $('<span>').text('删除').on('click', function () {
          $(this).parent().remove()
        }).appendTo($li)

        $('.thumb_list').append($li)
      }
    })
  });

})


/* 
  上传步骤
*/
$('#step').on('change', function () {
  // console.log(this.files);

  let arr = [...this.files]
  // console.log(arr);
  arr.forEach(file => {
    //每一张图片上传
    let fd = new FormData(); //js当中原生的对象

    fd.append('cover', file)


    $.ajax({
      method: 'post',
      url: '/user/publish/cover?type=cookbooks',
      processData: false,
      contentType: false,
      data: fd
    }).done(data => {
      if (!data.code) {
        //success
        // console.log('success');

        // console.log(data);
        /* $('.avatar').attr('src', '/public/uploads/avatar/' + data.data.url) */
        let $li = $('<li class="clearfix">').html(`
            <label id='sc'>
                <img 
                  _src = "${data.data.url}"
                  src = "/public/uploads/cookbooks/${data.data.url}"
                />
            </label>
            <textarea name="miaoshu" placeholder="请输入做法说明菜谱描述，最多输入200字"></textarea>
            <aside class="side_skill">
                <span class = "remove">X</span>
                <span class = "up" > ∧ </span>
                <span class = "down" > ∨ </span>
            </aside>
        `)


        $('.piclist').append($li)
      }
    })
  });

})

/* 
  给每一个  X  号  , 上移,下移号 添加事件的话 ,像这种不应该  给每个添加的方式, 应该 给他们的父级 添加事件委托
*/
$('.piclist').delegate('span.remove', 'click',function () {
  // console.log(this);
  $(this).parent().parent().remove()
  
})
$('.piclist').delegate('span.up', 'click',function () {
  // console.log(this);
  $(this).parent().parent().insertBefore($(this).parent().parent().prev())
  
})
$('.piclist').delegate('span.down', 'click',function () {
  // console.log(this);
  $(this).parent().parent().insertAfter($(this).parent().parent().next())
  
})


