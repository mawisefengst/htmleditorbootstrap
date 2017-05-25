var editor_layer_3 = {
    activeDrapAndDrop: function($,elementId){
        $( "#" + elementId ).draggable({
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
                current.css( {opacity: 0.4});
                $(ui.helper).attr("elID",$( event.target ).attr("id"));
                $(ui.helper).addClass( 'fusion-dragging-element' );
            },
            stop: function( event, ui ) {
                var current = $( event.target );
                var element = current;
                //return opacity of element to normal
                //$( event.target ).css({opacity: 1, left: $(ui.helper).position().left, top: $(ui.helper).position().top});
                $( event.target ).css({opacity: 1});
                //remove fusion-hover-active class from all elements
                $( '.fusion-hover-active' ).removeClass( 'fusion-hover-active' );
                //reset highlight on container class, currently application.css have setting for 4 nested level of element.
                //if you have more levels, just add it to the application.css like the other select-target
                $( "#editor" ).removeClass( 'select-target-1 select-target-2 select-target-3 select-target-4' );
            }
        });
        $( "#" + elementId ).droppable({
            tolerance: 'pointer',
            greedy: true,
            over: function( event, ui ) {
                var dropable = $( this );
                // check if the current element can accept the droppable element
                if (isDropingAllowed(ui.helper,dropable ) ) {
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
            drop: function( event, ui ) {
                 var dropable = $( this );
                 var originalElement = $(ui.helper)[0];
                 var targetFunction = $(originalElement).data("function"); 
                 if (isDropingAllowed(ui.helper,dropable ) ) {
                     if(ui.helper.find( '.element_block' ).length ){
                         //is from element model
                         //only for Col Options
                         if(targetFunction == "fusionText") editor_layer_4.initText($,$(this),ui);
                         //only for fusionImg
                         if(targetFunction == "fusionImg")  editor_layer_4.initImg($,$(this),ui);
                         //only for fustionVideo/Slides
                         if(targetFunction == "fusionVideo") editor_layer_4.initVideo($,$(this),ui);
                     }else{
                        var dropable = $( this );
                        var targetID = $(ui.helper).attr("elID");
                        var targetElement = $("#"+targetID); 
                        if(dropable.has(targetElement).length){
                            editor_layer_3.reOrder(dropable,targetElement,ui);
                        }else{
                            dropable.find(".ui-droppable.innerElement:first").append(targetElement);
                        }
                     }
                 }
            }
        });
    },
    reOrder: function(dropable,targetElement,ui){
        var elements = dropable.find( '.drag-element' ).not('.fusion-dragging-element'), offset = {}, method = 'after', toEl = false, position_array = [], last_pos, max_height;
        var currentKey;
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
        /*var grouped = _.groupBy(elementsArray,function(item){
            return Math.floor(item.top / 90);
        });
        _.each(grouped,function(item){
            item =  _.sortBy(item, "left");
            _.each(item,function(sortedItem){
                sortedArray.push(sortedItem);
            })
        });*/
        sortedArray = _.sortBy(elementsArray, "top");
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




