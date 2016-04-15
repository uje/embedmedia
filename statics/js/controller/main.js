/*! create_date:  2013-10-02 */
var __indexOf=[].indexOf||function(a){for(var b=0,c=this.length;c>b;b++)if(b in this&&this[b]===a)return b;return-1};define("app/controller/main",["jquery","../models/filter","../models/cache","../template/link.tpl","../template/tag.tpl","../template/autocomplete.tpl"],function(a,b){var c,d,e,f,g,h,i,j,k,l,m,n;a("jquery"),h=a("../models/filter"),c=a("../models/cache"),l=a("../template/link.tpl"),m=a("../template/tag.tpl"),k=a("../template/autocomplete.tpl"),$(window).on("resize",null,function(){return g.resize}),f=function(){},j={page:"#page",loading:"#loading",links:"#links",tag:"#tagCloud",links_item:"#links .box",links_mark:"#linksMark",keyword:"#keyword",navigator:".header .nav",css_navigator:"active"},d={link:"links",tag:"tag"},n={render:function(a,b,c){var d,e;return e=template.compile(a),d=e(b),c?$(c).html(d):d},isiPad:function(){return/safari/i.test(navigator.userAgent)&&/ipad/i.test(navigator.userAgent)},isMobile:function(){return/mobile/gi.test(navigator.userAgent)&&this.isiPad()}},e={get_tags:function(a){return c.get_if_cache(d.tag,function(){var b,c,d,e,f;for(d=[],b={},e=0,f=a.length;f>e;e++)c=a[e],b[c.tag]||(d.push(c.tag),b[c.tag]=1);return d.sort()})},get_link:function(a,b){var c,d,e;if(!a)throw new Error("links is require");if(!b)throw new Error("name is require");for(d=0,e=a.length;e>d;d++)if(c=a[d],-1!==c.title.toLowerCase().indexOf(b.toLowerCase())||-1!==toPinyin(c.title).toLowerCase().indexOf(b.toLowerCase()))return c},sort_data:function(a){return c.get_if_cache(d.link,function(){var b,c,d,e,f,g;for(c={},b={},e=[],f=0,g=a.length;g>f;f++)d=a[f],d.tag in c||(c[d.tag]=[],d.tag in b||(b[d.tag]=0),e.push(d.tag)),b[d.tag]++,c[d.tag].push(d);return{links_obj:c,tags:e.sort(function(a,c){return b[a]>b[c]?-1:1})}})},delete_repeat:function(a){var b,c,d,e,f,g;for(b=[],c={},g=[],e=0,f=a.length;f>e;e++)d=a[e],__indexOf.call(c,d)<0?g.push(b.push(d)):g.push(void 0);return g}},g={autocomplete:function(a){return $(j.keyword).autocomplete(a,{max:5,matchContains:!0,minChar:0,autoFill:!1,matchContains:!0,matchSubset:!1,width:188,scrollHeight:300,formatItem:function(a){return n.render(k,a)},formatResult:function(a){return a.title},formatMatch:function(a){return[a.title,a.url,a.tag,toPinyin(a.title)].join("")}}).result(function(a,b){return window.open(b.url)})},masonry:function(){return $(j.links).masonry({itemSelector:j.links_item,columnWidth:$(j.links).width()/3})},set_nav:function(a){return $(j.navigator).find("A").removeClass(j.css_navigator),$(j.navigator).find('LI[data-key="{0}"] A'.replace("{0}",a)).addClass(j.css_navigator)},resize:function(){return this.masonry()},keywordFocus:function(){return $(this).parents(".search").addClass("active"),$(this).bind("blur",function(){return $(this).parents(".search").removeClass("active"),$(this).unbind("blur")})}},i=function(a){h.getData(a,function(a){var b;return b=e.sort_data(a),$(function(){return $(j.loading).remove(),n.render(l,b,j.links),n.render(m,["全部"].concat(e.get_tags(a)),j.tag),g.autocomplete(a),!n.isMobile()&&g.masonry()})})},a.async("jqueryplugin"),$(function(){return $(j.keyword).trigger("focus"),$(j.keyword).bind("focus",g.keywordFocus)}),b.set_nav=g.set_nav,b.getLinks=i}),define("app/models/filter",["jquery","app/models/cache"],function(a,b){var c,d,e;a("jquery"),c=a("app/models/cache"),e=function(){},d="links",b.getData=function(a,b,f,g){if(b=b||e,!a)throw new Error("exports.getData: url is empty");$.isFunction(f)?(g=f,f=!1):g=g||e,f&&c.exist(d)&&b(c.get(d)),jQuery.ajax({url:a,dataType:"json",error:g,success:function(a){c.set(d,a),b(a)}})}}),define("app/models/cache",[],function(a,b){var c,d;return d||(d=Math.random().toString().substring(2)),c={data:{},exist:function(a){return c.data[d+a]?!0:!1},get:function(a){return this.exist(d+a)?c.data[d+a]:void 0},set:function(a,b){return jQuery.isFunction(b)&&(b=b()),c.data[d+a]=b,b},get_if_cache:function(a,b){var c;return c=this.get(a),c||(c=this.set(a,b)),c}},b.cache={exist:c.exist,get:c.get,set:c.set,get_if_cache:c.get_if_cache}}),define("app/template/link.tpl",[],'<%for(i = 0, tag;( tag = tags[ i ] ) != null; i++){ %>\n  <div class="box" data-tag="<%=tag %>">\n    <h2><%=tag%></h2>\n    <summary>\n	    <ul class="box-content">\n	      <%for(j = 0,links = links_obj[ tag ] ;(link=links[ j ])!=null; j++){%> \n	        <li><a href="<%=link.url%>" title="<%=link.title%>" target="_blank" rel="nofollow"><%=link.title%></a></li>\n	      <%}%>\n	    </ul>\n	</summary>\n  </div>\n<%}%>'),define("app/template/tag.tpl",[],'<%for(item in $data){%>\n	<li><a href="javascript:;" class="tag-item"><%=$data[item]%></a></li>\n<%}%>'),define("app/template/autocomplete.tpl",[],'<a href="<%=url%>" target="_blank"><%=title%></a>\n<mark><%=tag%></mark>');