var textEditor;
var player;
function YouTubeGetID(url){
  var ID = '';
  url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  if(url[2] !== undefined) {
    ID = url[2].split(/[^0-9a-z_\-]/i);ID = ID[0];
  }else ID = url;
  return ID;
}

var editor_layer_4 = {
	initText :  function($,dropable,ui){
        var source   = $("#layer-4-text-template").html();
        var template = Handlebars.compile(source);
        var elementId = guidGenerator();
        var context = {"id":elementId};
        var html    = template(context);
        if(typeof ui != "undefined") this.initHtmlNode(dropable,html,elementId,ui.helper);
        else this.initHtmlNode(dropable,html,elementId);
        this.initClickEvent(elementId);
	},
	initImg :  function($,dropable,ui){
        var source   = $("#layer-4-image-template").html();
        var template = Handlebars.compile(source);
        var elementId = guidGenerator();
        var context = {"id":elementId};
        var html    = template(context);
        if(typeof ui != "undefined") this.initHtmlNode(dropable,html,elementId,ui.helper);
        else this.initHtmlNode(dropable,html,elementId);
        this.initClickEvent(elementId);
	},
	initVideo :  function($,dropable,ui){
        var source   = $("#layer-4-video-template").html();
        var template = Handlebars.compile(source);
        var elementId = guidGenerator();
        var context = {"id":elementId};
        var html    = template(context);
        if(typeof ui != "undefined") this.initHtmlNode(dropable,html,elementId,ui.helper);
        else this.initHtmlNode(dropable,html,elementId);
        this.initClickEvent(elementId);
	},
	initHtmlNode: function(dropable,html,elementId,helper){
        if(typeof helper != "undefined" && isDropingAllowed(helper,dropable)) this.initElement(dropable,html,elementId);
        else this.initElement(dropable,html,elementId);
	},
    initElement: function(dropable,html,elementId){
      if(dropable.attr("id") == "editor") dropable.append(html);
      else dropable.find(".ui-droppable.innerElement:first").append(html);
      $( "#" + elementId ).draggable({
            cursor: 'default',
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
    },
	initClickEvent: function(elementId){
		$("#"+elementId).find(".edit-element-text").click(function(){
			var targetId = $(this).data("targetid");
            var currentText = $("#"+ targetId).find(".fusion_iconbox_icon").html();
            if($("#"+ targetId).find(".fusion_iconbox_icon > small").length) currentText = "";
			if(typeof textEditor == "undefined"){
				bootbox.dialog({
				  title: "Enter Text Below",
				  className: "long",
				  message: '<div id="texteditor_wrapper" class="advertorial_editor" data-targetId="'+ targetId +'" data-width="625" data-height="475" data-textareaid="texteditor" data-maxlength="320"><dl class="texteditor " id="texteditor_field"><dt><label for="texteditor">text</label></dt><dd><textarea id="texteditor" name="text">'+ currentText +'</textarea><button type="submit" class="blue_button_mini revert_save">Save</button></dd></dl></div>'	
				});			
				var textEditor = TextEditor("texteditor_wrapper");
				textEditor.init();
				ieFix(textEditor);
			}
		});
		$("#"+elementId).find(".edit-element-image").click(function(){
			var targetId = $(this).data("targetid");
			bootbox.prompt({
				title: "Please enter image url below", 
				className: 'input-block-level',
				callback: function(result) {                
				  if (result === null) {                                             
	                 bootbox.hideAll();
	                 return false;           
				  } else {
				  	 var imageNode = $("<img class='entryimg' src='"+ result +"' />");
				  	 $("#"+targetId).find(".fusion_iconbox_icon").html(imageNode);                     
				  }
				}
			});
		});
		$("#"+elementId).find(".edit-element-video").click(function(){
			var targetId = $(this).data("targetid");
			bootbox.prompt({
				title: "Please enter youtube video url below", 
				className: 'input-block-level',
				callback: function(result) {                
					  if (result === null) {                                             
		                 bootbox.hideAll();
		                 return false;           
					  } else {
					  	var vId = YouTubeGetID(result);
					  	if(vId.length){
					  		result = "https://www.youtube.com/embed/"+ vId;
                            //initVideoIframe(targetId,vId);
                            var videoUri = "http://img.youtube.com/vi/"+ vId +"/0.jpg";
						    var iframeNodeImg = "<img class='ytVideo' data-targetid='"+ targetId +"' data-vid='"+ vId +"' src='"+ videoUri + "' />";
						  	$("#"+targetId).find(".fusion_iconbox_icon").html($(iframeNodeImg));
						}else alert("Please enter a valid youtube url");				
					  	bootbox.hideAll();                          
					  }
				}
			});
		});
	}
};



// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
function onYouTubeIframeAPIReady() {
    
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    //event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
    /*if (event.data == YT.PlayerState.PLAYING && !done) {
      setTimeout(stopVideo, 6000);
      done = true;
    }*/
}

function stopVideo() {
     player.stopVideo();
}







