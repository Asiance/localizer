#!/usr/bin/env bash

CSSFILE=public/lclz.min.css
JSFILE=public/lclz.min.js

[ -f $CSSFILE ] && rm $CSSFILE
[ -f $JSFILE ] && rm $JSFILE

yuicompressor js/jquery-1.6.1.min.js >> $JSFILE
yuicompressor js/jquery-ui-1.8.14.custom.min.js >> $JSFILE
yuicompressor js/jquery.form.js >> $JSFILE
yuicompressor js/underscore-min.js >> $JSFILE
yuicompressor js/jscolor.js >> $JSFILE
yuicompressor js/jquery.Jcrop.min.js >> $JSFILE
yuicompressor js/localizer.js >> $JSFILE
yuicompressor js/fb-main.js >> $JSFILE
yuicompressor js/color.js >> $JSFILE

yuicompressor public/css/jquery.Jcrop.css >> $CSSFILE
yuicompressor public/css/global.css >> $CSSFILE
yuicompressor public/css/main.css >> $CSSFILE
yuicompressor public/css/studio.css >> $CSSFILE

echo 'Done.'
