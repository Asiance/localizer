#!/usr/bin/env bash

CSSFILE=public/lclz.min.css
JSFILE=public/lclz.min.js

[ -f $CSSFILE ] && rm $CSSFILE
[ -f $JSFILE ] && rm $JSFILE

yuicompressor public/js/jquery-1.6.1.min.js >> $JSFILE
yuicompressor public/js/underscore-min.js >> $JSFILE
yuicompressor public/js/jquery-ui-1.8.14.custom.min.js >> $JSFILE
yuicompressor public/js/jquery.form.js >> $JSFILE
yuicompressor public/js/jquery.Jcrop.min.js >> $JSFILE
yuicompressor public/js/jscolor.js >> $JSFILE
yuicompressor public/js/localizer.js >> $JSFILE
yuicompressor public/js/fb-main.js >> $JSFILE
yuicompressor public/js/color.js >> $JSFILE

yuicompressor public/css/jquery.Jcrop.css >> $CSSFILE
yuicompressor public/css/global.css >> $CSSFILE
yuicompressor public/css/main.css >> $CSSFILE
yuicompressor public/css/studio.css >> $CSSFILE

echo 'Done.'
