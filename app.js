const newTaskbtn = document.querySelector('#new-task-btn')
const taskContainer = document.querySelector('#newTaskHolderContainer')
newTaskbtn.addEventListener('click', () => {
     const newTask = document.createElement('div')
     newTask.classList.add('newTaskHolder')
     
     const newTaskName = document.createElement('ul')
     userNewTaskName = prompt('Task Name : ')
     newTaskName.innerHTML = `${userNewTaskName}`
     
     newTask.appendChild(newTaskName)
     console.log(newTask)
     taskContainer.appendChild(newTask)
})