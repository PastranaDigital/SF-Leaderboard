import { LightningElement } from 'lwc';
import imageResource from '@salesforce/resourceUrl/twentytwoImages';
import athleteResource from '@salesforce/resourceUrl/SPCompAthletes';
import getViewModel from '@salesforce/apex/LeaderboardController.getViewModel';
export default class TwentytwoWrapper extends LightningElement {
	outboundModel = {};
	inboundModel = {};
	allAthleteInfo = [];
	allScoreSubmissions = [];
	loading = true;
	
    connectedCallback() {
		this.getModel();
    }
	
	getModel() {
		getViewModel()
			.then((result) => {
				console.log('result', result);
				this.outboundModel = Object.assign({}, result.outboundModel);
				// console.log('this.outboundModel', this.outboundModel.currentWorkout.URL__c);
				this.inboundModel = Object.assign({}, result.inboundModel);
			})
			.catch((error) => {
				this.handleError(error);
			})
			.finally(() => {
				this.buildAthleteInfo(this.outboundModel.allAthleteInfo);
				this.buildScoreSubmissions(this.outboundModel.allScoreSubmissions);

				this.loading = false;
			});
			
	}

	buildAthleteInfo(incomingArray) {
		if (!incomingArray) return;
		let rank = 1;
		let currentData = [];
		incomingArray.forEach((row) => {
			let rowData = {};
			rowData.Age__c = row.Age__c;
			rowData.Total_Movement_1__c = row.Total_Movement_1__c;
			rowData.Total_Tie_Break_Points__c = row.Total_Tie_Break_Points__c;
			rowData.Is_RX__c = row.Is_RX__c;
			rowData.Total_Movement_2__c = row.Total_Movement_2__c;
			rowData.Grand_Total__c = row.Grand_Total__c;
			rowData.Challenge_Total__c = row.Challenge_Total__c;
			rowData.Profile_Pic_URL__c = row.Profile_Pic_URL__c;
			rowData.Did_SP_Workout__c = row.Did_SP_Workout__c;
			rowData.Name = row.Name;
			rowData.Total_Points__c = row.Total_Points__c;
			rowData.Id = row.Id;
			rowData.Grand_Total_Tie_Break__c = row.Grand_Total_Tie_Break__c;
			rowData.Location__c = row.Location__c;
			rowData.Challenges_Completed__c = row.Challenges_Completed__c;

			rowData.Rank = rank;
			rowData.Profile_Pic_URL__c = athleteResource + '/Athletes/' + row.Profile_Pic_URL__c;

			currentData.push(rowData);
			rank++;
		});
		this.allAthleteInfo = currentData;
	}

	buildScoreSubmissions(incomingArray) {
		if (!incomingArray) return;
		let currentData = [];
		incomingArray.forEach((row) => {
			let rowData = {};
			rowData.Id = row.Id; // score submission Id
			rowData.AthleteId = row.Athlete_Name__c;
			rowData.AthleteName = row.Athlete_Name__r.Name;
			rowData.WorkoutName = row.Vault_Workout__r.Name;
			rowData.Is_Score_Between_Goal__c = row.Is_Score_Between_Goal__c;
			rowData.Points_Based_on_Rank__c = row.Points_Based_on_Rank__c;
			rowData.Total_Points__c = row.Total_Workout_Points__c;

			rowData.Score_1st__c = row.Score_1st__c;
			rowData.First_Label__c = row.Vault_Workout__r.First_Label__c;
			rowData.Score_2nd__c = row.Score_2nd__c;
			rowData.Second_Label__c = row.Vault_Workout__r.Second_Label__c;
			rowData.Weight_Used__c = row.Weight_Used__c;
			rowData.RX_Weight_Male__c = row.Vault_Workout__r.RX_Weight_Male__c;

			currentData.push(rowData);
		});
		this.allScoreSubmissions = currentData;
	}

	handleError(error) {
		console.log(error);
	}

	headerTitle = 'Leaderboard';
	showLeaderboardPage = true;
	showSubmitPage = false;
	showWorkoutPage = false;
	showMonthlyPage = false;
	pages = [
		{
			name: 'showLeaderboardPage',
			active: true
		},
		{
			name: 'showSubmitPage',
			active: false
		},
		{
			name: 'showWorkoutPage',
			active: false
		},
		{
			name: 'showMonthlyPage',
			active: false
		},
	];


    labels = {
        ComponentFooter: '2022 Vault',
    };
    
    img_logo = imageResource + '/key_logo.png';
    nav_leaderboard = imageResource + '/leaderboard.png';
    nav_monthly = imageResource + '/monthly.png';
    nav_workout = imageResource + '/workout.png';
    nav_score = imageResource + '/score.png';
    
	addActiveClass() {
		this.pages.forEach(page => {
			// console.log('addActiveClass', page);
		});
	}

    handleLeaderboardClick() {
        this.showLeaderboardPage = true;
        this.showSubmitPage = false;
        this.showWorkoutPage = false;
        this.showMonthlyPage = false;
        this.headerTitle = 'Leaderboard';
		this.addActiveClass();
    }

    handleSubmitClick() {
        this.showLeaderboardPage = false;
        this.showSubmitPage = true;
        this.showWorkoutPage = false;
        this.showMonthlyPage = false;
        this.headerTitle = 'Submit Score';
    }

    handleWorkoutClick() {
        this.showLeaderboardPage = false;
        this.showSubmitPage = false;
        this.showWorkoutPage = true;
        this.showMonthlyPage = false;
        this.headerTitle = 'Workouts';
    }

    handleMonthlyClick(){
        this.showLeaderboardPage = false;
        this.showSubmitPage = false;
        this.showWorkoutPage = false;
        this.showMonthlyPage = true;
        this.headerTitle = 'Challenge';
    }
}