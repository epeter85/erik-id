!function e(t,n,i){function a(r,s){if(!n[r]){if(!t[r]){var l="function"==typeof require&&require;if(!s&&l)return l(r,!0);if(o)return o(r,!0);throw new Error("Cannot find module '"+r+"'")}var c=n[r]={exports:{}};t[r][0].call(c.exports,function(e){var n=t[r][1][e];return a(n?n:e)},c,c.exports,e,t,n,i)}return n[r].exports}for(var o="function"==typeof require&&require,r=0;r<i.length;r++)a(i[r]);return a}({1:[function(e,t,n){!function(e,t){"object"==typeof n&&n&&"string"!=typeof n.nodeName?t(n):"function"==typeof define&&define.amd?define(["exports"],t):(e.Mustache={},t(e.Mustache))}(this,function(e){function t(e){return"function"==typeof e}function n(e){return h(e)?"array":typeof e}function i(e){return e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}function a(e,t){return null!=e&&"object"==typeof e&&t in e}function o(e,t){return g.call(e,t)}function r(e){return!o(v,e)}function s(e){return String(e).replace(/[&<>"'`=\/]/g,function(e){return y[e]})}function l(t,n){function a(){if(v&&!y)for(;g.length;)delete m[g.pop()];else g=[];v=!1,y=!1}function o(e){if("string"==typeof e&&(e=e.split(x,2)),!h(e)||2!==e.length)throw new Error("Invalid tags: "+e);s=new RegExp(i(e[0])+"\\s*"),l=new RegExp("\\s*"+i(e[1])),p=new RegExp("\\s*"+i("}"+e[1]))}if(!t)return[];var s,l,p,f=[],m=[],g=[],v=!1,y=!1;o(n||e.tags);for(var _,E,j,L,I,C,T=new u(t);!T.eos();){if(_=T.pos,j=T.scanUntil(s))for(var S=0,M=j.length;S<M;++S)L=j.charAt(S),r(L)?g.push(m.length):y=!0,m.push(["text",L,_,_+1]),_+=1,"\n"===L&&a();if(!T.scan(s))break;if(v=!0,E=T.scan(b)||"name",T.scan(w),"="===E?(j=T.scanUntil($),T.scan($),T.scanUntil(l)):"{"===E?(j=T.scanUntil(p),T.scan(k),T.scanUntil(l),E="&"):j=T.scanUntil(l),!T.scan(l))throw new Error("Unclosed tag at "+T.pos);if(I=[E,j,_,T.pos],m.push(I),"#"===E||"^"===E)f.push(I);else if("/"===E){if(C=f.pop(),!C)throw new Error('Unopened section "'+j+'" at '+_);if(C[1]!==j)throw new Error('Unclosed section "'+C[1]+'" at '+_)}else"name"===E||"{"===E||"&"===E?y=!0:"="===E&&o(j)}if(C=f.pop())throw new Error('Unclosed section "'+C[1]+'" at '+T.pos);return d(c(m))}function c(e){for(var t,n,i=[],a=0,o=e.length;a<o;++a)t=e[a],t&&("text"===t[0]&&n&&"text"===n[0]?(n[1]+=t[1],n[3]=t[3]):(i.push(t),n=t));return i}function d(e){for(var t,n,i=[],a=i,o=[],r=0,s=e.length;r<s;++r)switch(t=e[r],t[0]){case"#":case"^":a.push(t),o.push(t),a=t[4]=[];break;case"/":n=o.pop(),n[5]=t[2],a=o.length>0?o[o.length-1][4]:i;break;default:a.push(t)}return i}function u(e){this.string=e,this.tail=e,this.pos=0}function p(e,t){this.view=e,this.cache={".":this.view},this.parent=t}function f(){this.cache={}}var m=Object.prototype.toString,h=Array.isArray||function(e){return"[object Array]"===m.call(e)},g=RegExp.prototype.test,v=/\S/,y={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;","`":"&#x60;","=":"&#x3D;"},w=/\s*/,x=/\s+/,$=/\s*=/,k=/\s*\}/,b=/#|\^|\/|>|\{|&|=|!/;u.prototype.eos=function(){return""===this.tail},u.prototype.scan=function(e){var t=this.tail.match(e);if(!t||0!==t.index)return"";var n=t[0];return this.tail=this.tail.substring(n.length),this.pos+=n.length,n},u.prototype.scanUntil=function(e){var t,n=this.tail.search(e);switch(n){case-1:t=this.tail,this.tail="";break;case 0:t="";break;default:t=this.tail.substring(0,n),this.tail=this.tail.substring(n)}return this.pos+=t.length,t},p.prototype.push=function(e){return new p(e,this)},p.prototype.lookup=function(e){var n,i=this.cache;if(i.hasOwnProperty(e))n=i[e];else{for(var o,r,s=this,l=!1;s;){if(e.indexOf(".")>0)for(n=s.view,o=e.split("."),r=0;null!=n&&r<o.length;)r===o.length-1&&(l=a(n,o[r])),n=n[o[r++]];else n=s.view[e],l=a(s.view,e);if(l)break;s=s.parent}i[e]=n}return t(n)&&(n=n.call(this.view)),n},f.prototype.clearCache=function(){this.cache={}},f.prototype.parse=function(e,t){var n=this.cache,i=n[e];return null==i&&(i=n[e]=l(e,t)),i},f.prototype.render=function(e,t,n){var i=this.parse(e),a=t instanceof p?t:new p(t);return this.renderTokens(i,a,n,e)},f.prototype.renderTokens=function(e,t,n,i){for(var a,o,r,s="",l=0,c=e.length;l<c;++l)r=void 0,a=e[l],o=a[0],"#"===o?r=this.renderSection(a,t,n,i):"^"===o?r=this.renderInverted(a,t,n,i):">"===o?r=this.renderPartial(a,t,n,i):"&"===o?r=this.unescapedValue(a,t):"name"===o?r=this.escapedValue(a,t):"text"===o&&(r=this.rawValue(a)),void 0!==r&&(s+=r);return s},f.prototype.renderSection=function(e,n,i,a){function o(e){return r.render(e,n,i)}var r=this,s="",l=n.lookup(e[1]);if(l){if(h(l))for(var c=0,d=l.length;c<d;++c)s+=this.renderTokens(e[4],n.push(l[c]),i,a);else if("object"==typeof l||"string"==typeof l||"number"==typeof l)s+=this.renderTokens(e[4],n.push(l),i,a);else if(t(l)){if("string"!=typeof a)throw new Error("Cannot use higher-order sections without the original template");l=l.call(n.view,a.slice(e[3],e[5]),o),null!=l&&(s+=l)}else s+=this.renderTokens(e[4],n,i,a);return s}},f.prototype.renderInverted=function(e,t,n,i){var a=t.lookup(e[1]);if(!a||h(a)&&0===a.length)return this.renderTokens(e[4],t,n,i)},f.prototype.renderPartial=function(e,n,i){if(i){var a=t(i)?i(e[1]):i[e[1]];return null!=a?this.renderTokens(this.parse(a),n,i,a):void 0}},f.prototype.unescapedValue=function(e,t){var n=t.lookup(e[1]);if(null!=n)return n},f.prototype.escapedValue=function(t,n){var i=n.lookup(t[1]);if(null!=i)return e.escape(i)},f.prototype.rawValue=function(e){return e[1]},e.name="mustache.js",e.version="2.3.2",e.tags=["{{","}}"];var _=new f;return e.clearCache=function(){return _.clearCache()},e.parse=function(e,t){return _.parse(e,t)},e.render=function(e,t,i){if("string"!=typeof e)throw new TypeError('Invalid template! Template should be a "string" but "'+n(e)+'" was given as the first argument for mustache#render(template, view, partials)');return _.render(e,t,i)},e.to_html=function(n,i,a,o){var r=e.render(n,i,a);return t(o)?void o(r):r},e.escape=s,e.Scanner=u,e.Context=p,e.Writer=f,e})},{}],2:[function(e,t,n){function i(){var e=$(b);$("html, body").stop().animate({scrollTop:e.offset().top},900,"swing",function(){window.location.hash=b})}function a(e){e.preventDefault();var t=$(this).find(".cardDetails");0==t.css("opacity")?($("#projects .cardDetails").css("opacity","0"),t.fadeTo(50,1),$(this).find(".cardDetails .btn").click({msg:"detailsBtn"},v)):(t.fadeTo(50,0),$(this).find(".cardDetails .btn").off())}function o(e){e.preventDefault();var t=$(this).find(".cardDetails");t.fadeTo(25,1),$(this).find(".cardDetails .btn").click({msg:"detailsBtn"},v)}function r(e){e.preventDefault();var t=$(this).find(".cardDetails");t.fadeTo(25,0),$(this).find(".cardDetails .btn").off()}function s(e){e.preventDefault(),b=this.hash,console.log(b),$(e.target).hasClass("sideMenu")?($("#offCanvas").foundation("close"),setTimeout(i,300)):i()}function l(e){c()}function c(){document.getElementById("logoImage").appendChild(L[C]),document.getElementById("homePackImage").appendChild(L[C+1]),document.getElementById("checkListImage").appendChild(L[C+2]),document.getElementById("origWackyPackImage").appendChild(L[C+3]),y();for(var e=0;e<=C-1;e++){var t="cell"+e,n=$("<div class='carousel-cell' id='"+t+"'></div>");$(".main-carousel").flickity("append",n),document.getElementById(t).appendChild(L[e])}$(".main-carousel .flickity-viewport").css("height","");for(var i=document.getElementsByClassName("thumb-container"),a=0;a<=i.length-1;a++){var o=$(i[a]);$(o).append($(L[a+C+4]))}I&&($(".container").show(),$("#loaderOverlay").fadeOut("slow",function(){$("#loaderOverlay").hide()}),$(".main-carousel").flickity("resize"),I=!1)}function d(e){var t=e.item,n=t.type;n==createjs.LoadQueue.IMAGE&&L.push(e.result)}function u(e){var t=Math.round(100*e.loaded);$("#loadingCaption").html("loading: "+t+"%")}function p(e){var t,n=Foundation.MediaQuery.current,i=!1,a=[];switch(j=[],window.devicePixelRatio>=2&&(i=!0),n){case"small":t="_SM";break;case"medium":t="_MD";break;case"large":case"xlarge":case"xxlarge":t="_LG"}for(var o=0;o<=e.length-1;o++){var r,s=e[o].name,l=e[o].sizes,c=e[o].path,d=e[o].format;switch(l){case"1":r=c+s;break;case"2":r="small"===n?c+s+"_SM":c+s;break;case"3":r=c+s+t}o<C&&j.push(e[o].name),i&&(r+="_x2"),r+=d,a.push(r)}return a}function f(e){_=new createjs.LoadQueue,_.on("complete",l,this),_.on("fileload",d,this),_.on("progress",u,this),_.loadManifest(e,!0)}function m(){var e=Foundation.MediaQuery.current;switch(e){case"small":T="small";break;case"medium":T="medium";break;case"large":case"xlarge":case"xxlarge":T="large"}S!==T&&g(),N&&S!==T&&h(),S=T}function h(){for(console.log("resize detail carousel"),$(".overlay-carousel").flickity("destroy"),$(".overlay-carousel").html(""),w(),index=0;index<M[0].length;++index)k(M[0][index],"detail");$(".overlay-carousel").flickity("resize")}function g(){console.log("resize page");p(E);c()}function v(e,t){function n(e){for(index=0;index<A.length;++index){var t="cell"+index+1,n=$("<div class='carousel-cell' id='"+t+"'></div>");$(".overlay-carousel").flickity("append",n),document.getElementById(t).appendChild(A[index])}$(".overlay-carousel").flickity("resize"),$("#loadingCaption2").fadeTo("fast",0),$(".overlay-carousel").fadeTo("slow",1)}function i(e){var t=e.item,n=t.type;n==createjs.LoadQueue.IMAGE&&A.push(e.result)}function a(e){var t=Math.round(100*e.loaded);$("#loadingCaption2").html("loading: "+t+"%")}if(classie.has(G,"open")){$(".project-details > .copy > #buttons > .view_site_btn").unbind("click"),$("body").removeClass("noscroll"),"detailsBtn"===D&&setTimeout(x,1e3),classie.remove(G,"open"),classie.remove(B,"overlay-open"),classie.add(G,"close");var o=function(e){if(support.transitions){if("visibility"!==e.propertyName)return;this.removeEventListener(transEndEventName,o)}classie.remove(G,"close")};support.transitions?G.addEventListener(transEndEventName,o):o(),D=""}else{if(console.log(P[e.target.id]),"undefined"==typeof P[e.target.id]?(console.log("whats-this"),ga("send","pageview","whats-this")):(console.log(P[e.target.id].title),ga("send","pageview",P[e.target.id].title)),$("body").addClass("noscroll"),"detailsBtn"===e.data.msg){D="detailsBtn",ga("send","pageview",P[e.target.id].title),$("#loadingCaption2").show(),$("#loadingCaption2").fadeTo("fast",1),$("#detailView").show(),$("#whatIsThis").hide(),w(),$(".overlay-carousel").css("opacity","0"),N=!0,$(".project-details > .copy > .titleText").html(""),$(".project-details > .copy > .titleText").append(P[e.target.id].title),$(".project-details > .copy > .header").html(""),$(".project-details > .copy > .header").append("<div><span>client: </span>"+P[e.target.id].client+"</div><div><span>agency: </span>"+P[e.target.id].agency+"</div><div><span>platform: </span>"+P[e.target.id].platform+"</div>"),$(".project-details > .copy > .description").html(""),$(".project-details > .copy > .description").append(P[e.target.id].description),$(".project-details > .copy > #buttons > .view_site_btn").html(""),$(".project-details > .copy > #buttons > .view_site_btn").append("<a href="+P[e.target.id].url+" target='_blank'><i class='fa fa-eye' aria-hidden='true'></i>view website</a>");var r=P[e.target.id].url;$(".project-details > .copy > #buttons > .view_site_btn").click(function(){console.log(r),ga("send","event",{eventCategory:"Outbound Link",eventAction:"click",eventLabel:r})}),"no link"===P[e.target.id].url?(console.log(P[e.target.id].url),$(".view_site_btn").hide()):$(".view_site_btn").show(),M=[],z=[],A=[];var s=!1;for(window.devicePixelRatio>=2&&(s=!0),M.push(P[e.target.id].slides),index=0;index<M[0].length;++index){var l;l=s?"images/slides/"+M[0][index]+"_LG_x2.jpg":"images/slides/"+M[0][index]+"_LG.jpg",z.push(l)}var c=new createjs.LoadQueue;c.on("complete",n,this),c.on("fileload",i,this),c.on("progress",a,this),c.loadManifest(z,!0)}else $("#detailView").hide(),$("#whatIsThis").show();classie.add(G,"open"),classie.add(B,"overlay-open")}}function y(){var e=Flickity.data(".main-carousel");void 0!==e&&(console.log("kill carousel"),$(".main-carousel").flickity("destroy"),$(".main-carousel").html("")),$(".main-carousel").flickity({cellAlign:"left",contain:!0,wrapAround:!0,lazyLoad:!0,autoPlay:!0,imagesLoaded:!0});var e=$(".main-carousel").data("flickity");$(".main-carousel").on("cellSelect",function(){switch(e.selectedIndex){case 0:case 2:$("#mainLogo > #caption").css("color","white");break;default:$("#mainLogo > #caption").css("color","black")}})}function w(){Foundation.MediaQuery.atLeast("large")?($(".overlay-carousel").flickity({cellAlign:"left",contain:!0,wrapAround:!0,imagesLoaded:!0}),$(".overlay-carousel .flickity-prev-next-button.next").click(function(){var e=$(".overlay-carousel").data("flickity"),t=e.selectedIndex,n=t+1;$(".overlay-carousel").flickity("select",n)}),$(".overlay-carousel .flickity-prev-next-button.previous").click(function(){var e=$(".overlay-carousel").data("flickity"),t=e.selectedIndex,n=t-1;$(".overlay-carousel").flickity("select",n)})):$(".overlay-carousel").flickity({cellAlign:"left",contain:!0,wrapAround:!0,autoPlay:!0,imagesLoaded:!0})}function x(){console.log(x),$(".overlay-carousel").flickity("destroy"),$(".overlay-carousel").html(""),N=!1}function k(e,t){var n,i=Foundation.MediaQuery.current,a=!1;if(window.devicePixelRatio>=2&&(a=!0),a)switch(i){case"small":n="detail"===t?"images/slides/"+e+"_LG_x2.jpg":"images/main_carousel/"+e+"_SM_x2.jpg",viewState="sm_ret";break;case"medium":n="detail"===t?"images/slides/"+e+"_LG_x2.jpg":"images/main_carousel/"+e+"_MD_x2.jpg",viewState="md_ret";break;case"large":case"xlarge":case"xxlarge":n="detail"===t?"images/slides/"+e+"_LG_x2.jpg":"images/main_carousel/"+e+"_LG_x2.jpg",viewState="lg_ret"}else switch(i){case"small":n="detail"===t?"images/slides/"+e+"_LG.jpg":"images/main_carousel/"+e+"_SM.jpg",viewState="sm";break;case"medium":n="detail"===t?"images/slides/"+e+"_LG.jpg":"images/main_carousel/"+e+"_MD.jpg",viewState="md";break;case"large":case"xlarge":case"xxlarge":n="detail"===t?"images/slides/"+e+"_LG.jpg":"images/main_carousel/"+e+"_LG.jpg",viewState="lg"}var o=$("<div class='carousel-cell'><img src='"+n+"' /></div>");"detail"===t&&(console.log("APPEND DETAIL IMAGES"),$(".overlay-carousel").flickity("append",o)),"main"===t&&$(".main-carousel").flickity("append",o)}!function(e){"use strict";function t(e){return new RegExp("(^|\\s+)"+e+"(\\s+|$)")}function n(e,t){var n=i(e,t)?o:a;n(e,t)}var i,a,o;"classList"in document.documentElement?(i=function(e,t){return e.classList.contains(t)},a=function(e,t){e.classList.add(t)},o=function(e,t){e.classList.remove(t)}):(i=function(e,n){return t(n).test(e.className)},a=function(e,t){i(e,t)||(e.className=e.className+" "+t)},o=function(e,n){e.className=e.className.replace(t(n)," ")});var r={hasClass:i,addClass:a,removeClass:o,toggleClass:n,has:i,add:a,remove:o,toggle:n};"function"==typeof define&&define.amd?define(r):e.classie=r}(window),Foundation.Interchange.SPECIAL_QUERIES.retina_small="only screen and (min-width: 1px) and (-webkit-min-device-pixel-ratio: 2), only screen and (min-width: 1px) and (min--moz-device-pixel-ratio: 2), only screen and (min-width: 1px) and (-o-min-device-pixel-ratio: 2/1), only screen and (min-width: 1px) and (min-device-pixel-ratio: 2), only screen and (min-width: 1px) and (min-resolution: 192dpi), only screen and (min-width: 1px) and (min-resolution: 2dppx)",Foundation.Interchange.SPECIAL_QUERIES.retina_medium="only screen and (min-width: 641px) and (-webkit-min-device-pixel-ratio: 2), only screen and (min-width: 641px) and (min--moz-device-pixel-ratio: 2), only screen and (min-width: 641px) and (-o-min-device-pixel-ratio: 2/1), only screen and (min-width: 641px) and (min-device-pixel-ratio: 2), only screen and (min-width: 641px) and (min-resolution: 192dpi), only screen and (min-width: 641px) and (min-resolution: 2dppx)",Foundation.Interchange.SPECIAL_QUERIES.retina_large="only screen and (min-width: 1025px) and (-webkit-min-device-pixel-ratio: 2), only screen and (min-width: 1025px) and (min--moz-device-pixel-ratio: 2), only screen and (min-width: 1025px) and (-o-min-device-pixel-ratio: 2/1), only screen and (min-width: 1025px) and (min-device-pixel-ratio: 2), only screen and (min-width: 1025px) and (min-resolution: 192dpi), only screen and (min-width: 1025px) and (min-resolution: 2dppx)";var b;$(document).ready(function(){$("#nav-icon").click(function(){$(this).toggleClass("open")}),$(document).on("closed.zf.offcanvas",function(){$("#nav-icon").toggleClass("open")})});var _,E=[],j=[],L=[],I=!0,C=4;$(window).load(function(){E=[{name:"pretender",sizes:"3",path:"images/main_carousel/",format:".jpg"},{name:"haagen_dazs",sizes:"3",path:"images/main_carousel/",format:".jpg"},{name:"mcdonalds",sizes:"3",path:"images/main_carousel/",format:".jpg"},{name:"computers",sizes:"3",path:"images/main_carousel/",format:".jpg"},{name:"logo",sizes:"3",path:"images/",format:".png"},{name:"homePack",sizes:"2",path:"images/",format:".png"},{name:"checklist",sizes:"1",path:"images/",format:".jpg"},{name:"original_wacky_pack",sizes:"1",path:"images/",format:".png"}];for(var e=0;e<=P.length-1;e++)E.push({name:P[e].cardImage,sizes:"1",path:"images/thumbs/",format:".jpg"});f(p(E))});var T,S;$(window).resize(function(){m()});var M,z,A,D,P=[],N=!1,B=document.querySelector("div.container"),G=(document.getElementById("trigger-overlay"),document.querySelector("div.overlay"));G.querySelector("button.overlay-close");transEndEventNames={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",msTransition:"MSTransitionEnd",transition:"transitionend"},transEndEventName=transEndEventNames[Modernizr.prefixed("transition")],support={transitions:Modernizr.csstransitions},$(function(){var t=e("mustache");$.getJSON("js/work.json",function(e){var n=$("#cardsdata").html(),i=t.to_html(n,e);$("#projects").html(i);var l;for(l=0;l<e.projects.length;++l)P.push(e.projects[l]);$(".thumb-container").click(a),$(".thumb-container").mouseover(o),$(".thumb-container").mouseout(r),$(".overlay-close").click(v),$(".back_btn").click(v),$("#footer-image").click({msg:"whatsThisBtn"},v),$(".sideMenu").click(s),$(".mainMenu").click(s)})})},{mustache:1}]},{},[2]);