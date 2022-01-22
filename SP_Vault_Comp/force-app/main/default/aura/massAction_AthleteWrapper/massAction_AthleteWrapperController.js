({
    doInit : function(component, event, helper) {
		helper.init(component);
    },

	handleToastEvent: function(component, event, helper) {
		const toast = $A.get('e.force:showToast');
		toast.setParams({
			'message': event.getParam('message'),
			'type': event.getParam('type'),
			'title': event.getParam('title'),
			'mode': event.getParam('mode')
		});
		toast.fire();
	},

	handleNavigateToListviewEvent: function(component, event, helper){
		console.log('inside handleNavigateToListviewEvent in Controller: ', event.getParam('listId'), event.getParam('objectName'));
		helper.goBackToListView(component, event.getParam('listId'), event.getParam('objectName'));
	},

	handleNavigateToRecord: function(component, event, helper) {
		helper.navigateToRecord(component, event.getParam('recordId'));
	}
})
