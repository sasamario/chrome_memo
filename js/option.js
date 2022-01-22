$(function() {
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

	$('#option_save').on('click', function() {
		let setObj = {};
		setObj['sizeOption'] = $('#size_input').val();
		chrome.storage.local.set(setObj, function(){});
	});
});