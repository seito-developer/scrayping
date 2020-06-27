const rp = require('request-promise');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const jsonfile = require('jsonfile');

const CONFIG = require('./config.js');

let pageCount = 1;
let articleArray = [];

const updateOutput = (data) => {
	jsonfile.writeFile(CONFIG.OUTPUT, data, (err) => {
	  if(err) {
	    console.log(err);
	  } else {
	    console.log('Created a file');
	  }
	});
};

const getData = (htmlString) => {
	const htmlDom = new JSDOM(htmlString);
	const $title = htmlDom.window.document.getElementsByClassName('card__title');
	const articleLen = $title.length;

 	let index = 0;

  	while(index < articleLen){
  		let $target = $title[index].getElementsByTagName('a')[0];
  		let obj = {
  			title: $target.textContent,
  			url: $target.getAttribute('href')
  		};

		if(obj.title.indexOf(CONFIG.KEYWORD) !== -1){
			articleArray.push(obj);
		}
  		index++;
  	}
};

const createList = (count) => {
	rp.get(CONFIG.TARGET_URL + pageCount)
		.then((htmlString) => {
			getData(htmlString);
			if(pageCount < CONFIG.PAGES_LEN){
				pageCount++;
				createList(pageCount);
			} else {
				updateOutput(articleArray);
				console.log('articleArray', articleArray);
			}
		});
};
createList(pageCount);