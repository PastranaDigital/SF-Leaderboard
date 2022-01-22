({
    init : function(component) {
		this.setTabLabel(component);
		this.setTabIcon(component);
    },

	close : function(component) {
		let workspace = component.find('workspace');
		workspace.getEnclosingTabId().then(function(id) {
			if (id) {
				workspace.closeTab({
					tabId: id
				});
			}
		});
	},

	goBackToListView : function(component, listView, objectName) {
		var navEvent = $A.get("e.force:navigateToList");
		console.log('navEvent: ', navEvent);
		navEvent.setParams({
			'listViewId': listView,
			'scope': objectName
		});
		navEvent.fire();
	},

	navigateToRecord : function(component, recordId) {
		if (recordId != null) {
			const navEvent = $A.get("e.force:navigateToSObject");
			navEvent.setParams({
				recordId: recordId
			});
			navEvent.fire();
		}
		this.close(component);
	},

	setTabLabel : function(component) {
		let workspace = component.find('workspace');
		workspace.getEnclosingTabId().then(function(tabId) {
			workspace.setTabLabel({
				tabId: tabId,
				label: $A.get('$Label.c.AthleteToggle')
			});
		});
	},

	setTabIcon : function(component) {
		let workspace = component.find('workspace');
		workspace.getEnclosingTabId().then(function(tabId) {
			workspace.setTabIcon({
				tabId: tabId,
				icon: 'custom:custom15'
			});
		});
	}
});
