        $(function () {
            if ($.cookie("homeFontSize")) {
                $("body").css("font-size", $.cookie("homeFontSize"));
            }

            $("#fontAdd").click(function () {
                var size = parseInt($("body").css("font-size").replace("px"));
                if (size < 26) {
                    $("body").css("font-size", (size + 2) + "px");
                    $.cookie("homeFontSize", (size + 2) + "px");
                }
            });
            $("#fontSub").click(function () {
                var size = parseInt($("body").css("font-size").replace("px"));
                if (size > 14) {
                    $("body").css("font-size", (size - 2) + "px");
                    $.cookie("homeFontSize", (size - 2) + "px");
                }
            });
            $("#fontNormal").click(function () {
                $("body").css("font-size", "14px");
                $.cookie("homeFontSize", "14px");
            });