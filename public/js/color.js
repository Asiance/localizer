$(function () {
    var $pickerz = [$('#colorpicker1'), $('#colorpicker2')]
      , current;

    var opened = [false, false];
    $('#colorbtn1, #colorbtn2').bind('click', function (event) {
        // num is corresponding array index
        var num = this.id[this.id.length - 1] - 1;
        // current is the corresponding id number
        // used above
        current = num + 1;

        console.log($pickerz[num][0], num);
        $pickerz[num][0].color.showPicker();
    });

    $('.color').live('change', function () {
        var newcolor = '#' + this.value;
        var self = this;

        // saving for later
        Asiance.caption['c' + current] = newcolor;

        // hack to close jscolor
        window.setTimeout(function () {
            self.color.hidePicker() 
        }, 100);

        // refreshing background
        $('#colorbtn' + current + ' div').css('background-color', newcolor);

        // fetching new caption
        Asiance.Caption.update();
    });
});
