(function() {
	// remove no JS warning
	document.documentElement.className = document.documentElement.className.replace("no-js", "js");

	// grabbing some elements
	var showMoreBtn = document.getElementById("show-more");

	// set up loading graphic
	var Loader = new createLoader();
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

	function showLoader() {
		showMoreBtn.setAttribute("disabled", "disabled");
		document.body.appendChild(Loader);
	}

	function initialPageLoad() {
		document.onreadystatechange = function() {
			if(document.readyState === "complete") {
				showLoader();
			}
		}
	}
	initialPageLoad();

})();
