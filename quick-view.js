$(document).ready(function(){
  $(".nws-quick-veiw-btn").click(function(){
    
    $("#nws-quick-view").show();
    
    setTimeout(function(){ $("#nws-quick-view").addClass("quick-view-on"); }, 100);
    
    $("body").addClass("quick-view-open");
    
    if ($('#quick-view').length == 0){$("body").append('<div id="quick-view"></div>');}

    var product_handle = $(this).data('handle');
    
    var Nwsoptions = $('.'+product_handle+'_options').html();
    var tabs = $('.'+product_handle+'_tabs').html();
    var pid = $('.'+product_handle+'_id').val();

    $('#quick-view').addClass(product_handle);

    jQuery.getJSON('/products/' + product_handle + '.js', function (product) {
      
      //console.log(product);

      var dataTitle = product.title
      var proTitle = dataTitle.split('|');
      if(proTitle[1]){
        var title_heading = proTitle[0]+"<span>"+proTitle[1]+"</span>";
      }else{
        var title_heading = dataTitle;
      }

      var ProductID = product.id;
      
      var title = title_heading;

      var type = product.type;

      var price = 0;

      var original_price = 0;

      var desc = product.description;

      var images = product.images;
      
      var medias = product.media;

      var variants = product.variants;

      var options = product.options;

      var url = '/products/' + product_handle;
      
      $('.qv-product-title').html(title);

    
      $('.view-product').attr('href', url);
  
      var newPurchaseAmount = product.price;
      $('.qv-product-options').html(Nwsoptions);
      var subtext = desc.replace(/(<([^>]+)>)/ig,"");
      if(subtext.length > 255){ $('.qv-product_desc p').text(subtext.substring(0,250) + '.....'); }
      $('.qv-product_tabs').html(tabs);
      $('#quick-view .nws-product-form__variants').val(pid);
      
      var imageCount = $(images).length;
      
      //console.log(product);

      $(medias).each(function (i, image) {
        
        var alt = image.alt;
        var alt_arr = 'nws-gb-images';
		
        if (i == imageCount - 1) {

          var image_embed = '<div class="'+alt_arr+' none-nws-img" ><img class="image_qv" src="' + image.src + '"></div>';

          image_embed = image_embed.replace('.jpg', '_600x.jpg').replace('.png', '_600x.png');

          $('.qv-product-images').append(image_embed);

          
        } else {
          
          //console.log(print_r(options));

          image_embed = '<div class="'+alt_arr+' none-nws-img" ><img class="image_qv" src="' + image.src + '"></div>';

          image_embed = image_embed.replace('.jpg', '_600x.jpg').replace('.png', '_600x.png');

          $('.qv-product-images').append(image_embed);

        }

      });

      $(product.variants).each(function (i, v) {

        if (v.inventory_quantity == 0) {

          $('.qv-add-button').prop('disabled', true).val('Sold Out');

          $('.qv-add-to-cart').hide();

          $('.qv-product-price').text('Sold Out').show();

          return true

        } else {

          price = parseFloat(v.price / 100).toFixed(2);

          original_price = parseFloat(v.compare_at_price / 100).toFixed(2);

          $('.qv-product-price').text('$' + price);

          if (original_price > 0) {
            $('.qv-product-original-price').text('$' + original_price).show();
          } else {
            $('.qv-product-original-price').hide();
          }
          return false
        }
      });
      
      if(Nwsoptions != ''){
        $("input.product-form__variants").click(function () {
          var value = $(this).val();
          var uid = $(this).attr('data-uid');
          var optVal = $(this).attr('data-option');
          var ImgID = $(this).attr('data-img-id');
          var ColorName = $(this).attr('data-select-value');
          //ColorName = ColorName.replace('-',' ');
          
          $('.qv-product-options .nws-fake-selection-li[data-option="'+optVal+'"]').removeClass('nws-fs-active');
          $(this).parent().addClass('nws-fs-active');
          $('.qv-product-options .nws-name-color').text(ColorName);
          $('#quick-view .nws-product-form__variants').val(value);
       });
	  }

      $("form.product-form").each( function () {
        $(this).bind("submit",function(e){
          e.preventDefault();
          var formID = $(this).attr("id");
          $.ajax({
            type: 'post',
            url: '/cart/add.js',
            data: $(this).serialize(),
            dataType: 'json',
            success: function(resp) {
              $(".nws-qv-close").click();
              Shopify.KT_getCart(); 
              KT.drawOpen();
              //console.log(success);
            },
            error: function(error) {
              //console.log(error)
            }
          });
          return false;
        });
      });
      
    });
    
  });
  
  $(".nws-qv-close").click(function(){
    $("#nws-quick-view").hide();
  	$("#nws-quick-view").removeClass("quick-view-on");
    $("body").removeClass("quick-view-open");
    $('.qv-product-images').empty();
    $('.qv-product-options').empty();
    $('.qv-product_desc p').empty();
  });
  $(".nws-qv-overlay").click(function(){
    $("#nws-quick-view").hide();
  	$("#nws-quick-view").removeClass("quick-view-on");
    $("body").removeClass("quick-view-open");
    $('.qv-product-images').empty();
    $('.qv-product-options').empty();
    $('.qv-product_desc p').empty();
  });
  
});
