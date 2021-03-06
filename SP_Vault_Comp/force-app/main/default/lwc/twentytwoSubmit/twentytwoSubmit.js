import { LightningElement, api } from 'lwc';
import createScore from '@salesforce/apex/createScoreSubmission.createScore';

export default class TwentytwoSubmit extends LightningElement {
	@api currentWorkout;
	@api athleteOptions;
	@api workoutResults;
	@api athleteInfo;

    //? both should begin as FALSE values
    scoreSubmitted = false;
    errorSubmitting = false;
    buttonErrorMessage = '';
    checkRequiredFieldsBoolean = [];
	currentWorkoutResults;
	
	comboboxValue = '';

    recordId;
    scoreSubmittedAthlete = {
        Image: '/leaderboard/webruntime/org-asset/c5107c6f53/resource/0815e000000jEeR/Athletes/default.png',
        Name: 'Test Testerson'
    };

    newRecord = {
        Athlete_Name__c: '',
        Vault_Workout__c: '',
        Score_1st__c: '',
        Score_2nd__c: '',
        Weight_Used__c: '',
        Notes__c: ''
    };
    
    handleAthleteChange(event) {
        this.comboboxValue = event.detail.value;
        this.newRecord.Athlete_Name__c = event.detail.value;
        console.log('this.newRecord.Athlete_Name__c', this.newRecord.Athlete_Name__c);
        this.newRecord.Vault_Workout__c = this.currentWorkout.Id;
        console.log('this.newRecord.Vault_Workout__c', this.newRecord.Vault_Workout__c);
    }

    handleScore1Change(event) {
        this.newRecord.Score_1st__c = event.detail.value;
        // console.log(this.newRecord.Score_1st__c);
    }

    handleScore2Change(event) {
        this.newRecord.Score_2nd__c = event.detail.value;
        // console.log(this.newRecord.Score_2nd__c);
    }

    handleWeightUsedChange(event) {
        this.newRecord.Weight_Used__c = event.detail.value;
        // console.log(this.newRecord.Weight_Used__c);
    }

    handleNotesChange(event) {
        this.newRecord.Notes__c = event.detail.value;
        // console.log(this.newRecord.Notes__c);
    }

	refreshScores() {
		const custEvent2 = new CustomEvent(
			'callscrolltotop', {
				detail: 'payload' 
			});
		this.dispatchEvent(custEvent2);
		this.delay(2500).then(() => {
			console.log('refreshing to Parent...');

			const custEvent = new CustomEvent(
				'callgetmodel', {
					detail: 'payload' 
				});
			this.dispatchEvent(custEvent);
			// const custEvent2 = new CustomEvent(
			// 	'callgotoleaderboard', {
			// 		detail: 'payload' 
			// 	});
			// this.dispatchEvent(custEvent2);
		});
	}

	delay(time) {
		return new Promise(resolve => setTimeout(resolve, time));
	}
	
    createScoreApex() {
		createScore({ score : this.newRecord })
		.then(result => {
				this.message = result;
				this.error = undefined;
				this.scoreSubmitted = true;                
				// console.log(JSON.stringify(result));
				console.log("result", this.message);
				// this.refreshScores();
            })
            .catch(error => {
                this.message = undefined;
                this.error = error;
                this.errorSubmitting = true;
                console.log("error", JSON.stringify(this.error));
            })
			.finally(() => this.refreshScores());
    }

    // getSubmittedScoreApex() {
    //     getSubmittedScore({ score : this.newRecord }) // only pulls last result
    //         .then(result => {
    //             this.message = result;
    //             console.log("getSubmittedScore result:", this.message);

    //             this.newRecord.Is_Score_Between_Goal__c = result.Is_Score_Between_Goal__c;
    //             this.newRecord.Points_Based_on_Rank__c = result.Points_Based_on_Rank__c;
    //             this.newRecord.Total_Workout_Points__c = result.Total_Workout_Points__c;
    //         })
    //         .catch(error => {
    //             this.error = error;
    //             // this.errorSubmitting = true;
    //             console.log("error", JSON.stringify(this.error));
    //         });
    // }

    handleSubmitRecord() {
        this.checkRequiredFieldsBoolean[0] = Boolean(this.newRecord.Athlete_Name__c);
        this.checkRequiredFieldsBoolean[1] = Boolean(this.newRecord.Score_1st__c);
        if (this.secondLabel) {
            this.checkRequiredFieldsBoolean[2] = Boolean(this.newRecord.Score_2nd__c);
        } else {
            this.checkRequiredFieldsBoolean[2] = true;
        }
        if (this.workoutRxWeight) {
            this.checkRequiredFieldsBoolean[3] = Boolean(this.newRecord.Weight_Used__c);
        } else {
            this.checkRequiredFieldsBoolean[3] = true;
        }
        
        console.log(this.checkRequiredFieldsBoolean);
        
        if (!this.checkRequiredFieldsBoolean.includes(false)) {
            this.createScoreApex();
            
            this.athleteInfo.forEach(element => {
                if (element.Id == this.newRecord.Athlete_Name__c) {
                    this.scoreSubmittedAthlete.Image = element.Profile_Pic_URL__c;
                    this.scoreSubmittedAthlete.Name = element.Name;
                }
            });
        } else {
            this.buttonErrorMessage = 'Please complete required fields';
            console.log('Please complete required fields');
        }        
    }

	getCurrentWorkoutResults() {
		if (!this.workoutResults) return;
		this.workoutResults.forEach((workout) => {
			if (workout.Name === this.currentWorkout.Name) {
				this.currentWorkoutResults = workout.allResults;
				console.log('this.currentWorkoutResults: ', this.currentWorkoutResults);
			}
		});
	}
    
    renderedCallback() {
    	this.getCurrentWorkoutResults();
		// if (!this.workoutResults) 
		this.template.querySelector('slot').innerHTML = this.currentWorkout.Description__c;
    }
}