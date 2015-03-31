/*
 * jQuery getImageData Plugin 0.1
 * http://www.maxnov.com/getimagedata
 *
 * Copyright 2010, Max Novakovic
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.maxnov.com/getimagedata/#license
 *
 * Includes jQuery JSONP Core Plugin 2.1.2
 * http://code.google.com/p/jquery-jsonp/
 * Copyright 2010, Julian Aubourg
 * Released under the MIT License.
 *
 * Date: Sat Feb 13 22:33:48 2010 GMT
 */

// jQuery JSONP Core Plugin
// For source, see: http://jquery-jsonp.googlecode.com/files/jquery.jsonp-2.1.2.js
(function(d,l){function w(){}function Q(a){p=[a]}function g(a,h,i){return a&&a.apply(h.context||h,i)}function x(a){function h(b){!j++&&l(function(){m();n&&(q[c]={s:[b]});y&&(b=y.apply(a,[b]));g(a.success,a,[b,z]);g(A,a,[a,z])},0)}function i(b){!j++&&l(function(){m();n&&b!=B&&(q[c]=b);g(a.error,a,[a,b]);g(A,a,[a,b])},0)}a=d.extend({},C,a);var A=a.complete,y=a.dataFilter,D=a.callbackParameter,E=a.callback,R=a.cache,n=a.pageCache,F=a.charset,c=a.url,e=a.data,G=a.timeout,o,j=0,m=w;a.abort=function(){!j++&& m()};if(g(a.beforeSend,a,[a])===false||j)return a;c=c||r;e=e?typeof e=="string"?e:d.param(e,a.traditional):r;c+=e?(/\?/.test(c)?"&":"?")+e:r;D&&(c+=(/\?/.test(c)?"&":"?")+escape(D)+"=?");!R&&!n&&(c+=(/\?/.test(c)?"&":"?")+"_"+(new Date).getTime()+"=");c=c.replace(/=\?(&|$)/,"="+E+"$1");n&&(o=q[c])?o.s?h(o.s[0]):i(o):l(function(b,k,s){if(!j){s=G>0&&l(function(){i(B)},G);m=function(){s&&clearTimeout(s);b[H]=b[t]=b[I]=b[u]=null;f[J](b);k&&f[J](k)};window[E]=Q;b=d(K)[0];b.id=L+S++;if(F)b[T]=F;var N=function(v){(b[t]|| w)();v=p;p=undefined;v?h(v[0]):i(M)};if(O.msie){b.event=t;b.htmlFor=b.id;b[H]=function(){b.readyState=="loaded"&&N()}}else{b[u]=b[I]=N;O.opera?(k=d(K)[0]).text="jQuery('#"+b.id+"')[0]."+u+"()":b[P]=P}b.src=c;f.insertBefore(b,f.firstChild);k&&f.insertBefore(k,f.firstChild)}},0);return a}var P="async",T="charset",r="",M="error",L="_jqjsp",t="onclick",u="on"+M,I="onload",H="onreadystatechange",J="removeChild",K="<script/>",z="success",B="timeout",O=d.browser,f=d("head")[0]||document.documentElement, q={},S=0,p,C={callback:L,url:location.href};x.setup=function(a){d.extend(C,a)};d.jsonp=x})(jQuery,setTimeout);

// jQuery getImageData Plugin
jQuery.getImageData = function(args) {
	
	// If a URL has been specified
	if(args.url) {
		
		// Ensure no problems when using http or http
		var is_secure = args.url.indexOf('https:');
		var remote_url = is_secure == 0 || location.protocol === "https:" ? "https://img-to-json.appspot" : "http://img-to-json.maxnov";
		remote_url += ".com/?callback=?";
		
		// Using jquery-jsonp (http://code.google.com/p/jquery-jsonp/) for the request
		// so that errors can be handled
		$.jsonp({	
	    url: remote_url,
	    data: { url: escape(args.url) },
	    dataType: 'jsonp',
      timeout: 10000,
			// It worked!
	    success: function(data, status) {
			
				// Create new, empty image
				var return_image = new Image();

				// When the image has loaded
				$(return_image).load(function(){
					
					// Set image dimensions
					this.width = data.width;
					this.height = data.height;

					// Return the image
					if(typeof(args.success) == typeof(Function)) {
						args.success(this);
					}
					
				// Put the base64 encoded image into the src to start the load
				}).attr('src', data.data);
			
	    },
			// Something went wrong.. 
			error: function(xhr, text_status){
				// Return the error(s)
				if(typeof(args.error) == typeof(Function)) {
					args.error(xhr, text_status);
				}
			}
		});
		
	// No URL specified so error
	} else {
		if(typeof(args.error) == typeof(Function)) {
			args.error(null, "no_url");
		}
	}
}

