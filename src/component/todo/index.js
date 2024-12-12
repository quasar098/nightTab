import { state } from '../state';

const todoComponent = {};

// styling is in src/style/utility/index.css

todoComponent.items = [];
todoComponent.todoListBoxElements = [];

todoComponent.generateTodoListBoxes = () => {
  const div = document.createElement('div');
  div.classList.add('todo-list');

  for (let i=0; i<3; i++) {
    let ta = document.createElement('div');

    ta.classList.add('todo-list-col');

    todoComponent.todoListBoxElements.push(ta);

    div.appendChild(ta);
  }

  return div;
}

todoComponent.createItemElement = (item) => {
  const elm = document.createElement('div');
  elm.classList.add("todo-list-item");

  const text = document.createElement('p');
  text.innerText = item;
  elm.appendChild(text);

  return elm;
}

todoComponent.liveRender = () => {
  for (let be of todoComponent.todoListBoxElements) {
    Array.from(be.children).map(q => q.remove());
  }

  let i=0;
  let maxPer=3;
  let j=0;
  for (let item of todoComponent.items) {
    let itemElement = todoComponent.createItemElement(item);

    todoComponent.todoListBoxElements[j].appendChild(itemElement);
    if (i++ > maxPer) {
      i = 0;
      j++;
    }
  }
}

todoComponent.addItem = (text) => {
  todoComponent.items.push(text);
  todoComponent.liveRender();
}

todoComponent.render = () => {

  console.log(123);

  const layout = document.body.getElementsByClassName('layout')[0];

  layout.insertBefore(todoComponent.generateTodoListBoxes(), layout.firstChild);

  setTimeout(() => {
    const addReminder = document.getElementById("header-search-string");
    addReminder.addEventListener('keydown', (e) => {
      if (e.keyCode == 13) {
        console.log(123);
        if (addReminder.value.length) {
          try {
            todoComponent.addItem(addReminder.value);
          } catch (e) {
            console.log('error', e);
          }
          addReminder.value = "";
        }
        e.preventDefault();
        return false;
      }
    });
  }, 2);

};

todoComponent.init = () => {
  todoComponent.render();
};

export { todoComponent as todo };
