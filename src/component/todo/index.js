import { state } from '../state';

const todoComponent = {};

// styling is in src/style/utility/index.css

todoComponent.colAmt = 1;

todoComponent.items = JSON.parse(localStorage.getItem("todoCache")) ?? [];
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
  buttons.classList.add('todo-buttons');

  const editButton = document.createElement('button');
  editButton.classList.add('button');
  editButton.classList.add('button-line');
  editButton.addEventListener('click', (e) => {
    todoComponent.editIndex(index);
    todoComponent.liveRender();
  });
  editButton.innerHTML = '<span class="icon"><svg version="1.1" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M20.719 7.031l-1.828 1.828-3.75-3.75 1.828-1.828c0.375-0.375 1.031-0.375 1.406 0l2.344 2.344c0.375 0.375 0.375 1.031 0 1.406zM3 17.25l11.063-11.063 3.75 3.75-11.063 11.063h-3.75v-3.75z"></path></svg></span>'

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("button");
  deleteButton.classList.add("button-line");
  deleteButton.classList.add("delete-button");
  // deleteButton.classList.add("button-ty1");
  deleteButton.addEventListener('click', (e) => {
    if (e.shiftKey || confirm(`Are you sure you want to delete "${todoComponent.items[index]}"`)) {
      todoComponent.popIndex(index);
      todoComponent.liveRender();
    }
  });
  deleteButton.innerHTML = '<span class="icon"><svg version="1.1" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z"></path></svg></span>';

  buttons.appendChild(editButton);
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

todoComponent.editIndex = (index) => {
  const item = todoComponent.items[index];
  const edited = prompt('Edit item', item);
  if (edited === null) {
    return;
  }

  index = index * 1;
  if (index < 0) {
    alert("what");
    return;
  }
  if (index >= todoComponent.items.length) {
    alert("what");
    return;
  }

  todoComponent.items = todoComponent.items.slice(0, index).concat([edited]).concat(todoComponent.items.slice(index+1))
}

todoComponent.addItem = (text) => {
  todoComponent.items.push(text);
  todoComponent.liveRender();
}

todoComponent.sendIt = async () => {

  let stuff;
  try {
    stuff = await (await fetch(state.get.current().header.greeting.custom, {
      'method': 'PUT',
      headers: {'Content-Type': 'application/json'},
      'body': JSON.stringify({data: todoComponent.items})
    })).text();
  } catch {
    let elm = document.createElement("p");
    elm.classList.add('epic-failure');
    elm.innerHTML = 'fail upload';
    document.body.appendChild(elm);
    return;
  }

  console.log(stuff);
}

todoComponent.liveRender = (dontSendIt) => {
  if (!dontSendIt) {
    todoComponent.sendIt();
  }

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
  localStorage.setItem("todoCache", JSON.stringify(todoComponent.items));
}

todoComponent.render = () => {

  const layout = document.body.getElementsByClassName('layout')[0];

  document.body.addEventListener('keydown', (e) => {
    if (e.shiftKey) {
      layout.classList.add('shifting');
    }
  });

  document.body.addEventListener('keyup', (e) => {
    if (!e.shiftKey) {
      layout.classList.remove('shifting');
    }
  });

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

  todoComponent.liveRender(true);

};

todoComponent.fetchRemote = async () => {
  let stuff;
  try {
    stuff = JSON.parse(await (await fetch(state.get.current().header.greeting.custom, {method: "GET"})).text());
  } catch {
    let elm = document.createElement("p");
    elm.classList.add('epic-failure');
    elm.innerHTML = 'fail download';
    document.body.appendChild(elm);
    return;
  }
  todoComponent.items = Array.from(stuff);
  todoComponent.liveRender(true);
}

todoComponent.init = () => {
  todoComponent.fetchRemote();

  todoComponent.render();
};

export { todoComponent as todo };
