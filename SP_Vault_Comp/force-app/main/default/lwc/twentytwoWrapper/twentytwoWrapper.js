import { LightningElement } from 'lwc';
import imageResource from '@salesforce/resourceUrl/twentytwoImages';
import getViewModel from '@salesforce/apex/LeaderboardController.getViewModel';
export default class TwentytwoWrapper extends LightningElement {
	outboundModel = {};
	inboundModel = {};
	
    connectedCallback() {
		this.getModel();
    }
	
	getModel() {
		getViewModel()
			.then((result) => {
				console.log('result', result);
				this.outboundModel = Object.assign({}, result.outboundModel);
				console.log('this.outboundModel', this.outboundModel.currentWorkout.URL__c);
				this.inboundModel = Object.assign({}, result.inboundModel);
			})
			.catch((error) => {
				this.handleError(error);
			});
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
			console.log('addActiveClass', page);
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