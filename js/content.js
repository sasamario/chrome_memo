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

let objUl = document.getElementById('my_tab');
let tabTotalCount = 3;
let activeTab = 'memo1';
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
	chrome.storage.local.get(['tabTotalCount', 'activeTab'], function(result) {
		if (result['tabTotalCount'] !== undefined) {
			tabTotalCount =  result['tabTotalCount'];
		}

		//最後にactiveだったtabを取得
		if (result['activeTab'] !== undefined) {
			activeTab = result['activeTab']
		}

		for (let i = 0; i < tabTotalCount; i++) {
			let objLi = document.createElement('li');
			let objLiCount = i + 1;
			let objButton = document.createElement('button');
			let objTabId = 'memo' + objLiCount;
	
			//最後にactiveだったtab情報がある場合、そのtabをactiveにする
			if (objTabId == activeTab) {
				buttonAttributes['class'] = 'nav-link active';
				let tabId = 'memo' + objLiCount;
				chrome.storage.local.get(tabId, function(result) {
					$('#memo_area').val(result[tabId]);
				});
			} else {
				buttonAttributes['class'] = 'nav-link';
			}
			//tabの各属性値にメモ番号を付与する
			buttonAttributes['id'] = objTabId;
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
	$('#add').on('click', function() {
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
	$('#my_tab').on('click', '.nav-link', function() {
		//どのtabかの情報を取得
		let tabId = $(this).attr('id');

		//tab選択時に該当するメモをテキストエリアに反映させる
		chrome.storage.local.get(tabId, function(result) {
			$('#memo_area').val(result[tabId]);

			//textaraのカウント数を反映
			// reflectCount();
		});

		//activeTabの番号をstorageにセット
		setObj['activeTab'] = tabId
		chrome.storage.local.set(setObj, function(){});
	});

	//メモ保存処理
	$('#memo_area').keyup(function() {
		saveMemo();
	});

	$('#memo_area').blur(function() {
		saveMemo();
	});

	//ダウンロード処理
	$('#download').on('click', function() {
		let fileName = ''
		let memo = $('#memo_area').val();
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

	//メモ保存処理
	let saveMemo = () => {
		//保存処理
		let tabId = $('.active').attr('id');
		setObj[tabId] = $('#memo_area').val();
		chrome.storage.local.set(setObj, function(){});

		//保存メッセージ表示・非表示処理
		$('#memo_name').text(tabId);
		if ($('#save_message').css('display') === 'none') {
			$('#save_message').fadeIn(1000).css('display', 'block');
			$('#save_message').fadeOut(2000);
		}
	}
});