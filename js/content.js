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

//tabの属性値セット処理
let createTab = (object, attributes) => {
	//Object.keysで連想配列のkeyのみの配列を作成し、それに対してforEachを行なっている
	Object.keys(attributes).forEach(key => {
		object.setAttribute(key, attributes[key]);
	});

	return object;
}

$(function() {
	for (let i = 0; i < tabTotalCount; i++) {
		let objLi = document.createElement('li');
		let objLiCount = i + 1;
		let objButton = document.createElement('button');

		//最初のタブをactive状態にする
		if (i == 0) {
			buttonAttributes['class'] = 'nav-link active';
		} else {
			buttonAttributes['class'] = 'nav-link';
		}
		//tabの各属性値にメモ番号を付与する
		buttonAttributes['id'] = 'memo' + objLiCount;
		buttonAttributes['data-bs-target'] = '#memo' + objLiCount;
		buttonAttributes['aria-controls'] = 'memo' + objLiCount;

		objLi = createTab(objLi, liAttributes);
		objButton = createTab(objButton, buttonAttributes);
		objButton.innerHTML = 'memo' + objLiCount;
		
		objUl.appendChild(objLi);
		objLi.appendChild(objButton);
	}

	//タブ追加ボタン（仮）
	$('#tabButton').on('click', function() {
		let objLi = document.createElement('li');
		let objLiCount = objUl.childElementCount + 1;
		let objButton = document.createElement('button');
		
		buttonAttributes['id'] = 'memo' + objLiCount;
		buttonAttributes['data-bs-target'] = '#memo' + objLiCount;
		buttonAttributes['aria-controls'] = 'memo' + objLiCount;


		objLi = createTab(objLi, liAttributes);
		objButton = createTab(objButton, buttonAttributes);
		
		objButton.innerHTML = 'memo' + objLiCount;
		
		objUl.appendChild(objLi);
		objLi.appendChild(objButton);
	});

	//動的に追加した要素に対してもclickイベントを発火させる
	$('#myTab').on('click', '.nav-link', function() {
		//どのtabかの情報を取得する
		let tabId = $(this).attr('id');

		chrome.storage.local.get(tabId, function(result) {
			$('#memoArea').val(result.tabId); //result.tabIdはない場合undefinedになる

			//textaraのカウント数を反映
			// reflectCount();
		});
	});

	//keyup処理 keyupの都度保存するようにする？
	$('#memoArea').keyup(function() {
		let tabId = $('.active').attr('id');
		chrome.storage.local.set({tabId: $('#memoArea').val()}, function(){});
	});
});