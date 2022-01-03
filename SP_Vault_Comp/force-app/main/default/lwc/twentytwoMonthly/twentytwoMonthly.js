import { LightningElement, wire, api } from 'lwc';
import createChallengeSubmission from '@salesforce/apex/LeaderboardController.createChallengeSubmission';

import { refreshApex } from "@salesforce/apex";
import { sortArray } from './helper.js';

export default class TwentytwoMonthly extends LightningElement {
	@api currentChallenge;
	@api athleteOptions;
	@api challengeTotals;
	@api challengeEntries;
	updtdChallengeTotals;

	//? should begin as FALSE values
	buildDataComplete = false;
    scoreSubmitted = false;
	buttonPressed = false;
    errorSubmitting = false;

    buttonErrorMessage = '';
    checkRequiredFieldsBoolean = [];

	totalChallengeCount;
	daysInMonth;
	divisor = 0;

    // optionsAthleteList = [];

	labels = {
		checkbox: 'Did a Workout Today? (If you did a Vault, no need to submit a checkbox here)',
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
		Challenge__c: '',
		Is_Challenge_Active__c: true
    };
    
    // keyLogo = imageResource + '/Images/key_logo.png';

	// @wire(getAllAthletesForOptions) athleteList(result) {
    //     this.wireAthleteList = result;
    //     if(result.data) {
    //         let endResult = [];
    //         result.data.forEach((row) => {
    //             let rowData = {};
    //             rowData.label = row.Name;
    //             rowData.value = row.Id;
    //             endResult.push(rowData);
    //         });
    //         this.optionsAthleteList = endResult;
    //     }
    // }

    // get options() {
    //     return this.optionsAthleteList;
    // }
    
    // data = [];
    // //? https://github.com/PastranaDigital/lwc-udemy-course/blob/feature/dev3/force-app/main/default/lwc/accountListViewer/accountListViewer.js
    // wireChallengeScores = []; //? used for refreshApex


	updateChallengeTotals(incomingTotals) {
		let currentData = [];
		this.divisor = this.totalChallengeCount;
		// console.log('divisor',this.divisor);
		incomingTotals.forEach((row) => {
			if (row.Challenge_Total__c > 0) {
				let rowData = {};
				rowData.Id = row.Id;
				rowData.Name = row.Name;
				rowData.Did_SP_Workout__c = row.Did_SP_Workout__c / 10;
				rowData.Total_Movement_1__c = row.Total_Movement_1__c;
				rowData.Total_Movement_2__c = row.Total_Movement_2__c;
				rowData.Challenge_Total__c = row.Challenge_Total__c;

				rowData.completed = row.Challenge_Total__c >= this.totalChallengeCount ? '★' : '';
				
				rowData.barFill = `width: ${row.Challenge_Total__c > this.totalChallengeCount ? 100 : Number(row.Challenge_Total__c / this.divisor * 100).toFixed(0)}%;`;

				rowData.barFillMovement1 = `width: ${row.Total_Movement_1__c > this.totalChallengeCount ? 100 : (row.Total_Movement_1__c / this.divisor * 100).toFixed(0)}%;`;
				currentData.push(rowData);
			}
		});
		if (currentData.length > 0) {
			this.updtdChallengeTotals = currentData;
			sortArray(this.updtdChallengeTotals, 'Challenge_Total__c', true);
		}
		// console.log('this.updtdChallengeTotals: ', this.updtdChallengeTotals);
		this.buildDataComplete = true;
	}

    // @wire(getAllChallengeScores) challengeScores(result) {
    //     this.wireChallengeScores = result;
    //     if (result.data) {
    //         let currentData = [];
	// 		this.divisor = this.totalChallengeCount;
    //         // console.log('divisor',this.divisor);
	// 		result.data.forEach((row) => {
    //             if (row.Challenge_Total__c-2001 > 0) {
	// 				let rowData = {};
	// 				rowData.Id = row.Id;
	// 				rowData.Name = row.Name;
	// 				rowData.Did_SP_Workout__c = row.Did_SP_Workout__c;
	// 				rowData.Total_Movement_1__c = row.Total_Movement_1__c;
	// 				rowData.Total_Movement_2__c = row.Total_Movement_2__c;
	// 				rowData.Challenge_Total__c = row.Challenge_Total__c-2001;

	// 				rowData.completed = row.Challenge_Total__c-2001 > this.totalChallengeCount ? '★' : '';
					
	// 				rowData.barFill = `width: ${row.Challenge_Total__c > this.totalChallengeCount ? 100 : Number(row.Challenge_Total__c-2001 / this.divisor * 100).toFixed(1)}%;`;

	// 				rowData.barFillMovement1 = `width: ${row.Total_Movement_1__c > this.totalChallengeCount ? 100 : (row.Total_Movement_1__c / this.divisor * 100).toFixed(1)}%;`;
	// 				currentData.push(rowData);
	// 			}
    //         });
    //         this.data = currentData;
    //     } else if (result.error) {
    //         window.console.log(result.error);
    //     }
    // }

	refreshScores() {
		console.log('refreshing to Parent...');
		//? https://www.emizentech.com/blog/child-to-parent-communication-in-lwc.html
		const custEvent = new CustomEvent(
            'callgetmodel', {
                detail: 'payload' 
            });
        this.dispatchEvent(custEvent);
		const custEvent2 = new CustomEvent(
            'callscrolltotop', {
                detail: 'payload' 
            });
        this.dispatchEvent(custEvent2);
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
		this.newRecord.Challenge__c = this.currentChallenge.Id;
		this.buttonErrorMessage = '';
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
        
        if (!this.checkRequiredFieldsBoolean.includes(false)) {
			this.createScoreApex();
			this.buttonPressed = true;    
        } else {
			this.buttonErrorMessage = 'Please complete required fields';
            console.log('Please complete required fields');
        }    
    }

    connectedCallback() {
		this.buildDataComplete = false;
	}

	numberWithCommas(x) {
		var parts = x.toString().split(".");
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		return parts.join(".");
	}
	
	// function test(x, expect) {
	// 	const result = numberWithCommas(x);
	// 	const pass = result === expect;
	// 	console.log(`${pass ? "✓" : "ERROR ====>"} ${x} => ${result}`);
	// 	return pass;
	// }
	
	// let failures = 0;
	// failures += !test(0              , "0");
	// failures += !test(0.123456       , "0.123456");
	// failures += !test(100            , "100");
	// failures += !test(100.123456     , "100.123456");
	// failures += !test(1000           , "1,000");
	// failures += !test(1000.123456    , "1,000.123456");
	// failures += !test(10000          , "10,000");
	// failures += !test(10000.123456   , "10,000.123456");
	// failures += !test(100000         , "100,000");
	// failures += !test(100000.123456  , "100,000.123456");
	// failures += !test(1000000        , "1,000,000");
	// failures += !test(1000000.123456 , "1,000,000.123456");
	// failures += !test(10000000       , "10,000,000");
	// failures += !test(10000000.123456, "10,000,000.123456");
	// if (failures) {
	// 	console.log(`${failures} test(s) failed`);
	// } else {
	// 	console.log("All tests passed");
	// }

	// createDisplayText(incomingArray) {
	// 	let currentData = [];
	// 	incomingArray.forEach(challenge => {
	// 		let rowData = {};
	// 		rowData.Active__c = challenge.Active__c;
	// 		rowData.Days_in_Month__c = challenge.Days_in_Month__c;
	// 		rowData.Id = challenge.Id;
	// 		rowData.Movement_1__c = challenge.Movement_1__c;
	// 		rowData.Movement_2__c = challenge.Movement_2__c;
	// 		rowData.Name = challenge.Name;
	// 		rowData.Start_Date__c = challenge.Start_Date__c;
	// 		rowData.Subtitle__c = challenge.Subtitle__c;
	// 		rowData.Total_Challenge_Count__c = challenge.Total_Challenge_Count__c;
	// 		rowData.DisplayTotalCount = this.formatBigNumber(challenge.Total_Challenge_Count__c);

	// 		currentData.push(rowData);
	// 	});

	// 	return currentData;
	// }

	DisplayTotalCount;
	
	renderedCallback() {
		this.totalChallengeCount = this.currentChallenge.Total_Challenge_Count__c;
		this.daysInMonth = this.currentChallenge.Days_in_Month__c;
		// console.log(athList.data[0].Name);
		const date = Number((new Date()).getDate());
		// console.log(`date: ${date}`);
		this.pacer.pace = ((+date / this.daysInMonth * this.totalChallengeCount) > this.totalChallengeCount ? this.totalChallengeCount : (+date / this.daysInMonth * this.totalChallengeCount)).toFixed(0);
		// console.log('this.pacer.pace', this.pacer.pace);
		this.pacer.barFill = `width: ${((+date / this.daysInMonth * 100) > 100 ? 100 : (+date / this.daysInMonth * 100)).toFixed(1)}%;`;
		// console.log('this.pacer.pace', this.pacer.barFill);
		if(!this.buildDataComplete) {
			this.DisplayTotalCount = this.numberWithCommas(this.currentChallenge.Total_Challenge_Count__c);
			console.log('this.currentChallenge.DisplayTotalCount: ', this.currentChallenge.DisplayTotalCount);
			console.log('this.currentChallenge.Total_Challenge_Count__c: ', this.currentChallenge.Total_Challenge_Count__c.toString());
			this.updateChallengeTotals(this.challengeTotals);
		}
	}
}