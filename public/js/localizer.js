$(function () {
    Asiance.$bigloader = $('#bigloader');

    var $studio = $('#studio');

    var $pickyourphoto = $('#pickyourphoto')
      , $workspace = $studio.find('#workspace')
      , $choice = $('#choice')
      , $sloader = $studio.find('.ajax-loader')
      , $imgform = $('#imgform')
      , $finput = $imgform.find('input[type=file]')
      , $messages = $('#messages')
      , $refresh = $('#refresh')
      , $photo = $('#photo')
      , $ploader = $photo.find('.ajax-loader')
      , $caption = $('#photo .caption')
      , $image = $('#photo .image');

    if (typeof Asiance !== 'undefined') {
        Asiance.caption = {
            c1: '#e62b47',
            c2: '#34414d',
            lang: 'ko',
            caption: '1'
        }
    }

    // click outside a box hides the current ui elements
    $('html').bind('click', function (event) {
        $studio.fadeOut();
        Asiance.Studio.workspace2choice();

        $messages.fadeOut();
    });

    // click inside should not close
    $studio.bind('click', function (event) {
        event.stopPropagation();
    });

    // click inside should not close
    $messages.bind('click', function (event) {
        event.stopPropagation();
    });

    $pickyourphoto.bind('click', function (event) {
        // to prevent #studio being closed
        // see html click event bindings
        $studio.fadeIn();
        event.stopPropagation();
    });

    $('.icon').bind('click', function (event) {
        // to prevent #studio being closed
        // see html click event bindings
        $messages.fadeIn();
        event.stopPropagation();

        Asiance.caption.lang = this.id;
    });

    $('.message').bind('click', function (event) {
        // change msg_id in hidden form
        $this = $(this);
        $messages.fadeOut();
        Asiance.caption.caption = $this.data('id');
        Asiance.Caption.update();
    });

    $finput.live('change', function () {
        // async form submit
        $imgform.submit();
    });

    $workspace.delegate('.cropbutton', 'click', function () {
        Asiance.Studio.crop();
    });

    var jcrop;
    function ajaxizeForm () {
        $imgform.ajaxForm({
            beforeSubmit: function (data) {
                Asiance.Studio.choice2workspace();
            },
            success: function (data) {
                // check if nginx sent 'request too large'
                if (/413/.test(data)) {
                    $studio.fadeOut();
                    Asiance.Studio.workspace2choice();
                    alert('This file is too big! (4MB max)');
                    return;
                }

                // data is url
                Asiance.Studio.init_workspace(data);
            }
        });
    }
    ajaxizeForm();

    Asiance.Studio = {
        choice2workspace: function () {
            $choice.hide();

            this.clean_fb();

            // displaying stu-stu-studiooo's workspace
            $workspace.show();
            $sloader.show();
        },

        workspace2choice: function () {
            // cleaning #studio
            if (typeof jcrop !== 'undefined') {
                jcrop.destroy();
            }

            $studio.find('.jcrop-holder').remove();
            $studio.find('.cropme').replaceWith('<img class="cropme" />');
            $sloader.hide();
            $workspace.hide();
            $choice.show();

            ajaxizeForm();
        },

        clean_fb: function () {
            $studio.find('#fbstuff').hide();
            // erasing fb albums / photos
            // FIXME don't remove, keep in cache?
            // what if user uploads a new photo in the meantime?
            $studio.find('.fbphoto, .fbalbum').remove();
        },

        init_workspace: function (url) {
            $sloader.hide();

            $studio.find('.cropbutton').show();

            var $cropme = $studio.find('.cropme');
            $cropme
            .attr('src', url)
            .load(function () {
                jcrop = $.Jcrop('#studio .cropme', {
                    onChange: function (pos) {
                        Asiance.crop = pos;
                    },
                    aspectRatio: 1
                });
                jcrop.setSelect([0, 0, 301, 301]);
            })
            .show();
        },

        crop: function () {
            var self = this;
            $ploader.show();

            $studio.fadeOut();
            self.workspace2choice();

            var url  = Asiance.path + '/cropped?' + $.param(Asiance.crop);

            // prefetch, hide loader on load event
            $('<img />')
            .attr('src', url)
            .load(function () {
                $photo.css('background-image', 'url(' + url + ')');
                $('#outline').css('border', 'none');
                $ploader.hide();
            });
        },

        loading: function (truth) {
            truth ? $sloader.show() : $sloader.hide();
        }
    }

/*
                 _   _             
  ___ __ _ _ __ | |_(_) ___  _ __  
 / __/ _` | '_ \| __| |/ _ \| '_ \ 
| (_| (_| | |_) | |_| | (_) | | | |
 \___\__,_| .__/ \__|_|\___/|_| |_|
          |_|                      
*/

    Asiance.Caption = {
        update: function () {
            var data = $.param(Asiance.caption);

            $caption[0].src = Asiance.path + '/caption?' + data;
            $caption.show();
        }
    }

    $caption.draggable({
        containment: 'parent',
        scroll: false,
        start: function (event, ui) {
            $(event.target).css('cursor', 'move');
        },
        stop: function (event, ui) {
            $(event.target).css('cursor', 'pointer');

            Asiance.caption.x = Math.round(ui.position.left);
            Asiance.caption.y = Math.round(ui.position.top);
        }
    }).bind('mousedown', function (event) {
        $(this).css('cursor', 'move');
    }).bind('mouseup', function (event) {
        $(this).css('cursor', 'pointer');
    });
});
