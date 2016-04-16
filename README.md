## [The Amazing Farm Animal Viewer](http://vrab.us/llama-viewer)
### By [Scott Vrable](http://scottvrable.com) / Powered by [Flickr](http://flickr.com)

It's random, but this mobile-first, responsive, single-page app pulls in pictures of various farm animals tagged on Flickr, specifically: **llamas**, **cows**, **chickens**, **horses**, **sheep**, **goats** and **donkeys**. Why farm animals? Because they're slightly more interesting than pictures of what people ordered at a restaurant.

On the initial page load, the app searches for images of llamas and loads the first 24 it finds based on "relevance" as determined by Flickr. (For the record, these images may not necessarily all be llamas. It's hard to control the random tags people put on their images.) The user can click on any of these square thumbnails to see a larger version of the image in a lightbox. The user can then click the left or right arrows to cycle through the images in this gallery. The "X" button in the top right exits out of the lightbox.

#### The "Show Me More" Button

Clicking on this button will choose a random number between 1 and 40 (fewer than that if fewer photo pages of that animal exist), then send a new query to Flickr for that page of results. The gallery will repopulate with new images. I've limited the page query to 40 or under (or less if fewer than 40 pages exist) because it turns out that Flickr has an undocumented "feature" in which it only allow you to have access to approximately the first 1,500 photos in a query even if far more exist in its database. (Thank you, Stack Overflow.)

#### The "Show Me Something Else" Button

If you grow bored of llamas, you can click this button to see other farm animals. The currently selected animal will not appear in the list. Once you choose a new animal, a new query will be sent to Flickr that pulls in the first 24 images of that animal. The title of the page will now change from "The Amazing LLAMA Viewer!" to, for example, "The Amazing CHICKEN Viewer!" The "Show Me More Button" will now say, "Show Me More Chickens!"

#### Final Notes

This application was built with HTML, CSS (using compiled Sass), and vanilla JavaScript. I used Gulp for preprocessing, including CSS prefix appending, Sass compiling, concatenation and minification. No jQuery or any other JavaScript libraries were used. No Bootstrap. The source files are in the **src** directory and the minified output files are in the **build** directory. It has been tested and should reliably work in all the newest versions of Chrome, Firefox, Safari and Internet Explorer.
