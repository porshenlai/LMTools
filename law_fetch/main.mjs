#!/usr/bin/node

/*
	npm init -y
	npm install node-html-parser
	mkdir -p cache
	node main.mjs 藥師法 藥事法
*/

import { readFileSync, writeFileSync } from 'node:fs';
import { access, constants } from 'fs/promises';
import { parse } from 'node-html-parser';

async function checkFile (filePath) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}

async function load (target) {
	const WDBs={
		"藥事法":"https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=L0030001",
		"藥師法":"https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=L0030066"
	}
	const CacheDB='cache/';
	try {
		// check target is a file or not
		if (await checkFile(CacheDB+target+".html")) {
			const htmlString = readFileSync(CacheDB+target+'.html', 'utf8');
			return htmlString;
		} else if (target in WDBs) {
			const response = await fetch(WDBs[target], {
				method: 'GET',
				headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
					'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
				}
			});
			if (!response.ok) {
	  			throw new Error(`HTTP error! Status: ${response.status}`);
			}
			const htmlString = await response.text();
			console.log('HTML downloaded successfully!');
			writeFileSync(CacheDB+target+'.html', htmlString, 'utf8');
			return htmlString;
		} else {
			console.error('未知目標，合法的目標有:'+Object.keys(WDBs).join(','));
		}
	} catch (error) {
		console.error('Error reading file:', error.message);
	}
	return '<div>Error</div>';
}

function extract (html) {
	try {
		const root = parse(html);
		console.log(root.querySelector('.law-reg-content').text);
	} catch (error) {
		console.error('Error reading file:', error.message);
	}
}

const target = "藥師法";
for (let i=2;i<process.argv.length;i++) {
	extract(await load(process.argv[i]));
}

