---
layout: default
title: Getting Started
---

Let's start by setting up a new Framework seed project and creating the files for our application.

## Download & Install

First, we'll need to clone and install the seed project:

	$ git clone https://github.com/Famous/framework-seed
	$ cd framework
	$ npm install  
	

Once everything is installed, create a new folder within the components folder and name it `lessons`. Then add three files named `apple-tvjs`, `apple-tv.html`, and `galleryData.js` so your folder structure looks similar to this:
    
     framework
	    ├── ...
	    └── components/
	        └── lessons/
	            └── apple-tv.html
	            └── apple-tv.js
	            └── galleryData.js

To do this from the command line, you can type:

    $ cd components
    $ mkdir lessons
    $ cd lessons
    $ touch apple-tv.js
    $ touch apple-tv.html 
    $ touch galleryData.js

For this lesson, the `apple-tv.js`  file will contain our entire [Framework component](#) and `apple-tv.html` will contain our [Tree](#).

Open the project up in your favorite text editor before moving on to the next step. 

<span class="cta">
[Up next: Structuring an app &raquo;](./structuring-an-app.md)
</span>

