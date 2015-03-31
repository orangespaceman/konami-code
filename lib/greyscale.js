/*
 * create greyscale image versions of all images, and overlay them on top of the originals
 */
var greyscale = function() {	

	// keep a count of all created greyscale images
	var greyscaleImageCache = [];

	// has this script already been initialised?
	var init = false;
	
	// are we currently set to show greyscale images?
	var isGreyscale = false;

	// cached image data (for ajax-based updates)
	var imgData = null;
	
	
	/*
	 * show all greyscale images
	 * 
	 * publicly accessible method
	 */
	var showGreyscaleImages = function() {

		isGreyscale = true;
		
		// condition : this has already been initialised, greyscale images exist
		// so just show them (skip recreation)
		if (init) {
			
			if (greyscaleImageCache.length > 0) {
				$(greyscaleImageCache).each(function(counter){
					showGreyscaleImage(this);
				});
			}

		// create greyscale images
		} else {
			
			$('img:not(.exclude)').each(function(counter){
				initGreyscaleImage(this);
			});
			
			// we've now initialised the script
			init = true;
		}
	};
	
	
	/*
	 * Preload a new greyscale image from an external site, 
	 * ready to be shown by addGreyscaleImage
	 * 
	 * publicly accessible method	
	 */
	var preloadGreyscaleImage = function (img) {
		if (init) {
			$.getImageData({
				url: img.src,
				success: function(image){
					imgData = image;
				},
				error: function(xhr, text_status){
					console.log('ERROR: ' + text_status);
				}
			});
		}
	};
	
	
	/*
	 * Add a new greyscale image 
	 * Method to be called if adding a new image once the page has loaded
	 * (assumes the image has already been preloaded)
	 * 
	 * publicly accessible method
	 */
	var addGreyscaleImage = function (img) {
		if (init) {
			initGreyscaleImage(img, true);
		}
	};
	
	
	
	/*
	 * hide all greyscale images
	 * 
	 * publicly accessible method	
	 */
	var hideGreyscaleImages = function() {
		
		isGreyscale = false;
		
		if (greyscaleImageCache.length > 0) {
			$(greyscaleImageCache).each(function(counter){
				hideGreyscaleImage(this);
			});
		}
	};
	
	
	/*
	 * show an individual greyscale image
	 */
	var showGreyscaleImage = function(imgWrap) {
		$(imgWrap).find("img.bw").css({opacity:0}).animate({opacity:1}, 1000, function(){
			hideLoader(imgWrap);
		});
	};
	
	
	
	/*
	 * hide an individual greyscale image
	 */
	var hideGreyscaleImage = function(imgWrap) {
		$(imgWrap).find("img.bw").css({opacity:1}).animate({opacity:0}, 1000);
	};
	
	
	
	/*
	 * init each greyscale image
	 *
	 *
	 */
	var initGreyscaleImage = function(img, preloaded) {
		
		// if the image is already wrapped, remove the wrap and sister-bw image
		if ($(img).parent().hasClass('bw-wrap')) {
			$(img).siblings().remove();
			$(img).unwrap();
		}

		// first create a wrapper (and cache for later use)
		var imgWrap = wrapImg(img);
		greyscaleImageCache.push(imgWrap);


		// if the greyscale image has already been preloaded?
		if (preloaded) {

			var greyImg = createGreyscaleImage(imgData);
			embedGreyscaleImage(greyImg, imgWrap);

			if (isGreyscale) {
				showLoader(imgWrap);
				showGreyscaleImage(imgWrap);
			}
			
		// greyscale image isn't preloaded, create it
		} else {

			// condition : check if image is from this domain?
			try {
			
				// 
				var greyImg = createGreyscaleImage(img);
				embedGreyscaleImage(greyImg, imgWrap);

				if (isGreyscale) {
					showLoader(imgWrap);
					showGreyscaleImage(imgWrap);
				}

			// image is on another domain, get it's image data remotely
			} catch (e) {

				try {
			
					$.getImageData({
						url: img.src,
						success: function(image){

							var greyImg = createGreyscaleImage(image);
							embedGreyscaleImage(greyImg, imgWrap);
						
							if (isGreyscale) {
								showLoader(imgWrap);
								showGreyscaleImage(imgWrap);
							}
						},

						error: function(xhr, text_status){
							console.log('ERROR: ' + text_status);
						}
					});
				} catch (e2) {
				
				}
			}
		}
	};
	
	
	/*
	 * Wrap both images in a parent wrapper, to allow one to be 
	 * overlaid directly on top of the other
	 */
	var wrapImg = function(img) {
		// 
		$(img)
			.addClass('original')
			.wrap('<span class="bw-wrap" />');
			
		$wrap = $(img).parent();
		$wrap.height($(img).height());
		
		return $wrap;
	};
	
	
	/*
	 * show loading icon
	 */
	var showLoader = function(imgWrap) {
		var loader = $(imgWrap).find('span.loader');
		
		if (loader.length < 1) {
			loader = $("<span/>").attr('class', 'loader').prependTo(imgWrap).css({height:$(imgWrap).height()});
		}
	};
	
	
	/*
	 * hide loading icon
	 */
	var hideLoader = function(imgWrap) {
		var loader = $(imgWrap).find('span.loader');
		
		if (loader.length > 0) {
			loader.animate({opacity:0}, 250);
		}
	};
	

	/*
	 * create greyscale image
	 */
	var createGreyscaleImage = function(imgObj) {
		
		var canvas = document.createElement('canvas');

		var canvasContext = canvas.getContext('2d');

		var imgW = imgObj.width;
		var imgH = imgObj.height;
		canvas.width = imgW;
		canvas.height = imgH;
		canvasContext.drawImage(imgObj, 0, 0);

		var imgPixels = canvasContext.getImageData(0, 0, imgW, imgH);

		for(var y = 0; y < imgPixels.height; y++){
			 for(var x = 0; x < imgPixels.width; x++){
					var i = (y * 4) * imgPixels.width + x * 4;
					var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
					imgPixels.data[i] = avg;
					imgPixels.data[i + 1] = avg;
					imgPixels.data[i + 2] = avg;
			 }
		}
		
		canvasContext.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);

		return canvas.toDataURL();
	};
	

	/*
	 * insert greyscale image into the page
	 */
	var embedGreyscaleImage = function(imgsrc, imgWrap) {
		var img = $("<img />")
			.attr('src', imgsrc)
			.attr('class', 'bw');
			imgWrap.append(img);
			
			if (!isGreyscale) {
				$(img).css({opacity:0});
			}
	};
	
	
	// expose methods
	return {
		hideGreyscaleImages: hideGreyscaleImages,
		showGreyscaleImages: showGreyscaleImages,
		addGreyscaleImage: addGreyscaleImage,
		preloadGreyscaleImage: preloadGreyscaleImage
	};
}();