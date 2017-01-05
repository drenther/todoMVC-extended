// start at the home page
window.location.hash = '';

// DOM Elements
const todoList = document.querySelector('.todo-list');
const footer = document.querySelector('footer');
const newTodo = document.querySelector('#new-todo');
const toggleAll = document.querySelector('#select-all');
const count = document.querySelector('.todo-count');
const filters = [...document.querySelectorAll('.details .filters a')];
const [all, complit, activ] = filters;

let uniqueCount = 0;
let lastChecked;

function render() {
	if (todoList.querySelectorAll('.todos').length) {
		footer.classList.remove('hidden');
		todoList.classList.remove('hidden');
		toggleAll.classList.remove('hidden');
	} else {
		footer.classList.add('hidden');
		todoList.classList.add('hidden');
		toggleAll.classList.add('hidden');
	}
}

function toggle(toggler) {
	const togglers = [...todoList.querySelectorAll('.todos .toggle')];
	const checked = togglers.filter( x => x.checked );
	if (toggler.checked) {
		toggler.parentElement.classList.remove('active');
		toggler.parentElement.classList.add('completed');
	} else {
		toggler.parentElement.classList.remove('completed');
		toggler.parentElement.classList.add('active');
	}
	if (togglers.length === checked.length) {
		toggleAll.checked = true;
	} else {
		toggleAll.checked = false;
	}
}

render();

newTodo.addEventListener('change', () => {
	const text = newTodo.value;
	
	const todoLi = document.createElement('li');
	todoLi.classList.add('todos', 'active');
	
	const todoToggle = document.createElement('input');
	todoToggle.classList.add('toggle');
	todoToggle.setAttribute('type', 'checkbox');
	todoLi.appendChild(todoToggle);
	
	const todoText = document.createElement('p');
	todoText.classList.add('todo');
	todoText.textContent = text;
	todoLi.appendChild(todoText);

	const todoRemove = document.createElement('button');
	todoRemove.classList.add('remove');
	todoRemove.setAttribute('type', 'button');
	todoRemove.textContent = 'x';
	todoLi.appendChild(todoRemove);

	todoList.appendChild(todoLi);
	newTodo.value = '';
	render();
});

todoList.addEventListener('click', function(e) {
	const elClasses = [...e.target.classList];
	const source = e.srcElement;

	if (elClasses.includes('remove')) {
		this.removeChild(source.parentElement);
	} else if (elClasses.includes('toggle')) {
		toggle(source);
		if (e.shiftKey && source.checked && lastChecked.checked) {
			let inBetween = false;
			const togglers = [...todoList.querySelectorAll('.todos .toggle')];
			togglers.forEach(toggler => {
				if (toggler === source || toggler === lastChecked) {
					inBetween = !inBetween;
				}
				if (inBetween) {
					toggler.checked = true;
					toggle(toggler);
				}
			});
		}
		lastChecked = source;
	}

	render();
});

todoList.addEventListener('dblclick', e => {
	const source = e.srcElement;

	if ([...source.classList].includes('todo')) {
		const edit = document.createElement('input');
		edit.style.width = '100%';
		edit.value = source.textContent;
		edit.type = 'text';
		edit.autofocus = 'true';
		edit.classList.add('edit');
		source.textContent = '';
		const input = source.appendChild(edit);
		input.addEventListener('change', function(e) {
			const text = this.value;
			source.removeChild(this);
			source.textContent = text;
		});
	}
});

toggleAll.addEventListener('click', (e) => {
	const togglers = [...todoList.querySelectorAll('.todos .toggle')];
	const checked = togglers.filter( x => x.checked );
	togglers.forEach( t => {
		if (togglers.length === checked.length) {
			t.checked = false;
		} else {
			t.checked = true;
		}
		toggle(t);
	});
});

window.addEventListener('keydown', e => {
	if (e.keyCode === 46) {
		const completed = [...todoList.querySelectorAll('.completed')];
		completed.forEach( item => (item.parentNode).removeChild(item) );
		render();
	}
});

function tabs() {
	const url = window.location.hash;
	const completed = [...todoList.querySelectorAll('.completed')];
	const active = [...todoList.querySelectorAll('.active')];
	const info = [...document.querySelectorAll('p.info')];

	filters.forEach( item => item.classList.remove('selected'));

	if (url.endsWith('completed')) {
		activ.classList.add('selected');
		completed.forEach( item => item.style.display = '' );
		active.forEach( item => item.style.display = 'none' );
	} else if (url.endsWith('active')) {
		complit.classList.add('selected');
		active.forEach( item => item.style.display = '' );
		completed.forEach( item => item.style.display = 'none' );
	} else {
		all.classList.add('selected');
		active.forEach( item => item.style.display = '' );
		completed.forEach( item => item.style.display = '' );
	}

	if (completed.length) {
		info.forEach( p => p.classList.add('show') );
	} else {
		info.forEach( p => p.classList.remove('show') );
	}

	count.textContent = active.length;
}

setInterval(tabs, 1);