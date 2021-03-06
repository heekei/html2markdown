(function () {
    var html2mk = {
        delRN: function (mk) {
            mk = mk.replace(/[\r\n]/g, "") // 去除回车、换行符
            return mk;
        },
        removeTagsIncludeContent: function (mk) {
            var re = "<style\\s*[^\\>]*>([^<]*)</style>|"; //<style></style>
            var re2 = "<script\\s*[^\\>]*>([^<]*)<\/script>|"; //<script><\/script>
            var re3 = "<!--\\[if(.*?)<!\\[endif]-->|"; //<!--[if IE]><![endif]-->
            var re4 = "<!DOCTYPE HTML.*?>|";
            var re5 = "<title>.*?<\/title>";
            var reg = new RegExp(re + re2 + re3 + re4 + re5, 'gi');
            mk = mk.replace(reg, "");
            return mk;
        },
        removeTag: function (mk) {
            var tag = ["img", "p", "a", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "li", "table", "tbody", "tr", "td", "th", "thead", "strong", "b"]; //except tags
            var t1 = "",
                t2 = "";
            for (arr in tag) {
                t1 += tag[arr] + ">|" + tag[arr] + "(\\s+[^>]+?\\s*)?>|";
                t2 += tag[arr] + ">|";
            }
            t1 = t1.substring(0, t1.length - 1);
            t2 = t2.substring(0, t2.length - 1);
            var re = "<(?!(!:" + t1 + "))[a-zA-Z0-9-]*(\\s+[^>]+?\\s*)?>|<\/(?!(?:" + t2 + "))[a-zA-Z0-9-]*>|(<[a-zA-Z0-9-]+\\s*\/>)";
            //console.log(re);//print RexExpStr
            var removeTAG = new RegExp(re, 'gi'); //Remove other tags
            mk = mk.replace(removeTAG, ""); //execute
            return mk;
        },
        h1_To_h6: function (mk) {
            var h = /<(h[1-6]{1})(\s+.*\=(\"|\')[a-zA-Z0-9\;\:\s\-\_\.\#]*\3\s*)*>(.*?(?!\1).*?)<\/\1>/gi; //匹配h1-h6
            mk = mk.replace(h, function ($0, $1, $2, $3, $4) {
                var sharpNums = $1.substring(1, 2);
                var sharps = "";
                for (var i = 0; i < sharpNums; i++) {
                    sharps += "#";
                }
                var res = sharps + " " + $4 + "\r";
                return res;
            });
            return mk;
        },
        p_tag: function (mk) {
            var p = /<p>(.*?(?!p).*?)<\/p>/gi;
            mk = mk.replace(p, function ($0, $1) {
                var res = "\r\n" + $1 + "\r\n";
                return res;
            });
            return mk;
        },
        hyperLinks: function (mk) {
            var hyperlinks = /<a([\s]+|[\s]+[^<>]+[\s]+)href=(\"([^<>"\']*)\"|\'([^<>"\']*)\')[^<>]*>(.*?(?!a).*?)<\/a>/gi;
            mk = mk.replace(hyperlinks, function ($0, $1, $2, $3, $4, $5) {
                // var res = "["+$2+"]("+ $1 +")\r";
                if ($5 == "") {
                    return "";
                }
                var res = "[" + $5 + "](" + $3 + ")\r";
                return res;
            });
            return mk;
        },
        imgTag: function (mk) {
            var imgtag = /<img\s*.*?(src=["|'](.*?)["|']).*?(alt=["|'](.*?)["|'])?.*?[\/]?>/gi;
            mk = mk.replace(imgtag, function ($0, $1, $2, $3, $4) {
                if (typeof $3 != "undefined") {
                    var res = "![" + $4 + "](" + $2 + ")";
                } else {
                    var res = "![](" + $2 + ")";
                }
                // console.log($3);
                return res;
            });
            return mk;
        },
        StrongOrB_tag: function (mk) {
            var re = /<(strong|b)>(.*?)<\/\1>/gi;
            mk = mk.replace(re, function ($0, $1, $2) {
                // var nospace = $2;
                // nospace = nospace.replace(" ","");
                var res = "**" + $2 + "**";
                return res;
            });
            return mk;
        }
    };
    var convert = function (html) {
        var mk = html;
        for (x in html2mk) {
            mk = html2mk[x](mk);
        }
        return mk;
    }
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = convert;
    }
    if (typeof define === 'function' && define.amd) {
        define('html2mk', [], function () {
            return convert;
        });
    } else {
        window.html2mk = convert;
    }
})()