(function() {
	// remove no JS warning
	document.documentElement.className = "js";

	// creating some elements
	var Loader           = createLoader(),
	    selectedAnimal   = "llama",
	    bigPhotoList     = null,
	    lightboxBG       = createLightboxFrame()
	    displayPhoto     = new Image();

	// grabbing some elements
	var win   			  = window,
			showMoreBtn   = document.getElementById("show-more"),
	  	imageDisplay  = document.getElementById("image-display"),
	   	fakeCell      = lightboxBG.querySelector("#fake-cell"),
	   	photoFrame    = lightboxBG.querySelector("#photo-frame"),
	   	captionHolder = lightboxBG.querySelector("h2"),
	   	closeButton   = lightboxBG.querySelector("#close-button"),
	   	backButton    = lightboxBG.querySelector("#back-button"),
	   	forwardButton = lightboxBG.querySelector("#forward-button");

	// set up loading graphic
	function createLoader() {
		var loadingBG        = document.createElement("div");
		var loadingGIF       = new Image;
		loadingBG.id         = "loading-bg";
		loadingBG.className  = "loading-bg";
		loadingGIF.src       = "img/loading-gif.gif";
		loadingGIF.className = "loading-gif";
		loadingBG.appendChild(loadingGIF);
		return loadingBG;
	}

	// show or hide Loader functions
	function showLoader() {
		showMoreBtn.setAttribute("disabled", "true");
		document.body.appendChild(Loader);
	}
	function removeLoader() {
		if(document.getElementById("loading-bg")) {
			document.body.removeChild(Loader);
			showMoreBtn.removeAttribute("disabled");
		}
	}

	function clearLightbox() {
		photoFrame.removeChild(displayPhoto);
	}

	function createLightboxFrame() {
		var lightboxBG       = document.createElement("div");
		var fakeTable        = document.createElement("div");
		var fakeRow          = document.createElement("div");
		var fakeCell         = document.createElement("div");
		var photoFrame       = document.createElement("div");
		var captionHolder    = document.createElement("h2");
		var closeButton      = document.createElement("div");
		var backButton       = document.createElement("div");
		var forwardButton    = document.createElement("div");
		var sprite           = new Image();
		lightboxBG.id        = "lightbox-bg";
		lightboxBG.className = "lightbox-bg";
		fakeTable.className  = "fake-table";
		fakeRow.className    = "fake-row";
		fakeCell.className   = "fake-cell";
		fakeCell.id          = "fake-cell";
		sprite.src           = "img/button-sprite.png";
		closeButton.id       = closeButton.className = "close-button";
		backButton.id        = backButton.className = "back-button";
		forwardButton.id     = forwardButton.className = "forward-button";
		photoFrame.className = photoFrame.id = "photo-frame";
		photoFrame.appendChild(captionHolder);
		fakeCell.appendChild(photoFrame);
		fakeRow.appendChild(fakeCell);
		fakeTable.appendChild(fakeRow);
		lightboxBG.appendChild(fakeTable);
		lightboxBG.appendChild(closeButton);
		lightboxBG.appendChild(backButton);
		lightboxBG.appendChild(forwardButton);
		closeButton.addEventListener("click", function() {
			document.body.removeChild(lightboxBG);
			photoFrame.className = "photo-frame";
			clearLightbox();
		});
		return lightboxBG;
	}
	function showLightbox(photoIndex) {
		displayPhoto = createLightboxImage(photoIndex);
		setMaxSize(displayPhoto, win.innerHeight, win.innerWidth);
		fakeCell.appendChild(photoFrame);
		document.body.appendChild(lightboxBG);
		setTimeout(function() {
			lightboxBG.className = "lightbox-bg show";
		}, 100);
		showLoader();
	}
	function createLightboxImage(photoIndex) {
		var photoObject   = bigPhotoList[photoIndex];
		var caption       = document.createTextNode(photoObject.title);
		displayPhoto.alt = photoObject.title;
		displayPhoto.src = photoObject.url;
		displayPhoto.id  = displayPhoto.className = "featured-photo";
		photoFrame.appendChild(displayPhoto);
		captionHolder.appendChild(caption);
		fadeInDisplayImage(displayPhoto);
		return displayPhoto;
	}
	function setMaxSize(image, windowHeight, windowWidth) {
		image.style.maxHeight = ((windowHeight - 30) + "px");
		image.style.maxWidth  = ((windowWidth - 30) + "px");
	}
	function fadeInDisplayImage(image) {
		var fadeIn = function() {
			this.parentNode.className = "photo-frame show";
			image.removeEventListener("load", fadeIn);
			removeLoader();
		}
		image.addEventListener("load", fadeIn);
	}
	window.onresize = function() {
		if(displayPhoto) {
			setMaxSize(displayPhoto, win.innerHeight, win.innerWidth);
		}
	}

	// load initial llama pictures
	function initialPageLoad() {
		document.onreadystatechange = function() {
			if(document.readyState === "interactive") {
				var flickrQuery = new Flickr("llama", 1);
			}
		}
	}

	// transition images in
	function attachImageLoadListener(image) {
		var fadeInImage = function() {
			this.parentNode.parentNode.className = "show";
			this.parentNode.addEventListener("click", function() {
				showLightbox(image.getAttribute("data-index"));
			});
			image.removeEventListener("load", fadeInImage);
		}
		image.addEventListener("load", fadeInImage);
	}

	// construct image frames
	function buildPhotoUrl(photo, thumbnail) {
		var sizeCharacter = thumbnail ? "q" : "c";
		var url = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_" + sizeCharacter + ".jpg";
		return url;
	}
	function buildPhoto(photo, index) {
		var li = document.createElement("li");
		var frame = document.createElement("div");
		var thumbnail = document.createElement("img");
		frame.className = "photo-frame";
		thumbnail.className = "thumbnail";
		thumbnail.src = buildPhotoUrl(photo, true);
		thumbnail.alt = photo.title;
		thumbnail.setAttribute("data-index", index);
		attachImageLoadListener(thumbnail);
		frame.appendChild(thumbnail);
		li.appendChild(frame);
		return li;
	}
	function buildGallery(photos) {
		var ul = document.createElement("ul");
		ul.id = "photo-list";
		for(var i = 0; i < photos.length; i++) {
			ul.appendChild(buildPhoto(photos[i], i));
			bigPhotoList.push({
				url: buildPhotoUrl(photos[i], false),
				title: photos[i].title
			});
		}
		imageDisplay.appendChild(ul);
	}

	function selectRandomNum(topNum) {
		return Math.ceil(Math.random() * topNum);
	}

	// show more button functionality
	showMoreBtn.addEventListener("click", function(e) {
		var numOfPages = Number(showMoreBtn.getAttribute("data-pages"));
		var randomPageNum = (numOfPages > 1) ? selectRandomNum(showMoreBtn.getAttribute("data-pages")) : 1;
		var flickrQuery = new Flickr(selectedAnimal, randomPageNum);
	});

	// Flickr query setup
	function Flickr(animal, pageNum) {
		this.initialize(animal, pageNum);
	}
	Flickr.prototype = {
		initialize: function(animal, pageNum) {
			this.removePreviousScript();
			this.clearViewer();
			this.api_key = "9874b5ae39cf7e7517ccaa37d29c262a";
			this.animal = animal;
			this.pageNum = pageNum;
			window.getPhotos = this.getPhotos;
			bigPhotoList = [];
			this.getJSON();
		},
		getJSON: function() {
			showLoader();
			var queryScript = document.createElement("script");
			var src = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + this.api_key + "&tags=" + this.animal + "&format=json&sort=relevance&content_type=1&per_page=24&safe_search=1&page=" + this.pageNum + "&jsoncallback=getPhotos";
			queryScript.src = src;
			queryScript.id = "flickrScript";
			document.body.appendChild(queryScript);
		},
		removePreviousScript: function() {
			var oldScript = document.getElementById("flickrScript");
			if(oldScript) {
				document.body.removeChild(oldScript);
			}
		},
		clearViewer: function() {
			imageDisplay.innerHTML = "";
		},
		getPhotos: function(data) {
			if(data.stat === "ok") {
				console.log(data);
				var photoWrapper = data.photos;
				buildGallery(photoWrapper.photo);
				showMoreBtn.setAttribute("data-pages", photoWrapper.pages < 40 ? photoWrapper.page : 40);
			} else {
				var errorPara = document.querySelector(".warning p");
				errorPara.innerHTML = "Sorry, something went wrong. Please try again later.";
				errorPara.parentNode.className = "warning show";
			}
			removeLoader();
			console.log(bigPhotoList);
		}
	};

	initialPageLoad();

})();
