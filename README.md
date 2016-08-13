<!DOCTYPE html>
<html lang="zh-cn">
    <head>
        <title>HTML转换Markdown</title>
        <meta charset="UTF-8">
        <style>
            html,body{
                
            }
            .clearfix:before,.clearfix:after{
                display:table;
                clear:both;
                content:"";
            }
            #InputBox {
                width:100%;
                height:100%;
                /*background-color:teal;*/
                padding:0;
                text-align:center;
            }
            .tarea{
                position:relative;
                display:inline-block;
                width:49%;
                height:300px;
                padding:0;
                resize:none;
                -webkit-resize:none;
                -moz-resize:none;
                -o-resize:none;
                -ms-resize:none;
            }
            .convert{
                border:none;
                background-color:lightblue;
                width:10rem;
                height:4rem;
                outline:none;
            }
            .convert:active{
                border:inset 2px #fff;
            }
            @media screen and (max-width:615px){
                .tarea{
                    position:relative;
                    display:inline-block;
                    width:100%;
                    height:200px;
                    padding:0;
                    resize:none;
                    -webkit-resize:none;
                    -moz-resize:none;
                    -o-resize:none;
                    -ms-resize:none;
                }
            }
        </style>
        <script>
            //<a\s+([^>]*)*(href=([\"\'])([^\"^\'^>]*)\3)\s*?>(.*[^<]*)</a>    \4 = url  \5 = text
            //<([a-zA-Z0-9-]+)(\s+[^<^>]+?\s*)+>  //match the tags with attributes
            function html2mk(){
                var mk = document.getElementById("htmlString").value;

                function delRN(str){
                    str = str.replace(/[\r\n]/g,"") // 去除回车、换行符
                    return str;
                }

                function removeTagsIncludeContent(str){
                    var re = "<style\\s*[^\\>]*>([^<]*)</style>|";//<style></style>
                    var re2 = "<script\\s*[^\\>]*>([^<]*)<\/script>|";//<script><\/script>
                    var re3 = "<!--\\[if(.*?)<!\\[endif]-->|";//<!--[if IE]><![endif]-->
                    var re4 = "<!DOCTYPE HTML.*?>|";
                    var re5 = "<title>.*?<\/title>";
                    var reg = new RegExp(re+re2+re3+re4+re5,'gi');
                        str = str.replace(reg,"");
                    return str;
                }

                function removeTag(str){
                    var tag = ["img","p","a","h1","h2","h3","h4","h5","h6","ul","li","table","tbody","tr","td","th","thead","strong","b"];//except tags
                    var t1="",t2="";
                    for(arr in tag){
                        t1 += tag[arr]+ ">|"+tag[arr]+"(\\s+[^>]+?\\s*)?>|";
                        t2 += tag[arr]+">|";
                    }
                    t1 = t1.substring(0,t1.length-1);
                    t2 = t2.substring(0,t2.length-1);
                    var re = "<(?!(!:"+ t1 +"))[a-zA-Z0-9-]*(\\s+[^>]+?\\s*)?>|<\/(?!(?:"+t2+"))[a-zA-Z0-9-]*>|(<[a-zA-Z0-9-]+\\s*\/>)";
                    //console.log(re);//print RexExpStr
                    var removeTAG = new RegExp(re,'gi');//Remove other tags
                        str = str.replace(removeTAG,"");//excute
                    return str;
                }

                function h1_To_h6(str){
                    var h = /<(h[1-6]{1})(\s+.*\=(\"|\')[a-zA-Z0-9\;\:\s\-\_\.\#]*\3\s*)*>(.*?(?!\1).*?)<\/\1>/gi ;//匹配h1-h6
                    str = str.replace(h,function($0,$1,$2,$3,$4){
                                var sharpNums= $1.substring(1,2);
                                var sharps="";
                                for(var i = 0;i<sharpNums;i++){
                                    sharps+="#";
                                }
                                var res = sharps + " " + $4 + "\r";
                                return res;
                            });
                    return str;
                }
                
                function p_tag(str){
                    var p = /<p>(.*?(?!p).*?)<\/p>/gi;
                    str = str.replace(p,function($0,$1){
                        var res = "\r\n"+$1+"\r\n";
                        return res;
                    });
                    return str
                }

                function hyperLinks(str){
                    var hyperlinks = /<a([\s]+|[\s]+[^<>]+[\s]+)href=(\"([^<>"\']*)\"|\'([^<>"\']*)\')[^<>]*>(.*?(?!a).*?)<\/a>/gi; 
                    str = str.replace(hyperlinks,function($0,$1,$2,$3,$4,$5){
                                    // var res = "["+$2+"]("+ $1 +")\r";
                                    if($5==""){
                                        return "";
                                    }
                                    var res = "["+$5+"]("+ $3 +")\r";
                                    return res;
                                });
                    return str;
                }

                function imgTag(str){
                    //var imgtag= /<img\s*.*?(src=["|'].*?["|']).*?(alt=["|'].*?["|'])?.*?[\/]?>|<img\s*.*?(alt=["|'].*?["|'])?.*?(src=["|'].*?["|']).*?[\/]?>/gi;
                        var imgtag = /<img\s*.*?(src=["|'](.*?)["|']).*?(alt=["|'](.*?)["|'])?.*?[\/]?>/;
                        str = str.replace(imgtag,function($0,$1,$2,$3,$4){
                            if(typeof $3!="undefined"){
                                var res = "!["+$4+"]("+$2+")";
                            }
                            else{
                                var res = "![]("+$2+")";
                            }
                            console.log($3);
                        return res;
                    });
                    return str;
                }

                function StrongOrB_tag(str){
                    var re = /<(strong|b)>(.*?)<\/\1>/gi;
                    str = str.replace(re,function($0,$1,$2){
                        // var nospace = $2;
                        // nospace = nospace.replace(" ","");
                        var res = "**"+$2+"**";
                        return res;
                    });
                    return str
                }

                mk = delRN(mk);//删除换行符、回车符
                mk =removeTagsIncludeContent(mk);//删除style、script、IE条件注释语句、HTML文档声明
                mk = removeTag(mk);//移除无用HTML标记
                mk = h1_To_h6(mk);//handle h1-h6;
                mk = p_tag(mk);//p标记处理
                mk = hyperLinks(mk);//处理a标记
                mk = imgTag(mk);
                mk = StrongOrB_tag(mk);
                document.getElementById("markdownString").value = mk;
            }
            // window.onload = function(){
            //     document.getElementById("convert").addEventListener("click",html2mk,false);
            //     // document.getElementById("htmlString").addEventListener("keyup",html2mk,false);
            // }
        </script>
    </head>
    <body>
        <div id="InputBox" class="clearfix">
            <textarea id="htmlString" class="tarea" onchange="html2mk()" placeholder="htmlString"></textarea>
            <textarea id="markdownString" class="tarea" placeholder="markdownString"></textarea>
            <button type="button" id="convert" class="convert" onclick="html2mk()">Convert</button>
        </div>
        
    </body>
</html>
