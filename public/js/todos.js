/* jshint esversion:6 */
/* globals $, LS, document */

var Todos = (function () {
    
    var DOM = {},
        ENTER_KEY = 13;
    
    
    // cache DOM elements
    function cacheDom() {
        DOM.$todosPanel = $('#todos-panel');
        DOM.$todosInput = DOM.$todosPanel.find('#todos-input');
        DOM.todosList   = DOM.$todosPanel.find('#todos-list');
    }
    
    
    // bind events
    function bindEvents() {
        $("form").submit(function() { return false; });
        
		DOM.$todosInput.on('keyup', add);
		$(document).on('click', '.delete-task', removeTask);
		$(document).on('click', '.check-task', toggleTask);
	}

    
    // add todo item
    function add(e) {
        var newTask = DOM.$todosInput.val().trim(),
            currentTasks,
            lastId,
            newTaskObj,
            liItem;

		if ((e.which !== 13) || (!newTask)) {
			return;
		}
        
		// establish current tasks
        if (LS.getData('todo-list')) {
            currentTasks = LS.getData('todo-list');
        } else {
            currentTasks = [];
        }
		
        // getting last id
		lastId = (typeof currentTasks[0] === 'object') ? currentTasks[0].id + 1 : 0;
		
        // the new object task
		newTaskObj = {
            id: lastId,
            task: newTask,
            isChecked: false
        };
        
		// Adding the new task to the top
		currentTasks.unshift(newTaskObj);

		// save todo list
        LS.setData('todo-list', currentTasks);

        // reset input field
		DOM.$todosInput.val('');
        
		// rendering the newly added task
		DOM.todosList.prepend(
            '<li id="' + newTaskObj.id + '">' +
              '<span class="check-task">' +
                '<i class="fa fa-square-o" aria-hidden="true"></i>' +
              '</span>' +
              newTaskObj.task +
              '<span class="delete-task">' +
                '<i class="fa fa-times" aria-hidden="true"></i>' +
              '</span>' +
            '</li>'
        );
	}
    
    
    // get todo list
    function getList() {
		var todoList = LS.getData('todo-list');

		if (!todoList) return;

		todoList.forEach(function (item) {

			var liItemChecked = "<li class=\"finished\" id='" + item.id + "'>" +
			    "<span class=\"check-task\"><i class=\"fa fa-check-square-o\" aria-hidden=\"true\"></i></span>" + 
			    item.task + 
			    "<span class=\"delete-task\"><i class=\"fa fa-times\" aria-hidden=\"true\"></i></span></li>";

			var liItemUnchecked = "<li id='" + item.id + "'>" +
			    "<span class=\"check-task\"><i class=\"fa fa-square-o\" aria-hidden=\"true\"></i></span>" + 
			    item.task + 
			    "<span class=\"delete-task\"><i class=\"fa fa-times\" aria-hidden=\"true\"></i></span></li>";

			if (item.isChecked) {
				DOM.todosList.append(liItemChecked);
			} else {
				DOM.todosList.append(liItemUnchecked);
			}
		});
	}
    
    
    // remove task
    function removeTask(e) {
		var todoList = LS.getData('todo-list'),
            taskSelectedElement = $(e.target).parent().parent(),
            taskSelectedId = taskSelectedElement.attr('id'),
            
            index = todoList.findIndex(function(x) {
                return x.id == taskSelectedId;
            });

		todoList.splice(index, 1);
		taskSelectedElement.remove();
		LS.setData('todo-list', todoList);
	}
    
    
    // toggle task
	function toggleTask(e) {
		var todoList = LS.getData('todo-list'),
            $target = $(e.target),
            $taskSelected = $target.parent().parent(),
            taskId = $taskSelected.attr('id'),
            
            index = todoList.findIndex(function(x) {
                return x.id == taskId;
            });

		todoList[index].isChecked = !todoList[index].isChecked;

		if (todoList[index].isChecked) {
			$target.removeClass('fa-square-o').addClass('fa-check-square-o');
			$taskSelected.addClass('finished');
		} else {
			$target.removeClass('fa-check-square-o').addClass('fa-square-o');
			$taskSelected.removeClass('finished');
		}

		LS.setData('todo-list', todoList);
	}
    
    
    // public init method
    function init() {
        cacheDom();
        bindEvents();
        getList();
    }
    
    
    // export public methods
    return {
        init: init
    };
    
}());