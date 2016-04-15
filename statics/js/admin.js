(function () {

    var db = {
        links: null,
        tags: null,
        //获取唯一的tag
        getTags: function (links) {
            var tags = [];
            for (var i = 0, len = links.length; i < len; i++) {
                var link = links[i];
                if (("##" + tags.join("##") + "##").indexOf("##" + link.tag + "##") == -1) {
                    tags.push(link.tag);
                }
            }
            return tags;
        },
        getNewToken: function (callback) {
            var callback = callback || {};
            $.ajax({
                url: "/admin/newtoken",
                success: function (r) {
                    callback(r);
                }
            });
        },
        addLink: function (data, callback) {
            var callback = callback || {};

            //链接已存在
            if (this.inLink(data.title)) {
                callback({ r: 500 });
                return;
            }
            $.ajax({
                url: "/admin/addfav",
                cache: false,
                data: data,
                type: "post",
                dataType: "json",
                success: function (r) {
                    db.links.push(data);
                    db.tags = db.getTags(db.links);
                    callback(r);
                },
                error: function () {

                }
            });
        },
        setDomain: function (data, callback) {
            var callback = callback || {};
            $.ajax({
                url: "/admin/domainchange",
                cache: false,
                data: data,
                type: "post",
                dataType: "json",
                success: function (r) {
                    callback(r);
                },
                error: function () {
                }
            });
        },
        delLink: function (data, callback) {

            var callback = callback || {};
            $.ajax({
                url: "/admin/dellink",
                data: data,
                type: "post",
                dataType: "json",
                success: function (r) {
                    db.links = db.deleteArrayData("title", data.name, db.links);
                    db.tags = db.getTags(db.links);
                    callback(r);
                },
                error: function (r) {
                }
            });
        },
        linkChange: function (data, newData, callback) {
            var callback = callback || {};
            $.ajax({
                url: "/admin/linkchange",
                type: "post",
                dataType: "json",
                data: newData,
                success: function (r) {
                    for (var i = 0, len = db.links.length; i < len; i++) {
                        if (db.links[i].title == data.title) {
                            db.links[i] = newData;
                        }
                    }
                    db.tags = db.getTags(db.links);
                    callback(r);
                },
                error: function () { }
            });
        },
        filter: function (arr, filterKey) {
            var _filter = filterKey.split("=");
            var key = _filter[0];
            var data = _filter[1];
            var filterArr = [];
            for (var i = 0, len = arr.length; i < len; i++) {
                var obj = arr[i];
                if (obj[key] == data) {
                    filterArr.push(obj);
                }
            }
            return filterArr;
        },
        search: function (key) {

            if (!key || key == "")
                return db.links;
            var arr = [];
            for (var i = 0, l = db.links.length; i < l; i++) {
                var link = db.links[i];
                if (link.tag.indexOf(key) != -1 || link.url.indexOf(key) != -1 || link.title.indexOf(key) != -1) {
                    arr.push(link);
                }
            }

            return arr.length == 0 ? db.links : arr;
        },
        inLink: function (title) {
            for (var i = 0, l = db.links.length; i < l; i++) {
                var link = db.links[i];
                if (title == link.title) {
                    return true;
                }
            }
            return false;
        },
        deleteArrayData: function (attr, data, arr) {
            var arr = arr || this;
            var newArr = [];
            var data = "," + data + ",";
            for (var i = 0, l = arr.length; i < l; i++) {
                var children = arr[i];
                if (data.indexOf("," + children[attr] + ",") == -1) {
                    newArr.push(children);
                }

            }
            return newArr;

        },
        init: function (complete) {
            $.ajax({
                url: "/admin/getlinks",
                dataType: "json",
                success: function (r) {
                    db.links = r;
                    db.tags = db.getTags(r);
                    complete && complete();
                }
            });
        }

    };
    var ui = {
        showLinkMsg: function (msg) {
            $("#msg").text(msg).fadeIn(function () {
                setTimeout(function () {
                    $("#msg").hide();
                }, 3000);
            });
        },
        //获取模板html
        getTmplHtml: function (id) {
            return $(id).html().replace(/\[\[/g, "{ {".replace(/\s/g, "")).replace(/\]\]/g, "} }".replace(/\s/g, ""));
        },
        //画界面
        render: function () {

            //清空
            $("#selTags").empty();
            $("#links").empty();
            $("#tagList").empty();
            $("#acTags").empty();

            //重新画界面
            $.tmpl('<option value="${$data}">${$data}</option>', db.tags).appendTo("#selTags");
            $("#tagTmpl").tmpl(db.tags).appendTo("#acTags");
            $("#tagTmpl").tmpl(db.tags).appendTo("#tagList");
            $("#linkTmpl").tmpl(db.links).appendTo("#links");
            RenderSelect();
        },
        addLink: function () {
            //添加新链接
            var linkName = $.trim($("#linkName").val());
            var linkHref = $.trim($("#linkHref").val());
            var linkTag = $.trim($("#linkTag").val());
            if ("" === linkName) {
                art.dialog.alert("请输入链接名称!", function () {
                    $("#linkName").focus();
                });
                return false;
            }
            if ("" === linkHref) {
                art.dialog.alert("请输入链接地址!", function () {
                    $("#linkHref").focus();
                });
                return false;
            }
            if ("" === linkTag) {
                art.dialog.alert("请输入链接分类!", function () {
                    $("#linkTag").focus();
                });
                return false;
            }
            var data = { title: linkName, url: linkHref, tag: linkTag };
            db.addLink(data, function (r) {
                if (r && r.code && 200 === r.code) {
                    ui.showLinkMsg("操作成功！");
                    $("#linkName").val('').focus();
                    $("#linkHref").val('');

                    ui.render();
                    return;
                }
                ui.showLinkMsg("链接已存在！");

            });
        },
        setDomain: function () {
            var rdomain = /http:\/\/(.+)\.muuou\.com/i;
            var myName = $("#mySiteName");
            var myDomain = $("#myDomain");
            var myTheme = $("#theme");

            art.dialog({
                title: "设置我的域名",
                content: $("#settingsDialog").html(),
                follow: document.getElementById("settings"),
                okValue: "确定",
                cancelValue: "取消",
                cancel: true,
                lock: true,
                initialize: function () {
                    try {
                        $("#siteName").val(myName.text()).focus();
                        $("#siteDomain").val(myDomain.text());
                        $('#siteTheme').val($("#theme").attr("theme"));
                        //$('#siteTheme>option[value="' + $("#theme").attr("theme") + '"]').attr("selected", true);
                    } catch (e) {
                    }
                },
                ok: function () {
                    if ("" === $.trim($("#siteName").val())) {
                        artDialog.alert("请填写名称！", function () {
                            $("#siteName").focus();
                        });
                        return false;
                    }
                    if ("" === $.trim($("#siteDomain").val())) {
                        art.dialog.alert("请填写域名！", function () {
                            $("#siteDomain").focus();
                        });
                        return false;
                    }
                    //var newTheme = $('#siteTheme>option:selected');
                    var data = { name: $.trim($("#siteName").val()), domain: $.trim($("#siteDomain").val()), theme: $("#siteTheme").val() }
                    db.setDomain(data, function (r) {
                        if (r && r.code && r.code == 200) {
                            myName.text(data.name);
                            myDomain.text(data.domain);
                            //myTheme.attr("theme", newTheme.val());
                            //myTheme.text(newTheme.text());
                            return;
                        }
                        art.dialog.alert("error");
                    });
                }
            });
        },
        delLink: function () {
            var link = $(this).parents(".link");
            var linkName = link.attr("lname");

            if (!link || !linkName || "" === $.trim(linkName)) {
                art.dialog.alert("发生错误！");
                return;
            }

            art.dialog.confirm("确认要删除吗？", function () {
                db.delLink({ name: $.trim(linkName) }, function (r) {
                    if (r && r.code && r.code == 200) {
                        link.fadeOut('fast', function () {
                            $(this).remove();
                        });
                        ui.render();
                        return;
                    }
                    art.dialog.alert("删除失败！");
                });
            }, function () {
            }, { okValue: "确定", cancelValue: "取消" });
        },
        delLinks: function () {
            var delLinks = [];
            var checked = $(".link-content :checked");
            for (var i = 0, len = checked.length; i < len; i++) {
                delLinks.push($(checked[i]).parents(".link").attr("lname"));
            }

            if (delLinks.length == 0) {
                artDialog.alert("请选择要删除的链接！");
                return;
            }
            art.dialog.confirm("确认要删除吗？", function () {
                db.delLink({ name: delLinks.join(",") }, function (r) {
                    if (r && r.code && r.code == 200) {
                        ui.render();
                        return;
                    }
                    art.dialog.alert("删除失败！");
                });
            }, function () { });
        },
        checkAll: function () {
            var checked = $(this)[0].checked;
            $(".link-content :checkbox").each(function () {
                $(this).attr("checked", checked);
            });
        },
        renderLinks: function (v) {
            var data = db.links;
            if (v != 0) {
                data = db.filter(db.links, "tag=" + v)
            }
            if (!data || data.length == 0) {
                return;
            }
            $("#links").empty();
            $("#linkTmpl").tmpl(data).appendTo("#links");

        },
        linkChnage: function () {
            var link = $(this).parents(".link");
            var data = {
                title: link.attr("lname"),
                url: link.attr("lurl"),
                tag: link.attr("ltag")
            }
            artDialog({
                title: "修改链接信息",
                content: $("#linkChangeDialog").tmpl(data).html(),
                cancel: true,
                okValue: "确定", cancelValue: "取消",
                lock: true,
                follow: this,
                initialize: function () {
                    $("#mLinkName").select().focus();
                },
                ok: function () {
                    var newData = {
                        origTitle: data.title,
                        title: $.trim($("#mLinkName").val()),
                        url: $.trim($("#mLinkUrl").val()),
                        tag: $.trim($("#mLinkTag").val())
                    }


                    if ("" === newData.title) {
                        art.dialog.alert("请输入链接名称!", function () {
                            $("#mLinkName").focus();
                        });
                        return false;
                    }
                    if ("" === newData.url) {
                        art.dialog.alert("请输入链接地址!", function () {
                            $("#mLinkHref").focus();
                        });
                        return false;
                    }
                    if ("" === newData.tag) {
                        art.dialog.alert("请输入链接分类!", function () {
                            $("#mLinkTag").focus();
                        });
                        return false;
                    }
                    if (newData.title === data.title && newData.url === data.url && newData.tag === data.tag) {
                        return true;
                    }
                    db.linkChange(data, newData, function (r) {
                        if (r && r.code && r.code == 200) {
                            link.replaceWith($("#linkTmpl").tmpl(newData));
                            ui.render();
                            return true;
                        }
                        artDialog.alert("操作失败，请重试！");
                        return false;
                    });
                }
            });

        },
        init: function () {
            $("#addNewLink").click(ui.addLink);
            $("#settings").click(ui.setDomain);
            $(".link-del").live("click", ui.delLink);
            $(".link-change").live("click", ui.linkChnage);
            $("#checkAll").click(ui.checkAll);
            $(".multi-del").click(ui.delLinks);
            $("#selTags")[0].onchange = ui.renderLinks;
            $("#linkName").focus();
            $("#linkTag").keypress(function (e) {
                if (e.keyCode == 13) {
                    $("#addNewLink").click();
                }
            });

            $("#linkTag").focus(function () {
                $("#tagsBox").addClass("tagsBox-show");
            });
            $("#linkTag").blur(function () {
                $("#tagsBox").removeClass("tagsBox-show");
            });

            $(".ac-tags").mousedown(function (e) {
                var e = window.event || e;
                var elem = e.target || e.srcElement;
                $("#linkTag").val($.trim($(elem).text()));
            });

            $("#filterKey").keyup(function (e) {
                $("#links").empty();
                $("#linkTmpl").tmpl(db.search($(this).val())).appendTo("#links");
            });

            $("#resetToken").click(function () {
                db.getNewToken(function (r) {
                    $("#token").text(r).hide().fadeIn("fast");
                });
            });

            $("#oauth .oauth-title a").hover(function () {
                $("#oauth .tips").fadeIn("normal");
            }, function () {
                $("#oauth .tips").fadeOut("normal");
            });
            ui.render();
        }
    };
    $(function () {
        db.init(function () {
            ui.init();
        });
    });
}());


var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-29300722-1']);
_gaq.push(['_setDomainName', 'muuou.com']);
_gaq.push(['_trackPageview']);

(function () {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();