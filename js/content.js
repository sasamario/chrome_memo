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

const objUl = document.getElementById('my_tab');
// const memoArea = document.getElementById('memo_area');
// const memoAreaConfig = {
// 	characterData: true
// }

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

$(function() {
	chrome.storage.local.get(['tabTotalCount', 'activeTab', 'widthOption', 'heightOption'], function(result) {
		if (result['tabTotalCount'] !== undefined) {
			tabTotalCount =  result['tabTotalCount'];
		}

		//最後にactiveだったtabを取得
		if (result['activeTab'] !== undefined) {
			activeTab = result['activeTab'];
		}

		//設定サイズの反映
		if (result['widthOption'] !== undefined) {
			$('body').css('width', result['widthOption']);
			$('#size_input').val(result['widthOption']);
		}

		if (result['heightOption'] !== undefined) {
			$('#memo_area').css('height', result['heightOption']);
		}

		//tab生成
		loopGenerateTab(tabTotalCount, activeTab);
	});

	//tab追加
	$('#add').on('click', function() {
		let objLi = document.createElement('li');
		let objLiCount = objUl.childElementCount + 1;
		let objButton = document.createElement('button');

		if (objLiCount > 10) {
			alert('メモは最大10個までです');
			return;
		}

		let newTabId = 'memo' + objLiCount;
		
		buttonAttributes['id'] = newTabId;
		buttonAttributes['data-bs-target'] = '#memo' + objLiCount;
		buttonAttributes['aria-controls'] = 'memo' + objLiCount;

		objLi = createTab(objLi, liAttributes);
		objButton = createTab(objButton, buttonAttributes);
		
		objButton.innerHTML = objLiCount;
		
		objUl.appendChild(objLi);
		objLi.appendChild(objButton);

		//現在のtabからactiveクラスを取り除き、新しく追加したtabにactiveクラスを追加
		$('.active').removeClass('active');
		$(`#${newTabId}`).addClass('active');
		$('#memo_area').val('');
		getCount();

		//tabの数をlocalstorageに格納する
		setObj['tabTotalCount'] = objLiCount;
		setObj['activeTab'] = newTabId;
		chrome.storage.local.set(setObj, function(){});
	});

	//動的に追加した要素に対してもclickイベントを発火
	$('#my_tab').on('click', '.nav-link', function() {
		//どのtabかの情報を取得
		let tabId = $(this).attr('id');

		//tab選択時に該当するメモをテキストエリアに反映させる
		chrome.storage.local.get(tabId, function(result) {
			$('#memo_area').val(result[tabId]);

			//カウント数を反映させる
			getCount();
		});

		//activeTabの番号をstorageにセット
		setObj['activeTab'] = tabId
		chrome.storage.local.set(setObj, function(){});
	});

	//メモ保存処理
	$('#memo_area').keyup(function() {
		saveMemo();
		getCount();
	});

	// $('#memo_area').change(function() {
	// 	console.log("変更検知");
	// });

	// let observer = new MutationObserver(function() {
	// 	saveMemo();
	// 	getCount();
	// 	console.log('変更検知');
	// });
	// observer.observe(memoArea, memoAreaConfig);

	$('#memo_area').blur(function() {
		saveMemo();
		setObj['heightOption'] = $('#memo_area').css('height');
		chrome.storage.local.set(setObj, function(){});
	});

	$('#delete').on('click', function() {
		//一番後ろのtab番号を取得する
		let objLiCount = objUl.childElementCount;
		let deleteTabId = 'memo' + objLiCount;

		//memoが3つしかない場合、削除はしない
		if (objLiCount === 3) {
			alert('これ以上は削除できません');
			return '';
		}

		//確認ダイアログ
		let deleteConfirm = window.confirm(deleteTabId + 'を削除しますか？');

		//確認ダイアログで削除するを選択した場合、一番後ろのメモを削除する
		if (deleteConfirm) {
			//削除処理(空値をセット)
			setObj[deleteTabId] = '';
			chrome.storage.local.set(setObj, function(){});

			//現状のタブ要素の削除(emptyで対象の子要素を削除)
			$('#my_tab').empty();

			//tab再描画 TODO:リファクタリング可能であればする
			chrome.storage.local.get('tabTotalCount', function(result) {
				if (result['tabTotalCount'] !== undefined) {
					//ここで取得した値がおかしかった　削除時に何故か2つ一気に削除されている原因？
					tabTotalCount =  result['tabTotalCount'];
					if (tabTotalCount > 3) {
						tabTotalCount--;
					}
				} else {
					tabTotalCount = 3;
				}
		
				//削除後は必ずmemo1をactiveにする
				activeTab = 'memo1';

				loopGenerateTab(tabTotalCount, activeTab);

				//tabの数更新
				setObj['tabTotalCount'] = tabTotalCount;
				chrome.storage.local.set(setObj, function(){});

				//activeTabの番号をstorageにセット
				setObj['activeTab'] = activeTab;
				chrome.storage.local.set(setObj, function(){});
			});
		}
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

	//resize
	$('#size_input').on('change', function() {
		$('body').css('width', $(this).val());
		setObj['widthOption'] = $(this).val();
		//ここでtextareaの高さ値も保存する
		setObj['heightOption'] = $('#memo_area').css('height');
		chrome.storage.local.set(setObj, function(){});
	});

	//option遷移処理
	$('#option').on('click', function() {
		window.location.href = 'option.html';
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

	//カウント処理（拡張機能起動時、keyup時、タブ切り替え時に実行する）
	function getCount() {
		let count = 0;
		//textareaを取得
		let memo = $('#memo_area').val();

		//取得情報を元に文字数をカウント
		for (let i = 0; i < memo.length; i++) {
			count++;
		}

		//画面上に反映
		$('#count').text(count);
	}

	//tabをループで生成する処理
	function loopGenerateTab(tabTotalCount, activeTab = '') {
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
					//カウント数を反映させる
					getCount();
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
	}
});