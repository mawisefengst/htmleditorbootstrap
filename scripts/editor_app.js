var start_top, stop_top, start_left, stop_left, movement_horiz, movement_verti;

function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

function isDropingAllowed ( draggable, droppable ) {
    if ( draggable.data( 'drop_level' ) > droppable.data( 'drop_level' ) ) {
        return true;
    }
    return false;
}


// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);



(function($){

    var DdHelper = {};

    DdHelper.isDropingAllowed = function( draggable, droppable ) {
        if ( draggable.data( 'drop_level' ) > droppable.data( 'drop_level' ) ) {
            return true;
        }
        return false;
    }

    //initlize  pre existed dragable element   
    $(".pre_element_block").draggable({
        cursor: 'move',
        helper: 'clone',
        zIndex: 1000,
        revert: false,
        scroll: true,
        cursorAt: {left: 20},
        start: function( event, ui ) {
            var current = $( event.target );
            var element = current;
            //reduce elements opacity so user got a visual feedback on what he is editing
            current.css( {opacity: 0.4} );
            //remove all previous fusion-hover-active classes
            $( '.fusion-hover-active' ).removeClass( 'fusion-hover-active' );
            //add a class based on element's drop_level to the editor container that highlights all possible drop targets
            $( "#editor" ).addClass( 'select-target-' + element.data( 'drop_level' ) );
            //get start position of UI element
            start_top = ui.position.top;
            start_left = ui.position.left;
            //limit height and hide extra
            //if element dragged from tab
            if ( ui.helper.hasClass( 'pre_element_block' ) ) {
                ui.helper.css( 'height', '56' );
                ui.helper.css( 'width', '66' );
            } else { //if inside editor movement
                ui.helper.css( 'height', '100' );
            }
            //hide extra
            ui.helper.css( 'overflow', 'hidden' );
            $(ui.helper).addClass( 'fusion-dragging-element' );
            //get element parent ID
            window.oldParent = $( this ).parent().parent().attr( "id" );
        },
        stop: function( event, ui ) {
            var current = $( event.target );
            var element = current;
            //return opacity of element to normal
            $( event.target ).css( {opacity: 1} );
            //remove fusion-hover-active class from all elements
            $( '.fusion-hover-active' ).removeClass( 'fusion-hover-active' );
            //reset highlight on container class, currently application.css have setting for 4 nested level of element.
            //if you have more levels, just add it to the application.css like the other select-target
            $( "#editor" ).removeClass( 'select-target-1 select-target-2 select-target-3 select-target-4' );
            //patch for full widht to full widht
            /*if ( window.oldParent.length > 9 ) {
                var pElement = app.editor.selectedElements.get( window.oldParent );
                phpClass = pElement.get( 'php_class' );
                var cElement = app.editor.selectedElements.get( $( this ).attr( 'id' ) );
                if ( phpClass == 'TF_FullWidthContainer' && cElement.get( 'childrenId' ).length > 0 ) {
                    $( "#clone-element-" + $( this ).attr( 'id' ) ).trigger( "click" );
                    $( "#delete-element-" + $( this ).attr( 'id' ) ).trigger( "click" );
                }
            }*/
        }
    }); 
    
    //initlize existed editor dropable element
    $("#editor").droppable({
        tolerance: 'pointer',
        greedy: true,
        // if there's a draggable element and it's over the current element, this function will be executed.
        over: function( event, ui ) {
            var dropable = $( this );
            // check if the current element can accept the droppable element
            if (DdHelper.isDropingAllowed(ui.helper,dropable ) ) {
                // add active class that will highlight the element with gree, i.e. drop is allowed.
                dropable.parent().parent().removeClass( 'fusion-hover-active' );
                dropable.addClass( 'fusion-hover-active' );
            }
        },

        // if there's a draggable element and it was over the current element, when it moves out this function will be executed.
        out: function( event, ui ) {
            // remove the highlighted class. i.e. drop is not allowed
            $( this ).removeClass( 'fusion-hover-active' );
        },

        // when an element is droped in the current element, the following function executed.
        drop: function( event, ui ) {

            //if drop is from existed menu block
            if (ui.helper.find( '.element_block' ).length ){
                var originalElement = $(ui.helper)[0];
                var targetFunction = $(originalElement).data("function"); 
                //only for Col Options
                if(targetFunction == "fusionColOption"){
                    var targetWidthClass = $(originalElement).data("width_class");
                    var targetTitle = ui.helper.find("span").text();
                    var elementId = guidGenerator();
                    // get handle bar element and compile
                    var source   = $("#layer-3-template").html();
                    var template = Handlebars.compile(source);
                    var context = {width: targetWidthClass,title:targetTitle,id:elementId};
                    var html    = template(context);
                    var dropable = $(this);
                    dropable.append(html);
                    editor_layer_3.activeDrapAndDrop($,elementId);
                    //editor_layer_3.initLayer($,$(this),ui);
                }

                //only for fusionText
                if(targetFunction == "fusionText") editor_layer_4.initText($,$(this),ui);
                //only for fusionImg
                if(targetFunction == "fusionImg")  editor_layer_4.initImg($,$(this),ui);
                //only for fustionVideo/Slides
                if(targetFunction == "fusionVideo") editor_layer_4.initVideo($,$(this),ui);
                
            }else{
                //if drop is from existed block in editor
                stop_left = ui.position.left;
                stop_top = ui.position.top;
                // the target that we dropped the draggable on
                var dropable = $( this );
                var elements = dropable.find( '>.drag-element' ).not('.fusion-dragging-element'), offset = {}, method = 'after', toEl = false, position_array = [], last_pos, max_height;
                var currentKey;
                //console.log($(ui.helper).attr("elID"));
                var targetID = $(ui.helper).attr("elID");
                var targetElement = $("#"+targetID);
                $(targetElement).data({"left" : $(ui.helper).position().left, "top" : $(ui.helper).position().top });
                //iterate over all elements and check their positions
                var elementsArray = [];
                var sortedArray = [];
                for ( var i = 0; i < elements.length; i++ ) {
                    var current = elements.eq(i);
                    var offset = current.position();
                    var elID = current.attr( 'id' );
                    if(typeof current.data("left") != "undefined") offset.left = current.data("left");
                    if(typeof current.data("top") != "undefined") offset.top = current.data("top");
                    elementsArray.push({"id":elID,"left":offset.left, "top" : offset.top});
                }
                
                var grouped = _.groupBy(elementsArray,function(item){
                    return Math.floor(item.top / 90);
                });
                _.each(grouped,function(item){
                    item =  _.sortBy(item, "left");
                    _.each(item,function(sortedItem){
                        sortedArray.push(sortedItem);
                    })
                });
                _.each(sortedArray,function(item,index){
                    $("#"+item.id).data("sortIndex",index);
                });
                elements.sortDomElements(function(a,b){
                    var akey = $(a).data("sortIndex");
                    var bkey = $(b).data("sortIndex");
                    if (akey  < bkey) return -1;
                    else if (akey > bkey) return 1;
                    else return 0;    
                });
                elements.removeAttr("style"); 
                $(targetElement).removeData("left").removeData("top");
            }
        } 
    });

    $("body").on("click",".delete-element",function(){
        var targetID = $(this).data("targetid");
        $("#"+targetID).remove();
    });

    $(".pre_element_block").click(function(){
        var originalElement = $(this);
        var targetFunction = $(originalElement).data("function"); 
        var dropable = $("#editor");
        //only for Col Options
        if(targetFunction == "fusionColOption"){
            var targetWidthClass = $(originalElement).data("width_class");
            var targetTitle = $(this).find("span").text();
            var elementId = guidGenerator();
            // get handle bar element and compile
            var source   = $("#layer-3-template").html();
            var template = Handlebars.compile(source);
            var context = {width: targetWidthClass,title:targetTitle,id:elementId};
            var html    = template(context);
            dropable.append(html);
            editor_layer_3.activeDrapAndDrop($,elementId);
            //editor_layer_3.initLayer($,$(this),ui);
        }
        //only for fusionText
        if(targetFunction == "fusionText") editor_layer_4.initText($,dropable);
        //only for fusionImg
        if(targetFunction == "fusionImg")  editor_layer_4.initImg($,dropable);
        //only for fustionVideo/Slides
        if(targetFunction == "fusionVideo") editor_layer_4.initVideo($,dropable);
    });

    $(".blue_button_mini").click(function(){
        var htmlNode = $("#editor").html();
        if(htmlNode.length){
            if($("#editor").is(':visible')){
                $(".ytVideo").each(function(i,obj){
                    var targetId = $(obj).data("targetid");
                    var vId = $(obj).data("vid");
                    initVideoIframe(targetId,vId);
                    $(obj).remove();
                });
                //$("#preview").after($("#editor"));
                $("#preview").prepend($("#editor").children()).show();
                $("#editor").hide();
               // $("#preview").html(htmlNode).show();
                $(".layer-widget").hide();
                $(this).text("BACK TO EDITOR");
            }else{
                 $("#editor").prepend($("#preview").children()).show();
                // $("#preview").html("");
                 $(".layer-widget").show();
                 $(this).text("PREVIEW")
            }
        }
    });

})(jQuery);


function initVideoIframe(targetId,vId){
    var playHeight = $("#"+targetId).height();
    var playWidth = $("#"+targetId).width();
    player = new YT.Player(targetId, {
      height: playHeight, 
      width: playWidth, 
      videoId: vId,
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
    initParrallax(targetId);
}





jQuery.fn.sortDomElements = (function() {
    return function(comparator) {
        return Array.prototype.sort.call(this, comparator).each(function(i) {
              this.parentNode.appendChild(this);
        });
    };
})();