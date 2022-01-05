import { LightningElement, api } from 'lwc';

export default class TwentytwoWorkoutDetails extends LightningElement {
	@api workoutData;

	renderedCallback() {
		this.template.querySelector('slot').innerHTML = this.workoutData;
	}
}