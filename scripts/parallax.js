


 
function initParrallax(targetId){

	var slide = $('#'+targetId);

	/*$( "window" ).scroll(function() {
	 	console.log(isScrolledIntoView(slide));
	});*/

	slide.appear(function() {
	  if(typeof player.stopVideo != "undefined") player.playVideo();
	});

	slide.on('appear', function(event, $all_appeared_elements) {
      // this element is now inside browser viewport
        
      if(isScrolledIntoView(slide)){
      	if(typeof player.stopVideo != "undefined") player.playVideo();
      }else{
      	if(typeof player.stopVideo != "undefined") player.stopVideo();
      }
    });

    slide.on('disappear', function(event, $all_disappeared_elements) {
      // this element is now outside browser viewport
      if(typeof player.playVideo != "undefined") {player.stopVideo();
                //$(".item-wrapper:not(#"+ targetId+")").fadeOut();
       }
    });


	//Setup waypoints plugin
    /*slide.waypoint(function (event, direction) {
    	if (direction === 'down') {
           //console.log("video player");
           if(typeof player.playVideo != "undefined") {
           		player.playVideo();
                //$(".item-wrapper:not(#"+ targetId+")").fadeOut();
           }
        }
        if (direction === 'up'){
           if(typeof player.stopVideo != "undefined") player.stopVideo();
        }

        //cache the variable of the data-slide attribute associated with each slide
        //dataslide = $(this).attr('data-slide');
        //If the user scrolls up change the navigation link that has the same data-slide attribute as the slide to active and 
        //remove the active class from the previous navigation link 
        //if (direction === 'down') {
            //$('.navigation li[data-slide="' + dataslide + '"]').addClass('active').prev().removeClass('active');
        //}
        // else If the user scrolls down change the navigation link that has the same data-slide attribute as the slide to active and 
        //remove the active class from the next navigation link 
        //else {
           // $('.navigation li[data-slide="' + dataslide + '"]').addClass('active').next().removeClass('active');
        //}

    },{offset: '80%'});

	slide.waypoint(function (event, direction) {
    	if (direction === 'down') {
           if(typeof player.playVideo != "undefined") {
           		player.stopVideo();
                //$(".item-wrapper:not(#"+ targetId+")").fadeOut();
           }
        }
    },{
    	offset: function(){
    		return -$(this).outerHeight();
    	}
    }).waypoint(function (event, direction) {
        if (direction === 'up'){
           if(typeof player.stopVideo != "undefined") player.playVideo();
        }
    },{
    	offset: function(){
    		return $(this).outerHeight()/2;
    	}
    });*/


}

function isScrolledIntoView(elem)
{
    var $elem = $(elem);
    var $window = $(window);
    var docViewTop = $window.scrollTop();
    var docViewBottom = docViewTop + $window.height();
    var elemTop = $elem.offset().top;
    var elemBottom = elemTop + $elem.height();
    var resultTop  = elemTop < screen.height + docViewTop - 200;
    var resultBottom  = elemBottom > docViewTop + 200;
    return resultTop && resultBottom;
}