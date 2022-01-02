import { LightningElement, api } from 'lwc';
import { sortArray } from './helper.js';

export default class TwentytwoLeaderboard extends LightningElement {
	@api incomingScores;
	@api incomingAthleteScores;
	
	displayAthleteScore; // Expand all onclick Boolean value

    //! Boolean tracked variable to indicate if modal is open or not default value is false as modal is closed when page is loaded 
    isModalOpen = false;
    athSpotlight = {};
    
    athId;
    athName;
    
    openModal(event) {
        this.athId = (event.target.id).split('-');
        this.athId = this.athId[0];
        this.athName = event.target.innerHTML;
        this.athName = this.athName.split('>');
        this.athName = this.athName[1];
        
        this.data.forEach(element => {
			if (element.Id == this.athId) {
				this.athSpotlight.Id = element.Id;
				this.athSpotlight.Name = element.Name;
				this.athSpotlight.Location = element.Location__c;
				this.athSpotlight.Age = element.Age__c;
				this.athSpotlight.Pic = element.Profile_Pic_URL__c;
				this.athSpotlight.Rank = element.Rank;
				this.athSpotlight.RankText = element.RankText;
				this.athSpotlight.TotalPoints = element.Total_Points__c;
				this.athSpotlight.allWorkouts = element.allWorkouts;
				
				this.athSpotlight.RankNumber = element.RankNumber;

				this.athSpotlight.ChallengeTotal = element.Challenges_Completed__c;
				this.athSpotlight.SPWorkouts = element.Did_SP_Workout__c;
				this.athSpotlight.GrandTotal = element.Grand_Total__c;
			}
		});
        this.isModalOpen = true;
    }
    
    closeModal() {
        // to close modal set isModalOpen track value as false
        this.isModalOpen = false;
    }
    
    submitDetails() {
        // to close modal set isModalOpen track value as false
        // Add your code to call apex method or do some processing
        this.isModalOpen = false;
    }
    //! -----------------------------------------------------

    scoreData = [];
    data = [];
	vaultReport = [];
	challengeReport = [];
	workoutReport = [];
	buildReportComplete = false;

	assignData() {
		this.scoreData = this.incomingScores;
		this.data = this.incomingAthleteScores;
		
		if (!this.buildReportComplete) {
			//? build vault report data
			this.data.forEach((element) => {
				let rowData = {};
				rowData.Id = element.Id;
				rowData.Name = element.Name;
				rowData.Total_Points__c = element.Total_Points__c;
				this.vaultReport.push(rowData);
				sortArray(this.vaultReport, 'Total_Points__c', true); //? true for descending
			});
			
			//? build challenge report data
			this.data.forEach((element) => {
				let rowData = {};
				rowData.Id = element.Id;
				rowData.Name = element.Name;
				rowData.Challenges_Completed__c = element.Challenges_Completed__c;
				this.challengeReport.push(rowData);
				sortArray(this.challengeReport, 'Challenges_Completed__c', true); //? true for descending
			});
			
			//? build workout report data
			this.data.forEach((element) => {
				let rowData = {};
				rowData.Id = element.Id;
				rowData.Name = element.Name;
				rowData.Did_SP_Workout__c = element.Did_SP_Workout__c;
				this.workoutReport.push(rowData);
				sortArray(this.workoutReport, 'Did_SP_Workout__c', true); //? true for descending
			});

			this.buildReportComplete = true;
		}

	}

	handleAthleteClick(event) {
        if (this.displayAthleteScore) {
            this.displayAthleteScore = false;
            this.template.querySelector('button').innerHTML = '&#9650;';
        } else {
            this.displayAthleteScore = true;
            this.template.querySelector('button').innerHTML = '&#9660;';
        }        
    }

    connectedCallback() {
        this.displayAthleteScore = false;
    }
	
    renderedCallback() {
		this.assignData();
    }
}