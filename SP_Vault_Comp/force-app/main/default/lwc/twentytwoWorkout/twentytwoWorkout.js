import { LightningElement, api } from 'lwc';

export default class TwentytwoWorkout extends LightningElement {
    @api currentWorkout;
	@api workoutResults;
	newWorkoutResults;
	buildDataComplete = false;

	setCurrent(incomingArray, value) {
		// console.log('incomingArray: ', incomingArray);
		// console.log('value: ', value);

		// if (incomingArray.length <= 1 || value) {
		// 	this.buildDataComplete = true;
		// 	return incomingArray;
		// }
		//? remove current item 
		//? move current item to top of list
		let putFirst = {};
		let theRest = [];
	
		incomingArray.forEach((element) => {
			if (element.Name === value.Name) {
				putFirst = element;
			} else {
				theRest.push(element);
			}
		});
		theRest.unshift(putFirst);
		this.buildDataComplete = true;
		// console.log('incomingArray.length greater than 1');
		return theRest;
	  };
	  
	connectedCallback() {
		this.buildDataComplete = false;
	}

    renderedCallback() {
		//? reorder the workoutResults to have the currentWorkout first
		if(!this.buildDataComplete) {
			this.newWorkoutResults = this.setCurrent(this.workoutResults, this.currentWorkout);
		}
    }
}