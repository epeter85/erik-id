!function e(t,n,i){function a(r,s){if(!n[r]){if(!t[r]){var l="function"==typeof require&&require;if(!s&&l)return l(r,!0);if(o)return o(r,!0);throw new Error("Cannot find module '"+r+"'")}var c=n[r]={exports:{}};t[r][0].call(c.exports,function(e){var n=t[r][1][e];return a(n?n:e)},c,c.exports,e,t,n,i)}return n[r].exports}for(var o="function"==typeof require&&require,r=0;r<i.length;r++)a(i[r]);return a}({1:[function(e,t,n){!function(e,t){"object"==typeof n&&n&&"string"!=typeof n.nodeName?t(n):"function"==typeof define&&define.amd?define(["exports"],t):(e.Mustache={},t(e.Mustache))}(this,function(e){function t(e){return"function"==typeof e}function n(e){return h(e)?"array":typeof e}function i(e){return e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}function a(e,t){return null!=e&&"object"==typeof e&&t in e}function o(e,t){return g.call(e,t)}function r(e){return!o(v,e)}function s(e){return String(e).replace(/[&<>"'`=\/]/g,function(e){return y[e]})}function l(t,n){function a(){if(v&&!y)for(;g.length;)delete f[g.pop()];else g=[];v=!1,y=!1}function o(e){if("string"==typeof e&&(e=e.split(x,2)),!h(e)||2!==e.length)throw new Error("Invalid tags: "+e);s=new RegExp(i(e[0])+"\\s*"),l=new RegExp("\\s*"+i(e[1])),p=new RegExp("\\s*"+i("}"+e[1]))}if(!t)return[];var s,l,p,m=[],f=[],g=[],v=!1,y=!1;o(n||e.tags);for(var _,E,j,L,I,T,C=new u(t);!C.eos();){if(_=C.pos,j=C.scanUntil(s))for(var S=0,M=j.length;M>S;++S)L=j.charAt(S),r(L)?g.push(f.length):y=!0,f.push(["text",L,_,_+1]),_+=1,"\n"===L&&a();if(!C.scan(s))break;if(v=!0,E=C.scan(b)||"name",C.scan(w),"="===E?(j=C.scanUntil($),C.scan($),C.scanUntil(l)):"{"===E?(j=C.scanUntil(p),C.scan(k),C.scanUntil(l),E="&"):j=C.scanUntil(l),!C.scan(l))throw new Error("Unclosed tag at "+C.pos);if(I=[E,j,_,C.pos],f.push(I),"#"===E||"^"===E)m.push(I);else if("/"===E){if(T=m.pop(),!T)throw new Error('Unopened section "'+j+'" at '+_);if(T[1]!==j)throw new Error('Unclosed section "'+T[1]+'" at '+_)}else"name"===E||"{"===E||"&"===E?y=!0:"="===E&&o(j)}if(T=m.pop())throw new Error('Unclosed section "'+T[1]+'" at '+C.pos);return d(c(f))}function c(e){for(var t,n,i=[],a=0,o=e.length;o>a;++a)t=e[a],t&&("text"===t[0]&&n&&"text"===n[0]?(n[1]+=t[1],n[3]=t[3]):(i.push(t),n=t));return i}function d(e){for(var t,n,i=[],a=i,o=[],r=0,s=e.length;s>r;++r)switch(t=e[r],t[0]){case"#":case"^":a.push(t),o.push(t),a=t[4]=[];break;case"/":n=o.pop(),n[5]=t[2],a=o.length>0?o[o.length-1][4]:i;break;default:a.push(t)}return i}function u(e){this.string=e,this.tail=e,this.pos=0}function p(e,t){this.view=e,this.cache={".":this.view},this.parent=t}function m(){this.cache={}}var f=Object.prototype.toString,h=Array.isArray||function(e){return"[object Array]"===f.call(e)},g=RegExp.prototype.test,v=/\S/,y={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;","`":"&#x60;","=":"&#x3D;"},w=/\s*/,x=/\s+/,$=/\s*=/,k=/\s*\}/,b=/#|\^|\/|>|\{|&|=|!/;u.prototype.eos=function(){return""===this.tail},u.prototype.scan=function(e){var t=this.tail.match(e);if(!t||0!==t.index)return"";var n=t[0];return this.tail=this.tail.substring(n.length),this.pos+=n.length,n},u.prototype.scanUntil=function(e){var t,n=this.tail.search(e);switch(n){case-1:t=this.tail,this.tail="";break;case 0:t="";break;default:t=this.tail.substring(0,n),this.tail=this.tail.substring(n)}return this.pos+=t.length,t},p.prototype.push=function(e){return new p(e,this)},p.prototype.lookup=function(e){var n,i=this.cache;if(i.hasOwnProperty(e))n=i[e];else{for(var o,r,s=this,l=!1;s;){if(e.indexOf(".")>0)for(n=s.view,o=e.split("."),r=0;null!=n&&r<o.length;)r===o.length-1&&(l=a(n,o[r])),n=n[o[r++]];else n=s.view[e],l=a(s.view,e);if(l)break;s=s.parent}i[e]=n}return t(n)&&(n=n.call(this.view)),n},m.prototype.clearCache=function(){this.cache={}},m.prototype.parse=function(e,t){var n=this.cache,i=n[e];return null==i&&(i=n[e]=l(e,t)),i},m.prototype.render=function(e,t,n){var i=this.parse(e),a=t instanceof p?t:new p(t);return this.renderTokens(i,a,n,e)},m.prototype.renderTokens=function(e,t,n,i){for(var a,o,r,s="",l=0,c=e.length;c>l;++l)r=void 0,a=e[l],o=a[0],"#"===o?r=this.renderSection(a,t,n,i):"^"===o?r=this.renderInverted(a,t,n,i):">"===o?r=this.renderPartial(a,t,n,i):"&"===o?r=this.unescapedValue(a,t):"name"===o?r=this.escapedValue(a,t):"text"===o&&(r=this.rawValue(a)),void 0!==r&&(s+=r);return s},m.prototype.renderSection=function(e,n,i,a){function o(e){return r.render(e,n,i)}var r=this,s="",l=n.lookup(e[1]);if(l){if(h(l))for(var c=0,d=l.length;d>c;++c)s+=this.renderTokens(e[4],n.push(l[c]),i,a);else if("object"==typeof l||"string"==typeof l||"number"==typeof l)s+=this.renderTokens(e[4],n.push(l),i,a);else if(t(l)){if("string"!=typeof a)throw new Error("Cannot use higher-order sections without the original template");l=l.call(n.view,a.slice(e[3],e[5]),o),null!=l&&(s+=l)}else s+=this.renderTokens(e[4],n,i,a);return s}},m.prototype.renderInverted=function(e,t,n,i){var a=t.lookup(e[1]);return!a||h(a)&&0===a.length?this.renderTokens(e[4],t,n,i):void 0},m.prototype.renderPartial=function(e,n,i){if(i){var a=t(i)?i(e[1]):i[e[1]];return null!=a?this.renderTokens(this.parse(a),n,i,a):void 0}},m.prototype.unescapedValue=function(e,t){var n=t.lookup(e[1]);return null!=n?n:void 0},m.prototype.escapedValue=function(t,n){var i=n.lookup(t[1]);return null!=i?e.escape(i):void 0},m.prototype.rawValue=function(e){return e[1]},e.name="mustache.js",e.version="2.2.1",e.tags=["{{","}}"];var _=new m;e.clearCache=function(){return _.clearCache()},e.parse=function(e,t){return _.parse(e,t)},e.render=function(e,t,i){if("string"!=typeof e)throw new TypeError('Invalid template! Template should be a "string" but "'+n(e)+'" was given as the first argument for mustache#render(template, view, partials)');return _.render(e,t,i)},e.to_html=function(n,i,a,o){var r=e.render(n,i,a);return t(o)?void o(r):r},e.escape=s,e.Scanner=u,e.Context=p,e.Writer=m})},{}],2:[function(e,t,n){function i(){console.log("scrollToAnchor");var e=$(x);$("html, body").stop().animate({scrollTop:e.offset().top},900,"swing",function(){window.location.hash=x})}function a(e){e.preventDefault();var t=$(this).find(".cardDetails");0==t.css("opacity")?($("#projects .cardDetails").css("opacity","0"),t.fadeTo(50,1),$(this).find(".cardDetails .btn").click({msg:"detailsBtn"},h)):(t.fadeTo(50,0),$(this).find(".cardDetails .btn").off())}function o(e){e.preventDefault(),x=this.hash,console.log(x),$(e.target).hasClass("sideMenu")?($("#offCanvas").foundation("close"),setTimeout(i,300)):i()}function r(e){s()}function s(){document.getElementById("logoImage").appendChild(E[L]),document.getElementById("homePackImage").appendChild(E[L+1]),document.getElementById("checkListImage").appendChild(E[L+2]),document.getElementById("origWackyPackImage").appendChild(E[L+3]),g();for(var e=0;L-1>=e;e++){var t="cell"+e,n=$("<div class='carousel-cell' id='"+t+"'></div>");$(".main-carousel").flickity("append",n),document.getElementById(t).appendChild(E[e])}$(".main-carousel .flickity-viewport").css("height","");for(var i=document.getElementsByClassName("thumb-container"),a=0;a<=i.length-1;a++){var o=$(i[a]);$(o).append($(E[a+L+4]))}j&&($(".container").show(),$("#loaderOverlay").fadeOut("slow",function(){$("#loaderOverlay").hide()}),$(".main-carousel").flickity("resize"),j=!1)}function l(e){var t=e.item,n=t.type;n==createjs.LoadQueue.IMAGE&&E.push(e.result)}function c(e){var t=Math.round(100*e.loaded);$("#loadingCaption").html("loading: "+t+"%")}function d(e){var t,n=Foundation.MediaQuery.current,i=!1,a=[];switch(_=[],window.devicePixelRatio>=2&&(i=!0),n){case"small":t="_SM";break;case"medium":t="_MD";break;case"large":case"xlarge":case"xxlarge":t="_LG"}for(var o=0;o<=e.length-1;o++){var r,s=e[o].name,l=e[o].sizes,c=e[o].path,d=e[o].format;switch(l){case"1":r=c+s;break;case"2":r="small"===n?c+s+"_SM":c+s;break;case"3":r=c+s+t}L>o&&_.push(e[o].name),i&&(r+="_x2"),r+=d,a.push(r)}return a}function u(e){k=new createjs.LoadQueue,k.on("complete",r,this),k.on("fileload",l,this),k.on("progress",c,this),k.loadManifest(e,!0)}function p(){var e=Foundation.MediaQuery.current;switch(e){case"small":I="small";break;case"medium":I="medium";break;case"large":case"xlarge":case"xxlarge":I="large"}T!==I&&f(),P&&T!==I&&m(),T=I}function m(){for(console.log("resize detail carousel"),$(".overlay-carousel").flickity("destroy"),$(".overlay-carousel").html(""),v(),index=0;index<C[0].length;++index)w(C[0][index],"detail");$(".overlay-carousel").flickity("resize")}function f(){console.log("resize page");d(b);s()}function h(e,t){function n(e){for(index=0;index<M.length;++index){var t="cell"+index+1,n=$("<div class='carousel-cell' id='"+t+"'></div>");$(".overlay-carousel").flickity("append",n),document.getElementById(t).appendChild(M[index])}$(".overlay-carousel").flickity("resize"),$("#loadingCaption2").fadeTo("fast",0),$(".overlay-carousel").fadeTo("slow",1)}function i(e){var t=e.item,n=t.type;n==createjs.LoadQueue.IMAGE&&M.push(e.result)}function a(e){var t=Math.round(100*e.loaded);$("#loadingCaption2").html("loading: "+t+"%")}if(classie.has(G,"open")){$(".project-details > .copy > #buttons > .view_site_btn").unbind("click"),$("body").removeClass("noscroll"),"detailsBtn"===z&&setTimeout(y,1e3),classie.remove(G,"open"),classie.remove(N,"overlay-open"),classie.add(G,"close");var o=function(e){if(support.transitions){if("visibility"!==e.propertyName)return;this.removeEventListener(transEndEventName,o)}classie.remove(G,"close")};support.transitions?G.addEventListener(transEndEventName,o):o(),z=""}else{if($("body").addClass("noscroll"),"detailsBtn"===e.data.msg){z="detailsBtn",ga("send","pageview",A[e.target.id].title),$("#loadingCaption2").show(),$("#loadingCaption2").fadeTo("fast",1),$("#detailView").show(),$("#whatIsThis").hide(),v(),$(".overlay-carousel").css("opacity","0"),P=!0,$(".project-details > .copy > .titleText").html(""),$(".project-details > .copy > .titleText").append(A[e.target.id].title),$(".project-details > .copy > .header").html(""),$(".project-details > .copy > .header").append("<div><span>client: </span>"+A[e.target.id].client+"</div><div><span>agency: </span>"+A[e.target.id].agency+"</div><div><span>platform: </span>"+A[e.target.id].platform+"</div>"),$(".project-details > .copy > .description").html(""),$(".project-details > .copy > .description").append(A[e.target.id].description),$(".project-details > .copy > #buttons > .view_site_btn").html(""),$(".project-details > .copy > #buttons > .view_site_btn").append("<a href="+A[e.target.id].url+" target='_blank'><i class='fa fa-eye' aria-hidden='true'></i>view website</a>");var r=A[e.target.id].url;$(".project-details > .copy > #buttons > .view_site_btn").click(function(){console.log(r),ga("send","event",{eventCategory:"Outbound Link",eventAction:"click",eventLabel:r})}),"no link"===A[e.target.id].url?(console.log(A[e.target.id].url),$(".view_site_btn").hide()):$(".view_site_btn").show(),C=[],S=[],M=[];var s=!1;for(window.devicePixelRatio>=2&&(s=!0),C.push(A[e.target.id].slides),index=0;index<C[0].length;++index){var l;l=s?"images/slides/"+C[0][index]+"_LG_x2.jpg":"images/slides/"+C[0][index]+"_LG.jpg",S.push(l)}var c=new createjs.LoadQueue;c.on("complete",n,this),c.on("fileload",i,this),c.on("progress",a,this),c.loadManifest(S,!0)}else $("#detailView").hide(),$("#whatIsThis").show();classie.add(G,"open"),classie.add(N,"overlay-open")}}function g(){var e=Flickity.data(".main-carousel");void 0!==e&&(console.log("kill carousel"),$(".main-carousel").flickity("destroy"),$(".main-carousel").html("")),$(".main-carousel").flickity({cellAlign:"left",contain:!0,wrapAround:!0,lazyLoad:!0,autoPlay:!0,imagesLoaded:!0});var e=$(".main-carousel").data("flickity");$(".main-carousel").on("cellSelect",function(){switch(e.selectedIndex){case 1:$("#mainLogo > #caption").css("color","white");break;default:$("#mainLogo > #caption").css("color","black")}})}function v(){Foundation.MediaQuery.atLeast("large")?($(".overlay-carousel").flickity({cellAlign:"left",contain:!0,wrapAround:!0,imagesLoaded:!0}),$(".overlay-carousel .flickity-prev-next-button.next").click(function(){var e=$(".overlay-carousel").data("flickity"),t=e.selectedIndex,n=t+1;$(".overlay-carousel").flickity("select",n)}),$(".overlay-carousel .flickity-prev-next-button.previous").click(function(){var e=$(".overlay-carousel").data("flickity"),t=e.selectedIndex,n=t-1;$(".overlay-carousel").flickity("select",n)})):$(".overlay-carousel").flickity({cellAlign:"left",contain:!0,wrapAround:!0,autoPlay:!0,imagesLoaded:!0})}function y(){console.log(y),$(".overlay-carousel").flickity("destroy"),$(".overlay-carousel").html(""),P=!1}function w(e,t){var n,i=Foundation.MediaQuery.current,a=!1;if(window.devicePixelRatio>=2&&(a=!0),a)switch(i){case"small":n="detail"===t?"images/slides/"+e+"_LG_x2.jpg":"images/main_carousel/"+e+"_SM_x2.jpg",viewState="sm_ret";break;case"medium":n="detail"===t?"images/slides/"+e+"_LG_x2.jpg":"images/main_carousel/"+e+"_MD_x2.jpg",viewState="md_ret";break;case"large":case"xlarge":case"xxlarge":n="detail"===t?"images/slides/"+e+"_LG_x2.jpg":"images/main_carousel/"+e+"_LG_x2.jpg",viewState="lg_ret"}else switch(i){case"small":n="detail"===t?"images/slides/"+e+"_LG.jpg":"images/main_carousel/"+e+"_SM.jpg",viewState="sm";break;case"medium":n="detail"===t?"images/slides/"+e+"_LG.jpg":"images/main_carousel/"+e+"_MD.jpg",viewState="md";break;case"large":case"xlarge":case"xxlarge":n="detail"===t?"images/slides/"+e+"_LG.jpg":"images/main_carousel/"+e+"_LG.jpg",viewState="lg"}var o=$("<div class='carousel-cell'><img src='"+n+"' /></div>");"detail"===t&&(console.log("APPEND DETAIL IMAGES"),$(".overlay-carousel").flickity("append",o)),"main"===t&&$(".main-carousel").flickity("append",o)}!function(e){"use strict";function t(e){return new RegExp("(^|\\s+)"+e+"(\\s+|$)")}function n(e,t){var n=i(e,t)?o:a;n(e,t)}var i,a,o;"classList"in document.documentElement?(i=function(e,t){return e.classList.contains(t)},a=function(e,t){e.classList.add(t)},o=function(e,t){e.classList.remove(t)}):(i=function(e,n){return t(n).test(e.className)},a=function(e,t){i(e,t)||(e.className=e.className+" "+t)},o=function(e,n){e.className=e.className.replace(t(n)," ")});var r={hasClass:i,addClass:a,removeClass:o,toggleClass:n,has:i,add:a,remove:o,toggle:n};"function"==typeof define&&define.amd?define(r):e.classie=r}(window),Foundation.Interchange.SPECIAL_QUERIES.retina_small="only screen and (min-width: 1px) and (-webkit-min-device-pixel-ratio: 2), only screen and (min-width: 1px) and (min--moz-device-pixel-ratio: 2), only screen and (min-width: 1px) and (-o-min-device-pixel-ratio: 2/1), only screen and (min-width: 1px) and (min-device-pixel-ratio: 2), only screen and (min-width: 1px) and (min-resolution: 192dpi), only screen and (min-width: 1px) and (min-resolution: 2dppx)",Foundation.Interchange.SPECIAL_QUERIES.retina_medium="only screen and (min-width: 641px) and (-webkit-min-device-pixel-ratio: 2), only screen and (min-width: 641px) and (min--moz-device-pixel-ratio: 2), only screen and (min-width: 641px) and (-o-min-device-pixel-ratio: 2/1), only screen and (min-width: 641px) and (min-device-pixel-ratio: 2), only screen and (min-width: 641px) and (min-resolution: 192dpi), only screen and (min-width: 641px) and (min-resolution: 2dppx)",Foundation.Interchange.SPECIAL_QUERIES.retina_large="only screen and (min-width: 1025px) and (-webkit-min-device-pixel-ratio: 2), only screen and (min-width: 1025px) and (min--moz-device-pixel-ratio: 2), only screen and (min-width: 1025px) and (-o-min-device-pixel-ratio: 2/1), only screen and (min-width: 1025px) and (min-device-pixel-ratio: 2), only screen and (min-width: 1025px) and (min-resolution: 192dpi), only screen and (min-width: 1025px) and (min-resolution: 2dppx)";var x,k,b=[],_=[],E=[],j=!0,L=4;$(window).load(function(){b=[{name:"haagen_dazs",sizes:"3",path:"images/main_carousel/",format:".jpg"},{name:"pretender",sizes:"3",path:"images/main_carousel/",format:".jpg"},{name:"subway",sizes:"3",path:"images/main_carousel/",format:".jpg"},{name:"computers",sizes:"3",path:"images/main_carousel/",format:".jpg"},{name:"logo",sizes:"3",path:"images/",format:".png"},{name:"homePack",sizes:"2",path:"images/",format:".png"},{name:"checklist",sizes:"1",path:"images/",format:".jpg"},{name:"original_wacky_pack",sizes:"1",path:"images/",format:".png"}];for(var e=0;e<=A.length-1;e++)b.push({name:A[e].cardImage,sizes:"1",path:"images/thumbs/",format:".jpg"});u(d(b))});var I,T;$(window).resize(function(){p()});var C,S,M,z,A=[],P=!1,N=document.querySelector("div.container"),G=(document.getElementById("trigger-overlay"),document.querySelector("div.overlay"));G.querySelector("button.overlay-close");transEndEventNames={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",msTransition:"MSTransitionEnd",transition:"transitionend"},transEndEventName=transEndEventNames[Modernizr.prefixed("transition")],support={transitions:Modernizr.csstransitions},$(function(){var t=e("mustache");$.getJSON("js/work.json",function(e){var n=$("#cardsdata").html(),i=t.to_html(n,e);$("#projects").html(i);var r;for(r=0;r<e.projects.length;++r)A.push(e.projects[r]);$(".thumb-container").click(a),$(".overlay-close").click(h),$(".back_btn").click(h),$("#footer-image").click({msg:"whatsThisBtn"},h),$(".sideMenu").click(o),$(".mainMenu").click(o)})})},{mustache:1}]},{},[2]);