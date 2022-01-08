let liAttributes = [
	'class',
	'role'
];

let liValues = [
	'nav-item',
	'presentation'
];

let buttonAttributes = [
	'class',
	'id',
	'data-bs-toggle',
	'data-bs-target',
	'type',
	'role',
	'aria-controls',
	'aria-selected'
];

let tabTotalCount = 3;

//tabのHTML
let createTab = (object, attributes, values) => {
	attributes.forEach((attribute, index) => {
		object.setAttribute(attribute, values[index]);
	});
	return object;
}

$(function() {
	let objUl = document.getElementById('myTab');

	for (let i = 0; i < tabTotalCount; i++) {
		let objLi = document.createElement('li');
		let objLiCount = i + 1;
		let objButton = document.createElement('button');

		let buttonValues = [
			'nav-link', 
			'memo' + objLiCount + '-tab',
			'tab',
			'#memo' + objLiCount,
			'button',
			'tab',
			'memo' + objLiCount,
			'false'
		];

		objLi = createTab(objLi, liAttributes, liValues);
		objButton = createTab(objButton, buttonAttributes, buttonValues);
		objButton.innerHTML = 'memo' + objLiCount;
		
		objUl.appendChild(objLi);
		objLi.appendChild(objButton);
	}

	$('#tabButton').on('click', function() {
		let objLi = document.createElement('li');
		let objLiCount = objUl.childElementCount + 1;
		let objButton = document.createElement('button');
		
		let buttonValues = [
			'nav-link', 
			'memo' + objLiCount + '-tab',
			'tab',
			'#memo' + objLiCount,
			'button',
			'tab',
			'memo' + objLiCount,
			'false'
		];

		objLi = createTab(objLi, liAttributes, liValues);
		objButton = createTab(objButton, buttonAttributes, buttonValues);
		
		objButton.innerHTML = 'memo' + objLiCount;
		
		objUl.appendChild(objLi);
		objLi.appendChild(objButton);
	});
});