const liAttributes = [
	'class',
	'role'
];

const liValues = [
	'nav-item',
	'presentation'
];

const buttonAttributes = [
	'class',
	'id',
	'data-bs-toggle',
	'data-bs-target',
	'type',
	'role',
	'aria-controls',
	'aria-selected'
];

let buttonValues = [];

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

		buttonValues = [
			'nav-link', 
			'memo' + objLiCount + '-tab',
			'tab',
			'#memo' + objLiCount,
			'button',
			'tab',
			'memo' + objLiCount,
			'false'
		];

		if (i == 0) {
			buttonValues[0] = 'nav-link active';
		}

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
		
		buttonValues = [
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