/*===============================================
============== Anthor: Jianming ================
================ Date: 2013-06-04 ==============
===============================================*/

; (function ($) {

    var supportPlaceHolder = 'placeholder' in document.createElement("INPUT");

    function placeHolderRepair(inputElm) {

        var $inputElm = $(inputElm);
        var emptyClassName = 'placeholder';
        var placeHolder = $inputElm.attr('placeholder');

        //设置初始值
        $inputElm.addClass(emptyClassName)
                 .val(placeHolder);

        $inputElm.bind('focus', function () {
            if (this.value === placeHolder) {
                $inputElm.removeClass(emptyClassName)
                         .val('');
            }
        }).bind('blur', function () {
            if (this.value == '') {
                $inputElm.addClass(emptyClassName)
                         .val(placeHolder);
            }
        });

        //提交窗体前检测input值是否为placeholder的值
        $inputElm.parents('FORM').bind('submit', function () {
            if ($inputElm.val() === placeHolder) {
                $inputElm.val('');
            }
        });
    }

    //如果浏览器不支持placeholder
    if (!supportPlaceHolder) {
        $(function () {
            $('INPUT:text').each(function () {
                placeHolderRepair(this);
            });
        });
    }

})(jQuery);