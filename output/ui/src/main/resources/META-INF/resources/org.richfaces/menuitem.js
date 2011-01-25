(function($, rf) {
	rf.ui = rf.ui || {};

	var defaultOptions = {
		mode : "server"
	}

	// constructor definition

	rf.ui.MenuItem = function(componentId, options) {
		this.options = {};
		$.extend(this.options, defaultOptions, options || {});
		$super.constructor.call(this, componentId);
		this.attachToDom(componentId);
		this.element = $(rf.getDomElement(componentId));
		rf.Event.bindById(this.id, 'click', this.__clickHandler, this);
		rf.Event.bindById(this.id, 'mouseenter', this.select, this);
		rf.Event.bindById(this.id, 'mouseleave', this.unselect, this);
		this.selected = false;
	};

	rf.BaseComponent.extend(rf.ui.MenuItem);

	// define super class link
	var $super = rf.ui.MenuItem.$super;

	$.extend(rf.ui.MenuItem.prototype, (function() {

		return {
			name : "MenuItem",
			select : function() {
				this.element.removeClass('rf-ddm-itm-unsel');
				this.element.addClass('rf-ddm-itm-sel');
				this.selected = true;
			},
			unselect : function() {
				this.element.removeClass('rf-ddm-itm-sel');
				this.element.addClass('rf-ddm-itm-unsel');
				this.selected = false;
			},
			activate : function() {
				this.invokeEvent('click', rf.getDomElement(this.id));
			},

			isSelected : function() {
				return this.selected;
			},

			__clickHandler : function(e) {
				var parentMenu = this.__getParentMenu();
				if (parentMenu) {
					parentMenu.processItem(this.element);
				}

				this.__submitForm(rf.getDomElement(this.id), e,
						this.options.params);
			},

			/**
			 *
			 * @param item DOM element
			 */
			__submitForm : function(item, e, params) {
				var form = this.__getParentForm(item);
				var itemId = {};
				itemId[item.id] = item.id;
				$.extend(itemId, params || {});
				if (this.options.mode == "server") {
					rf.submitForm(form, itemId);
				}
				if (this.options.mode == "ajax" && this.options.submitFunction) {
					this.options.submitFunction.call(this, e);
				}
			},

			__getParentForm : function(item) {
				return $($(item).parents("form").get(0));
			},

			__getParentMenu : function() {
				var menu = this.element.parents('div.rf-ddm-lbl');
				if (menu && menu.length > 0)
					return rf.$(menu);
				else
					return null;
			}
		};
	})());

})(jQuery, RichFaces);