const initialWidth = 400;

$(function() {
	//設定画面起動時に、storageの値をスライダーに反映
	chrome.storage.local.get(['widthOption', 'langOption'], function(result) {
		if (result['widthOption'] !== undefined) {
			$('#size_input').val(result['widthOption']);
			$('#size_value').html(result['widthOption']);
		}
		// if (result['langOption'] !== undefined) {
		// 	lang = result['langOption'];
		// }

		if (result['langOption'] === 'japanese') {
			$('#lang_ja').prop('checked', true);
		} else {
			//英語がデフォルト
			$('#lang_en').prop('checked', true);
		}
	});

	//on('input', func)でスライダー操作時もイベント発火
	$('#size_input').on('input', function() {
		$('#size_value').html($(this).val());
	});

	$('#option_reset').on('click', function() {
		let deleteConfirm = window.confirm('設定を初期化しますか？');

		if (deleteConfirm) {
			//localstorageの初期化
			chrome.storage.local.clear();

			//設定画面の入力欄部分の初期化
			$('#size_input').val(initialWidth);
			$('#size_value').html(initialWidth);
		}
	});

	$('#option_save').on('click', function() {
		let setObj = {};
		let language = 'english';
		let languages = $('input[name="lang"]');

		//ラジオボタンから値を取得
		for (let i = 0; i < languages.length; i++) {
			if (languages[i].checked) {
				language = languages[i].value;
				break;
			}
		}

		setObj['widthOption'] = $('#size_input').val();
		setObj['langOption'] = language;
		chrome.storage.local.set(setObj, function(){});
	});
});