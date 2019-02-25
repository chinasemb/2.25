/* 
  修改个人基本资料
*/

$('.profile_form').on('submit',function (e) {
  

  //阻止默认行为
  e.preventDefault()

  $.ajax({
    method: this.method,
    url: this.action,
    data: {
      mobile: this.mobile.value,
      nickname: this.nickname.value,
      email: this.email.value,
      realname: this.realname.value,
      gender: this.gender.value,
      year: this.year.value,
      month: this.month.value,
      date: this.date.value,
    }
  }).done(data => {
    if (data.code) {
      $('.message').html(data.message).css('color','red')
    }else{
      console.log(2);
      
      $('.message').html('success').css('color', 'green')
      setTimeout(() => {
        window.location.reload()
        $('.message').html('success')
      }, 500);
    }
  })

})