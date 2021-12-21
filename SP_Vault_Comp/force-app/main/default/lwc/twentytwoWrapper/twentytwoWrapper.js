import { LightningElement } from 'lwc';
import imageResource from '@salesforce/resourceUrl/twentytwoImages';

export default class TwentytwoWrapper extends LightningElement {
    headerTitle = 'Leader Board';
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
    img_workout = imageResource + '/workout01.png';
    

    handleLeaderboardClick() {
        this.showLeaderboardPage = true;
        this.showSubmitPage = false;
        this.showWorkoutPage = false;
        this.showMonthlyPage = false;
        this.headerTitle = 'Leader Board';
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
        this.headerTitle = 'Vault Workout';
    }

    handleMonthlyClick(){
        this.showLeaderboardPage = false;
        this.showSubmitPage = false;
        this.showWorkoutPage = false;
        this.showMonthlyPage = true;
        this.headerTitle = 'Monthly Challenge';
    }

    connectedCallback() {
    }
}