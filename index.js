const rp = require('request-promise');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const jsonfile = require('jsonfile');

const OUTPUT = './public/data.json';
const KEYWORD = 'ポケモン';
const TARGET_URL = 'https://www.famitsu.com/search/?category=new-article&page=';
const PAGES_LEN = 20;
let pageCount = 1;
let articleArray = [];

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


const createList = (count) => {
	rp.get(TARGET_URL + pageCount)
		.then((htmlString) => {
			getData(htmlString);
			if(pageCount < PAGES_LEN){
				pageCount++;
				createList(pageCount);
			} else {
				console.log('articleArray', articleArray);
			}
		});
};
createList(pageCount);