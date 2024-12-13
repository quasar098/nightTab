import { state } from '../state';

const todoComponent = {};

// styling is in src/style/utility/index.css

todoComponent.colAmt = 1;

todoComponent.items = [];
todoComponent.todoListBoxElements = [];

todoComponent.generateTodoListBoxes = () => {
  const div = document.createElement('div');
  div.classList.add('todo-list');

  for (let i=0; i<todoComponent.colAmt; i++) {
    let ta = document.createElement('div');

    ta.classList.add('todo-list-col');

    todoComponent.todoListBoxElements.push(ta);

    div.appendChild(ta);
  }

  return div;
}

todoComponent.createItemElement = (index, item) => {
  const elm = document.createElement('div');
  elm.classList.add("todo-list-item");

  const textContainer = document.createElement("div");
  textContainer.classList.add("todo-list-text-container");

  const text = document.createElement('p');
  text.innerText = item;
  textContainer.appendChild(text);

  const buttons = document.createElement('div');
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("button");
  deleteButton.classList.add("button-line");
  deleteButton.classList.add("button-ty1");
  deleteButton.addEventListener('click', (e) => {
    todoComponent.popIndex(index);
    todoComponent.liveRender();
  });
  deleteButton.innerHTML = '<span class="icon"><svg version="1.1" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z"></path></svg></span>';
  buttons.appendChild(deleteButton);
  elm.appendChild(textContainer);
  elm.appendChild(buttons);

  return elm;
}

todoComponent.popIndex = (index) => {
  index = index * 1;
  if (index < 0) {
    alert("what");
    return;
  }
  if (index >= todoComponent.items.length) {
    alert("what");
    return;
  }

  todoComponent.items = todoComponent.items.slice(0, index).concat(todoComponent.items.slice(index+1))
}

todoComponent.liveRender = () => {
  for (let be of todoComponent.todoListBoxElements) {
    Array.from(be.children).map(q => q.remove());
  }

  let i=0;
  let maxPer=1;
  let j=0;
  for (let i2 in todoComponent.items) {
    let item = todoComponent.items[i2];
    let itemElement = todoComponent.createItemElement(i2, item);

    todoComponent.todoListBoxElements[j % todoComponent.colAmt].appendChild(itemElement);
    if (j >= todoComponent.colAmt) {
      j++;
      continue;
    }
    if ((++i % maxPer) == 0) {
      j++;
    }
  }
}

todoComponent.addItem = (text) => {
  todoComponent.items.push(text);
  todoComponent.liveRender();
}

todoComponent.render = () => {


  const layout = document.body.getElementsByClassName('layout')[0];

  layout.insertBefore(todoComponent.generateTodoListBoxes(), layout.firstChild);

  setTimeout(() => {
    const addReminder = document.getElementById("header-search-string");
    addReminder.addEventListener('keydown', (e) => {
      if (e.keyCode == 13) {
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
