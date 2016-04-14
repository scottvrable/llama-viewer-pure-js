(function() {
	// remove no JS warning
	document.documentElement.className = document.documentElement.className.replace("no-js", "js");

	// creating some elements
	var Loader         = createLoader(),
	    availablePages = null,
	    selectedAnimal = "llama",
	    previousAnimal = null;

	// grabbing some elements
	var showMoreBtn = document.getElementById("show-more"),
	   imageDisplay = document.getElementById("image-display");

	// set up loading graphic
	function createLoader() {
		var loadingBG = document.createElement("div");
		var loadingGIF = new Image;
		loadingBG.id = "loading-bg";
		loadingBG.className = "loading-bg";
		loadingGIF.src = "img/loading-gif.gif";
		loadingGIF.className = "loading-gif";
		loadingBG.appendChild(loadingGIF);
		return loadingBG;
	}

	// show or hide Loader functions
	function showLoader() {
		showMoreBtn.setAttribute("disabled", "disabled");
		document.body.appendChild(Loader);
	}
	function removeLoader() {
		showMoreBtn.removeAttribute("disabled");
		document.body.removeChild(Loader);
	}

	// load initial llama pictures
	function initialPageLoad() {
		document.onreadystatechange = function() {
			if(document.readyState === "interactive") {
				var flickrFeed = new Flickr("llama");
			}
		}
	}

	// transition images in
	function attachImageLoadListener(image) {
		var fadeInImage = function() {
			this.parentNode.parentNode.className = "show";
			image.removeEventListener("load", fadeInImage);
		}
		image.addEventListener("load", fadeInImage);
	}

	// construct image frames
	function buildPhotoUrl(photo, thumbnail) {
		var sizeCharacter = thumbnail ? "_q" : "";
		var url = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + sizeCharacter + ".jpg";
		return url;
	}
	function buildPhoto(photo) {
		var li = document.createElement("li");
		var frame = document.createElement("div");
		var thumbnail = document.createElement("img");
		frame.className = "photo-frame";
		thumbnail.className = "thumbnail";
		thumbnail.src = buildPhotoUrl(photo, true);
		thumbnail.alt = photo.title;
		thumbnail.setAttribute("data-photosrc", buildPhotoUrl(photo, false));
		attachImageLoadListener(thumbnail);
		frame.appendChild(thumbnail);
		li.appendChild(frame);
		return li;
	}
	function buildGallery(photos) {
		var ul = document.createElement("ul");
		ul.id = "photo-list";
		for(var i = 0; i < photos.length; i++) {
			ul.appendChild(buildPhoto(photos[i]));
		}
		imageDisplay.appendChild(ul);
	}

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
			this.getJSON();
		},
		getJSON: function() {
			showLoader();
			var queryScript = document.createElement("script");
			var src = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + this.api_key + "&tags=" + this.animal + "&format=json&content_type=1&per_page=24&safe_search=1&page=" + this.pageNum + "&jsoncallback=getPhotos";
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
			var photoArray = data.photos.photo;
			buildGallery(photoArray);
			removeLoader();
		}
	};

	initialPageLoad();

})();
