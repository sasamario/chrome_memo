$(function() {
	const initialWidth = 400;

	//設定画面起動時に、storageの値をスライダーに反映
	chrome.storage.local.get('sizeOption', function(result) {
		if (result['sizeOption'] !== undefined) {
			$('#size_input').val(result['sizeOption']);
			$('#size_value').html(result['sizeOption']);
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
		setObj['sizeOption'] = $('#size_input').val();
		chrome.storage.local.set(setObj, function(){});
	});
});