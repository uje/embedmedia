/*!artTemplate - Template Engine*/
var template = function (a, b) { return template["object" == typeof b ? "render" : "compile"].apply(template, arguments) }; (function (a, b) { "use strict"; a.version = "2.0.1", a.openTag = "<%", a.closeTag = "%>", a.isEscape = !0, a.isCompress = !1, a.parser = null, a.render = function (a, b) { var c = d(a); return void 0 === c ? e({ id: a, name: "Render Error", message: "No Template" }) : c(b) }, a.compile = function (b, d) { function l(c) { try { return new j(c) + "" } catch (f) { return h ? (f.id = b || d, f.name = "Render Error", f.source = d, e(f)) : a.compile(b, d, !0)(c) } } var g = arguments, h = g[2], i = "anonymous"; "string" != typeof d && (h = g[1], d = g[0], b = i); try { var j = f(d, h) } catch (k) { return k.id = b || d, k.name = "Syntax Error", e(k) } return l.prototype = j.prototype, l.toString = function () { return "" + j }, b !== i && (c[b] = l), l }, a.helper = function (b, c) { a.prototype[b] = c }, a.onerror = function (a) { var c = "[template]:\n" + a.id + "\n\n[name]:\n" + a.name; a.message && (c += "\n\n[message]:\n" + a.message), a.line && (c += "\n\n[line]:\n" + a.line, c += "\n\n[source]:\n" + a.source.split(/\n/)[a.line - 1].replace(/^[\s\t]+/, "")), a.temp && (c += "\n\n[temp]:\n" + a.temp), b.console && console.error(c) }; var c = {}, d = function (d) { var e = c[d]; if (void 0 === e && "document" in b) { var f = document.getElementById(d); if (f) { var g = f.value || f.innerHTML; return a.compile(d, g.replace(/^\s*|\s*$/g, "")) } } else if (c.hasOwnProperty(d)) return e }, e = function (b) { function c() { return c + "" } return a.onerror(b), c.toString = function () { return "{Template Error}" }, c }, f = function () { a.prototype = { $render: a.render, $escape: function (a) { return "string" == typeof a ? a.replace(/&(?![\w#]+;)|[<>"']/g, function (a) { return { "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "&": "&#38;" }[a] }) : a }, $string: function (a) { return "string" == typeof a || "number" == typeof a ? a : "function" == typeof a ? a() : "" } }; var b = Array.prototype.forEach || function (a, b) { for (var c = this.length >>> 0, d = 0; c > d; d++) d in this && a.call(b, this[d], d, this) }, c = function (a, c) { b.call(a, c) }, d = "break,case,catch,continue,debugger,default,delete,do,else,false,finally,for,function,if,in,instanceof,new,null,return,switch,this,throw,true,try,typeof,var,void,while,with,abstract,boolean,byte,char,class,const,double,enum,export,extends,final,float,goto,implements,import,int,interface,long,native,package,private,protected,public,short,static,super,synchronized,throws,transient,volatile,arguments,let,yield,undefined", e = /\/\*(?:.|\n)*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|'[^']*'|"[^"]*"|[\s\t\n]*\.[\s\t\n]*[$\w\.]+/g, f = /[^\w$]+/g, g = RegExp(["\\b" + d.replace(/,/g, "\\b|\\b") + "\\b"].join("|"), "g"), h = /\b\d[^,]*/g, i = /^,+|,+$/g, j = function (a) { return a = a.replace(e, "").replace(f, ",").replace(g, "").replace(h, "").replace(i, ""), a = a ? a.split(/,+/) : [] }; return function (b, d) { function w(b) { return k += b.split(/\n/).length - 1, a.isCompress && (b = b.replace(/[\n\r\t\s]+/g, " ")), b = b.replace(/('|\\)/g, "\\$1").replace(/\r/g, "\\r").replace(/\n/g, "\\n"), b = q[1] + "'" + b + "'" + q[2], b + "\n" } function x(b) { var c = k; if (g ? b = g(b) : d && (b = b.replace(/\n/g, function () { return k++, "$line=" + k + ";" })), 0 === b.indexOf("=")) { var e = 0 !== b.indexOf("=="); if (b = b.replace(/^=*|[\s;]*$/g, ""), e && a.isEscape) { var f = b.replace(/\s*\([^\)]+\)/, ""); m.hasOwnProperty(f) || /^(include|print)$/.test(f) || (b = "$escape($string(" + b + "))") } else b = "$string(" + b + ")"; b = q[1] + b + q[2] } return d && (b = "$line=" + c + ";" + b), y(b), b + "\n" } function y(a) { a = j(a), c(a, function (a) { l.hasOwnProperty(a) || (z(a), l[a] = !0) }) } function z(a) { var b; "print" === a ? b = s : "include" === a ? (n.$render = m.$render, b = t) : (b = "$data." + a, m.hasOwnProperty(a) && (n[a] = m[a], b = 0 === a.indexOf("$") ? "$helpers." + a : b + "===undefined?$helpers." + a + ":" + b)), o += a + "=" + b + "," } var e = a.openTag, f = a.closeTag, g = a.parser, h = b, i = "", k = 1, l = { $data: !0, $helpers: !0, $out: !0, $line: !0 }, m = a.prototype, n = {}, o = "var $helpers=this," + (d ? "$line=0," : ""), p = "".trim, q = p ? ["$out='';", "$out+=", ";", "$out"] : ["$out=[];", "$out.push(", ");", "$out.join('')"], r = p ? "if(content!==undefined){$out+=content;return content}" : "$out.push(content);", s = "function(content){" + r + "}", t = "function(id,data){if(data===undefined){data=$data}var content=$helpers.$render(id,data);" + r + "}"; c(h.split(e), function (a) { a = a.split(f); var c = a[0], d = a[1]; 1 === a.length ? i += w(c) : (i += x(c), d && (i += w(d))) }), h = i, d && (h = "try{" + h + "}catch(e){" + "e.line=$line;" + "throw e" + "}"), h = "'use strict';" + o + q[0] + h + "return new String(" + q[3] + ")"; try { var u = Function("$data", h); return u.prototype = n, u } catch (v) { throw v.temp = "function anonymous($data) {" + h + "}", v } } }() })(template, this), "function" == typeof define ? define(function (a, b, c) { c.exports = template }) : "undefined" != typeof exports && (module.exports = template);

/*jQuery.cookie*/
; jQuery.cookie = function (d, c, a) { if (typeof c != "undefined") { a = a || {}; if (c === null) { c = ""; a.expires = -1 } var h = ""; if (a.expires && (typeof a.expires == "number" || a.expires.toUTCString)) { var b; if (typeof a.expires == "number") { b = new Date; b.setTime(b.getTime() + a.expires * 24 * 60 * 60 * 1e3) } else b = a.expires; h = "; expires=" + b.toUTCString() } var l = a.path ? "; path=" + a.path : "", j = a.domain ? "; domain=" + a.domain : "", k = a.secure ? "; secure" : ""; document.cookie = [d, "=", encodeURIComponent(c), h, l, j, k].join("") } else { var f = null; if (document.cookie && document.cookie != "") for (var g = document.cookie.split(";"), e = 0; e < g.length; e++) { var i = jQuery.trim(g[e]); if (i.substring(0, d.length + 1) == d + "=") { f = decodeURIComponent(i.substring(d.length + 1)); break } } return f } }

/*artDialog with plugin*/
; eval(function (p, a, c, k, e, d) { e = function (c) { return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36)) }; if (!''.replace(/^/, String)) { while (c--) { d[e(c)] = k[c] || e(c) } k = [function (e) { return d[e] }]; e = function () { return '\\w+' }; c = 1 }; while (c--) { if (k[c]) { p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]) } } return p }('(6(g,h){6 i(a){y c=f.2s,d=a===g?0:a[c];d===h&&(a[c]=d=++f.30);8 d}y f=g.2M=6(a,c){8 1M f.M.1i(a,c)},p=/^(?:[^<]*(<[\\w\\W]+>)[^>]*$|#([\\w\\-]+)$)/,o=/[\\n\\t]/g;z(g.$===h)g.$=f;f.M=f.1O={1i:6(a,c){y d,c=c||A;z(!a)8 3;z(a.1u)8 3[0]=a,3;z("1N"===1f a&&(d=p.3z(a))&&d[2])8(d=c.3m(d[2]))&&d.1n&&(3[0]=d),3;3[0]=a;8 3},2u:6(a){8-1<(" "+3[0].X+" ").2E(o," ").3q(" "+a+" ")?!0:!1},16:6(a){3.2u(a)||(3[0].X+=" "+a);8 3},1s:6(a){y c=3[0];z(a){z(3.2u(a))c.X=c.X.2E(a," ")}Y c.X="";8 3},J:6(a,c){y d,e=3[0];z("1N"===1f a){z(c===h)8 f.J(e,a);e.Q[a]=c}Y F(d I a)e.Q[d]=a[d];8 3},1E:6(){8 3.J("1I","3E")},1K:6(){8 3.J("1I","2C")},1R:6(){y a=3[0],c=a.3W(),d=a.3H,a=d.1c,d=d.1v;8{14:c.14+(2A.2b||d.2m)-(d.2D||a.2D||0),12:c.12+(2A.2R||d.2j)-(d.2w||a.2w||0)}},15:6(a){y c=3[0];z(a===h)8 c.2d;f.1X(c.1F("*"));c.2d=a;8 3},1j:6(){y a=3[0];f.1X(a.1F("*"));f.1X([a]);a.1n.3M(a);8 3},1g:6(a,c){f.17.2X(3[0],a,c);8 3},2q:6(a,c){f.17.1j(3[0],a,c);8 3}};f.M.1i.1O=f.M;f.28=6(a){8 a&&"3N"===1f a&&"3O"I a};f.M.3K=6(a){y c=3[0],d=a.36(".")[1];z(d)z(A.2B)d=c.2B(d);Y{F(y e=a=0,b=[],c=(c||A).1F("*"),m=c.1d,d=3J("(^|\\\\s)"+d+"(\\\\s|$)");a<m;a++)d.2t(c[a].X)&&(b[e]=c[a],e++);d=b}Y d=c.1F(a);8 f(d[0])};f.2o=6(a,c){y d,e=0,b=a.1d;z(b===h)F(d I a){z(!1===c.1o(a[d],d,a[d]))3F}Y F(d=a[0];e<b&&!1!==c.1o(d,e,d);d=a[++e]);8 a};f.1C=6(a,c,d){y e=f.1B,a=i(a);z(c===h)8 e[a];e[a]||(e[a]={});d!==h&&(e[a][c]=d);8 e[a][c]};f.2l=6(a,c){y d=!0,e=f.2s,b=f.1B,m=i(a),n=m&&b[m];z(n)z(c){1p n[c];F(y k I n)d=!1;d&&1p f.1B[m]}Y 1p b[m],a.1U?a.1U(e):a[e]=H};f.30=0;f.1B={};f.2s="@1B"+ +1M 2Y;f.17={2X:6(a,c,d){y j;y e,b=f.17;e=f.1C(a,"@1A")||f.1C(a,"@1A",{});j=e[c]=e[c]||{},e=j;(e.1z=e.1z||[]).1L(d);z(!e.19)e.1W=a,e.19=b.19(e),a.2Z?a.2Z(c,e.19,!1):a.3Q("2N"+c,e.19)},1j:6(a,c,d){y e,b,m;b=f.17;y n=!0,k=f.1C(a,"@1A");z(k)z(c){z(b=k[c]){m=b.1z;z(d)F(e=0;e<m.1d;e++)m[e]===d&&m.3X(e--,1);Y b.1z=[];z(0===b.1z.1d){a.2T?a.2T(c,b.19,!1):a.3Y("2N"+c,b.19);1p k[c];b=f.1C(a,"@1A");F(y r I b)n=!1;n&&f.2l(a,"@1A")}}}Y F(e I k)b.1j(a,e)},19:6(a){8 6(c){F(y c=f.17.2O(c||g.17),d=0,e=a.1z,b;b=e[d++];)!1===b.1o(a.1W,c)&&(c.2P(),c.2V())}},2O:6(a){z(a.21)8 a;y c={21:a.3V||A,2P:6(){a.3R=!1},2V:6(){a.3S=!0}},d;F(d I a)c[d]=a[d];8 c}};f.1X=6(a){F(y c=0,d,e=a.1d,b=f.17.1j,m=f.2l;c<e;c++)d=a[c],b(d),m(d)};f.J="1P"I A&&"2Q"I A.1P?6(a,c){8 A.1P.2Q(a,!1)[c]}:6(a,c){8 a.3l[c]||""};f.2o(["3k","3r"],6(a,c){y d="26"+c;f.M[d]=6(){y c=3[0],b;8(b=f.28(c)?c:9===c.1u?c.1P||c.3o:!1)?"2b"I b?b[a?"2R":"2b"]:b.A.1v[d]||b.A.1c[d]:c[d]}});f.2o(["3i","3j"],6(a,c){y d=c.3p();f.M[d]=6(a){y b=3[0];8!b?H==a?H:3:f.28(b)?b.A.1v["25"+c]||b.A.1c["25"+c]:9===b.1u?2k.2e(b.1v["25"+c],b.1c["26"+c],b.1v["26"+c],b.1c["1R"+c],b.1v["1R"+c]):H}});8 f})(1T);(6(g,h,i){z("3A"===A.3B)3b 3a("1m: 3C 3y 3x 3t 42 3v.0");y f,p=0,o="1m"+ +1M 2Y,a=h.40&&!h.4b,c="4y"I A&&!("4z"I A)||/(4C|4v|4t)/i.2t(4D.4s),d=!a&&!c,e=6(b,a,n){b=b||{};z("1N"===1f b||1===b.1u)b={10:b,Z:!c};y k;k=e.1H;y r=b.K=1===3.1u&&3||b.K,t;F(t I k)b[t]===i&&(b[t]=k[t]);b.11=r&&r[o+"K"]||b.11||o+p;z(k=e.1l[b.11])8 r&&k.K(r),k.L().E(),k;z(!d)b.Z=!1;z(!b.O||!b.O.1L)b.O=[];z(a!==i)b.1y=a;b.1y&&b.O.1L({11:"1y",1Y:b.2y,1e:b.1y,E:!0});z(n!==i)b.P=n;b.P&&b.O.1L({11:"P",1Y:b.2z,1e:b.P});e.1H.L=b.L;p++;8 e.1l[b.11]=f?f.1i(b):1M e.M.1i(b)};e.4w="5.0";e.M=e.1O={1i:6(b){y a;3.2g=!1;3.13=b;3.D=a=3.D||3.37();b.2c&&a.R.16(b.2c);a.R.J("U",b.Z?"Z":"1Q");a.1x[!1===b.P?"1K":"1E"]();a.10.J("2n",b.2n);3.O.3g(3,b.O);3.1k(b.1k).10(b.10).2I(b.S,b.1b).1G(b.1G);b.K?3.K(b.K):3.U();3.L();b.1w&&3.1w();3.3d();3[b.1h?"1h":"1J"]().E();f=H;b.2f&&b.2f.1o(3);8 3},10:6(b){y a,c,e,d,f=3,v=3.D.10,l=v[0];3.1q&&(3.1q(),1p 3.1q);z("1N"===1f b)v.15(b);Y z(b&&1===b.1u)d=b.Q.1I,a=b.4n,c=b.2W,e=b.1n,3.1q=6(){a&&a.1n?a.1n.29(b,a.2W):c&&c.1n?c.1n.29(b,c):e&&e.20(b);b.Q.1I=d;f.1q=H},v.15(""),l.20(b),g(b).1E();8 3.U()},1k:6(b){y a=3.D,c=a.V,a=a.1k;!1===b?(a.1K().15(""),c.16("d-T-2K")):(a.1E().15(b),c.1s("d-T-2K"));8 3},U:6(){y b=3.D,a=b.R[0],c=b.1T,e=b.A,d=3.13.Z,b=d?0:e.2m(),e=d?0:e.2j(),d=c.S(),f=c.1b(),g=a.1S,c=(d-a.1Z)/2+b,d=d=(g<4*f/7?0.4a*f-g/ 2: (f - g) /2)+e,a=a.Q;a.14=2k.2e(c,b)+"1a";a.12=2k.2e(d,e)+"1a";8 3},2I:6(b,a){y c=3.D.3c[0].Q;"31"===1f b&&(b+="1a");"31"===1f a&&(a+="1a");c.S=b;c.1b=a;8 3},K:6(b){y a=g(b),c=3.13;z(!b||!b.1Z&&!b.1S)8 3.U(3.44,3.45);y d=c.Z,e=o+"K",f=3.D,h=f.1T,l=f.A,f=h.S(),h=h.1b(),s=l.2m(),l=l.2j(),j=a.1R(),a=b.1Z,i=d?j.14-s:j.14,j=d?j.12-l:j.12,q=3.D.R[0],p=q.Q,u=q.1Z,q=q.1S,w=i-(u-a)/2,x=j+b.1S,s=d?0:s,d=d?0:l;p.14=(w<s?i:w+u>f&&i-u>s?i-u+a:w)+"1a";p.12=(x+q>h+d&&j-q>d?j-q:x)+"1a";3.2i&&3.2i.1U(e);3.2i=b;b[e]=c.11;8 3},O:6(){F(y b=3.D.2h,a=b[0],c=3.1V=3.1V||{},d=[].4e.1o(3h),e=0,f,h,l,i,j;e<d.1d;e++){f=d[e];h=f.1Y;l=f.11||h;i=!c[l];j=!i?c[l].1W:A.24("35");j.32="O";j.X="d-O";c[l]||(c[l]={});z(h)j.1Y=h;z(f.S)j.Q.S=f.S;z(f.1e)c[l].1e=f.1e;z(f.E)3.1D&&3.1D.1s("d-T-2J"),3.1D=g(j).16("d-T-2J"),3.E();j[o+"1e"]=l;j.2r=!!f.2r;z(i)c[l].1W=j,a.20(j)}b[0].Q.1I=d.1d?"":"2C";8 3},1h:6(){3.D.R.J("2F","1h");3.D.V.16("d-T-1h");3.1r&&3.18.1E();8 3},1J:6(){3.D.R.J("2F","1J");3.D.V.1s("d-T-1h");3.1r&&3.18.1K();8 3},1x:6(){z(3.2g)8 3;y b=3.D,a=b.R,c=e.1l,k=3.13.2x,g=3.13.K;z(k&&!1===k.1o(3))8 3;z(e.E===3)e.E=H;g&&g.1U(o+"K");3.1q&&3.1q();3.1G();3.33();3.34();1p c[3.13.11];z(f)a.1j();Y{f=3;b.1k.15("");b.10.15("");b.2h.15("");a[0].X=a[0].Q.38="";b.V[0].X="d-V";a.J({14:0,12:0,U:d?"Z":"1Q"});F(y h I 3)3.48(h)&&"D"!==h&&1p 3[h];3.1J()}3.2g=!0;8 3},1G:6(b){y a=3,c=3.2L;c&&4r(c);z(b)3.2L=3u(6(){a.1t("P")},b);8 3},E:6(){z(3.13.E)4u{y b=3.1D&&3.1D[0]||3.D.1x[0];b&&b.E()}4p(a){}8 3},L:6(){y b=3.D,a=e.E,c=e.1H.L++;b.R.J("L",c);3.18&&3.18.J("L",c-1);a&&a.D.V.1s("d-T-E");e.E=3;b.V.16("d-T-E");8 3},1w:6(){z(3.1r)8 3;y b=3,a=3.D,c=A.24("G"),f=g(c),i=e.1H.L-1;3.L();a.V.16("d-T-1w");f.J({L:i,U:"Z",14:0,12:0,S:"3f%",1b:"3f%",49:"1J"}).16("d-46");d||f.J({U:"1Q",S:g(h).S()+"1a",1b:g(A).1b()+"1a"});f.1g("2v",6(){b.2a()}).1g("4d",6(){b.1t("P")});A.1c.20(c);3.18=f;3.1r=!0;8 3},33:6(){z(!3.1r)8 3;3.18.2q();3.18.1K();3.18.1j();3.D.V.1s("d-T-1w");3.1r=!1;8 3},37:6(){y b=A.1c;z(!b)3b 3a(\'1m: "4l.1c" 4q 3w\');y a=A.24("G");a.Q.38="U:1Q;14:0;12:0";a.2d=e.39;b.29(a,b.3n);F(y c=0,d={},f=a.1F("*"),i=f.1d;c<i;c++)(b=f[c].X.36("d-")[1])&&(d[b]=g(f[c]));d.1T=g(h);d.A=g(A);d.R=g(a);8 d},1t:6(b){b=3.1V[b]&&3.1V[b].1e;8"6"!==1f b||!1!==b.1o(3)?3.1x():3},2a:6(){y b=3.13.K;b?3.K(b):3.U()},3d:6(){y b=3,a=3.D;a.R.1g("2v",6(c){c=c.21;z(c.2r)8!1;z(c===a.1x[0])8 b.1t("P"),!1;(c=c[o+"1e"])&&b.1t(c)}).1g("3P",6(){b.L()})},34:6(){3.D.R.2q()}};e.M.1i.1O=e.M;g.M.2p=g.M.1m=6(){y b=3h;3[3.3e?"3e":"1g"]("2v",6(){e.3g(3,b);8!1});8 3};e.E=H;e.43=6(b){8 b===i?e.1l:e.1l[b]};e.1l={};g(A).1g("3L",6(b){y a=b.21,c=a.3U,d=/^35|3G$/i,f=e.E,b=b.3Z;f&&f.13.2S&&!(d.2t(c)&&"O"!==a.32)&&27===b&&f.1t("P")});g(h).1g("41",6(){y b=e.1l,a;F(a I b)b[a].2a()});e.39=\'<G C="d-V"><22 C="d-3D"><23><N><B C="d-3s"></B><B C="d-n"></B><B C="d-4x"></B></N><N><B C="d-w"></B><B C="d-c"><G C="d-4c"><22 C="d-2p"><23><N><B C="d-4j"><G C="d-4h"><G C="d-1k"></G><a C="d-1x" 4g="4f:/*1m*/;">\\4k</a></G></B></N><N><B C="d-3c"><G C="d-10"></G></B></N><N><B C="d-47"><G C="d-2h"></G></B></N></23></22></G></B><B C="d-e"></B></N><N><B C="d-4B"></B><B C="d-s"></B><B C="d-4m"></B></N></23></22></G>\';e.1H={10:\'<G C="d-2G"><2H>2G..</2H></G>\',1k:"4i",O:H,1y:H,P:H,2f:H,2x:H,2y:"1y",2z:"P",S:"2U",1b:"2U",2n:"4A 4o",2c:H,1G:H,2S:!0,E:!0,1h:!0,K:H,1w:!1,Z:!1,L:3T};3.1m=g.2p=g.1m=e})(3.2M||3.3I,3);', 62, 288, '|||this|||function||return||||||||||||||||||||||||||var|if|document|td|class|dom|focus|for|div|null|in|css|follow|zIndex|fn|tr|button|cancel|style|wrap|width|state|position|outer||className|else|fixed|content|id|top|config|left|html|addClass|event|_lockMask|handler|px|height|body|length|callback|typeof|bind|visible|constructor|remove|title|list|artDialog|parentNode|call|delete|_elemBack|_isLock|removeClass|_click|nodeType|documentElement|lock|close|ok|listeners|events|cache|data|_focus|show|getElementsByTagName|time|defaults|display|hidden|hide|push|new|string|prototype|defaultView|absolute|offset|offsetHeight|window|removeAttribute|_listeners|elem|cleanData|value|offsetWidth|appendChild|target|table|tbody|createElement|client|scroll||isWindow|insertBefore|_reset|pageXOffset|skin|innerHTML|max|initialize|closed|buttons|_follow|scrollTop|Math|removeData|scrollLeft|padding|each|dialog|unbind|disabled|expando|test|hasClass|click|clientTop|beforeunload|okValue|cancelValue|self|getElementsByClassName|none|clientLeft|replace|visibility|loading|span|size|highlight|noTitle|_timer|art|on|fix|preventDefault|getComputedStyle|pageYOffset|esc|removeEventListener|auto|stopPropagation|nextSibling|add|Date|addEventListener|uuid|number|type|unlock|_removeEvent|input|split|_getDom|cssText|_templates|Error|throw|main|_addEvent|live|100|apply|arguments|Height|Width|Left|currentStyle|getElementById|firstChild|parentWindow|toLowerCase|indexOf|Top|nw|more|setTimeout|xhtml1|ready|require|types|exec|BackCompat|compatMode|Document|border|block|break|textarea|ownerDocument|jQuery|RegExp|find|keydown|removeChild|object|setInterval|mousedown|attachEvent|returnValue|cancelBubble|1987|nodeName|srcElement|getBoundingClientRect|splice|detachEvent|keyCode|VBArray|resize|than|get|_left|_top|mask|footer|hasOwnProperty|overflow|382|XMLHttpRequest|inner|dblclick|slice|javascript|href|titleBar|message|header|u00d7|documents|se|previousSibling|25px|catch|not|clearTimeout|userAgent|iPod|try|iPad|version|ne|createTouch|onmousemove|20px|sw|iPhone|navigator'.split('|'), 0, {}))
; eval(function (p, a, c, k, e, d) { e = function (c) { return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36)) }; if (!''.replace(/^/, String)) { while (c--) { d[e(c)] = k[c] || e(c) } k = [function (e) { return d[e] }]; e = function () { return '\\w+' }; c = 1 }; while (c--) { if (k[c]) { p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]) } } return p }('(2(c){c.1t=c.C.1t=2(b,a){7 c.C({Y:"1I",L:!0,X:!0,M:b,U:!0,1G:a})};c.1n=c.C.1n=2(b,a,m){7 c.C({Y:"1E",L:!0,X:!0,M:b,U:a,19:m})};c.1s=c.C.1s=2(b,a,m){5 d;7 c.C({Y:"2f",L:!0,X:!0,M:[\'<Q 9="2b-2m:2g;1Y-1Z:1V">\',b,\'</Q><Q><S 22="W" 2d="d-S-W" 12="\',m||"",\'" 9="G:24;27:26 20" /></Q>\'].1W(""),1X:2(){d=4.O.M.1T(".d-S-W")[0];d.1M();d.K()},U:2(){7 a&&a.1J(4,d.12)},19:2(){}})};c.C.1b.1H=2(){5 b=2(a,b,c){5 h=+V 14,e=1F(2(){5 f=(+V 14-h)/c;1<=f?(1L(e),b(f)):a(f)},13)},a=2(c,d,g,h){5 e=h;1R 0===e&&(e=6,g/=e);5 f=1Q(c.9.1e)||0;b(2(a){c.9.1e=f+(d-f)*a+"E"},2(){0!==e&&a(c,1===e?0:1.3*(d/e-d),g,--e)},g)};7 2(){a(4.O.1c[0],1N,1O);7 4}}();5 o=2(){5 b=4,a=2(a){5 c=b[a];b[a]=2(){7 c.1S(b,1C)}};a("10");a("N");a("8")};o.1b={10:2(b){c(I).B("18",4.N).B("16",4.8);4.1d=b.J;4.15=b.H;4.1g(b.J,b.H);7!1},N:2(b){4.1w=b.J;4.1x=b.H;4.1h(b.J-4.1d,b.H-4.15);7!1},8:2(b){c(I).F("18",4.N).F("16",4.8);4.1j(b.J,b.H);7!1}};5 j=c(1A),k=c(I),i=I.1z,p=!!("1P"Z i.9)&&"28"Z i,q="1a"Z i,r=2(){7!1},n=2(b){5 a=V o,c=1v.K,d=c.O,g=d.1c,h=d.1l,e=g[0],f=h[0],i=d.2a[0],l=e.9,s=i.9,t=b.1q===d.1p[0]?!0:!1,u=(d="L"===e.9.2h)?0:k.2k(),v=d?0:k.2n(),n=j.G()-e.T+u,A=j.1i()-e.1f+v,w,x,y,z;a.1g=2(){t?(w=i.T,x=i.1f):(y=e.2i,z=e.2j);k.B("1m",a.8).B("1o",r);p?h.B("1r",a.8):j.B("1k",a.8);q&&f.1a();g.29("d-1u-11");c.K()};a.1h=2(a,b){R(t){5 c=a+w,d=b+x;l.G="1U";s.G=D.P(0,c)+"E";l.G=e.T+"E";s.1i=D.P(0,d)+"E"}21 c=D.P(u,D.17(n,a+y)),d=D.P(v,D.17(A,b+z)),l.23=c+"E",l.25=d+"E"};a.1j=2(){k.F("1m",a.8).F("1o",r);p?h.F("1r",a.8):j.F("1k",a.8);q&&f.2c();g.2e("d-1u-11")};a.10(b)};c(I).B("1B",2(b){5 a=1v.K;R(a){5 c=b.1q,d=a.1y,a=a.O;R(!1!==d.11&&c===a.1l[0]||!1!==d.1D&&c===a.1p[0])7 n(b),!1}})})(4.1K||4.2l);', 62, 148, '||function||this|var||return|end|style||||||||||||||||||||||||||||bind|dialog|Math|px|unbind|width|clientY|document|clientX|focus|fixed|content|over|dom|max|div|if|input|offsetWidth|ok|new|text|lock|id|in|start|drag|value||Date|_sClientY|mouseup|min|mousemove|cancel|setCapture|prototype|wrap|_sClientX|marginLeft|offsetHeight|onstart|onover|height|onend|blur|title|dblclick|confirm|dragstart|se|target|losecapture|prompt|alert|state|artDialog|_mClientX|_mClientY|config|documentElement|window|mousedown|arguments|resize|Confirm|setInterval|beforeunload|shake|Alert|call|art|clearInterval|select|40|600|minWidth|parseInt|void|apply|find|auto|12px|join|initialize|font|size|4px|else|type|left|18em|top|6px|padding|onlosecapture|addClass|main|margin|releaseCapture|class|removeClass|Prompt|5px|position|offsetLeft|offsetTop|scrollLeft|jQuery|bottom|scrollTop'.split('|'), 0, {}))

/**
* jQuery Masonry v2.1.08
* A dynamic layout plugin for jQuery
* The flip-side of CSS Floats
* http://masonry.desandro.com
*
* Licensed under the MIT license.
* Copyright 2012 David DeSandro
*/
; (function (e, t, n) { "use strict"; var r = t.event, i; r.special.smartresize = { setup: function () { t(this).bind("resize", r.special.smartresize.handler) }, teardown: function () { t(this).unbind("resize", r.special.smartresize.handler) }, handler: function (e, t) { var n = this, s = arguments; e.type = "smartresize", i && clearTimeout(i), i = setTimeout(function () { r.dispatch.apply(n, s) }, t === "execAsap" ? 0 : 100) } }, t.fn.smartresize = function (e) { return e ? this.bind("smartresize", e) : this.trigger("smartresize", ["execAsap"]) }, t.Mason = function (e, n) { this.element = t(n), this._create(e), this._init() }, t.Mason.settings = { isResizable: !0, isAnimated: !1, animationOptions: { queue: !1, duration: 500 }, gutterWidth: 0, isRTL: !1, isFitWidth: !1, containerStyle: { position: "relative" } }, t.Mason.prototype = { _filterFindBricks: function (e) { var t = this.options.itemSelector; return t ? e.filter(t).add(e.find(t)) : e }, _getBricks: function (e) { var t = this._filterFindBricks(e).css({ position: "absolute" }).addClass("masonry-brick"); return t }, _create: function (n) { this.options = t.extend(!0, {}, t.Mason.settings, n), this.styleQueue = []; var r = this.element[0].style; this.originalStyle = { height: r.height || "" }; var i = this.options.containerStyle; for (var s in i) this.originalStyle[s] = r[s] || ""; this.element.css(i), this.horizontalDirection = this.options.isRTL ? "right" : "left"; var o = this.element.css("padding-" + this.horizontalDirection), u = this.element.css("padding-top"); this.offset = { x: o ? parseInt(o, 10) : 0, y: u ? parseInt(u, 10) : 0 }, this.isFluid = this.options.columnWidth && typeof this.options.columnWidth == "function"; var a = this; setTimeout(function () { a.element.addClass("masonry") }, 0), this.options.isResizable && t(e).bind("smartresize.masonry", function () { a.resize() }), this.reloadItems() }, _init: function (e) { this._getColumns(), this._reLayout(e) }, option: function (e, n) { t.isPlainObject(e) && (this.options = t.extend(!0, this.options, e)) }, layout: function (e, t) { for (var n = 0, r = e.length; n < r; n++) this._placeBrick(e[n]); var i = {}; i.height = Math.max.apply(Math, this.colYs); if (this.options.isFitWidth) { var s = 0; n = this.cols; while (--n) { if (this.colYs[n] !== 0) break; s++ } i.width = (this.cols - s) * this.columnWidth - this.options.gutterWidth } this.styleQueue.push({ $el: this.element, style: i }); var o = this.isLaidOut ? this.options.isAnimated ? "animate" : "css" : "css", u = this.options.animationOptions, a; for (n = 0, r = this.styleQueue.length; n < r; n++) a = this.styleQueue[n], a.$el[o](a.style, u); this.styleQueue = [], t && t.call(e), this.isLaidOut = !0 }, _getColumns: function () { var e = this.options.isFitWidth ? this.element.parent() : this.element, t = e.width(); this.columnWidth = this.isFluid ? this.options.columnWidth(t) : this.options.columnWidth || this.$bricks.outerWidth(!0) || t, this.columnWidth += this.options.gutterWidth, this.cols = Math.floor((t + this.options.gutterWidth) / this.columnWidth), this.cols = Math.max(this.cols, 1) }, _placeBrick: function (e) { var n = t(e), r, i, s, o, u; r = Math.ceil(n.outerWidth(!0) / this.columnWidth), r = Math.min(r, this.cols); if (r === 1) s = this.colYs; else { i = this.cols + 1 - r, s = []; for (u = 0; u < i; u++) o = this.colYs.slice(u, u + r), s[u] = Math.max.apply(Math, o) } var a = Math.min.apply(Math, s), f = 0; for (var l = 0, c = s.length; l < c; l++) if (s[l] === a) { f = l; break } var h = { top: a + this.offset.y }; h[this.horizontalDirection] = this.columnWidth * f + this.offset.x, this.styleQueue.push({ $el: n, style: h }); var p = a + n.outerHeight(!0), d = this.cols + 1 - c; for (l = 0; l < d; l++) this.colYs[f + l] = p }, resize: function () { var e = this.cols; this._getColumns(), (this.isFluid || this.cols !== e) && this._reLayout() }, _reLayout: function (e) { var t = this.cols; this.colYs = []; while (t--) this.colYs.push(0); this.layout(this.$bricks, e) }, reloadItems: function () { this.$bricks = this._getBricks(this.element.children()) }, reload: function (e) { this.reloadItems(), this._init(e) }, appended: function (e, t, n) { if (t) { this._filterFindBricks(e).css({ top: this.element.height() }); var r = this; setTimeout(function () { r._appended(e, n) }, 1) } else this._appended(e, n) }, _appended: function (e, t) { var n = this._getBricks(e); this.$bricks = this.$bricks.add(n), this.layout(n, t) }, remove: function (e) { this.$bricks = this.$bricks.not(e), e.remove() }, destroy: function () { this.$bricks.removeClass("masonry-brick").each(function () { this.style.position = "", this.style.top = "", this.style.left = "" }); var n = this.element[0].style; for (var r in this.originalStyle) n[r] = this.originalStyle[r]; this.element.unbind(".masonry").removeClass("masonry").removeData("masonry"), t(e).unbind(".masonry") } }, t.fn.imagesLoaded = function (e) { function u() { e.call(n, r) } function a(e) { var n = e.target; n.src !== s && t.inArray(n, o) === -1 && (o.push(n), --i <= 0 && (setTimeout(u), r.unbind(".imagesLoaded", a))) } var n = this, r = n.find("img").add(n.filter("img")), i = r.length, s = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==", o = []; return i || u(), r.bind("load.imagesLoaded error.imagesLoaded", a).each(function () { var e = this.src; this.src = s, this.src = e }), n }; var s = function (t) { e.console && e.console.error(t) }; t.fn.masonry = function (e) { if (typeof e == "string") { var n = Array.prototype.slice.call(arguments, 1); this.each(function () { var r = t.data(this, "masonry"); if (!r) { s("cannot call methods on masonry prior to initialization; attempted to call method '" + e + "'"); return } if (!t.isFunction(r[e]) || e.charAt(0) === "_") { s("no such method '" + e + "' for masonry instance"); return } r[e].apply(r, n) }) } else this.each(function () { var n = t.data(this, "masonry"); n ? (n.option(e || {}), n._init()) : t.data(this, "masonry", new t.Mason(e, this)) }); return this } })(window, jQuery);

/*
 * jQuery Autocomplete plugin 1.1
 *
 * Copyright (c) 2009 Jörn Zaefferer
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Revision: $Id: jquery.autocomplete.js 15 2009-08-22 10:30:27Z joern.zaefferer $
 */; (function ($) {
     $.fn.extend({ autocomplete: function (urlOrData, options) { var isUrl = typeof urlOrData == "string"; options = $.extend({}, $.Autocompleter.defaults, { url: isUrl ? urlOrData : null, data: isUrl ? null : urlOrData, delay: isUrl ? $.Autocompleter.defaults.delay : 10, max: options && !options.scroll ? 10 : 150 }, options); options.highlight = options.highlight || function (value) { return value; }; options.formatMatch = options.formatMatch || options.formatItem; return this.each(function () { new $.Autocompleter(this, options); }); }, result: function (handler) { return this.bind("result", handler); }, search: function (handler) { return this.trigger("search", [handler]); }, flushCache: function () { return this.trigger("flushCache"); }, setOptions: function (options) { return this.trigger("setOptions", [options]); }, unautocomplete: function () { return this.trigger("unautocomplete"); } }); $.Autocompleter = function (input, options) { var KEY = { UP: 38, DOWN: 40, DEL: 46, TAB: 9, RETURN: 13, ESC: 27, COMMA: 188, PAGEUP: 33, PAGEDOWN: 34, BACKSPACE: 8 }; var $input = $(input).attr("autocomplete", "off").addClass(options.inputClass); var timeout; var previousValue = ""; var cache = $.Autocompleter.Cache(options); var hasFocus = 0; var lastKeyPressCode; var config = { mouseDownOnSelect: false }; var select = $.Autocompleter.Select(options, input, selectCurrent, config); var blockSubmit; $.browser.opera && $(input.form).bind("submit.autocomplete", function () { if (blockSubmit) { blockSubmit = false; return false; } }); $input.bind(($.browser.opera ? "keypress" : "keydown") + ".autocomplete", function (event) { hasFocus = 1; lastKeyPressCode = event.keyCode; switch (event.keyCode) { case KEY.UP: event.preventDefault(); if (select.visible()) { select.prev(); } else { onChange(0, true); } break; case KEY.DOWN: event.preventDefault(); if (select.visible()) { select.next(); } else { onChange(0, true); } break; case KEY.PAGEUP: event.preventDefault(); if (select.visible()) { select.pageUp(); } else { onChange(0, true); } break; case KEY.PAGEDOWN: event.preventDefault(); if (select.visible()) { select.pageDown(); } else { onChange(0, true); } break; case options.multiple && $.trim(options.multipleSeparator) == "," && KEY.COMMA: case KEY.TAB: case KEY.RETURN: if (selectCurrent()) { event.preventDefault(); blockSubmit = true; return false; } break; case KEY.ESC: select.hide(); break; default: clearTimeout(timeout); timeout = setTimeout(onChange, options.delay); break; } }).focus(function () { hasFocus++; }).blur(function () { hasFocus = 0; if (!config.mouseDownOnSelect) { hideResults(); } }).click(function () { if (hasFocus++ > 1 && !select.visible()) { onChange(0, true); } }).bind("search", function () { var fn = (arguments.length > 1) ? arguments[1] : null; function findValueCallback(q, data) { var result; if (data && data.length) { for (var i = 0; i < data.length; i++) { if (data[i].result.toLowerCase() == q.toLowerCase()) { result = data[i]; break; } } } if (typeof fn == "function") fn(result); else $input.trigger("result", result && [result.data, result.value]); } $.each(trimWords($input.val()), function (i, value) { request(value, findValueCallback, findValueCallback); }); }).bind("flushCache", function () { cache.flush(); }).bind("setOptions", function () { $.extend(options, arguments[1]); if ("data" in arguments[1]) cache.populate(); }).bind("unautocomplete", function () { select.unbind(); $input.unbind(); $(input.form).unbind(".autocomplete"); }); function selectCurrent() { var selected = select.selected(); if (!selected) return false; var v = selected.result; previousValue = v; if (options.multiple) { var words = trimWords($input.val()); if (words.length > 1) { var seperator = options.multipleSeparator.length; var cursorAt = $(input).selection().start; var wordAt, progress = 0; $.each(words, function (i, word) { progress += word.length; if (cursorAt <= progress) { wordAt = i; return false; } progress += seperator; }); words[wordAt] = v; v = words.join(options.multipleSeparator); } v += options.multipleSeparator; } $input.val(v); hideResultsNow(); $input.trigger("result", [selected.data, selected.value]); return true; } function onChange(crap, skipPrevCheck) { if (lastKeyPressCode == KEY.DEL) { select.hide(); return; } var currentValue = $input.val(); if (!skipPrevCheck && currentValue == previousValue) return; previousValue = currentValue; currentValue = lastWord(currentValue); if (currentValue.length >= options.minChars) { $input.addClass(options.loadingClass); if (!options.matchCase) currentValue = currentValue.toLowerCase(); request(currentValue, receiveData, hideResultsNow); } else { stopLoading(); select.hide(); } }; function trimWords(value) { if (!value) return [""]; if (!options.multiple) return [$.trim(value)]; return $.map(value.split(options.multipleSeparator), function (word) { return $.trim(value).length ? $.trim(word) : null; }); } function lastWord(value) { if (!options.multiple) return value; var words = trimWords(value); if (words.length == 1) return words[0]; var cursorAt = $(input).selection().start; if (cursorAt == value.length) { words = trimWords(value) } else { words = trimWords(value.replace(value.substring(cursorAt), "")); } return words[words.length - 1]; } function autoFill(q, sValue) { if (options.autoFill && (lastWord($input.val()).toLowerCase() == q.toLowerCase()) && lastKeyPressCode != KEY.BACKSPACE) { $input.val($input.val() + sValue.substring(lastWord(previousValue).length)); $(input).selection(previousValue.length, previousValue.length + sValue.length); } }; function hideResults() { clearTimeout(timeout); timeout = setTimeout(hideResultsNow, 200); }; function hideResultsNow() { var wasVisible = select.visible(); select.hide(); clearTimeout(timeout); stopLoading(); if (options.mustMatch) { $input.search(function (result) { if (!result) { if (options.multiple) { var words = trimWords($input.val()).slice(0, -1); $input.val(words.join(options.multipleSeparator) + (words.length ? options.multipleSeparator : "")); } else { $input.val(""); $input.trigger("result", null); } } }); } }; function receiveData(q, data) { if (data && data.length && hasFocus) { stopLoading(); select.display(data, q); autoFill(q, data[0].value); select.show(); } else { hideResultsNow(); } }; function request(term, success, failure) { if (!options.matchCase) term = term.toLowerCase(); var data = cache.load(term); if (data && data.length) { success(term, data); } else if ((typeof options.url == "string") && (options.url.length > 0)) { var extraParams = { timestamp: +new Date() }; $.each(options.extraParams, function (key, param) { extraParams[key] = typeof param == "function" ? param() : param; }); $.ajax({ mode: "abort", port: "autocomplete" + input.name, dataType: options.dataType, url: options.url, data: $.extend({ q: lastWord(term), limit: options.max }, extraParams), success: function (data) { var parsed = options.parse && options.parse(data) || parse(data); cache.add(term, parsed); success(term, parsed); } }); } else { select.emptyList(); failure(term); } }; function parse(data) { var parsed = []; var rows = data.split("\n"); for (var i = 0; i < rows.length; i++) { var row = $.trim(rows[i]); if (row) { row = row.split("|"); parsed[parsed.length] = { data: row, value: row[0], result: options.formatResult && options.formatResult(row, row[0]) || row[0] }; } } return parsed; }; function stopLoading() { $input.removeClass(options.loadingClass); }; }; $.Autocompleter.defaults = { inputClass: "ac_input", resultsClass: "ac_results", loadingClass: "ac_loading", minChars: 1, delay: 400, matchCase: false, matchSubset: true, matchContains: false, cacheLength: 10, max: 100, mustMatch: false, extraParams: {}, selectFirst: true, formatItem: function (row) { return row[0]; }, formatMatch: null, autoFill: false, width: 0, multiple: false, multipleSeparator: ", ", highlight: function (value, term) { return value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1") + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>"); }, scroll: true, scrollHeight: 180 }; $.Autocompleter.Cache = function (options) {
         var data = {}; var length = 0; function matchSubset(s, sub) { if (!options.matchCase) s = s.toLowerCase(); var i = s.indexOf(sub); if (options.matchContains == "word") { i = s.toLowerCase().search("\\b" + sub.toLowerCase()); } if (i == -1) return false; return i == 0 || options.matchContains; }; function add(q, value) { if (length > options.cacheLength) { flush(); } if (!data[q]) { length++; } data[q] = value; } function populate() { if (!options.data) return false; var stMatchSets = {}, nullData = 0; if (!options.url) options.cacheLength = 1; stMatchSets[""] = []; for (var i = 0, ol = options.data.length; i < ol; i++) { var rawValue = options.data[i]; rawValue = (typeof rawValue == "string") ? [rawValue] : rawValue; var value = options.formatMatch(rawValue, i + 1, options.data.length); if (value === false) continue; var firstChar = value.charAt(0).toLowerCase(); if (!stMatchSets[firstChar]) stMatchSets[firstChar] = []; var row = { value: value, data: rawValue, result: options.formatResult && options.formatResult(rawValue) || value }; stMatchSets[firstChar].push(row); if (nullData++ < options.max) { stMatchSets[""].push(row); } }; $.each(stMatchSets, function (i, value) { options.cacheLength++; add(i, value); }); } setTimeout(populate, 25); function flush() { data = {}; length = 0; } return {
             flush: flush, add: add, populate: populate, load: function (q) {
                 if (!options.cacheLength || !length) return null; if (!options.url && options.matchContains) { var csub = []; for (var k in data) { if (k.length > 0) { var c = data[k]; $.each(c, function (i, x) { if (matchSubset(x.value, q)) { csub.push(x); } }); } } return csub; } else
                     if (data[q]) { return data[q]; } else
                         if (options.matchSubset) { for (var i = q.length - 1; i >= options.minChars; i--) { var c = data[q.substr(0, i)]; if (c) { var csub = []; $.each(c, function (i, x) { if (matchSubset(x.value, q)) { csub[csub.length] = x; } }); return csub; } } } return null;
             }
         };
     }; $.Autocompleter.Select = function (options, input, select, config) { var CLASSES = { ACTIVE: "ac_over" }; var listItems, active = -1, data, term = "", needsInit = true, element, list; function init() { if (!needsInit) return; element = $("<div/>").hide().addClass(options.resultsClass).css("position", "absolute").appendTo(document.body); list = $("<ul/>").appendTo(element).mouseover(function (event) { if (target(event).nodeName && target(event).nodeName.toUpperCase() == 'LI') { active = $("li", list).removeClass(CLASSES.ACTIVE).index(target(event)); $(target(event)).addClass(CLASSES.ACTIVE); } }).click(function (event) { $(target(event)).addClass(CLASSES.ACTIVE); select(); input.focus(); return false; }).mousedown(function () { config.mouseDownOnSelect = true; }).mouseup(function () { config.mouseDownOnSelect = false; }); if (options.width > 0) element.css("width", options.width); needsInit = false; } function target(event) { var element = event.target; while (element && element.tagName != "LI") element = element.parentNode; if (!element) return []; return element; } function moveSelect(step) { listItems.slice(active, active + 1).removeClass(CLASSES.ACTIVE); movePosition(step); var activeItem = listItems.slice(active, active + 1).addClass(CLASSES.ACTIVE); if (options.scroll) { var offset = 0; listItems.slice(0, active).each(function () { offset += this.offsetHeight; }); if ((offset + activeItem[0].offsetHeight - list.scrollTop()) > list[0].clientHeight) { list.scrollTop(offset + activeItem[0].offsetHeight - list.innerHeight()); } else if (offset < list.scrollTop()) { list.scrollTop(offset); } } }; function movePosition(step) { active += step; if (active < 0) { active = listItems.size() - 1; } else if (active >= listItems.size()) { active = 0; } } function limitNumberOfItems(available) { return options.max && options.max < available ? options.max : available; } function fillList() { list.empty(); var max = limitNumberOfItems(data.length); for (var i = 0; i < max; i++) { if (!data[i]) continue; var formatted = options.formatItem(data[i].data, i + 1, max, data[i].value, term); if (formatted === false) continue; var li = $("<li/>").html(options.highlight(formatted, term)).addClass(i % 2 == 0 ? "ac_even" : "ac_odd").appendTo(list)[0]; $.data(li, "ac_data", data[i]); } listItems = list.find("li"); if (options.selectFirst) { listItems.slice(0, 1).addClass(CLASSES.ACTIVE); active = 0; } if ($.fn.bgiframe) list.bgiframe(); } return { display: function (d, q) { init(); data = d; term = q; fillList(); }, next: function () { moveSelect(1); }, prev: function () { moveSelect(-1); }, pageUp: function () { if (active != 0 && active - 8 < 0) { moveSelect(-active); } else { moveSelect(-8); } }, pageDown: function () { if (active != listItems.size() - 1 && active + 8 > listItems.size()) { moveSelect(listItems.size() - 1 - active); } else { moveSelect(8); } }, hide: function () { element && element.hide(); listItems && listItems.removeClass(CLASSES.ACTIVE); active = -1; }, visible: function () { return element && element.is(":visible"); }, current: function () { return this.visible() && (listItems.filter("." + CLASSES.ACTIVE)[0] || options.selectFirst && listItems[0]); }, show: function () { var offset = $(input).offset(); element.css({ width: typeof options.width == "string" || options.width > 0 ? options.width : $(input).width(), top: offset.top + input.offsetHeight, left: offset.left }).show(); if (options.scroll) { list.scrollTop(0); list.css({ maxHeight: options.scrollHeight, overflow: 'auto' }); if ($.browser.msie && typeof document.body.style.maxHeight === "undefined") { var listHeight = 0; listItems.each(function () { listHeight += this.offsetHeight; }); var scrollbarsVisible = listHeight > options.scrollHeight; list.css('height', scrollbarsVisible ? options.scrollHeight : listHeight); if (!scrollbarsVisible) { listItems.width(list.width() - parseInt(listItems.css("padding-left")) - parseInt(listItems.css("padding-right"))); } } } }, selected: function () { var selected = listItems && listItems.filter("." + CLASSES.ACTIVE).removeClass(CLASSES.ACTIVE); return selected && selected.length && $.data(selected[0], "ac_data"); }, emptyList: function () { list && list.empty(); }, unbind: function () { element && element.remove(); } }; }; $.fn.selection = function (start, end) { if (start !== undefined) { return this.each(function () { if (this.createTextRange) { var selRange = this.createTextRange(); if (end === undefined || start == end) { selRange.move("character", start); selRange.select(); } else { selRange.collapse(true); selRange.moveStart("character", start); selRange.moveEnd("character", end); selRange.select(); } } else if (this.setSelectionRange) { this.setSelectionRange(start, end); } else if (this.selectionStart) { this.selectionStart = start; this.selectionEnd = end; } }); } var field = this[0]; if (field.createTextRange) { var range = document.selection.createRange(), orig = field.value, teststring = "<->", textLength = range.text.length; range.text = teststring; var caretAt = field.value.indexOf(teststring); field.value = orig; this.selection(caretAt, caretAt + textLength); return { start: caretAt, end: caretAt + textLength } } else if (field.selectionStart !== undefined) { return { start: field.selectionStart, end: field.selectionEnd } } };
 })(jQuery);
/*
 * jQuery.placeholder.js v1
 * Copyright (c) 2013 Jianming<id@msn.cn>
 * Date: 2013-06-04 
*/
; (function (a) { var b = "placeholder" in document.createElement("INPUT"); function c(e) { var b = a(e), d = "placeholder", c = b.attr("placeholder"); b.addClass(d).val(c); b.bind("focus", function () { this.value === c && b.removeClass(d).val("") }).bind("blur", function () { this.value == "" && b.addClass(d).val(c) }); b.parents("FORM").bind("submit", function () { b.val() === c && b.val("") }) } !b && a(function () { a("INPUT:text").each(function () { c(this) }) }) })(jQuery)


;(function($){

	// Useragent RegExp
	var rwebkit = /(webkit)[ \/]([\w.]+)/,
	ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
	rmsie = /(msie) ([\w.]+)/,
	rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

	// For matching the engine and version of the browser
	browserMatch,
	uaMatch= function( ua ) {
		ua = ua.toLowerCase();

		var match = rwebkit.exec( ua ) ||
			ropera.exec( ua ) ||
			rmsie.exec( ua ) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
			[];

		return { 
			version: match[2] || "0",
			browser: {
				opera: !!ropera.exec( ua ),
				rmsie: !!rmsie.exec( ua ),
				webkit: !! rwebkit.exec( ua ),
				mozilla: !!rmozilla.exec( ua )

		} };
	};

	jQuery.browser = uaMatch(userAgent);

})(jQuery);

/*
 * jQuery.placeholder.js v1
 * Copyright (c) 2013  Jianming<id@msn.cn>
 * Date: 2013-07-28
*/
;var toPinyin = (function () {
    var pinyin = {
        'A': '阿吖嗄腌锕',
        'Ai': '埃挨哎唉哀皑癌蔼矮艾碍爱隘捱嗳嗌嫒瑷暧砹锿霭',
        'An': '鞍氨安俺按暗岸胺案谙埯揞庵桉铵鹌黯',
        'Ang': '肮昂盎',
        'Ao': '凹敖熬翱袄傲奥懊澳坳嗷岙廒遨媪骜獒聱螯鏊鳌鏖',
        'Ba': '芭捌扒叭吧笆八疤巴拔跋靶把耙坝霸罢爸茇菝岜灞钯粑鲅魃',
        'Bai': '白柏百摆佰败拜稗捭掰',
        'Ban': '斑班搬扳般颁板版扮拌伴瓣半办绊阪坂钣瘢癍舨',
        'Bang': '邦帮梆榜膀绑棒磅镑傍谤蒡浜',
        'Beng': '蚌崩绷甭泵蹦迸嘣甏',
        'Bao': '苞胞包褒薄雹保堡饱宝抱报暴豹鲍爆曝勹葆孢煲鸨褓趵龅',
        'Bo': '剥玻菠播拨钵波博勃搏铂箔伯帛舶脖膊渤泊驳亳啵饽檗擘礴钹鹁簸跛踣',
        'Bei': '杯碑悲卑北辈背贝钡倍狈备惫焙被孛陂邶蓓呗悖碚鹎褙鐾鞴',
        'Ben': '奔苯本笨畚坌锛',
        'Bi': '逼鼻比鄙笔彼碧蓖蔽毕毙毖币庇痹闭敝弊必壁臂避陛匕俾荜荸萆薜吡哔狴庳愎滗濞弼妣婢嬖璧贲睥畀铋秕裨筚箅篦舭襞跸髀',
        'Pi': '辟坯砒霹批披劈琵毗啤脾疲皮匹痞僻屁譬丕仳陴邳郫圮埤鼙芘擗噼庀淠媲纰枇甓罴铍癖疋蚍蜱貔',
        'Bian': '鞭边编贬扁便变卞辨辩辫遍匾弁苄忭汴缏煸砭碥窆褊蝙笾鳊',
        'Biao': '标彪膘表婊骠飑飙飚镖镳瘭裱鳔',
        'Bie': '鳖憋别瘪蹩',
        'Bin': '彬斌濒滨宾摈傧豳缤玢槟殡膑镔髌鬓',
        'Bing': '兵冰柄丙秉饼炳病并禀邴摒',
        'Bu': '捕卜哺补埠不布步簿部怖卟逋瓿晡钚钸醭',
        'Ca': '擦嚓礤',
        'Cai': '猜裁材才财睬踩采彩菜蔡',
        'Can': '餐参蚕残惭惨灿骖璨粲黪',
        'Cang': '苍舱仓沧藏伧',
        'Cao': '操糙槽曹草嘈漕螬艚',
        'Ce': '厕策侧册测恻',
        'Ceng': '层蹭曾噌',
        'Cha': '插叉茬茶查碴搽察岔诧猹馇汊姹杈槎檫锸镲衩',
        'Chai': '差拆柴豺侪钗瘥虿',
        'Chan': '搀掺蝉馋谗缠铲产阐颤冁谄蒇廛忏潺澶孱羼婵骣觇禅蟾躔',
        'Chang': '昌猖场尝常长偿肠厂敞畅唱倡伥鬯苌菖徜怅惝阊娼嫦昶氅鲳',
        'Chao': '超抄钞朝嘲潮巢吵炒怊晁焯耖',
        'Che': '车扯撤掣彻澈坼砗',
        'Chen': '郴臣辰尘晨忱沉陈趁衬谌谶抻嗔宸琛榇碜龀',
        'Cheng': '撑称城橙成呈乘程惩澄诚承逞骋秤丞埕枨柽塍瞠铖铛裎蛏酲',
        'Chi': '吃痴持池迟弛驰耻齿侈尺赤翅斥炽傺墀茌叱哧啻嗤彳饬媸敕眵鸱瘛褫蚩螭笞篪豉踟魑',
        'Shi': '匙师失狮施湿诗尸虱十石拾时食蚀实识史矢使屎驶始式示士世柿事拭誓逝势是嗜噬适仕侍释饰氏市恃室视试谥埘莳蓍弑轼贳炻礻铈舐筮豕鲥鲺',
        'Chong': '充冲虫崇宠重茺忡憧铳舂艟',
        'Chou': '抽酬畴踌稠愁筹仇绸瞅丑臭俦帱惆瘳雠',
        'Chu': '初出橱厨躇锄雏滁除楚础储矗搐触处亍刍怵憷绌杵楮樗褚蜍蹰黜',
        'Chuai': '揣搋嘬膪踹',
        'Chuan': '川穿椽传船喘串舛遄氚钏舡',
        'Chuang': '疮窗床闯创怆',
        'Zhuang': '幢桩庄装妆撞壮状僮',
        'Chui': '吹炊捶锤垂陲棰槌',
        'Chun': '春椿醇唇淳纯蠢莼鹑蝽',
        'Chuo': '戳绰啜辍踔龊',
        'Ci': '疵茨磁雌辞慈瓷词此刺赐次茈祠鹚糍',
        'Cong': '聪葱囱匆从丛苁淙骢琮璁枞',
        'Cou': '凑楱辏腠',
        'Cu': '粗醋簇促卒蔟徂猝殂酢蹙蹴',
        'Cuan': '蹿篡窜汆撺爨镩',
        'Cui': '摧崔催脆瘁粹淬翠萃啐悴璀榱毳',
        'Cun': '村存寸忖皴',
        'Cuo': '磋撮搓措挫错厝嵯脞锉矬痤鹾蹉',
        'Da': '搭达答瘩打大耷哒怛妲褡笪靼鞑',
        'Dai': '呆歹傣戴带殆代贷袋待逮怠埭甙呔岱迨绐玳黛',
        'Dan': '耽担丹单郸掸胆旦氮但惮淡诞蛋儋凼萏菪啖澹宕殚赕眈疸瘅聃箪',
        'Tan': '弹坍摊贪瘫滩坛檀痰潭谭谈坦毯袒碳探叹炭郯昙忐钽锬覃',
        'Dang': '当挡党荡档谠砀裆',
        'Dao': '刀捣蹈倒岛祷导到稻悼道盗叨氘焘纛',
        'De': '德得的锝',
        'Deng': '蹬灯登等瞪凳邓噔嶝戥磴镫簦',
        'Di': '堤低滴迪敌笛狄涤嫡抵底地蒂第帝弟递缔氐籴诋谛邸坻荻嘀娣柢棣觌祗砥碲睇镝羝骶締',
        'Zhai': '翟摘斋宅窄债寨砦瘵',
        'Dian': '颠掂滇碘点典靛垫电佃甸店惦奠淀殿丶阽坫巅玷钿癜癫簟踮',
        'Diao': '碉叼雕凋刁掉吊钓铞貂鲷',
        'Tiao': '调挑条迢眺跳佻苕祧窕蜩笤粜龆鲦髫',
        'Die': '跌爹碟蝶迭谍叠垤堞喋牒瓞耋鲽',
        'Ding': '丁盯叮钉顶鼎锭定订仃啶玎腚碇町疔耵酊',
        'Diu': '丢铥',
        'Dong': '东冬董懂动栋侗恫冻洞垌咚岽峒氡胨胴硐鸫',
        'Dou': '兜抖斗陡豆逗痘蔸钭窦蚪篼',
        'Du': '都督毒犊独读堵睹赌杜镀肚度渡妒芏嘟渎椟牍蠹笃髑黩',
        'Duan': '端短锻段断缎椴煅簖',
        'Dui': '堆兑队对怼憝碓镦',
        'Dun': '墩吨蹲敦顿钝盾遁沌炖砘礅盹趸',
        'Tun': '囤吞屯臀氽饨暾豚',
        'Duo': '掇哆多夺垛躲朵跺舵剁惰堕咄哚沲缍铎裰踱',
        'E': '蛾峨鹅俄额讹娥恶厄扼遏鄂饿噩谔垩苊莪萼呃愕屙婀轭腭锇锷鹗颚鳄',
        'En': '恩蒽摁嗯',
        'Er': '而儿耳尔饵洱二贰迩珥铒鸸鲕',
        'Fa': '发罚筏伐乏阀法珐垡砝',
        'Fan': '藩帆番翻樊矾钒繁凡烦反返范贩犯饭泛蕃蘩幡夂梵燔畈蹯',
        'Fang': '坊芳方肪房防妨仿访纺放邡枋钫舫鲂',
        'Fei': '菲非啡飞肥匪诽吠肺废沸费狒悱淝妃绯榧腓斐扉砩镄痱蜚篚翡霏鲱',
        'Fen': '芬酚吩氛分纷坟焚汾粉奋份忿愤粪偾瀵棼鲼鼢',
        'Feng': '丰封枫蜂峰锋风疯烽逢冯缝讽奉凤俸酆葑唪沣砜豐',
        'Fo': '佛',
        'Fou': '否缶',
        'Fu': '夫敷肤孵扶拂辐幅氟符伏俘服浮涪福袱弗甫抚辅俯釜斧脯腑府腐赴副覆赋复傅付阜父腹负富讣附妇缚咐匐凫郛芙芾苻茯莩菔拊呋呒幞怫滏艴孚驸绂绋桴赙祓黻黼罘稃馥蚨蜉蝠蝮麸趺跗鲋鳆',
        'Ga': '噶嘎垓尬尕尜旮钆',
        'Gai': '该改概钙盖溉丐陔戤赅',
        'Gan': '干甘杆柑竿肝赶感秆敢赣坩苷尴擀泔淦澉绀橄旰矸疳酐',
        'Gang': '冈刚钢缸肛纲岗港杠戆罡筻',
        'Gao': '篙皋高膏羔糕搞镐稿告睾诰郜藁缟槔槁杲锆',
        'Ge': '哥歌搁戈鸽胳疙割革葛格阁隔铬个各鬲仡哿圪塥嗝纥搿膈硌镉袼虼舸骼',
        'Ha': '蛤哈铪',
        'Gei': '给',
        'Gen': '根跟亘茛哏艮',
        'Geng': '耕更庚羹埂耿梗哽赓绠鲠',
        'Gong': '工攻功恭龚供躬公宫弓巩汞拱贡共珙肱蚣觥',
        'Gou': '钩勾沟苟狗垢构购够佝诟岣遘媾缑枸觏彀笱篝鞲',
        'Gu': '辜菇咕箍估沽孤姑鼓古蛊骨谷股故顾固雇嘏诂菰崮汩梏轱牯牿臌毂瞽罟钴锢鸪痼蛄酤觚鲴',
        'Gua': '刮瓜剐寡挂褂卦诖呱栝胍鸹',
        'Guai': '乖拐怪掴',
        'Guan': '棺关官冠观管馆罐惯灌贯倌莞掼涫盥鹳鳏',
        'Guang': '光广逛咣犷桄胱',
        'Gui': '瑰规圭硅归龟闺轨鬼诡癸桂柜跪贵刽匦刿庋宄妫桧炅晷皈簋鲑鳜',
        'Gun': '辊滚棍衮绲磙鲧',
        'Guo': '锅郭国果裹过馘埚呙帼崞猓椁虢聒蜾蝈',
        'Hai': '骸孩海氦亥害骇嗨胲醢',
        'Han': '酣憨邯韩含涵寒函喊罕翰撼捍旱憾悍焊汗汉邗菡撖犴瀚晗焓顸颔蚶鼾',
        'Hang': '夯杭航行沆绗颃',
        'Hao': '壕嚎豪毫郝好耗号浩貉蒿薅嗥嚆濠灏昊皓颢蚝',
        'He': '呵喝荷菏核禾和何合盒阂河涸赫褐鹤贺诃劾壑嗬阖曷盍颌蚵翮',
        'Hei': '嘿黑',
        'Hen': '痕很狠恨',
        'Heng': '哼亨横衡恒蘅珩桁',
        'Hong': '轰哄烘虹鸿洪宏弘红黉訇讧荭蕻薨闳泓',
        'Hou': '喉侯猴吼厚候后堠後逅瘊篌糇鲎骺',
        'Hu': '呼乎忽瑚壶葫胡蝴狐糊湖弧虎唬护互沪户冱唿囫岵猢怙惚浒滹琥槲轷觳烀煳戽扈祜瓠鹄鹕鹱笏醐斛鹘',
        'Hua': '花哗华猾滑画划化话骅桦砉铧',
        'Huai': '槐徊怀淮坏踝',
        'Huan': '欢环桓还缓换患唤痪豢焕涣宦幻奂擐圜獾洹浣漶寰逭缳锾鲩鬟',
        'Huang': '荒慌黄磺蝗簧皇凰惶煌晃幌恍谎隍徨湟潢遑璜肓癀蟥篁鳇',
        'Hui': '灰挥辉徽恢蛔回毁悔慧卉惠晦贿秽会烩汇讳诲绘诙茴荟蕙咴喙隳洄彗缋珲晖恚虺蟪麾',
        'Hun': '荤昏婚魂浑混诨馄阍溷',
        'Huo': '豁活伙火获或惑霍货祸劐藿攉嚯夥钬锪镬耠蠖',
        'Ji': '計機击圾基机畸稽积箕肌饥迹激讥鸡姬绩缉吉极棘辑籍集及急疾汲即嫉级挤几脊己蓟技冀季伎祭剂悸济寄寂计记既忌际妓继纪藉亟乩剞佶偈墼芨芰荠蒺蕺掎叽咭哜唧岌嵴洎屐骥畿玑楫殛戟戢赍觊犄齑矶羁嵇稷瘠虮笈笄暨跻跽霁鲚鲫髻',
        'Jia': '嘉枷夹佳家加荚颊贾甲钾假稼价架驾嫁伽郏葭岬浃迦珈戛胛恝铗镓痂瘕蛱笳袈跏',
        'Jian': '歼监坚尖笺间煎兼肩艰奸缄茧检柬碱硷拣捡简俭剪减荐槛鉴践贱见键箭件健舰剑饯渐溅涧建僭谏谫菅蒹搛湔蹇謇缣枧楗戋戬牮犍毽腱睑锏鹣裥笕翦踺鲣鞯',
        'Jiang': '僵姜将浆江疆蒋桨奖讲匠酱降茳洚绛缰犟礓耩糨豇',
        'Jiao': '蕉椒礁焦胶交郊浇骄娇搅铰矫侥脚狡角饺缴绞剿教酵轿较叫窖佼僬艽茭挢噍峤徼姣敫皎鹪蛟醮跤鲛',
        'Jue': '嚼撅攫抉掘倔爵觉决诀绝厥劂谲矍蕨噘崛獗孓珏桷橛爝镢蹶觖',
        'Jie': '揭接皆秸街阶截劫节桔杰捷睫竭洁结解姐戒芥界借介疥诫届讦诘拮喈嗟婕孑桀碣疖颉蚧羯鲒骱',
        'Jin': '巾筋斤金今津襟紧锦仅谨进靳晋禁近烬浸尽劲卺荩堇噤馑廑妗缙瑾槿赆觐衿矜',
        'Jing': '荆兢茎睛晶鲸京惊精粳经井警景颈静境敬镜径痉靖竟竞净刭儆阱菁獍憬泾迳弪婧肼胫腈旌箐',
        'Jiong': '炯窘迥扃',
        'Jiu': '揪究纠玖韭久灸九酒厩救旧臼舅咎就疚僦啾阄柩桕鸠鹫赳鬏',
        'Ju': '鞠拘狙疽居驹菊局咀矩举沮聚拒据巨具距踞锯俱句惧炬剧倨讵苣苴莒掬遽屦琚椐榘榉橘犋飓钜锔窭裾醵踽龃雎鞫',
        'Juan': '捐鹃娟倦眷卷绢鄄狷涓桊蠲锩镌隽',
        'Jun': '均菌钧军君峻俊竣浚郡骏捃皲筠麇',
        'Ka': '喀咖卡佧咔胩',
        'Luo': '咯萝螺罗逻锣箩骡裸落洛骆络倮蠃荦摞猡泺漯珞椤脶镙瘰雒',
        'Kai': '开揩楷凯慨剀垲蒈忾恺铠锎锴',
        'Kan': '刊堪勘坎砍看侃莰阚戡龛瞰',
        'Kang': '康慷糠扛抗亢炕伉闶钪',
        'Kao': '考拷烤靠尻栲犒铐',
        'Ke': '坷苛柯棵磕颗科壳咳可渴克刻客课嗑岢恪溘骒缂珂轲氪瞌钶锞稞疴窠颏蝌髁',
        'Ken': '肯啃垦恳裉',
        'Keng': '坑吭铿',
        'Kong': '空恐孔控倥崆箜',
        'Kou': '抠口扣寇芤蔻叩囗眍筘',
        'Ku': '枯哭窟苦酷库裤刳堀喾绔骷',
        'Kua': '夸垮挎跨胯侉',
        'Kuai': '块筷侩快蒯郐哙狯浍脍',
        'Kuan': '宽款髋',
        'Kuang': '匡筐狂框矿眶旷况诓诳邝圹夼哐纩贶',
        'Kui': '亏盔岿窥葵奎魁傀馈愧溃馗匮夔隗蒉揆喹喟悝愦逵暌睽聩蝰篑跬',
        'Kun': '坤昆捆困悃阃琨锟醌鲲髡',
        'Kuo': '括扩廓阔蛞',
        'La': '垃拉喇蜡腊辣啦剌邋旯砬瘌',
        'Lai': '莱来赖崃徕涞濑赉睐铼癞籁',
        'Lan': '蓝婪栏拦篮阑兰澜谰揽览懒缆烂滥岚漤榄斓罱镧褴',
        'Lang': '琅榔狼廊郎朗浪蒗啷阆稂螂',
        'Lao': '捞劳牢老佬姥酪烙涝唠崂忉栳铑铹痨耢醪',
        'Le': '勒了仂叻泐鳓',
        'Yue': '乐曰约越跃岳粤月悦阅龠哕瀹樾刖钺',
        'Lei': '雷镭蕾磊累儡垒擂肋类泪羸诔嘞嫘缧檑耒酹',
        'Leng': '棱楞冷塄愣',
        'Li': '厘梨犁黎篱狸离漓理李里鲤礼莉荔吏栗丽厉励砾历利傈例俐痢立粒沥隶力璃哩俪俚郦坜苈莅蓠藜呖唳喱猁溧澧逦娌嫠骊缡枥栎轹膦戾砺詈罹锂鹂疠疬蛎蜊蠡笠篥粝醴跞雳鲡鳢黧',
        'Lia': '俩',
        'Lian': '联莲连镰廉怜涟帘敛脸链恋炼练蔹奁潋濂琏楝殓臁裢裣蠊鲢',
        'Liang': '粮凉梁粱良两辆量晾亮谅墚莨椋锒踉靓魉',
        'Liao': '撩聊僚疗燎寥辽潦撂镣廖料蓼尥嘹獠寮缭钌鹩',
        'Lie': '列裂烈劣猎冽埒捩咧洌趔躐鬣',
        'Lin': '琳林磷霖临邻鳞淋凛赁吝拎蔺啉嶙廪懔遴檩辚瞵粼躏麟',
        'Ling': '玲菱零龄铃伶羚凌灵陵岭领另令酃苓呤囹泠绫柃棂瓴聆蛉翎鲮',
        'Liu': '溜琉榴硫馏留刘瘤流柳六浏遛骝绺旒熘锍镏鹨鎏',
        'Long': '龙聋咙笼窿隆垄拢陇垅茏珑栊胧砻癃',
        'Lou': '楼娄搂篓漏陋偻蒌喽嵝镂瘘耧蝼髅',
        'Lu': '芦卢颅庐炉掳卤虏鲁麓碌露路赂鹿潞禄录陆戮垆撸噜泸渌漉逯璐栌橹轳辂辘氇胪镥鸬鹭簏舻鲈',
        'Lv': '驴吕铝侣旅履屡缕虑氯律率滤绿捋闾榈膂稆褛',
        'Luan': '峦挛孪滦卵乱脔娈栾鸾銮',
        'Lue': '掠略锊',
        'Lun': '抡轮伦仑沦纶论囵',
        'Ma': '妈麻玛码蚂马骂嘛吗唛犸杩蟆',
        'Mai': '埋买麦卖迈脉劢荬霾',
        'Man': '瞒馒蛮满蔓曼慢漫谩墁幔缦熳镘颟螨鳗鞔',
        'Mang': '芒茫盲氓忙莽邙漭硭蟒',
        'Mao': '猫茅锚毛矛铆卯茂冒帽貌贸袤茆峁泖瑁昴牦耄旄懋瞀蝥蟊髦',
        'Me': '么麽',
        'Mei': '玫枚梅酶霉煤眉媒镁每美昧寐妹媚莓嵋猸浼湄楣镅鹛袂魅',
        'Mo': '没摸摹蘑模膜磨摩魔抹末莫墨默沫漠寞陌谟茉蓦馍嫫嬷殁镆秣瘼耱貊貘',
        'Men': '门闷们扪焖懑钔',
        'Meng': '萌蒙檬盟锰猛梦孟勐甍瞢懵朦礞虻蜢蠓艋艨',
        'Mi': '眯醚靡糜迷谜弥米秘觅泌蜜密幂芈谧咪嘧猕汨宓弭脒祢敉縻麋',
        'Mian': '棉眠绵冕免勉娩缅面沔渑湎腼眄',
        'Miao': '苗描瞄藐秒渺庙妙喵邈缈杪淼眇鹋',
        'Mie': '蔑灭乜咩蠛篾',
        'Min': '民抿皿敏悯闽苠岷闵泯缗玟珉愍黾鳘',
        'Ming': '明螟鸣铭名命冥茗溟暝瞑酩',
        'Miu': '谬缪',
        'Mou': '谋牟某侔哞眸蛑鍪',
        'Mu': '拇牡亩姆母墓暮幕募慕木目睦牧穆仫坶苜沐毪钼',
        'Na': '拿哪呐钠那娜纳讷捺肭镎衲',
        'Nai': '氖乃奶耐奈鼐佴艿萘柰',
        'Nan': '南男难喃囝囡楠腩蝻赧',
        'Nang': '囊攮囔馕曩',
        'Nao': '挠脑恼闹淖孬垴呶猱瑙硇铙蛲',
        'Ne': '呢',
        'Nei': '馁内',
        'Nen': '嫩恁',
        'Neng': '能',
        'Ni': '妮霓倪泥尼拟你匿腻逆溺伲坭蘼猊怩昵旎睨铌鲵',
        'Nian': '蔫拈年碾撵捻念廿埝辇黏鲇鲶',
        'Niang': '娘酿',
        'Niao': '鸟尿茑嬲脲袅',
        'Nie': '捏聂孽啮镊镍涅陧蘖嗫颞臬蹑',
        'Nin': '您',
        'Ning': '柠狞凝宁拧泞佞咛甯聍',
        'Niu': '牛扭钮纽拗狃忸妞',
        'Nong': '脓浓农弄侬哝',
        'Nu': '奴努怒弩胬孥驽',
        'Nv': '女恧钕衄',
        'Nuan': '暖',
        'Nue': '虐疟挪',
        'Nuo': '懦糯诺傩搦喏锘',
        'O': '哦噢',
        'Ou': '欧鸥殴藕呕偶沤讴怄瓯耦',
        'Pa': '啪趴爬帕怕琶葩杷筢',
        'Pai': '拍排牌徘湃派俳蒎哌',
        'Pan': '攀潘盘磐盼畔判叛拚爿泮袢襻蟠蹒',
        'Pang': '乓庞旁耪胖彷滂逄螃',
        'Pao': '抛咆刨炮袍跑泡匏狍庖脬疱',
        'Pei': '呸胚培裴赔陪配佩沛辔帔旆锫醅霈',
        'Pen': '喷盆湓',
        'Peng': '砰抨烹澎彭蓬棚硼篷膨朋鹏捧碰堋嘭怦蟛',
        'Pian': '篇偏片骗谝骈犏胼翩蹁',
        'Piao': '飘漂瓢票剽嘌嫖缥殍瞟螵',
        'Pie': '撇瞥丿苤氕',
        'Pin': '拼频贫品聘姘嫔榀牝颦',
        'Ping': '乒坪苹萍平凭瓶评屏俜娉枰鲆',
        'Po': '坡泼颇婆破魄迫粕叵鄱珀钋钷皤笸',
        'Pou': '剖裒掊',
        'Pu': '扑铺仆莆葡菩蒲埔朴圃普浦谱瀑匍噗溥濮璞氆镤镨蹼',
        'Qi': '期欺栖戚妻七凄漆柒沏其棋奇歧畦崎脐齐旗祈祁骑起岂乞企启契砌器气迄弃汽泣讫亓圻芑芪萁萋葺蕲嘁屺岐汔淇骐绮琪琦杞桤槭耆祺憩碛颀蛴蜞綦鳍麒',
        'Qia': '掐恰洽葜袷髂',
        'Qian': '牵扦钎铅千迁签仟谦乾黔钱钳前潜遣浅谴堑嵌欠歉倩佥阡芊芡茜掮岍悭慊骞搴褰缱椠肷愆钤虔箝',
        'Qiang': '枪呛腔羌墙蔷强抢戕嫱樯戗炝锖锵镪襁蜣羟跄',
        'Qiao': '橇锹敲悄桥瞧乔侨巧鞘撬翘峭俏窍劁诮谯荞愀憔缲樵硗跷鞒',
        'Qie': '切茄且怯窃郄惬妾挈锲箧趄',
        'Qin': '钦侵亲秦琴勤芹擒禽寝沁芩揿吣嗪噙溱檎锓螓衾',
        'Qing': '青轻氢倾卿清擎晴氰情顷请庆苘圊檠磬蜻罄綮謦鲭黥',
        'Qiong': '琼穷邛茕穹蛩筇跫銎',
        'Qiu': '秋丘邱球求囚酋泅俅巯犰湫逑遒楸赇虬蚯蝤裘糗鳅鼽',
        'Qu': '趋区蛆曲躯屈驱渠取娶龋趣去诎劬蕖蘧岖衢阒璩觑氍朐祛磲鸲癯蛐蠼麴瞿黢',
        'Quan': '圈颧权醛泉全痊拳犬券劝诠荃犭悛绻辁畎铨蜷筌鬈',
        'Que': '缺炔瘸却鹊榷确雀阕阙悫',
        'Qun': '裙群逡',
        'Ran': '然燃冉染苒蚺髯',
        'Rang': '瓤壤攘嚷让禳穰',
        'Rao': '饶扰绕荛娆桡',
        'Re': '惹热',
        'Ren': '壬仁人忍韧任认刃妊纫仞荏饪轫稔衽',
        'Reng': '扔仍',
        'Ri': '日',
        'Rong': '戎茸蓉荣融熔溶容绒冗嵘狨榕肜蝾',
        'Rou': '揉柔肉糅蹂鞣',
        'Ru': '茹蠕儒孺如辱乳汝入褥蓐薷嚅洳溽濡缛铷襦颥',
        'Ruan': '软阮朊',
        'Rui': '蕊瑞锐芮蕤枘睿蚋',
        'Run': '闰润',
        'Ruo': '若弱偌箬',
        'Sa': '撒洒萨卅脎飒',
        'Sai': '腮鳃塞赛噻',
        'San': '三叁伞散仨彡馓毵',
        'Sang': '桑嗓丧搡磉颡',
        'Sao': '搔骚扫嫂埽缫臊瘙鳋',
        'Se': '瑟色涩啬铯穑',
        'Sen': '森',
        'Seng': '僧',
        'Sha': '莎砂杀刹沙纱傻啥煞唼歃铩痧裟霎鲨',
        'Shai': '筛晒酾',
        'Shan': '珊苫杉山删煽衫闪陕擅赡膳善汕扇缮讪鄯芟潸姗嬗骟膻钐疝蟮舢跚鳝',
        'Shang': '墒伤商赏晌上尚裳垧泷绱殇熵觞',
        'Shao': '梢捎稍烧芍勺韶少哨邵绍劭潲杓筲艄',
        'She': '奢赊蛇舌舍赦摄射慑涉社设厍佘揲猞滠麝',
        'Shen': '砷申呻伸身深娠绅神沈审婶甚肾慎渗什诜谂莘葚哂渖椹胂矧蜃糁',
        'Sheng': '声生甥牲升绳省盛剩胜圣嵊晟眚笙',
        'Shou': '收手首守寿授售受瘦兽狩绶艏',
        'Shu': '蔬枢梳殊抒输叔舒淑疏书赎孰熟薯暑曙署蜀黍鼠属术述树束戍竖墅庶数漱恕丨倏塾菽摅沭澍姝纾毹腧殳秫',
        'Shua': '刷耍唰',
        'Shuai': '摔衰甩帅蟀',
        'Shuan': '栓拴闩涮',
        'Shuang': '霜双爽孀',
        'Shui': '谁水睡税',
        'Shun': '吮瞬顺舜',
        'Shuo': '说硕朔烁蒴搠妁槊铄',
        'Si': '斯撕嘶思私司丝死肆寺嗣四伺似饲巳厮俟兕厶咝汜泗澌姒驷缌祀锶鸶耜蛳笥',
        'Song': '松耸怂颂送宋讼诵凇菘崧嵩忪悚淞竦',
        'Sou': '搜艘擞嗽叟薮嗖嗾馊溲飕瞍锼螋',
        'Su': '苏酥俗素速粟僳塑溯宿诉肃夙谡蔌嗉愫涑簌觫稣術',
        'Suan': '酸蒜算狻',
        'Sui': '虽隋随绥髓碎岁穗遂隧祟谇荽濉邃燧眭睢',
        'Sun': '孙损笋荪狲飧榫隼',
        'Suo': '蓑梭唆缩琐索锁所唢嗦嗍娑桫挲睃羧',
        'Ta': '塌他它她塔獭挞蹋踏嗒闼溻遢榻沓铊趿鳎',
        'Tai': '胎苔抬台泰酞太态汰邰薹骀肽炱钛跆鲐',
        'Tang': '汤塘搪堂棠膛唐糖倘躺淌趟烫傥帑溏瑭樘铴镗耥螗螳羰醣',
        'Tao': '掏涛滔绦萄桃逃淘陶讨套鼗啕洮韬饕',
        'Te': '特忑慝铽',
        'Teng': '藤腾疼誊滕',
        'Ti': '梯剔踢锑提题蹄啼体替嚏惕涕剃屉倜悌逖绨缇鹈裼醍',
        'Tian': '天添填田甜恬舔腆掭忝阗殄畋',
        'Tie': '贴铁帖萜餮',
        'Ting': '厅听烃汀廷停亭庭挺艇莛葶婷梃铤蜓霆',
        'Tong': '通桐酮瞳同铜彤童桶捅筒统痛佟仝茼嗵恸潼砼',
        'Tou': '偷投头透骰',
        'Tu': '凸秃突图徒途涂屠土吐兔堍荼菟钍酴塗',
        'Tuan': '湍团抟彖疃',
        'Tui': '推颓腿蜕褪退忒煺',
        'Tuo': '拖托脱鸵陀驮驼椭妥拓唾佗坨庹沱柝柁橐砣箨酡跎鼍',
        'Wa': '挖哇蛙洼娃瓦袜佤娲腽',
        'Wai': '歪外崴',
        'Wan': '豌弯湾玩顽丸烷完碗挽晚皖惋宛婉万腕剜芄菀纨绾琬脘畹蜿',
        'Wang': '汪王亡枉网往旺望忘妄罔惘辋魍',
        'Wei': '威巍微危韦违桅围唯惟为潍维苇萎委伟伪尾纬未蔚味畏胃喂魏位渭谓尉慰卫偎诿隈葳薇帏帷嵬猥猬闱沩洧涠逶娓玮韪軎炜煨痿艉鲔為',
        'Wen': '瘟温蚊文闻纹吻稳紊问刎阌汶璺攵雯',
        'Weng': '嗡翁瓮蓊蕹',
        'Wo': '挝蜗涡窝我斡卧握沃倭莴喔幄渥肟硪龌',
        'Wu': '巫呜钨乌污诬屋无芜梧吾吴毋武五捂午舞伍侮坞戊雾晤物勿务悟误兀仵阢邬圬芴唔庑怃忤寤迕妩婺骛杌牾焐鹉鹜痦蜈鋈鼯',
        'Xi': '昔熙析西硒矽晰嘻吸锡牺稀息希悉膝夕惜熄烯溪汐犀檄袭席习媳喜铣洗系隙戏细僖兮隰郗菥葸蓰奚唏徙饩阋浠淅屣嬉玺樨曦觋欷歙熹禊禧皙穸蜥螅蟋舄舾羲粞翕醯蹊鼷',
        'Xia': '瞎虾匣霞辖暇峡侠狭下厦夏吓呷狎遐瑕柙硖罅黠',
        'Xian': '掀锨先仙鲜纤咸贤衔舷闲涎弦嫌显险现献县腺馅羡宪陷限线冼苋莶藓岘猃暹娴氙燹祆鹇痫蚬筅籼酰跣跹霰縣',
        'Xiang': '相厢镶香箱襄湘乡翔祥详想响享项巷橡像向象芗葙饷庠骧缃蟓鲞飨',
        'Xiao': '萧硝霄削哮嚣销消宵淆晓小孝校肖啸笑效哓崤潇逍骁绡枭枵蛸筱箫魈',
        'Xie': '楔些歇蝎鞋协挟携邪斜胁谐写械卸蟹懈泄泻谢屑偕亵勰燮薤撷獬廨渫瀣邂绁缬榭榍蹀躞',
        'Xin': '薪芯锌欣辛新忻心信衅囟馨昕歆镡鑫',
        'Xing': '星腥猩惺兴刑型形邢醒幸杏性姓陉荇荥擤饧悻硎',
        'Xiong': '兄凶胸匈汹雄熊芎',
        'Xiu': '休修羞朽嗅锈秀袖绣咻岫馐庥溴鸺貅髹',
        'Xu': '墟戌需虚嘘须徐许蓄酗叙旭序畜恤絮婿绪续诩勖圩蓿洫溆顼栩煦盱胥糈醑',
        'Xuan': '轩喧宣悬旋玄选癣眩绚儇谖萱揎泫渲漩璇楦暄炫煊碹铉镟痃',
        'Xue': '靴薛学穴雪血谑噱泶踅鳕',
        'Xun': '勋熏循旬询寻驯巡殉汛训讯逊迅巽郇埙荀荨蕈薰峋徇獯恂洵浔曛醺鲟',
        'Ya': '压押鸦鸭呀丫芽牙蚜崖衙涯雅哑亚讶伢垭揠岈迓娅琊桠氩砑睚痖',
        'Yan': '焉咽阉烟淹盐严研蜒岩延言颜阎炎沿奄掩眼衍演艳堰燕厌砚雁唁彦焰宴谚验厣赝剡俨偃兖谳郾鄢埏菸崦恹闫阏湮滟妍嫣琰檐晏胭焱罨筵酽趼魇餍鼹',
        'Yang': '殃央鸯秧杨扬佯疡羊洋阳氧仰痒养样漾徉怏泱炀烊恙蛘鞅',
        'Yao': '邀腰妖瑶摇尧遥窑谣姚咬舀药要耀钥夭爻吆崾徭幺珧杳轺曜肴铫鹞窈鳐',
        'Ye': '椰噎耶爷野冶也页掖业叶曳腋夜液靥谒邺揶晔烨铘',
        'Yi': '一壹医揖铱依伊衣颐夷遗移仪胰疑沂宜姨彝椅蚁倚已乙矣以艺抑易邑屹亿役臆逸肄疫亦裔意毅忆义益溢诣议谊译异翼翌绎刈劓佚佾诒圯埸懿苡荑薏弈奕挹弋呓咦咿噫峄嶷猗饴怿怡悒漪迤驿缢殪轶贻欹旖熠眙钇镒镱痍瘗癔翊蜴舣羿',
        'Yin': '茵荫因殷音阴姻吟银淫寅饮尹引隐印胤鄞垠堙茚吲喑狺夤洇氤铟瘾窨蚓霪龈',
        'Ying': '英樱婴鹰应缨莹萤营荧蝇迎赢盈影颖硬映嬴郢茔莺萦蓥撄嘤膺滢潆瀛瑛璎楹媵鹦瘿颍罂',
        'Yo': '哟唷',
        'Yong': '拥佣臃痈庸雍踊蛹咏泳涌永恿勇用俑壅墉喁慵邕镛甬鳙饔',
        'You': '幽优悠忧尤由邮铀犹油游酉有友右佑釉诱又幼卣攸侑莠莜莸尢呦囿宥柚猷牖铕疣蚰蚴蝣繇鱿黝鼬',
        'Yu': '迂淤于盂榆虞愚舆余俞逾鱼愉渝渔隅予娱雨与屿禹宇语羽玉域芋郁吁遇喻峪御愈欲狱育誉浴寓裕预豫驭禺毓伛俣谀谕萸蓣揄圄圉嵛狳饫馀庾阈鬻妪妤纡瑜昱觎腴欤於煜燠聿畲钰鹆鹬瘐瘀窬窳蜮蝓竽臾舁雩龉',
        'Yuan': '鸳渊冤元垣袁原援辕园员圆猿源缘远苑愿怨院垸塬芫掾沅媛瑗橼爰眢鸢螈箢鼋',
        'Yun': '耘云郧匀陨允运蕴酝晕韵孕郓芸狁恽愠纭韫殒昀氲熨',
        'Za': '匝砸杂咋拶咂',
        'Zai': '栽哉灾宰载再在崽甾',
        'Zan': '咱攒暂赞瓒昝簪糌趱錾',
        'Zang': '赃脏葬奘驵臧',
        'Zao': '遭糟凿藻枣早澡蚤躁噪造皂灶燥唣',
        'Ze': '责择则泽仄赜啧帻迮昃箦舴',
        'Zei': '贼',
        'Zen': '怎谮',
        'Zeng': '增憎赠缯甑罾锃',
        'Zha': '扎喳渣札轧铡闸眨栅榨乍炸诈柞揸吒咤哳楂砟痄蚱齄',
        'Zhan': '瞻毡詹粘沾盏斩辗崭展蘸栈占战站湛绽谵搌旃',
        'Zhang': '樟章彰漳张掌涨杖丈帐账仗胀瘴障仉鄣幛嶂獐嫜璋蟑',
        'Zhao': '招昭找沼赵照罩兆肇召着诏棹钊笊',
        'Zhe': '遮折哲蛰辙者锗蔗这浙乇谪摺柘辄磔鹧褶蜇螫赭',
        'Zhen': '珍斟真甄砧臻贞针侦枕疹诊震振镇阵帧圳蓁浈缜桢榛轸赈胗朕祯畛稹鸩箴',
        'Zheng': '蒸挣睁征狰争怔整拯正政症郑证诤峥徵钲铮筝',
        'Zhi': '芝枝支吱蜘知肢脂汁之织职直植殖执值侄址指止趾只旨纸志挚掷至致置帜峙制智秩稚质炙痔滞治窒卮陟郅埴芷摭帙忮彘咫骘栉枳栀桎轵轾贽胝膣祉黹雉鸷痣蛭絷酯跖踬踯豸觯',
        'Zhong': '中盅忠钟衷终种肿仲众冢锺螽舯踵',
        'Zhou': '舟周州洲诌粥轴肘帚咒皱宙昼骤荮啁妯纣绉胄碡籀酎',
        'Zhu': '珠株蛛朱猪诸诛逐竹烛煮拄瞩嘱主著柱助蛀贮铸筑住注祝驻伫侏邾苎茱洙渚潴杼槠橥炷铢疰瘃竺箸舳翥躅麈',
        'Zhua': '抓爪',
        'Zhuai': '拽',
        'Zhuan': '专砖转撰赚篆啭馔颛',
        'Zhui': '椎锥追赘坠缀萑惴骓缒隹',
        'Zhun': '谆准肫窀',
        'Zhuo': '捉拙卓桌琢茁酌啄灼浊倬诼擢浞涿濯禚斫镯',
        'Zi': '兹咨资姿滋淄孜紫仔籽滓子自渍字谘呲嵫姊孳缁梓辎赀恣眦锱秭耔笫粢趑訾龇鲻髭',
        'Zong': '鬃棕踪宗综总纵偬腙粽',
        'Zou': '邹走奏揍诹陬鄹驺鲰',
        'Zu': '租足族祖诅阻组俎菹镞',
        'Zuan': '钻纂攥缵躜',
        'Zui': '嘴醉最罪蕞觜',
        'Zun': '尊遵撙樽鳟',
        'Zuo': '昨左佐做作坐座阼唑怍胙祚笮',
        'Ei': '诶',
        'Dia': '嗲',
        'Cen': '岑涔',
        'Nou': '耨'
    }
    for (var p in pinyin) {
        var word = pinyin[p];
        for (var i = 0, l = word.length; i < l; i++) {
            pinyin[word[i]] = p;
        }
    }
    return function (word) {
		var w = [];
		
        if (word.length == 1) {
            return pinyin[word] || word;
        }

        for (var i = 0, l = word.length; i < l; i++) {
            w.push(toPinyin(word[i]));
        }
        return w.join('');
    };
})();