// 上传头像
$('.avatar').on('click',function () {
  // console.log(1);
  // console.log($('.avatarInput').click());
  
  //点击图片调用fileInput 的click方法,弹出选择文件对话框,
  $('.avatarInput').click();


})

//当用户选择要上传的文件以后,会触发input 的change 事件

$('.avatarInput').on('change',function () {
  //console.log(this.value);value 保存的是图片的路径和文件名称,而不是图片的二进制数据
  //图片的真实数据保存在 files属性中,给input file 加一个属性 multiple  这样就可以多选文件了.
  //我们传递的数据是二进制格式的数据,所以要使用formData对象来构建formData
  let fd = new FormData();//js当中原生的对象
  // console.log(this.files);
  //第一个参数是后端接受的key,第二个参数是value,
  //Uncaught TypeError: Illegal invocation  ?无效?
  //jq 默认情况下,会把数据处理成 urlencoded (key: value) 的格式
  //我们不需要jq 帮 我们处理,希望根据数据的格式自动进行构建  <processData: false>
  //jq 还会默认把content-type的类型设置成 application/x-www-form-urlencoded的格式
  fd.append('avatar',this.files[0])
  
  
  $.ajax({
    method: 'post',
    url: '/user/avatar',
    processData: false,
    contentType: false,
    data: fd
  }).done( data => {
    if (!data.code) {
      //success
      console.log(data);
      $('.avatar').attr('src','/public/uploads/avatar/' + data.data.url)
    }
  } )

})