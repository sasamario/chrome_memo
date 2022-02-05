const initialWidth = 400;
const LANGUAGE = {
	'japanese': {
		'page_title': '設定画面',
		'lang_title': '言語',
		'lang_ja': '日本語',
		'lang_en': '英語',
		'home': 'ホーム',
		'save': '保存',
		'reset': '初期化',
		'reset_confirm': '初期化しますか？\n※メモも削除されます',
		'save_alert': '設定が保存されました'
	},
	'english': {
		'page_title': 'OptionPage',
		'lang_title': 'Language',
		'lang_ja': 'Japanese',
		'lang_en': 'English',
		'home': 'home',
		'save': 'save',
		'reset': 'reset',
		'reset_confirm': 'Do you want to initialize？\n※The memo will also be deleted',
		'save_alert': 'The settings have been saved'
	}
}
let language = 'english';

$(function() {
	//設定画面起動時に、storageの値をスライダーに反映
	chrome.storage.local.get(['widthOption', 'langOption'], function(result) {
		if (result['widthOption'] !== undefined) {
			$('#size_input').val(result['widthOption']);
			$('#size_value').html(result['widthOption']);
		}
		language = (result['langOption'] === undefined) ? 'english' : result['langOption'];
		reflectLangOption(LANGUAGE[language]);

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
		let deleteConfirm = window.confirm(LANGUAGE[language]['reset_confirm']);

		if (deleteConfirm) {
			//localstorageの初期化
			chrome.storage.local.clear();

			//設定画面の入力欄部分の初期化
			$('#size_input').val(initialWidth);
			$('#size_value').html(initialWidth);
		}
	});

	//設定保存処理
	$('#option_save').on('click', function() {
		let setObj = {};
		let languages = $('input[name="lang"]');
		//設定変更前の言語を格納
		let beforeLanguage = language;

		//ラジオボタンから値を取得
		for (let i = 0; i < languages.length; i++) {
			if (languages[i].checked) {
				language = languages[i].value;
				break;
			}
		}

		//設定値をlocalStorageに保存
		setObj['widthOption'] = $('#size_input').val();
		setObj['langOption'] = language;
		chrome.storage.local.set(setObj, function(){});
		alert(LANGUAGE[beforeLanguage]['save_alert']);

		//言語設定反映
		reflectLangOption(LANGUAGE[language]);
	});

	//home画面に遷移
	$('#home').on('click', function() {
		window.location.href = 'index.html';
	});

	//言語設定反映
	function reflectLangOption(Option) {
		$('#page_title').text(Option['page_title']);
		$('#lang_title').text(Option['lang_title']);
		$('#text_ja').text(Option['lang_ja']);
		$('#text_en').text(Option['lang_en']);
		$('#home .icon-text').text(Option['home']);
		$('#option_save .icon-text').text(Option['save']);
		$('#option_reset .icon-text').text(Option['reset']);
	}
});