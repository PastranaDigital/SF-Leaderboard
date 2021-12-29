import { LightningElement, api } from 'lwc';

export default class TwentytwoWorkout extends LightningElement {
    @api currentWorkout;
	@api workoutResults;

    renderedCallback() {
		//? reorder the workoutResults to have the currentWorkout first
    }
}