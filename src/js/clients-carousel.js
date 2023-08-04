$(document).ready(function(){
    const owl = $('#slider');

    owl.owlCarousel({ 
        autoWidth: true,
        items: 1,
        autoplay: true,
        autoplayTimeout: 8000,
        loop: true      
    });
  });