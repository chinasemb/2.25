$('.food_img_thumb img').on('click',function (params) {
  
  $('.food_img_thumb img').removeClass('active');
  $(this).addClass('active');
  $('.food_img img').attr('src',this.src)


})