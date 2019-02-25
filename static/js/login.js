$('form').on('submit',function(e) {
  e.preventDefault();

  $.ajax({
    method: this.method,
    url: this.action,
    contentType: 'application/json',
    data: JSON.stringify({
      username: this.username.value,
      password: this.password.value,
      rememberPass: this.rememberPass.checked

    })
  }).done(data => {
    if (data.code) {
      $('.message').html(data.message).css('color','red')
    }else{
      $('.message').html('登录成功~~').css('color','green')

      setTimeout( () => {

        window.location = '/';

      },1000 )

    }
  })
})