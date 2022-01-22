import { LightningElement, api } from 'lwc';
import lblAthleteToggle from '@salesforce/label/c.AthleteToggle';

export default class MassActionAthleteLwc extends LightningElement {
	@api selectedIdsList;
	@api listId;

	labels = {
		lblAthleteToggle
	};

	navigateToListView() {
		let navDetail = ({listId: this.listId, objectName: 'Athlete__c'}); 
		//? if using namespace from outboundModel	objectName: this.outboundModel.namespace + 'Athlete__c'
		let navEvent = new CustomEvent('navigatetolistview', {detail: navDetail});
		this.dispatchEvent(navEvent);
	}

	recordIdsCreated = ['a015e00000TFsadAAD'];

	navigateToRecord() {
		//? if there is more than one record created or none then the recordId will be blank
		let recordId = this.recordIdsCreated && this.recordIdsCreated.length && this.recordIdsCreated.length==1 ? this.recordIdsCreated[0] : null;
		let navDetail = ({recordId: recordId});
		let navEvent = new CustomEvent('navigatetorecord', {detail: navDetail});
		this.dispatchEvent(navEvent);
	}

	navigate() {
		if (this.listId) {
			//? may help to repair
			//? https://developer.salesforce.com/docs/component-library/bundle/lightning:navigation/documentation
			this.navigateToListView();
		} else {
			this.navigateToRecord();
		}
	}

	showToast(variant, title, message, mode) {
		let eventDetail = ({message: message, title: title, variant: variant, mode: mode});
		let toastEvent = new CustomEvent('showtoast', {detail: eventDetail});
		this.dispatchEvent(toastEvent);
	}

	handleCancelClick() {
		this.navigate();
	}

	handleToastTestClick() {
		this.showToast('error', 'Error doing something!', 'Ape was supposed to run better.', 'dismissible');
	}
}