var TextEditor = function(editorID, options) {
    var self = {};
    self.editor;
    var editorData = $("#" +  editorID); 
    options = $.extend(true, {
        width:editorData.data("width"),
        height:editorData.data("height"),
        textarea_id: editorData.data("textareaid"),
        targetid: editorData.data("targetid")
    }, options);
    
    self.saveText = function(value,id){
        $("#"+id).find(".fusion_iconbox_icon").html(value);
        bootbox.hideAll();
    }
    
    self.init = function() {    
        self.editor = new TINY.editor.edit('editor', {
            id: options.textarea_id,
            width: options.width,
            height: options.height,
            targetId: options.targetid,
            cssclass: 'tinyeditor',
            controlclass: 'tinyeditor-control',
            rowclass: 'tinyeditor-header',
            dividerclass: 'tinyeditor-divider',
            controls: ['bold', 'italic', 'underline', 'unformat',  'undo', 'style', '|', 'image', 'link', 'unlink', '|'],       
            xhtml: true,
            css:'body{ background-color:#fff;font-family:Arial; font-size:14px; line-height:1.5em;} h1 { font-size:18px;} h2 { font-size:16px; } h3 { font-size:15px;} .errorMessage{ color:red}', 
            bodyid: 'editor'        
        });
        
        if($("#" + options.textarea_id).length > 0) {
            $("button[type=submit]").click(function() {
                //update the textarea with the editor value
                self.editor.post();
                self.saveText(self.editor.t.value,self.editor.obj.targetId);
                //var textAreaHtml = editor.t.value;            
            })
        }
        
    };
    return self;
}


function readURL(){
     $("#contentFormUpload").ajaxSubmit({
         success:   function(responseText, statusText, xhr, $form){
             if(responseText.status == "success"){
                 $(".input-block-level").val(responseText.message);
                 $("#contentFormUpload")[0].reset();
                 $(".errorMessage").remove();
             }else{
                $(".errorMessage").remove();
                var message = JSON.parse(responseText.message).uploadpicture;
                $("#uploadpicture").after("<div class=errorMessage>"+ message[0] +"</div>");
             }
         }
     }); 
}


function ieFix(textEditor){
    //most of the below craziness is in place b/c IE wasn't working well
    var f = textEditor.editor.insert;
    textEditor.editor.insert = function(pro, msg, cmd){
         if(cmd!="createlink" && cmd!= "insertimage"){
            f.apply(textEditor.editor, arguments);
            return;
         }
        var d = textEditor.editor.e;
        var selection = d.getSelection();
        var range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
        var checkbox = null;
        var el = bootbox.prompt(pro, "Cancel", "OK", function(result) {                
            if(result!=null && result!= msg && range){
                var selectionContents = range.extractContents();
                var e = null;
                if(cmd=="createlink"){
                    e = d.createElement("a");
                    e.setAttribute('href', result);
                    if(checkbox && checkbox.is(":checked")) e.setAttribute('rel', 'nofollow');
                }else if(cmd=="insertimage"){
                    e = d.createElement("img");
                    e.setAttribute('src', result);
                }
                e.appendChild(selectionContents);
                range.insertNode(e);
            }
        }, msg);
        
        
        if(cmd=="createlink"){
            checkbox = $('<input style="margin:2px 4px 0 0; vertical-align:top" type="checkbox">');
            el.find('.modal-body').append(checkbox).append(' Add \'nofollow\' (i.e., &lt;a rel="nofollow" ...)')
        }
        
        if(cmd == "insertimage"){
            //var formNode = '<form id="contentFormUpload" action="4" method="POST" enctype="multipart/form-data"><input type="file" id="uploadpicture" name="uploadpicture" onchange="readURL()"></form>';
            //var uploadoform = "<input type=file id=landscapeImage name=landscapeImage>";
            //el.find('.modal-body').prepend(formNode);
        }
    
        el.find('.btn').addClass('white_button_mini');
        el.find('.btn-primary').removeClass('white_button_mini').addClass('blue_button_mini');
     }
}