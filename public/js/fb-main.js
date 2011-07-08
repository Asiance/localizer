$(function () {
    Asiance.tmpl.photo = _.template('<li class="fbphoto"><img src="<%= source %>" /></li>');
    Asiance.tmpl.album = _.template('<li class="fbalbum"><img src="<%= source %>" /><h5><%= name %></h5></li>');

    var $fbconnect = $('#fbconnect')
      , $fbstuff = $('#fbstuff');

    var Photo = {
        pick: function (p) {
            var params = {
                pid: p.id,
                access_token: Asiance.fbsession.access_token
            };

            Asiance.Studio.choice2workspace();

            $.post(Asiance.path + '/fbupload', params, function (data) {
                // data is url
                Asiance.Studio.init_workspace(data);
            });
        },
        render: function (p) {
            var url = p.picture + '?' + (new Date()).getTime();

            $('<img />')
            .attr('src', url)
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
                $(Asiance.tmpl.photo(obj))
                    .data('photo', p)
                    .appendTo($fbstuff);
            });
        }
    };

    var Album = {
        render: function (a) {
            if (typeof a.cover_photo !== 'undefined') {
                FB.api(a.cover_photo + '?' + token(), function (data) {
                    var url = data.picture + '?' + (new Date()).getTime();

                    // 2 is small (130x130)
                    $('<img />')
                    .attr('src', url)
                    .data('album', a)
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
                        $(Asiance.tmpl.album(obj))
                        .data('album', a)
                        .appendTo($fbstuff);
                    });
                });
            } else {
                // 'anonymous' photo
            }
        },

        dump: function (a) {
            Asiance.Studio.loading(true);

            // Clean all the thingz!
            $fbstuff.find('.fbalbum').remove();

            FB.api(a.id + '/photos?' + token(), function (data) {
                Asiance.Studio.loading(false);
                $fbstuff.find('h2').text('Your Photos');

                a.photos = data.data;

                // DUMP ALL THE THINGZ
                _(a.photos).forEach(function (p) {
                    Photo.render(p);
                });
            });
        },

        fetch: function () {
            var self = this;
            if (typeof Asiance.fbsession !== 'undefined') {
                // cleanup ui
                $('#choice').fadeOut('slow');
                $fbstuff.show();

                // fetch from FB
                FB.api('/me/albums?' + token(), function (data) {
                    Asiance.Studio.loading(false);
                    Asiance.albums = data.data;
                    $fbstuff.find('h2').text('Your Albums');

                    _(Asiance.albums).forEach(function (a) {
                        Album.render(a);
                    });
                });
            }
        }
    };

    $('#share').bind('click', function (e) {
        if (Asiance.fbsession = FB.getSession()) {
            share_and_save();
        } else {
            FB.login(function (response) {
                //user didn't login or didnt authorize
                // console.log('not logged in');
                if (response.perms && response.session) {
                    Asiance.fbsession = response.session;
                    share_and_save();
                } else {
                    // not logged in
                }
            }, { perms:'publish_stream,user_photos' });
        }
    });

    $fbconnect.bind('click', function (event) {
        if(Asiance.fbsession = FB.getSession()) {
            Asiance.Studio.loading(true);
            Album.fetch();
        } else {
            // not logged in
            FB.login(function (response) {
                if (response.perms && response.session) {
                    Asiance.fbsession = response.session;
                    // FIXME duplicate above
                    Asiance.Studio.loading(true);
                    Album.fetch();
                } else {
                    console.log('fail');
                }
            }, { perms: 'publish_stream,user_photos' });
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

    function share_and_save () {
        Asiance.$bigloader.show();

        // adding access_token to data sent to server
        Asiance.caption.access_token = Asiance.fbsession.access_token;
        Asiance.caption.uid = Asiance.fbsession.uid;

        // contacting server
        // putting into album
        $.post(Asiance.path + '/share', Asiance.caption, function (lynx) {
            Asiance.$bigloader.hide();
            
            // lynx: "imagesource#linktoimage"
            var split = lynx.split('#');

            // sharing to wall
            // https://www.facebook.com/photo.php?fbid=' + split[1]
            FB.ui({
                method: 'feed',
                name: 'Asiance Localizer',
                link: 'https://www.facebook.com/Asiance?sk=app_141297295948882',
                source: split[0],
                caption: 'Generate pictures and share them with your friends!',
                properties: {
                    'Photo': {
                        text: 'Zoom',
                        href: 'https://www.facebook.com/photo.php?fbid=' + split[1],
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
                if (response && response.post_id) {
                    // published
                } else {
                    // not published
                }
            });
        });
    }

    function token () {
        if (typeof Asiance.fbsession !== 'undefined') {
            return $.param({access_token: Asiance.fbsession.access_token});
        } else {
            console.log('token errorz.');
        }
    }
});
