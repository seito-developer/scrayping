const rp = require('request-promise');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const KEYWORD = 'ポケモン';
const TARGET_URL = 'https://www.famitsu.com/search/?category=new-article&page=';
let pageCount = 1;
let articleArray = [];

const getData = new Promise((htmlString, callback) => {
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

		if(obj.title.indexOf(KEYWORD) !== -1){
			articleArray.push(obj);
		}	  		
  		
  		index++;
  	}

  	
  		callback();
  		
});

getData.then(() => {
	if(pageCount < 10){
		pageCount++;
		getData
	} else {
		console.log(articleArray);
	}
});

const crawlPages = (url) => {
	rp.get(url)
		.then((htmlString) => {
			getData(htmlString, url);
		})
		.catch((error) => {
	    	console.error('Error:', error);
	  	});
};

crawlPages(TARGET_URL + pageCount);



