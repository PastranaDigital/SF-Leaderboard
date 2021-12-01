import { LightningElement, wire } from 'lwc';
import imageResource from '@salesforce/resourceUrl/SPCompImages';
import getAllFriscoChallengeScores from '@salesforce/apex/ChallengeLwcController.getAllFriscoChallengeScores';
import createFriscoChallengeSubmission from '@salesforce/apex/ChallengeLwcController.createFriscoChallengeSubmission';
import getAllAthletesForOptions from "@salesforce/apex/ChallengeLwcController.getAllAthletesForOptions";

import { refreshApex } from "@salesforce/apex";

export default class MonthlyChallenge extends LightningElement {
	//? both should begin as FALSE values
    scoreSubmitted = false;
    errorSubmitting = false;
    buttonErrorMessage = '';
    checkRequiredFieldsBoolean = [];

	totalChallengeCount = 30;
	daysInMonth = 31;

    optionsAthleteList = [];

	labels = {
		challengeTitle: `${this.totalChallengeCount} Miles Run`,
		movement1: 'Miles',
		movement2: '',
		checkbox: '',
		month: 'December',
		footer: '2021 Frisco Challenge',
	};

	pacer = {
		pace: 0,
		barFill: 0,
	};

    newRecord = {
        Frisco_Athlete__c: '',
        Movement_1__c: '',
        Movement_2__c: '',
        Daily_Checkbox__c: '',
    };
    
    topLogo = imageResource + '/Images/main_logo.png';

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


    @wire(getAllFriscoChallengeScores) challengeScores(result) {
        this.wireChallengeScores = result;
        if (result.data) {
            let currentData = [];
            result.data.forEach((row) => {
                if (row.Challenge_Total__c > 0) {
					let rowData = {};
					rowData.Id = row.Id;
					rowData.Name = row.Name;
					rowData.Total_Movement_1__c = row.Total_Movement_1__c;
					rowData.Total_Movement_2__c = row.Total_Movement_2__c;
					rowData.Challenge_Total__c = row.Challenge_Total__c;
					rowData.barFill = `width: ${row.Challenge_Total__c > this.totalChallengeCount ? 100 : Number(row.Challenge_Total__c / this.totalChallengeCount * 100).toFixed(1)}%;`;
					rowData.barFillMovement1 = `width: ${(row.Total_Movement_1__c / this.totalChallengeCount * 100).toFixed(1)}%;`;
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
        createFriscoChallengeSubmission({ score : this.newRecord })
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
        this.newRecord.Frisco_Athlete__c = event.detail.value;
        console.log(this.newRecord.Frisco_Athlete__c);
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
        this.checkRequiredFieldsBoolean[0] = Boolean(this.newRecord.Frisco_Athlete__c);
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