import { LightningElement, wire } from 'lwc';
import imageResource from '@salesforce/resourceUrl/SPCompImages';
import getAllChallengeScores from '@salesforce/apex/ChallengeLwcController.getAllChallengeScores';
import createChallengeSubmission from '@salesforce/apex/ChallengeLwcController.createChallengeSubmission';
import getAllAthletesForOptions from "@salesforce/apex/AthleteLwcController.getAllAthletesForOptions";

import { refreshApex } from "@salesforce/apex";

export default class TwentytwoMonthly extends LightningElement {
	//? both should begin as FALSE values
    scoreSubmitted = false;
    errorSubmitting = false;
    buttonErrorMessage = '';
    checkRequiredFieldsBoolean = [];

	totalChallengeCount = 3000;
	daysInMonth = 30;
	divisor = 0;

    optionsAthleteList = [];

	labels = {
		challengeTitle: `${this.totalChallengeCount} Calories`,
		challengeSubTitle: 'Run, Bike, Row',
		movement1: 'Calories',
		movement2: '',
		checkbox: 'Did Street Parking WOD?',
		month: 'December 2021',
	}

	pacer = {
		pace: 0,
		barFill: 0,
	};

    newRecord = {
        Athlete__c: '',
        Movement_1__c: '',
        Movement_2__c: '',
        Daily_Checkbox__c: '',
    };
    
    keyLogo = imageResource + '/Images/key_logo.png';

	@wire(getAllAthletesForOptions) athleteList(result) {
        this.wireAthleteList = result;
        if(result.data) {
            let endResult = [];
            result.data.forEach((row) => {
                let rowData = {};
                rowData.label = row.Name;
                rowData.value = row.Id;
                endResult.push(rowData);
            });
            this.optionsAthleteList = endResult;
        }
    }

    get options() {
        return this.optionsAthleteList;
    }
    
    data = [];
    //? https://github.com/PastranaDigital/lwc-udemy-course/blob/feature/dev3/force-app/main/default/lwc/accountListViewer/accountListViewer.js
    wireChallengeScores = []; //? used for refreshApex


    @wire(getAllChallengeScores) challengeScores(result) {
        this.wireChallengeScores = result;
        if (result.data) {
            let currentData = [];
			this.divisor = this.totalChallengeCount;
            result.data.forEach((score) => {
				this.divisor = score.Challenge_Total__c > this.divisor ? score.Challenge_Total__c : this.divisor;
				// console.log(score.Challenge_Total__c);
				console.log(score.Challenge_Total__c, this.divisor);
			});
			console.log('divisor',this.divisor);
			result.data.forEach((row) => {
                if (row.Challenge_Total__c > 0) {
					let rowData = {};
					rowData.Id = row.Id;
					rowData.Name = row.Name;
					rowData.Did_SP_Workout__c = row.Did_SP_Workout__c;
					rowData.Total_Movement_1__c = row.Total_Movement_1__c;
					rowData.Total_Movement_2__c = row.Total_Movement_2__c;
					rowData.Challenge_Total__c = row.Challenge_Total__c;
					rowData.barFill = `width: ${row.Challenge_Total__c > this.totalChallengeCount ? 100 : Number(row.Challenge_Total__c / this.divisor * 100).toFixed(1)}%;`;
					rowData.barFillMovement1 = `width: ${(row.Total_Movement_1__c / this.divisor * 100).toFixed(1)}%;`;
					currentData.push(rowData);
				}
            });
            this.data = currentData;
        } else if (result.error) {
            window.console.log(result.error);
        }
    }

	refreshScores() {
		console.log('refreshing...');
		refreshApex(this.wireChallengeScores);
	}

    createScoreApex() {
        createChallengeSubmission({ score : this.newRecord })
            .then(result => {
                this.message = result;
                this.error = undefined;
                this.scoreSubmitted = true;
                console.log("result", this.message);
				this.refreshScores();
            })
            .catch(error => {
                this.message = undefined;
                this.error = error;
                this.errorSubmitting = true;
                console.log("error", JSON.stringify(this.error));
            });
    }

	handleAthleteChange(event) {
        this.newRecord.Athlete__c = event.detail.value;
        console.log(this.newRecord.Athlete__c);
    }

    handleScore1Change(event) {
        this.newRecord.Movement_1__c = event.detail.value;
        console.log(this.newRecord.Movement_1__c);
    }

    handleScore2Change(event) {
        this.newRecord.Movement_2__c = event.detail.value;
        console.log(this.newRecord.Movement_2__c);
    }

    handleCheckboxChange(event) {
        this.newRecord.Daily_Checkbox__c = event.detail.checked;
        console.log(this.newRecord.Daily_Checkbox__c);
    }

    handleSubmitRecord() {
        this.checkRequiredFieldsBoolean[0] = Boolean(this.newRecord.Athlete__c);
        this.checkRequiredFieldsBoolean[1] = Boolean(this.newRecord.Movement_1__c);
        // this.checkRequiredFieldsBoolean[2] = Boolean(this.newRecord.Movement_2__c);
        // this.checkRequiredFieldsBoolean[3] = Boolean(this.newRecord.Daily_Checkbox__c);
        console.log(this.checkRequiredFieldsBoolean);
        
        if (!this.checkRequiredFieldsBoolean.includes(false)) {
            this.createScoreApex();
        } else {
			this.buttonErrorMessage = 'Please complete required fields';
            console.log('Please complete required fields');
        }        
    }

    connectedCallback() {
        // console.log(athList.data[0].Name);
		const date = Number((new Date()).getDate());
		// console.log(`date: ${date}`);
		this.pacer.pace = (+date / this.daysInMonth * this.totalChallengeCount).toFixed(0);
		// console.log('this.pacer.pace', this.pacer.pace);
		this.pacer.barFill = `width: ${(+date / this.daysInMonth * 100).toFixed(1)}%;`;
		// console.log('this.pacer.pace', this.pacer.barFill);
    }

	renderedCallback() {

	}
}