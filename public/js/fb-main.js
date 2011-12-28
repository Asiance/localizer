$(function () {
    Asiance.tmpl.photo = _.template('<li class="fbphoto fbitem"><img src="<%= source %>" /></li>');
    Asiance.tmpl.album = _.template('<li class="fbalbum fbitem"><img src="<%= source %>" /><h5><%= name %></h5></li>');
    Asiance.tmpl.friend = _.template('<li class="fbfriend fbitem"><img src="<%= source %>" /><h5><%= name %></h5></li>');

    var $fbconnect = $('#fbconnect')
      , $fbstuff = $('#fbstuff')
      , nbloaded = 0;

    var Friend = {
        fetch: function () {
            var self = this;

            // cleaning previous fb stuff if any
            // user has to be ninja to prevent studio being cleaned
            // but ninjas DO exist so...
            Asiance.Studio.clean_fb();

            if (typeof Asiance.authResponse !== 'undefined') {
                // cleanup ui
                $('#choice').fadeOut('slow', function () {
                    $fbstuff.show();
                });

                //cached?
                if (typeof Asiance.friends === 'object') {
                    self.searchinput();
                    return;
                }

                // not cached.
                // fetch from FB
                FB.api('/me/friends&' + token(), function (data) {
                    Asiance.friends = _(data.data).map(function (f) {
                        return {
                            label: f.name,
                            id: f.id
                        };
                    });

                    Asiance.friends.push({
                        label: 'Me',
                        id: Asiance.authResponse.userId
                    });

                    self.searchinput();
                });
            }
        },
        searchinput: function () {
            $('#friendsearch').autocomplete({
                appendTo: '#bigloader',
                source: Asiance.friends,
                focus: function (event, ui) {
                    // return false;
                },
                search: function (event, ui) {
                    Asiance.Bigloader.postbutton.hide();
                },
                select: function (event, ui) {
                    // do something when selected
                    Asiance.share.to = ui.item.id;

                    if (Asiance.Bigloader.buttons.hasClass('done')) {
                        Asiance.Bigloader.postbutton.show();
                    }
                },
                delay: 100
            })
            .data("autocomplete")._renderItem = function( ul, item ) {
                return $('<li></li>')
                .data("item.autocomplete", item)
                .append('<a><img src="https://graph.facebook.com/'+ item.id +'/picture?type=square" />' + item.label + '</a>')
                .appendTo(ul);
            };
        },
        render: function (f) {
            var url = 
                'https://graph.facebook.com/'+ f.id +'/picture?type=small&'+ token();

            $('<img />').load(function (event) {
                var name = f.name;

                if (typeof name !== 'undefined') {
                    name = name.length > 23 ? name.substr(0, 20) + '...' : name;
                } else {
                    name = '';
                }

                var obj = {
                    source: url,
                    name: name
                };

                $(Asiance.tmpl.friend(obj)).data('friend', f)
                  .appendTo($fbstuff);
            })
            .attr('src', url);
        }
    };

    var Photo = {
        pick: function (p) {
            var params = {
                pid: p.id,
                accessToken: Asiance.authResponse.accessToken
            };

            Asiance.Studio.choice2workspace();

            $.post(Asiance.path + '/fbupload', params, function (data) {
                // data is url
                Asiance.Studio.init_workspace(data);
            });
        },
        render: function (p) {
            var url = p.picture;

            $('<img />')
            .load(function () {
                var name = p.name;

                if (typeof name !== 'undefined') {
                    name = name.length > 23 ? name.substr(0, 20) + '...' : name;
                } else {
                    name = '';
                }

                var obj = {
                    source: url,
                    name: name
                };

                // when pic is ready, we insert the photo into the dom
                // attaching the corresponding js object to it
                var pho = $(Asiance.tmpl.photo(obj))
                .data('photo', p)
                .appendTo($fbstuff);

                if ((++nbloaded % 3) === 0) {
                    pho.addClass('last');
                }
            })
            .attr('src', url);

        }
    };

    var Album = {
        render: function (a) {
            var url = 
                'https://graph.facebook.com/' + a.id + '/picture?type=small&' + token();
            // 2 is small (130x130)
            $('<img />')
            .load(function () {
                var name = a.name;

                if (typeof name !== 'undefined') {
                    name = name.length > 23 ? name.substr(0, 20) + '...' : name;
                } else {
                    name = '';
                }

                var obj = {
                    source: url,
                    name: name
                };

                // when pic is ready, we insert the album into the dom
                // attaching the corresponding js object to it
                var alb = $(Asiance.tmpl.album(obj))
                .data('album', a)
                .appendTo($fbstuff);

                if ((++nbloaded % 3) === 0) {
                    alb.addClass('last');
                }
            })
            .attr('src', url)
            .data('album', a);
        },

        dump: function (a) {
            Asiance.Studio.loading(true);

            // Clean all the thingz!
            $fbstuff.find('.fbalbum').remove();

            FB.api(a.id + '/photos?limit=51&' + token(), function (data) {
                // counter to be able to style last element of a line
                nbloaded = 0;
                Asiance.Studio.loading(false);
                $fbstuff.find('h2').text('Your Photos');

                // DUMP ALL THE THINGZ
                _(data.data).forEach(function (p) {
                    Photo.render(p);
                });
            });
        },

        fetch: function () {

            // cleaning previous fb stuff if any
            // user has to be ninja to prevent studio being cleaned
            // but ninjas DO exist so...
            Asiance.Studio.clean_fb();
            
            if (typeof Asiance.authResponse !== 'undefined') {
                // cleanup ui
                Asiance.Studio.choice2fb();

                // fetch from FB
                FB.api('/me/albums?limit=51&' + token(), function (data) {
                    // counter to be able to style last element of a line
                    nbloaded = 0;
                    
                    Asiance.Studio.loading(false);
                    $fbstuff.find('h2').text('Your Albums');

                    _(data.data).forEach(function (a) {
                        Album.render(a);
                    });
                });
            }
        }
    };
    
    var UI = {
        share: function () {
            // lynx: "imagesource#linktoimage"

            // sharing to wall
            // https://www.facebook.com/photo.php?fbid=' + split[1]
            FB.ui({
                method: 'feed',
                name: 'View larger image',
                link: 'https://www.facebook.com/photo.php?fbid=' + Asiance.share.pid + '&theater',
                source: Asiance.share.result_url,
                to: Asiance.share.to,
                caption: 'Generate pictures in Korean, Japanese, Chinese, French or English and share them with your friends!',
                properties: {
                    'Photo': {
                        text: 'Zoom',
                        href: 'https://www.facebook.com/photo.php?fbid=' + Asiance.share.pid + '&theater',
                    },
                    'Find out more': {
                        text: 'Asiance Localizer',
                        href: 'https://www.facebook.com/Asiance?sk=app_141297295948882'
                    }
                },
                actions: {
                    name: "Make your own",
                    link: 'https://www.facebook.com/Asiance?sk=app_141297295948882'
                }
            }, function(response) {
                Asiance.share = {};

                if (response && response.post_id) {
                    // published
                } else {
                    // not published
                }
            });
        }
    };

    $fbconnect.bind('click', function (event) {
        if(typeof Asiance.authResponse !== 'undefined') {
            Asiance.Studio.loading(true);
            Album.fetch();
        } else {
            // not logged in
            FB.login(function (response) {
            	if (response.authResponse) {
                    Asiance.authResponse = response.authResponse;
                    // FIXME duplicate above
                    Asiance.Studio.loading(true);
                    Album.fetch();
                } else {
                	console.log('User cancelled login or did not fully authorize.');
                }
            }, { scope: 'publish_stream, user_photos' });
        }
    });

    $fbstuff.delegate('.fbalbum', 'click', function (event) {
        $this = $(this);

        Album.dump($this.data('album'));
    })
    .delegate('.fbphoto', 'click', function (event) {
        $this = $(this);
        Photo.pick($this.data('photo'));
    });

    $('#share').bind('click', function (e) {
        if (!Asiance.Caption.loaded) {
            Asiance.Bigloader.show();
            Asiance.Bigloader.error();
            return;
        }

        if (typeof Asiance.authResponse !== 'undefined') {
            share_and_save();
        } else {
            FB.login(function (response) {
                //user didn't login or didnt authorize
                // console.log('not logged in');
            	if (response.authResponse) {
                    Asiance.authResponse = response.authResponse;
                    share_and_save();
                } else {
                    // not logged in
                }
            }, { scope: 'publish_stream,user_photos' });
        };
    });

    $('#bigloader .fb-button').bind('click', function (event) {
        var $this = $(this);

        Asiance.Bigloader.fadeOut();

        if ($this.hasClass('cancel')) return;
        if ($(this).hasClass('mywall')) Asiance.share.to = undefined;

        UI.share();
    });

    function share_and_save () {
        // adding accessToken to data sent to server
        Asiance.caption.accessToken = Asiance.authResponse.accessToken;
        Asiance.caption.uid = Asiance.authResponse.userId;

        Friend.fetch();

        Asiance.Bigloader.postbutton.hide();
        Asiance.Bigloader.show();

        // contacting server
        // putting into album
        $.ajax({
            url: Asiance.path + '/share',
            type: 'POST',
            data: Asiance.caption,
            error: function (lynx) {
                Asiance.Bigloader.error();
            },
            success: function (lynx) {
                var split = lynx.split('#');
                Asiance.share.result_url = split[0];
                Asiance.share.pid = split[1];

                Asiance.Bigloader.done();
            }
        });
    }

    function token () {
        if (typeof Asiance.authResponse !== 'undefined') {
            return $.param({accessToken: Asiance.authResponse.accessToken});
        } else {
            console.log('token errorz.');
        }
    }

    Asiance.FB = {
        Friend: Friend,
        Photo: Photo,
        Album: Album,
        UI: UI
    };
});
