﻿/*jQuery.cookie*/
jQuery.cookie = function (d, c, a) { if (typeof c != "undefined") { a = a || {}; if (c === null) { c = ""; a.expires = -1 } var h = ""; if (a.expires && (typeof a.expires == "number" || a.expires.toUTCString)) { var b; if (typeof a.expires == "number") { b = new Date; b.setTime(b.getTime() + a.expires * 24 * 60 * 60 * 1e3) } else b = a.expires; h = "; expires=" + b.toUTCString() } var l = a.path ? "; path=" + a.path : "", j = a.domain ? "; domain=" + a.domain : "", k = a.secure ? "; secure" : ""; document.cookie = [d, "=", encodeURIComponent(c), h, l, j, k].join("") } else { var f = null; if (document.cookie && document.cookie != "") for (var g = document.cookie.split(";"), e = 0; e < g.length; e++) { var i = jQuery.trim(g[e]); if (i.substring(0, d.length + 1) == d + "=") { f = decodeURIComponent(i.substring(d.length + 1)); break } } return f } }