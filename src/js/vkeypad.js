/* This is Virtual KeyPad (vKeyPad)
 * ----vKeyPad 0.9
 * developed by Lapiz
 */
var vKey;
var focusVar;
var enableKey11 = true;
var isDecimalPressed = false;
window.vKeyPad = function (TextBox) {
    vKey = this;
    this.TextBox = [];
    this.TextBox[0] = TextBox[0];
    try {
        if (TextBox.indexOf(".") == 0) {
            this.TextBox = $(TextBox);
        } else if (TextBox.indexOf("#") == 0) {
            this.TextBox = $(TextBox);
        }
    } catch (e) {}
    this.Keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", ".", "&#x02423;"];
    this.AllowedKeys = [8, 46, 37, 39];
    this.AutoClear = false;
    this.KeyPad;
    this.Width = 150;
    this.Height = 150;
    this.MaximumDig = 4;
    this.CurrentFocus = null;
    //$(this.TextBox).attr("maxlength",this.MaximumDig);
    for (var t = 0; t < this.TextBox.length; t++) {
        var txtBox = $(this.TextBox[t]);
        if (txtBox[0]) {
            txtBox.bind('keypress', this.onKeyPress);
            txtBox.bind('click', this.onFocus);
            txtBox.bind('focus', this.onFocus);
            txtBox.bind('blur', this.onBlur);
            txtBox.blur();
        }
    }
    
    this.init();
};

vKeyPad.prototype = {
    init: function () {
        for (var k = 0; k < this.Keys.length; k++) this.AllowedKeys.push(this.Keys[k].charCodeAt(0));
        this.KeyPad = $("<div class=\"keypadHolder\" style=\"z-index:1000;position:absolute;width:180px; height:215px;display:table;\" />");
        var cols = 3;
        var rows = Math.ceil(this.Keys.length / cols);
        var num = 0;
        var header = $("<div class=\"numPadHeader\" style=\"position:absolute;left:5px; top:5px;\" />")
        this.KeyPad.append(header);
        var key = $("<div id=\"numPadClose\" class=\"vkBtnCls\" />");
        //key.html("X");
        header.append(key);
        key.bind('click', this.hidePad);
        var row = $("<div style=\"display:table-row;\" />")
        this.KeyPad.append(row);
        var key = $("<div id=\"key_emp1\" class=\"vkBtnEmp\" />");
        key.html("");
        row.append(key);
        //key.bind('click',this.onNumClick);
        var key = $("<div id=\"key_emp2\" class=\"vkBtn\" />");
        key.html("/");
        row.append(key);
        key.bind('click', this.onNumClick);

        var key = $("<div id=\"key_bs\" class=\"vkBtnBS\" />");
        key.html("<svg class=\"delete\" width=\"23\" height=\"18\" viewBox=\"0 0 1024 1024\"><g><path d=\"M921.6 153.6h-489.165c-22.528 0-54.835 12.134-71.782 26.982l-347.955 304.435c-16.947 14.848-16.947 39.117 0 53.965l347.955 304.486c16.947 14.797 49.254 26.931 71.782 26.931h489.165c56.371 0 102.4-46.080 102.4-102.4v-512c0-56.32-46.029-102.4-102.4-102.4zM777.779 716.8l-130.918-130.918-130.816 130.918-73.933-73.882 130.867-130.918-130.867-130.867 73.933-73.933 130.867 130.867 130.867-130.867 73.882 73.933-130.816 130.867 130.867 130.867-73.933 73.933z\"></path></g></svg>");

        row.append(key);
        key.bind('click', this.onNumClick);

        for (var r = 0; r < rows; r++) {
            var row = $("<div style=\"display:table-row; background:red;\" />")
            this.KeyPad.append(row);
            for (var c = 0; c < cols; c++) {
                if (this.Keys[num]) {
                    var key = $("<div id=\"key_" + num + "\" class=\"vkBtn\" />");
                    key.html(this.Keys[num]);
                    row.append(key);
                    key.bind('click', this.onNumClick);
                    num++;
                }
            }
        }
        $('#vkeyCont').append(this.KeyPad);
        $(".keypadHolder").draggable({
            containment: "#vkeyCont"
        });
        this.KeyPad.css({
            "visibility": "hidden"
        });
        $('#navigation-container').css({
            'visibility': 'hidden'
        });
    },

    onNumClick: function (event) {
        //drawLineAfterPlot = false;


        //alert("here")
        var vK = vKey.getSelf();



        if (!event) event = window.event;
        var isBackSpace = $(event.target);
        if (isBackSpace.attr('id') != "key_bs") {
            isBackSpace = isBackSpace.parents("#key_bs");
        }

        //console.log(vK.ActualText)

        if (isBackSpace.length > 0) {

            var curText = vK.ActualText;
            if (curText != undefined && curText != 'undefined' && curText.length > 0) {
                curText = curText.substr(0, curText.length - 1);

            }
            vK.ActualText = curText;



            ms = curText.replace(/&([-#.\w]+);|\\([a-z]+)(?: |(?=[^a-z]))/ig,
                function (s, e, m) {
                    if (m && (M.macros_[m] || M.macro1s_[m])) return s; // e.g. \it or \sc
                    var t = '&' + (e || m) + ';',
                        res = $('<span>' + t + '</span>').text();

                    return res != t ? res : ents_[e || m] || s;
                }),
            h = ms.replace(/</g, '&lt;');

            if (vK.ActualText != h) vK.ActualText = h;

            var t;
            try {
                //t = M.sToMathE(ms, true);
            } catch (exc) {
                //t = String(exc);
            }

            $(vK.CurrentFocus).empty().append(t);



        }


        console.log(vK.ActualText)

        if (event.target && vK.ActualText.length < vKey.MaximumDig) {
            var e = $.Event('keypress');

            if ($(event.target).attr('id') == 'key_bs') {

            } else {
                var keyedText = $(event.target).text();

                if (event.target.id == "key_11") {
                    keyedText = " ";
                }
                vK.ActualText += keyedText;
                curText = vK.ActualText;

                //var regex=new RegExp("[0-9]{1,2}\s* \/ \s*[0-9]{1,2}")

                //restrict dot
                if (vK.ActualText.substring(vK.ActualText.length - 1) == ".")
                    if (vK.ActualText.substring(vK.ActualText.length - 2, vK.ActualText.length - 1) == vK.ActualText.substring(vK.ActualText.length - 1))
                        curText = vK.ActualText = vK.ActualText.substring(0, vK.ActualText.length - 1)

                if ((vK.ActualText.split('.').length - 1) > 1) {
                    if (vK.ActualText.indexOf('.') != -1) curText = vK.ActualText.substring(0, vK.ActualText.length - 1);
                }




                //restrict space before /
                if (vK.ActualText.substring(vK.ActualText.length - 1) == "/")
                    curText = vK.ActualText = vK.ActualText.substring(0, vK.ActualText.length - 1).trim() + "/"
                    //curText=vK.ActualText=vK.ActualText.substring(0).trim();


                if ((vK.ActualText.split('/').length - 1) > 1) {
                    if (vK.ActualText.indexOf('/') != -1) curText = vK.ActualText.substring(0, vK.ActualText.length - 1);
                }

                var delspace = vK.ActualText.substring(vK.ActualText.length - 2);
                if (delspace == "/ ") {
                    curText = vK.ActualText.substring(0, vK.ActualText.length - 1);
                }


                //restrict space    
                if (vK.ActualText.substring(vK.ActualText.length - 1) == " ")
                    if (vK.ActualText.substring(vK.ActualText.length - 2, vK.ActualText.length - 1) == vK.ActualText.substring(vK.ActualText.length - 1))
                        curText = vK.ActualText = vK.ActualText.substring(0, vK.ActualText.length - 1)

                    // console.log(vK.ActualText.substring(vK.ActualText.length-1)==".")


                var regex = new RegExp("[0-9]")

                if (regex.test(this.innerText))
                    if (vK.ActualText.substring(0, vK.ActualText.length - 2) == "/")
                        curText = vK.ActualText = vK.ActualText.substring(0, vK.ActualText.length - 1).trim() + this.innerText;



                ms = curText.replace(/&([-#.\w]+);|\\([a-z]+)(?: |(?=[^a-z]))/ig,
                    function (s, e, m) {
                        if (m && (M.macros_[m] || M.macro1s_[m])) return s; // e.g. \it or \sc
                        var t = '&' + (e || m) + ';',
                            res = $('<span>' + t + '</span>').text();
                        return res != t ? res : ents_[e || m] || s;
                    }),
                h = ms.replace(/</g, '&lt;');
                if (vK.ActualText != h) vK.ActualText = h;

                var t;
                try {
                    t = M.sToMathE(ms, true);
                } catch (exc) {
                    t = String(exc);
                }



                $(vK.CurrentFocus).empty().append(t);
                //console.log('text append here1')
            }

            for (var i = 1; i <= 7; i++) {
                if (vK.CurrentFocus.id == ('x' + i)) {
                    //console.log("vK.CurrentFocus.innerText --->>>"+ vK.CurrentFocus.innerText);
                    if (vK.ActualText.length > 1 && $(event.target).text() == "\u2013") {

                        var curText = vK.ActualText;
                        curText = curText.substr(0, curText.length - 1);
                        ms = curText.replace(/&([-#.\w]+);|\\([a-z]+)(?: |(?=[^a-z]))/ig,
                            function (s, e, m) {
                                if (m && (M.macros_[m] || M.macro1s_[m])) return s; // e.g. \it or \sc
                                var t = '&' + (e || m) + ';',
                                    res = $('<span>' + t + '</span>').text();
                                return res != t ? res : ents_[e || m] || s;
                            }),
                        h = ms.replace(/</g, '&lt;');
                        if (vK.ActualText != h) vK.ActualText = h; // assignment may clear insertion point

                        var t;
                        try {
                            t = M.sToMathE(ms, true);
                        } catch (exc) {
                            t = String(exc);
                        }
                        $(vK.CurrentFocus).empty().append(t);
                        console.log('text append here2')


                    }
                }
            }

        }

        vKeyPadEvent(event, vK);
        onTextChanged(event);
        var targetId = $(vK.CurrentFocus).attr('id');
        var targetIndex = targetId.substr(1);

        $("#editorTxt" + targetIndex).val(vK.ActualText);
        placeCaretAtEnd(vK.CurrentFocus);


    },
    onKeyPress: function (event) {
        alert("here21")
        var vK = vKey.getSelf();
        if (!event) event = window.event;
        var allowed = false;
        var code = event.which;
        event.charCode != 0 ? code : event.charCode;
        event.keyCode != 0 ? code : event.keyCode;
        event.which != 0 ? code : event.which;
        if (vK.AllowedKeys.indexOf(code) >= 0) allowed = true;
        if (!allowed) event.preventDefault();
        if (vK.ActualText.length == 0) {
            vK.ActualText = "";
            event.target.innerText = "";
        }
        placeCaretAtEnd(event.target);



        //return ($(this.TextBox).text().length <= 6);
    },
    onFocus: function (event) {



        //alert('yes');
        enableKey11 = true;
        $('.numTxt').each(function () {
            //$(this).css({'background': '#fff'});
        })
        //$(this).css({'background': '#faecc9'});
        try {
            //console.log(vK.ActualText);    
        } catch (e) {}

        var vK = vKey.getSelf();
        $(".keypadHolder").css("visibility","hidden");
        if (vK.KeyPad) {
            vK.KeyPad.css({
                "visibility": "visible"
            });
        }
        if (focusVar == undefined) {
            focusVar = $(event.currentTarget)[0];
        }
        if (focusVar != $(event.currentTarget)[0]) {
            focusVar = $(event.currentTarget)[0];
            vK.ActualText = "";
        }
        if (vK.AutoClear) {
            event.target.innerText = "";
            vK.ActualText = "";
        }
        vK.CurrentFocus = $(event.currentTarget)[0];
        var targetId = $(vK.CurrentFocus).attr('id');
        var targetIndex = targetId.substr(1);
        vK.ActualText="";
       // vK.ActualText = $("#editorTxt" + targetIndex).val();


    },
    hidePad: function () {
        var vK = vKey.getSelf();
        if (vK.KeyPad) vK.KeyPad.css({
            "visibility": "hidden"
        });
        $('.numTxt').blur();
    },
    onBlur: function () {
        var vK = vKey.getSelf();
        try {
            var targetId = $(event.currentTarget).attr('id');
            var targetIndex = targetId.substr(1);
            $("#editorTxt" + targetIndex).val(vK.ActualText);
        } catch (e) {}




    },
    getSelf: function () {
        return this;
    }
};

function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
}