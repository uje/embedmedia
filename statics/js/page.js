$(function () {
    $(".placeholder").click(function () {
        $(this).parent().find("input").focus();
    });
    $(".right input").focus(function () {
        $(this).parent().find(".placeholder")
    });

    //function insertOfChange(mode) {

    //    var oname = $.trim($("#pageOldName").val());
    //    var name = $.trim($("#pageName").val());
    //    var title = $.trim($("#pageTitle").val());
    //    var pageContent = $.trim(editor.html());

    //    if (!/^[a-zA-Z0-9\-\.]+$/.test(name)) {
    //        art.dialog.alert("请输入正确的名称！");
    //        return;
    //    }
    //    if (title == "") {
    //        art.dialog.alert("请输入标题！");
    //        return;
    //    }

    //    if (pageContent == "") {
    //        art.dialog.alert("请输入内容！");
    //        return;
    //    }

    //    var isChange=(mode=="change");

    //    $.ajax({
    //        url: isChange ? "/admin/pagechange" : "/admin/addpage",
    //        type: "post",
    //        dataType: "json",
    //        data: { name: name, title: title, html: pageContent, oname: oname },
    //        success: function (r) {
    //            if (r && r.code && r.code == 200) {
    //                art.dialog.alert("操作成功！");
    //                //$("#pageName").val("");
    //                //$("#pageTitle").val("");
    //                //editor.html("");
    //                if (isChange) {
    //                } else {
    //                }
    //                return;
    //            }
    //            art.dialog.alert("操作失败!");
    //        },
    //        error: function () {
    //            art.dialog.alert("操作失败，可能存在重复的名称！");
    //        }
    //    });
    //}

    $("#btnAdd").live("click", function () {

        var isChange = $("#pageOldName").val() != "";
        var oname = $.trim($("#pageOldName").val());
        var name = $.trim($("#pageName").val());
        var title = $.trim($("#pageTitle").val());
        var pageContent = $.trim(editor.html());

        if (!/^[a-zA-Z0-9\-\.]+$/.test(name)) {
            art.dialog.alert("请输入正确的名称！");
            return;
        }
        if (title == "") {
            art.dialog.alert("请输入标题！");
            return;
        }

        if (pageContent == "") {
            art.dialog.alert("请输入内容！");
            return;
        }

        $.ajax({
            url: isChange ? "/admin/pagechange" : "/admin/addpage",
            type: "post",
            dataType: "json",
            data: { 
                name: name, 
                title: title, 
                html: pageContent, 
                oname: oname, 
                showInTop: (document.getElementById("showInTop").checked ? "1" : "0"), 
                useFrame: (document.getElementById('useFrame').checked ? "1" : "0") 
            },
            success: function (r) {
                if (r && r.code && r.code == 200) {
                    //art.dialog.alert("操作成功！");
                    //$("#pageName").val("");
                    //$("#pageTitle").val("");
                    //editor.html("");
                    if (isChange) {
                        var cur = $('.page-manager-area tr[pagename="' + $("#pageOldName").val() + '"]');
                        cur.find(".l-page-name").text(name);
                        cur.find(".l-page-title").text(title);
                        cur.attr("pagename", name).fadeOut("normal", function () {
                            $(this).fadeIn("normal");
                        });
                    } else {
                        $(".page-manager-area tbody")
                            .prepend('<tr pagename="' + name + '"><td class="l-page-name">' + name + '</td><td class="l-page-title">' + title + '</td><td><a href="javascript:;" class="page-edit">编辑</a>&nbsp;<a href="javascript:;" class="page-delete">删除</a></td></tr>');
                    }
                    return;
                }
                art.dialog.alert("操作失败!");
            },
            error: function () {
                art.dialog.alert("操作失败，可能存在重复的名称！");
            }
        });
    });
    $(".page-delete").click(function () {
        var elem = $(this);
        var name = $.trim($(this).parents("tr").find(".l-page-name").text());
        if (name == "") {
            art.dialog.alert("请选择要删除的页面！");
            return;
        }
        $.ajax({
            url: "/admin/pagedelete",
            type: "post",
            dataType: "json",
            data: { name: name },
            success: function (r) {
                if (r && r.code && r.code == 200) {
                    elem.parents("tr").fadeOut("fast", function () {
                        $(this).remove();
                    });
                    return;
                }
                art.dialog.alert("操作失败!");
            },
            error: function () {
                art.dialog.alert("操作失败，请重试！");
            }
        });
    });

    $("#btnNew").click(function () {
        $("#pageName").val("");
        $("#pageTitle").val("");
        $("#pageOldName").val("");
        editor.html("");
        $(".page-label b").text("添加新页面");
    });

    $(".page-edit").click(function () {

        var elem = $(this);
        var name = $.trim($(this).parents("tr").find(".l-page-name").text());
        if (name == "") {
            art.dialog.alert("请选择要编辑的页面！");
            return;
        }
        $("#pageOldName").val(name);
        $(".page-label b").text("编辑" + name);
        $.ajax({
            url: "/admin/getpage",
            type: "post",
            dataType: "json",
            data: { name: name },
            success: function (r) {
                $("#pageName").val(r.name);
                $("#pageTitle").val(r.title);
                if (r.showInTop) {
                    document.getElementById("showInTop").checked = true;
                } else {
                    document.getElementById("showInTop").checked = false;
                }

                if (r.useFrame) {
                    document.getElementById("useFrame").checked = true;
                } else {
                    document.getElementById("useFrame").checked = false;
                }
                editor.html(r.html);
            },
            error: function () {
                art.dialog.alert("操作失败，请重试！");
            }
        });
    });
});