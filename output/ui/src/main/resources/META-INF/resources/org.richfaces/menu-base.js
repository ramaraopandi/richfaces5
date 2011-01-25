(function($, rf) {

	rf.ui = rf.ui || {};

	var defaultOptions = {
		mode : 'server',
		attachToBody : false,
		showDelay : 50,
		hideDelay : 300,
		verticalOffset : 0,
		horisantalOffset : 0,
		showEvent : 'mouseover',
		positionOffset : [0, 0],
		itemCss : "rf-ddm-itm",
		selectItemCss : "rf-ddm-itm-sel",
		unselectItemCss : "rf-ddm-itm-unsel",
		disabledItemCss : "rf-ddm-itm-dis",
		listCss : "rf-ddm-lst",
		listContainerCss : "rf-ddm-lst-bg"
	};

	rf.ui.MenuBase = function(componentId, options) {
		$super.constructor.call(this, componentId, options);
		this.id = componentId;
		this.namespace = this.namespace || "."
				+ rf.Event.createNamespace(this.name, this.id);

		this.options = {};
		$.extend(this.options, defaultOptions, options || {});
		this.attachToDom(componentId);

		this.element = rf.getDomElement(this.id);

		this.displayed = false;

		this.options.attachTo = this.id;
		this.options.attachToBody = false;

		this.options.positionOffset = [this.options.horisantalOffset,
				this.options.verticalOffset];
		this.popup = new RichFaces.ui.Popup(this.id + "_list", {
					attachTo : this.id,
					direction : this.options.direction,
					jointPoint : this.options.jointPoint,
					positionType : this.options.positionType,
					positionOffset : this.options.positionOffset,
					attachToBody : this.options.attachToBody
				});

		this.selectedGroup = null;

		rf.Event.bindById(this.id, "mouseenter", $.proxy(this.__overHandler,
						this), this);
		rf.Event.bindById(this.id, "mouseleave", $.proxy(this.__leaveHandler,
						this), this);

		this.popupElement = rf.getDomElement(this.popup.id);
		this.popupElement.tabIndex = -1;

		this.__updateItemsList();

		rf.Event.bind(this.items, "mouseenter", $.proxy(
						this.__itemMouseEnterHandler, this), this);

		this.currentSelectedItemIndex = -1;
		var navEventHandlers;
		navEventHandlers = {};
		navEventHandlers["keydown" + this.namespace] = this.__keydownHandler;

		rf.Event.bind(this.popupElement, navEventHandlers, this);
	};

	rf.BaseComponent.extend(rf.ui.MenuBase);

	// define super class link
	var $super = rf.ui.MenuBase.$super;

	$.extend(rf.ui.MenuBase.prototype, (function() {
		return {
			name : "MenuBase",

			show : function() {
				this.__showPopup();
			},

			hide : function() {
				this.__hidePopup();
			},

			processItem : function(item) {
				if (item && item.attr('id') && !this.__isDisabled(item)
						&& !this.__isGroup(item)) {
					this.invokeEvent("itemclick", rf.getDomElement(this.id),
							null);
					this.hide();
				}
			},

			activateItem : function(menuItemId) {
				var item = $(RichFaces.getDomElement(menuItemId));
				rf.Event.fireById(item.attr('id'), 'click');
			},

			__showPopup : function() {
				if (!this.__isShown()) {
					this.invokeEvent("show", rf.getDomElement(this.id), null);
					this.popup.show();
					this.displayed = true;
					rf.ui.MenuManager.setActiveSubMenu(rf.$(this.element));
				}
				this.popupElement.focus();
			},

			__hidePopup : function() {
				window.clearTimeout(this.showTimeoutId);
				this.showTimeoutId = null;
				if (this.__isShown()) {
					this.invokeEvent("hide", rf.getDomElement(this.id), null);
					this.__closeChildGroups();
					this.popup.hide();
					this.displayed = false;
					this.__deselectCurrentItem();
					this.currentSelectedItemIndex = -1;
					parentMenu = rf.$(this.__getParentMenu());
					if (this.id != parentMenu.id) {
						parentMenu.popupElement.focus();
						rf.ui.MenuManager.setActiveSubMenu(parentMenu);
					}
				}
			},

			__closeChildGroups : function() {
				var i = 0;
				var menuItem;
				for (i in this.items) {
					menuItem = this.items.eq(i);
					if (this.__isGroup(menuItem)) {
						rf.$(menuItem).hide();
					}
				}
			},

			__getParentMenuFromItem : function(item) {
				var menu;
				if (item)
					menu = item.parents('div.rf-ddm-itm')
							.has('div.rf-ddm-lst-bg').eq(1);
				if (menu && menu.length > 0)
					return menu;
				else {
					menu = item.parents('div.rf-ddm-lbl');
					if (menu && menu.length > 0)
						return menu;
					else
						return null;
				}
			},

			__getParentMenu : function() {
				var menu = $(this.element).parents('div.rf-ddm-itm')
						.has('div.rf-ddm-lst-bg').eq(0);
				if (menu && menu.length > 0)
					return menu;
				else {
					var item = this.items.eq(0);
					return this.__getParentMenuFromItem(item);
				}
			},

			__isGroup : function(item) {
				return item.find('div.' + this.options.listCss).length > 0;
			},

			__isDisabled : function(item) {
				return item.hasClass(this.options.disabledItemCss);
			},

			__isShown : function() {
				return this.displayed;

			},

			__itemMouseEnterHandler : function(e) {
				var item = this.__getItemFromEvent(e);
				if (item) {
					//this.__selectItem(item);
					if (this.currentSelectedItemIndex != this.items.index(item)) {
						this.__deselectCurrentItem();
						this.currentSelectedItemIndex = this.items.index(item);
					}
				}
			},

			__selectItem : function(item) {
				if (!rf.$(item).isSelected) {
					rf.$(item).select();
				}
			},

			__getItemFromEvent : function(e) {
				return $(e.target).closest("." + this.options.itemCss,
						e.currentTarget).eq(0);
			},

			__showHandler : function(e) {
				if (!this.__isShown()) {
					this.showTimeoutId = window.setTimeout($.proxy(function() {
										this.show();
									}, this), this.options.showDelay);
				}
			},

			__leaveHandler : function() {
				//console.log('__leaveHandler showTimeoutId:'+ this.showTimeoutId);				
				this.hideTimeoutId = window.setTimeout($.proxy(function() {
									this.hide();
								}, this), this.options.hideDelay);
			},

			__overHandler : function() {
				window.clearTimeout(this.hideTimeoutId);
				this.hideTimeoutId = null;
			},

			destroy : function() {
				// clean up code here
				this.detach(this.id);

				rf.Event.unbind(this.popupElement, "keydown" + this.namespace)

				// call parent's destroy method
				$super.destroy.call(this);
			}
		};
	})());

})(jQuery, RichFaces);