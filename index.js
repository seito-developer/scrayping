const rp = require('request-promise');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const jsonfile = require('jsonfile');

const KEYWORD = 'ポケモン';
const TARGET_URL = 'https://www.famitsu.com/search/?category=new-article&page=';
let pageCount = 1;
let articleArray = [];

const PAGES_LEN = 20;

const file = './public/data.json';


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

		if(obj.title.indexOf(KEYWORD) !== -1){
			articleArray.push(obj);
		}
  		index++;
  	}
};

const foo = () => {
	console.log('hi');
	return new Promise((resolve) => {
		while(pageCount < PAGES_LEN){
			rp.get(TARGET_URL + pageCount)
				.then((htmlString) => {
					getData(htmlString);
				})
				.catch((error) => {
			    	console.error('Error:', error);
			  	});
			// crawlPages(pageCount);
			// console.log('articleArray', articleArray);
			pageCount++;
		}
	});
};

const onFulfilled = (value) => {
	console.log('articleArray', value);	
};
// bar();
foo().then(onFulfilled(articleArray));
	