const liAttributes = {
	'class': 'nav-item',
	'role': 'presentation'
};

let buttonAttributes = {
	'class': 'nav-link', 
	'id': 'memo', //後ほどメモ番号を追加する
	'data-bs-toggle': 'tab',
	'data-bs-target': '#memo', //後ほどメモ番号を追加する
	'type': 'button',
	'role': 'tab',
	'aria-controls': 'memo', //後ほどメモ番号を追加する
	'aria-selected': 'false'
};

let objUl = document.getElementById('myTab');
let tabTotalCount = 3;
let setObj = {};

//tabの属性値セット処理
let createTab = (object, attributes) => {
	//Object.keysで連想配列のkeyのみの配列を作成し、それに対してforEachを行なっている
	Object.keys(attributes).forEach(key => {
		object.setAttribute(key, attributes[key]);
	});

	return object;
}

// let getDateTime = () => {
// 	let date = new Date();
// 	let year = date.getFullYear();
// 	let month = date.getMonth() + 1;
// 	let day = date.getDate();
// 	let hour = date.getHours();
// 	let min = date.getMinutes();
// 	let sec = date.getSeconds();
// 	let result = `${year}${month}${day}${hour}${min}${sec}`;

// 	return result;
// }

$(function() {
	chrome.storage.local.get('tabTotalCount', function(result) {
		if (result['tabTotalCount'] !== undefined) {
			tabTotalCount =  result['tabTotalCount'];
		}

		for (let i = 0; i < tabTotalCount; i++) {
			let objLi = document.createElement('li');
			let objLiCount = i + 1;
			let objButton = document.createElement('button');
	
			//最初のタブをactive状態にする
			if (i == 0) {
				buttonAttributes['class'] = 'nav-link active';
				let tabId = 'memo' + objLiCount;
				chrome.storage.local.get(tabId, function(result) {
					$('#memoArea').val(result[tabId]);
				});
			} else {
				buttonAttributes['class'] = 'nav-link';
			}
			//tabの各属性値にメモ番号を付与する
			buttonAttributes['id'] = 'memo' + objLiCount;
			buttonAttributes['data-bs-target'] = '#memo' + objLiCount;
			buttonAttributes['aria-controls'] = 'memo' + objLiCount;
	
			objLi = createTab(objLi, liAttributes);
			objButton = createTab(objButton, buttonAttributes);
			objButton.innerHTML = objLiCount;
			
			objUl.appendChild(objLi);
			objLi.appendChild(objButton);
		}
	});

	

	//タブ追加ボタン（仮）
	$('#tabButton').on('click', function() {
		let objLi = document.createElement('li');
		let objLiCount = objUl.childElementCount + 1;
		let objButton = document.createElement('button');

		if (objLiCount >= 10) {
			alert('メモは最大10個までです');
			return;
		}
		
		buttonAttributes['id'] = 'memo' + objLiCount;
		buttonAttributes['data-bs-target'] = '#memo' + objLiCount;
		buttonAttributes['aria-controls'] = 'memo' + objLiCount;

		objLi = createTab(objLi, liAttributes);
		objButton = createTab(objButton, buttonAttributes);
		
		objButton.innerHTML = objLiCount;
		
		objUl.appendChild(objLi);
		objLi.appendChild(objButton);

		//tabの数をlocalstorageに格納する
		setObj['tabTotalCount'] = objLiCount;
		console.log(setObj);
		chrome.storage.local.set(setObj, function(){});
	});

	//動的に追加した要素に対してもclickイベントを発火
	$('#myTab').on('click', '.nav-link', function() {
		//どのtabかの情報を取得
		let tabId = $(this).attr('id');

		//tab選択時に該当するメモをテキストエリアに反映させる
		chrome.storage.local.get(tabId, function(result) {
			$('#memoArea').val(result[tabId]);

			//textaraのカウント数を反映
			// reflectCount();
		});
	});

	//メモ保存処理
	$('#memoArea').keyup(function() {
		let tabId = $('.active').attr('id');
		setObj[tabId] = $('#memoArea').val();
		
		chrome.storage.local.set(setObj, function(){});
	});

	//ダウンロード処理
	$('#download').on('click', function() {
		let fileName = ''
		let memo = $('#memoArea').val();
		let tabId = $('.active').attr('id');

		if (!memo) {
			alert('メモを記載してください');
			return;
		}

		//ファイル名入力ダイアログ
		fileNameInput = window.prompt("ファイル名を入力してください");
		if (fileNameInput == null) {
			return;
		} else if(fileNameInput != '') {
			fileName = fileNameInput + '.txt';
		} else {
			fileName = tabId + '.txt';
		}

		let blob = new Blob([memo], {type: 'text/plain'});

		let downloadLink = document.createElement('a');
		downloadLink.href = URL.createObjectURL(blob);
		console.log(downloadLink);
		downloadLink.download = fileName;
		downloadLink.click();
	});
});