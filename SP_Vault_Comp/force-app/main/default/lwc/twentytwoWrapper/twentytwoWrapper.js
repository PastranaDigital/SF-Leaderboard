import { LightningElement } from 'lwc';
import imageResource from '@salesforce/resourceUrl/twentytwoImages';

export default class TwentytwoWrapper extends LightningElement {
    headerTitle = 'Leaderboard';
    showLeaderboardPage = true;
    showSubmitPage = false;
    showWorkoutPage = false;
    showMonthlyPage = false;

    labels = {
        ComponentFooter: '2022 Vault',
    };
    
    img_logo = imageResource + '/key_logo.png';
    nav_leaderboard = imageResource + '/leaderboard.png';
    nav_monthly = imageResource + '/monthly.png';
    nav_workout = imageResource + '/workout.png';
    
	idealData = {
		//? workouts ordered by date ASC
		allWorkouts: [
			{
				name: 'Alpha WOD',
				active: true,
				date: '01/01/22',
				url: 'https://my.streetparking.com',
				description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse sequi saepe rem maxime, consequatur culpa fugit delectus autem magnam nam!',
				rxWeight: 40,
				goal: 245,
				firstLabel: 'rounds',
				secondLabel: 'reps',
			},
			{
				name: 'Bravo WOD',
				active: true,
				date: '01/08/22',
				url: 'https://my.streetparking.com',
				description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse sequi saepe rem maxime, consequatur culpa fugit delectus autem magnam nam!',
				rxWeight: 40,
				goal: 245,
				firstLabel: 'rounds',
				secondLabel: 'reps',
			},
			{
				name: 'Charlie WOD',
				active: true,
				date: '01/15/22',
				url: 'https://my.streetparking.com',
				description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse sequi saepe rem maxime, consequatur culpa fugit delectus autem magnam nam!',
				rxWeight: 40,
				goal: 245,
				firstLabel: 'rounds',
				secondLabel: 'reps',
			},
		],
		allAthletes: [
			{
				rank: 1,
				id: '1245442134',
				name: 'Lorem Ipsum',
				totalPoints: 5000,
				age: 39,
				location: 'Texas',
				profilePicUrl: 'default.png',
			},
			{
				rank: 2,
				id: '1245442134',
				name: 'Lorem Ipsum',
				totalPoints: 5000,
				age: 39,
				location: 'Texas',
				profilePicUrl: 'default.png',
			},
			{
				rank: 3,
				id: '1245442134',
				name: 'Lorem Ipsum',
				totalPoints: 5000,
				age: 39,
				location: 'Texas',
				profilePicUrl: 'default.png',
			},
			{
				rank: 4,
				id: '1245442134',
				name: 'Lorem Ipsum',
				totalPoints: 5000,
				age: 39,
				location: 'Texas',
				profilePicUrl: 'default.png',
			},
		],
		allResults: [
			{
				workoutName: 'Alpha WOD',
				rank: 1,
				name: 'Lorem Ipsum',
				score1st: 4,
				score2nd: 28,
				weightUsed: 40,
				topScoreString: `${element.Score_1st__c} ${row.First_Label__c}`,
			},
			{
				workoutName: 'Alpha WOD',
				rank: 2,
				name: 'Lorem Ipsum',
				score1st: 4,
				score2nd: 28,
				weightUsed: 40,
				topScoreString: `${element.Score_1st__c} ${row.First_Label__c}`,
			},
			{
				workoutName: 'Alpha WOD',
				rank: 3,
				name: 'Lorem Ipsum',
				score1st: 4,
				score2nd: 28,
				weightUsed: 40,
				topScoreString: `${element.Score_1st__c} ${row.First_Label__c}`,
			},
			{
				workoutName: 'Alpha WOD',
				rank: 4,
				name: 'Lorem Ipsum',
				score1st: 4,
				score2nd: 28,
				weightUsed: 40,
				topScoreString: `${element.Score_1st__c} ${row.First_Label__c}`,
			},
			{
				workoutName: 'Bravo WOD',
				rank: 1,
				name: 'Lorem Ipsum',
				score1st: 4,
				score2nd: 28,
				weightUsed: 40,
				topScoreString: `${element.Score_1st__c} ${row.First_Label__c}`,
			},
			{
				workoutName: 'Bravo WOD',
				rank: 2,
				name: 'Lorem Ipsum',
				score1st: 4,
				score2nd: 28,
				weightUsed: 40,
				topScoreString: `${element.Score_1st__c} ${row.First_Label__c}`,
			},
			{
				workoutName: 'Bravo WOD',
				rank: 3,
				name: 'Lorem Ipsum',
				score1st: 4,
				score2nd: 28,
				weightUsed: 40,
				topScoreString: `${element.Score_1st__c} ${row.First_Label__c}`,
			},
		],
	};

    handleLeaderboardClick() {
        this.showLeaderboardPage = true;
        this.showSubmitPage = false;
        this.showWorkoutPage = false;
        this.showMonthlyPage = false;
        this.headerTitle = 'Leaderboard';
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
        this.headerTitle = 'Workout';
    }

    handleMonthlyClick(){
        this.showLeaderboardPage = false;
        this.showSubmitPage = false;
        this.showWorkoutPage = false;
        this.showMonthlyPage = true;
        this.headerTitle = 'Challenge';
    }

    connectedCallback() {
    }
}