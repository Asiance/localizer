$(function () {
    window.Asiance = {
        tmpl: {},
        path: window.location.protocol + '//' + window.location.host,
        caption: {
            c1: '#e62b47',
            c2: '#34414d'
        },
        share: {}
    };

    if (typeof FB !== 'undefined') {
        FB.Canvas.setSize({ height: 1030, width: 510});
        FB.init({
            appId  : '141297295948882',
            status : true, // check login status
            cookie : true, // enable cookies to allow the server to access the session
            xfbml  : true  // parse XFBML
        });
    }

    // Not that clean but christmas patch !
    $('.inside p.message').each(function () {
        if (jQuery.inArray($(this).data('id'),  [6, 12, 14, 16]) != -1) {
            $(this).css('color', '#fff');
            $(this).css('background', '#BB2D3D');
            $(this).css('font-weight', 'bold');
        }
    });

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
      , $bigloader = $('#bigloader')
      , $caption = $('#photo .caption')
      , $image = $('#photo .image');

    var Bigloader = {
        friendsearch: $bigloader.find('p'),
        buttons: $bigloader.find('.buttons'),
        postbutton: $bigloader.find('.post'),
        // isdone: false,
        reset: function () {
            this.text('Localizing...');
            this.pic('ajax-bigloader.gif');
            this.friendsearch.show();
            this.postbutton.removeClass('done');
            // this.buttons.hide();
            // this.isdone = false;
        },
        text: function (txt) {
            $bigloader.find('h2').text(txt);
        },
        pic: function (newimg) {
            $bigloader.children('img').attr('src', Asiance.path + '/images/' + newimg);
        },
        show: function () {
            $bigloader.show();
        },
        hide: function () {
            $bigloader.hide();
            this.reset();
        },
        fadeOut: function () {
            var self = this;
            $bigloader.fadeOut(function () {
                Bigloader.reset();
            });
        },
        done: function (callback) {
            var self = this;

            self.text('The photo has been uploaded to your album!');
            self.pic('check.png');
            self.friendsearch.show();

            // self.isdone = true;
            self.buttons.addClass('done');
            if (typeof Asiance.share.to !== 'undefined') {
                self.postbutton.show();
            }
        },
        error: function () {
            var self = this;

            self.friendsearch.hide();
            $bigloader.find('h2')
              .html('Something went wrong...<br />Did you select an image and a caption?');

            self.pic('redcross.png');

            setTimeout(self.fadeOut, 2800);
        }
    };


    // click outside a box hides the current ui elements
    $('html').bind('click', function (event) {
        $studio.fadeOut(function () {
            Studio.workspace2choice();
        });

        $messages.fadeOut();
    });

    // click inside should not close
    $studio.bind('click', function (event) {
        if($(event.target).hasClass('cancel'))
            return;

        event.stopPropagation();
    });

    // click inside should not close
    $messages.bind('click', function (event) {
        if($(event.target).hasClass('cancel'))
            return;

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
        Caption.update();
    });

    var submitted = false;
    $finput.change(function (event) {
        // ie8 hack
        if (submitted) return;
        submitted = true;

        $imgform.submit();
    });

    $workspace.delegate('.cropbutton', 'click', function () {
        Studio.crop();
    });

    var jcrop;
    function ajaxizeForm () {
        submitted = false;
        $imgform.ajaxForm({
            beforeSubmit: function (data) {
                Studio.choice2workspace();
            },
            success: function (data) {
                // check if nginx sent 'request too large'
                if (/^413/.test(data)) {
                    $studio.fadeOut();
                    Studio.workspace2choice();
                    alert('This file is too big! (4MB max)');
                    return;
                }

                // data is url
                Studio.init_workspace(data);
            }
        });
    }
    ajaxizeForm();

    var Studio = {
        choice2workspace: function () {
            $choice.hide();

            this.clean_fb();

            // displaying stu-stu-studiooo's workspace
            $workspace.find('.cropbutton').hide();
            $workspace.show();
            $sloader.show();
        },

        workspace2choice: function () {
            // cleaning #studio
            if (typeof jcrop !== 'undefined') {
                jcrop.destroy();
            }

            this.clean_fb();

            $studio.find('.jcrop-holder').remove();
            $studio.find('.cropme').replaceWith('<img class="cropme" />');
            $sloader.hide();
            $workspace.hide();
            $choice.show();

        },

        choice2fb: function () {
            $choice.fadeOut('slow', function () {
                $('#fbstuff').show();
            });
        },

        clean_fb: function () {
            $studio.find('#fbstuff').hide();
            // erasing fb albums / photos
            // FIXME don't remove, keep in cache?
            // what if user uploads a new photo in the meantime?
            $studio.find('.fbphoto, .fbalbum, .fbfriend, #friendsearch').remove();
        },

        init_workspace: function (url) {
            $sloader.hide();

            $studio.find('.cropbutton').show();

            var $cropme = $studio.find('.cropme');
            $cropme
            .load(function () {
                jcrop = $.Jcrop('#studio .cropme', {
                    onChange: function (pos) {
                        Asiance.crop = pos;
                    },
                    aspectRatio: 1
                });
                jcrop.setSelect([0, 0, 301, 301]);
                ajaxizeForm();
            })
            .attr('src', url)
            .show();
        },

        crop: function () {
            var self = this;
            $ploader.show();

            $studio.fadeOut();
            self.workspace2choice();

            var url = Asiance.path + '/cropped?' + $.param(Asiance.crop);

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
    };

/*
                 _   _             
  ___ __ _ _ __ | |_(_) ___  _ __  
 / __/ _` | '_ \| __| |/ _ \| '_ \ 
| (_| (_| | |_) | |_| | (_) | | | |
 \___\__,_| .__/ \__|_|\___/|_| |_|
          |_|                      
*/

    var Caption = {
        loaded: false,
        update: function () {
            var self = this;
            
            var data = $.param(Asiance.caption);

            $caption
              .load(function () {
                  var $this = $(this);

                  var r = Math.round;

                  // slide element to the white area, bottom of the pic
                  // trying to center it horizontally and vertically too
                  var white_area_height = 80
                    , margin = Math.max(r((white_area_height - $this.height())/2), 0)
                    , newtop = $photo.height() - $this.height() - margin
                    , newleft = r(($photo.width() - $this.width()) / 2);

                  $this.animate({
                      top: newtop + 'px',
                      left: newleft + 'px'
                  }, {
                      duration: self.loaded ? 0 : 800,
                      queue: false
                  });

                  // caption is visible.
                  if (!self.loaded) self.loaded = true;

                  // setting x and y to new coordinates
                  Asiance.caption.x = Math.round(newleft);
                  Asiance.caption.y = Math.round(newtop);
              })
              .attr('src', Asiance.path + '/caption?' + data);

              $caption.show();
        }
    };

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

    Asiance.Bigloader = Bigloader;
    Asiance.Studio = Studio;
    Asiance.Caption = Caption;
});
