import { LightningElement, wire } from 'lwc';
import imageResource from '@salesforce/resourceUrl/SPCompImages';
import getAllChallengeScores from '@salesforce/apex/ChallengeLwcController.getAllChallengeScores';
import createChallengeSubmission from '@salesforce/apex/ChallengeLwcController.createChallengeSubmission';
import getAllAthletesForOptions from "@salesforce/apex/AthleteLwcController.getAllAthletesForOptions";

import { refreshApex } from "@salesforce/apex";

export default class MonthlyChallenge extends LightningElement {
	//? both should begin as FALSE values
    scoreSubmitted = false;
    errorSubmitting = false;
    buttonErrorMessage = '';
    checkRequiredFieldsBoolean = [];

    optionsAthleteList = [];

    newRecord = {
        Athlete__c: '',
        Burpees__c: '',
        KB_Swings__c: '',
        Fruits_Veggies__c: '',
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
    
    //? Default Values
    firstLabel = 'Burpees';
    secondLabel = 'KB Swings';
    fnvLabel = 'Fruits & Veggies';

    @wire(getAllChallengeScores) challengeScores(result) {
        this.wireChallengeScores = result;
        if (result.data) {
            let currentData = [];
            result.data.forEach((row) => {
                if (row.Challenge_Total__c > 0) {
					let rowData = {};
					rowData.Id = row.Id;
					rowData.Name = row.Name;
					rowData.Total_Burpees__c = row.Total_Burpees__c;
					rowData.Total_KB_Swings__c = row.Total_KB_Swings__c;
					rowData.Challenge_Total__c = row.Challenge_Total__c;
					rowData.barFill = `width: ${row.Challenge_Total__c > 2000 ? 100 : Number(row.Challenge_Total__c / 2000 * 100).toFixed(1)}%;`;
					rowData.barFillBurpees = `width: ${(row.Total_Burpees__c / 2000 * 100).toFixed(1)}%;`;
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
        this.newRecord.Burpees__c = event.detail.value;
        console.log(this.newRecord.Burpees__c);
    }

    handleScore2Change(event) {
        this.newRecord.KB_Swings__c = event.detail.value;
        console.log(this.newRecord.KB_Swings__c);
    }

    handleCheckboxChange(event) {
        this.newRecord.Fruits_Veggies__c = event.detail.checked;
        console.log(this.newRecord.Fruits_Veggies__c);
    }

    handleSubmitRecord() {
        this.checkRequiredFieldsBoolean[0] = Boolean(this.newRecord.Athlete__c);
        // this.checkRequiredFieldsBoolean[1] = Boolean(this.newRecord.Burpees__c);
        // this.checkRequiredFieldsBoolean[2] = Boolean(this.newRecord.KB_Swings__c);
        // this.checkRequiredFieldsBoolean[3] = Boolean(this.newRecord.Fruits_Veggies__c);
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
    }

	renderedCallback() {

	}
}