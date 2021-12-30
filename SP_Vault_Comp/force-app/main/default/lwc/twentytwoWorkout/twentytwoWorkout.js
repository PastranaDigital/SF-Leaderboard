import { LightningElement, api } from 'lwc';

export default class TwentytwoWorkout extends LightningElement {
    @api currentWorkout;
	@api workoutResults;
	newWorkoutResults = [];
	buildDataComplete = false;

	setCurrent(incomingArray, value) {
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