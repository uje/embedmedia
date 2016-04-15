$(function () {
    $("#siteName").trigger("focus");
    $(".settings input").focus(function () {
        $(this).addClass("current");
    }).blur(function () {
        $(this).removeClass("current");
    });

    $("#siteDomain").focus(function () {
        $(this).next().addClass("current-domain");
    }).blur(function () {
        $(this).next().removeClass("current-domain");
    });
    $(".setting-buttoner:eq(0) input:eq(0)").on("click", null, function () {
        var name = $("#siteName");
        var domain = $("#siteDomain");
        var theme = $("#theme");
        var buttoner = $(".setting-buttoner:eq(0)");
        if ($.trim(name.val()) == "") {
            name.focus();
            return;
        }
        if ($.trim(domain.val()) == "") {
            domain.focus();
            return;
        }

        var buttonHtml = $(".setting-buttoner:eq(0)").html();
        buttoner.html("请稍候，正在提交请求...");

        $.ajax({
            url: "/admin/domainchange",
            data: { name: $.trim(name.val()), domain: $.trim(domain.val()), theme: theme.val() },
            type: "post",
            dataType: "json",
            success: function (r) {
                if (r && r.code && r.code == 200) {
                    location.href = "/admin";
                    return;
                }
                $.dialog.alert("操作失败！");
                buttoner.html(buttonHtml);
            },
            error: function () {
                $.dialog.alert("操作失败！");
                buttoner.html(buttonHtml);
            }
        });
    });
});


var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-29300722-1']);
_gaq.push(['_setDomainName', 'muuou.com']);
_gaq.push(['_trackPageview']);

(function () {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();