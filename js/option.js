const initialWidth = 400;

//言語設定（デフォルトは英語）
let language = 'english';
const LANGUAGE = {
	'japanese': {
		//id名: 表示テキスト
		'page_title': '設定',
		'lang_title': '言語',
		'ja_text': '日本語',
		'en_text': '英語',
		'mode_title': 'ダークモード',
		'home_text': 'ホーム',
		'save_text': '保存',
		'reset_text': '初期化'
	},
	'english': {
		//id名: 表示テキスト
		'page_title': 'Option',
		'lang_title': 'Language',
		'ja_text': 'Japanese',
		'en_text': 'English',
		'mode_title': 'DarkMode',
		'home_text': 'home',
		'save_text': 'save',
		'reset_text': 'reset'
	}
}

//デフォルトモード
let mode = 'normal';

//テーマカラー：ノーマルモード
const NORMAL_MODE = {
	'body': {
		'background-color': '#fff',
		'color': '#212529'
	},
	'.option-wrap': {
		'background-color': '#f2f4f6'
	}
}

//テーマカラー：ダークモード
const DARK_MODE = {
	'body': {
		'background-color': '#23282F',
		'color': '#fff'
	},
	'.option-wrap': {
		'background-color': '#6b778d'
	}
}

//テーマカラー表示用テキスト
const MODE_TEXT = {
	'japanese': {
		'normal': 'デフォルト',
		'dark': 'ダーク'
	},
	'english': {
		'normal': 'Normal',
		'dark': 'Dark'
	}
}

//その他メッセージ（アラート、ダイアログ等）
const OTHER_MESSAGE = {
	'japanese': {
		'reset_confirm': '初期化しますか？\n※メモも削除されます',
		'save_alert': '設定が保存されました'
	},
	'english': {
		'reset_confirm': 'Do you want to initialize？\n※The memo will also be deleted',
		'save_alert': 'The settings have been saved'
	}
}

$(function() {
	//設定画面起動時に、storageの値をスライダーに反映
	chrome.storage.local.get(['widthOption', 'langOption', 'mode'], function(result) {
		language = (result['langOption'] === undefined) ? 'english' : result['langOption'];
		reflectLangOption(LANGUAGE[language]);

		if (result['langOption'] === 'japanese') {
			$('#lang_ja').prop('checked', true);
		} else {
			//英語がデフォルト
			$('#lang_en').prop('checked', true);
		}

		mode = (result['mode'] === undefined) ? 'normal' : result['mode'];

		if (mode === 'dark') {
			reflectMode(DARK_MODE);
			$('input[name="mode"]').prop('checked', true);
		}
		$('#mode_text').text(MODE_TEXT[language][mode]);
	});

	//ラジオボタンによる言語設定反映
	$('input[name="lang"]').on('change', function() {
		let languages = $('input[name="lang"]');
		//ラジオボタンから値を取得
		for (let i = 0; i < languages.length; i++) {
			if (languages[i].checked) {
				language = languages[i].value;
				break;
			}
		}
		//言語設定反映
		reflectLangOption(LANGUAGE[language]);
		$('#mode_text').text(MODE_TEXT[language][mode]);
	});

	//カラーモード変更
	$('input[name="mode"]').click(function() {
		let setObj = {};
		if ($('input[name="mode"]').prop('checked')) {
			reflectMode(DARK_MODE);
			mode = 'dark';
		} else {
			reflectMode(NORMAL_MODE);
			mode = 'normal';
		}
		$('#mode_text').text(MODE_TEXT[language][mode]);
		chrome.storage.local.set(setObj, function(){});
	});

	//初期化処理
	$('#option_reset').on('click', function() {
		let deleteConfirm = window.confirm(OTHER_MESSAGE[language]['reset_confirm']);

		if (deleteConfirm) {
			//localstorageの初期化
			chrome.storage.local.clear();

			//トップに遷移
			window.location.href = 'index.html';
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

		//カラーモード値のセット
		if ($('input[name="mode"]').prop('checked')) {
			setObj['mode'] = 'dark';
		} else {
			setObj['mode'] = 'normal';
		}

		//設定値をlocalStorageに保存
		setObj['widthOption'] = $('#size_input').val();
		setObj['langOption'] = language;
		chrome.storage.local.set(setObj, function(){});
		alert(OTHER_MESSAGE[beforeLanguage]['save_alert']);

		//言語設定反映
		reflectLangOption(LANGUAGE[language]);
	});

	//home画面に遷移
	$('#home').on('click', function() {
		window.location.href = 'index.html';
	});

	//言語設定反映
	function reflectLangOption(Option, Mode) {
		for (key in Option) {
			$(`#${key}`).text(Option[key]);
		}
	}

	//テーマカラー反映処理
	function reflectMode(Mode) {
		for (element in Mode) {
			for (property in Mode[element]) {
				$(element).css(property, Mode[element][property]);
			}
		}
	}
});