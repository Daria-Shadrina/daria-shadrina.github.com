(function() {
	"use strict";
	if (!Function.prototype.bind) {
		Function.prototype.bind = function (oThis) {
			if (typeof this !== "function") {
				// closest thing possible to the ECMAScript 5 internal IsCallable function
				throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
			}

			var aArgs = Array.prototype.slice.call(arguments, 1), 
			fToBind = this, 
			fNOP = function () {},
			fBound = function () {
				return fToBind.apply(this instanceof fNOP && oThis
										? this
										: oThis,
									aArgs.concat(Array.prototype.slice.call(arguments)));
			};

			fNOP.prototype = this.prototype;
			fBound.prototype = new fNOP();

			return fBound;
		};
	}
	if (!String.prototype.trim) {
		String.prototype.trim = function () {
			return this.replace(/^\s+|\s+$/gm, '');
		};
	}
	function addEvent(obj, event_name, handler) {
		var handler_wrapper = function(event) {
			event = event || window.event;
			if (!event.target && event.srcElement) {
				event.target = event.srcElement;
			}
			return handler.call(obj, event);
		};

		if (obj.addEventListener) {
			obj.addEventListener(event_name, handler_wrapper, false);
		} else if (obj.attachEvent) {
			obj.attachEvent('on' + event_name, handler_wrapper);
		}
		return handler_wrapper;
	}
	
	function Tags(tagsNode, tagsArr) {
		this.tagsNode = tagsNode;
		this.tagsArr = tagsArr;
	}
	Tags.prototype.showTag = function(tagName) {
		var newTag = document.createElement('div');
		newTag.className = 'tag';
		newTag.innerHTML = '<span class="tag-name"></span><span class="delete-tag">&#215;</span>';
		var tagNameSpan = newTag.querySelector('.tag-name');
		tagNameSpan.textContent = tagName;
		tagNameSpan.innerText = tagName;
		this.tagsNode.appendChild(newTag);
		addEvent(newTag.querySelector('.delete-tag'), 'click', this.removeTag.bind(this, newTag, tagName));
	}
	Tags.prototype.removeTag = function(tag, tagName) {
		for(var i = 0; i < this.tagsArr.length; i++) {
			if(this.tagsArr[i] === tagName) {
				this.tagsArr.splice(i, 1);
			}
		}
		this.tagsNode.removeChild(tag);
	}
	function TagList(node, tagsArr) {
		this.node = node || document.querySelector('body');
		this.tagsArr = tagsArr || [];
		this.tagsArr = this.getTagList();
		this.taglist = document.createElement('div');
		this.taglist.className = 'taglist';
		this.taglist.innerHTML = '<span class="edit-btn">Редактировать теги</span><div class="tags"></div><form><input type="text"><div class="add-btn">добавить</div><button type="submit"></button></form>';
		this.node.appendChild(this.taglist);
		this.tags = new Tags(this.taglist.querySelector('.tags'), this.tagsArr);
		this.editBtn = this.taglist.querySelector('.edit-btn');
		this.editingForm = this.taglist.querySelector('form');
		this.addInput = this.taglist.querySelector('input');
		this.addBtn = this.taglist.querySelector('.add-btn');
		this.editing = false;
		this.init();
	}
	TagList.prototype.init = function() {
		for(var i = 0; i < this.tagsArr.length; i++) {
			this.tags.showTag(this.tagsArr[i]);
		}
		addEvent(this.editBtn, 'click', this.edit.bind(this));
		addEvent(this.addBtn, 'click', this.addTag.bind(this));
		var self = this;
		addEvent(this.editingForm, 'submit', function(event) {
			self.addTag();
			if(event.preventDefault) {
				event.preventDefault();
			}
			if(event.returnValue) {
				event.returnValue = false;
			}
			return false;
		});
	}
	TagList.prototype.edit = function() {
		if(!this.editing) {
			this.editingForm.style.display = 'block';
			this.editBtn.textContent = 'Завершить редактирование';
			this.editBtn.innerText = 'Завершить редактирование';
			this.editing = true;
		} else {
			this.editingForm.style.display = 'none';
			this.editBtn.textContent = 'Редактировать теги';
			this.editBtn.innerText = 'Редактировать теги';
			this.editing = false;
		}
	}
	TagList.prototype.addTag = function() {
		var addTagValue = this.addInput.value.trim();
		if(addTagValue === '') {
			return;
		}

		for(var i = 0; i < this.tagsArr.length; i++) {
			if(this.tagsArr[i] === addTagValue) {
				return;
			}
		}
		this.tagsArr.push(addTagValue);
		this.tags.showTag(addTagValue);
		this.addInput.value = '';
	}
	TagList.prototype.getTagList = function() {
		var stringTagList = [];
		for(var i = 0; i < this.tagsArr.length; i++) {
			stringTagList.push(this.tagsArr[i].toString());
		}
		return stringTagList;
	}
	window.TagList = TagList;
}());