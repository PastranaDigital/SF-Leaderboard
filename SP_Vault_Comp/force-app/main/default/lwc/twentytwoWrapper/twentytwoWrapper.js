import { LightningElement } from 'lwc';
import imageResource from '@salesforce/resourceUrl/twentytwoImages';
import workoutImages from '@salesforce/resourceUrl/SPCompImages';
import athleteResource from '@salesforce/resourceUrl/SPCompAthletes';
import getViewModel from '@salesforce/apex/LeaderboardController.getViewModel';
import { sortArray } from './helper.js';
export default class TwentytwoWrapper extends LightningElement {
	outboundModel = {};
	inboundModel = {};

	//? outgoing variables to child components
	allAthleteInfo = [];
	allScoreSubmissions = [];
	allAthleteScores = [];
	allAthleteOptions = [];
	allWorkoutResults = [];
	allChallengeEntries = [];
	
	loading = true;
	
    connectedCallback() {
		this.getModel();
    }
	
	getModel() {
		console.log('getting model');
		this.loading = true;
		getViewModel()
			.then((result) => {
				console.log('ViewModel: ', result);
				this.outboundModel = Object.assign({}, result.outboundModel);
				// console.log('this.outboundModel', this.outboundModel.currentWorkout.URL__c);
				this.inboundModel = Object.assign({}, result.inboundModel);
			})
			.catch((error) => {
				this.handleError(error);
			})
			.finally(() => {
				this.buildAllAthleteInfo(this.outboundModel.allAthleteInfo);
				this.buildAllScoreSubmissions(this.outboundModel.allScoreSubmissions);
				this.buildAllAthleteScores(this.allAthleteInfo, this.allScoreSubmissions);
				this.buildAllAthleteOptions(this.allAthleteInfo);
				this.buildAllWorkoutResults(this.outboundModel.allWorkouts, this.allScoreSubmissions);
				this.buildAllChallengeEntries(this.outboundModel.allChallenges, this.outboundModel.allChallengeEntries);

				this.loading = false;
			});
	}

	buildAllAthleteInfo(incomingAthletes) {
		if (!incomingAthletes) return;
		let rank = 1;
		let currentData = [];
		incomingAthletes.forEach((row) => {
			let rowData = {};
			rowData.Age__c = row.Age__c;
			rowData.Total_Tie_Break_Points__c = row.Total_Tie_Break_Points__c;
			rowData.Is_RX__c = row.Is_RX__c;
			rowData.Grand_Total__c = row.Grand_Total__c;
			
			rowData.Did_SP_Workout__c = row.Did_SP_Workout__c * 10;
			rowData.Total_Movement_1__c = row.Total_Movement_1__c;
			rowData.Total_Movement_2__c = row.Total_Movement_2__c;
			rowData.Challenge_Total__c = row.Challenge_Total__c;
			
			rowData.Profile_Pic_URL__c = row.Profile_Pic_URL__c;
			rowData.Name = row.Name;
			rowData.Total_Points__c = row.Total_Points__c;
			rowData.Id = row.Id;
			rowData.Grand_Total_Tie_Break__c = row.Grand_Total_Tie_Break__c;
			rowData.Location__c = row.Location__c;
			rowData.Challenges_Completed__c = row.Challenges_Completed__c;

			//? additions to data
			rowData.Rank = rank;
			rowData.RankText = this.getRankNumber(rank);
			rowData.Profile_Pic_URL__c = athleteResource + '/Athletes/' + row.Profile_Pic_URL__c;
			
			currentData.push(rowData);
			rank++;
		});
		this.allAthleteInfo = currentData;
	}

	buildAllScoreSubmissions(incomingScores) {
		if (!incomingScores) return;
		let currentData = [];
		incomingScores.forEach((row) => {
			let rowData = {};
			rowData.Id = row.Id; // score submission Id
			rowData.WorkoutId = row.Vault_Workout__c;
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

	buildAllAthleteScores(incomingAthletes, incomingScores) {
		if (!incomingAthletes || !incomingScores) return;
		let currentData = [];
        incomingAthletes.forEach(athlete => {
            let rowData = athlete;
            let athWorkouts = [];
            incomingScores.forEach((score) => {
                let athScore = {};
                if (athlete.Id == score.AthleteId) {
					athScore.WorkoutName = score.WorkoutName;

                    athScore.Score_1st__c = score.Score_1st__c;
                    athScore.First_Label__c = score.First_Label__c;
                    athScore.Score_2nd__c = score.Score_2nd__c;
                    athScore.Second_Label__c = score.Second_Label__c;
                    athScore.Weight_Used__c = score.Weight_Used__c;
                    athScore.RX_Weight_Male__c = score.RX_Weight_Male__c;

                    athScore.Is_Score_Between_Goal__c = score.Is_Score_Between_Goal__c;
                    athScore.Points_Based_on_Rank__c = score.Points_Based_on_Rank__c;
                    athScore.Total_Points__c = score.Total_Points__c;
                    
                    let RankNumber = ((105 - score.Points_Based_on_Rank__c) / 5);
        
                    athScore.RankNumber = this.getRankNumber(RankNumber);

                    //? takes the Score Submission and make it into a string
                    let ScoreString = `${score.Score_1st__c} ${score.First_Label__c}`;
                    //! needs to be done here
                    if (score.Second_Label__c) {
                        ScoreString += ` ${score.Score_2nd__c} ${score.Second_Label__c}`;
                    } 
                    if (score.RX_Weight_Male__c) {
                        ScoreString += ` @ ${score.Weight_Used__c} lbs`;
                    };
                    athScore.ScoreString = ScoreString;

                    athWorkouts.push(athScore);
                }
            });
            rowData.allWorkouts = athWorkouts;
            currentData.push(rowData);
        });
		this.allAthleteScores = currentData;
	}

	buildAllAthleteOptions(incomingAthletes) {
		if (!incomingAthletes) return;
		let currentData = [];
        incomingAthletes.forEach(athlete => {
			let rowData = {};
			rowData.label = athlete.Name;
			rowData.value = athlete.Id;
			currentData.push(rowData);
		});
		sortArray(currentData, 'label');
		this.allAthleteOptions = currentData;
	}

	buildAllWorkoutResults(incomingWorkouts, incomingScores) {
		if (!incomingWorkouts || !incomingScores) return;
		let currentData = [];
        incomingWorkouts.forEach(workout => {
            // let rowData = workout;
			let rowData = {};
			rowData.Name = workout.Name;
			rowData.Id = workout.Id;
			rowData.AccordionName = String(workout.Order__c);
			rowData.AccordionTitle = `#${workout.Order__c} ${workout.Name} - ${workout.Workout_Date__c}`;
			rowData.Plain_Description__c = workout.Plain_Description__c;
			rowData.Description__c = workout.Description__c;
			rowData.First_Label__c = workout.First_Label__c;
			rowData.Second_Label__c = workout.Second_Label__c;
			rowData.Order__c = workout.Order__c;
			rowData.Active__c = workout.Active__c;
			rowData.Goal__c = workout.Goal__c;
			rowData.Image_File__c = workoutImages + '/Images/' + workout.Image_File__c;
			rowData.RX_Weight_Male__c = workout.RX_Weight_Male__c;
			rowData.URL__c = workout.URL__c;
			rowData.Workout_Date__c = workout.Workout_Date__c;
			// console.log('rowData: ', rowData);
            let workoutScores = [];
			// console.log('workout.Id: ', workout.Id);
            incomingScores.forEach((score) => {
                let athScore = {};
                if (workout.Id === score.WorkoutId) {
					athScore.WorkoutName = score.WorkoutName;
                    
					let RankNumber = ((105 - score.Points_Based_on_Rank__c) / 5);
					athScore.Rank = RankNumber;
					
					athScore.AthleteName = score.AthleteName;
					athScore.WorkoutId = score.WorkoutId;
					athScore.Id = score.Id;
					// console.log('athScore.WorkoutName: ', athScore.WorkoutName);
                    athScore.Score_1st__c = score.Score_1st__c;
                    athScore.First_Label__c = score.First_Label__c;
                    athScore.Score_2nd__c = score.Score_2nd__c;
                    athScore.Second_Label__c = score.Second_Label__c;
                    athScore.Weight_Used__c = score.Weight_Used__c;
                    athScore.RX_Weight_Male__c = score.RX_Weight_Male__c;

                    athScore.Is_Score_Between_Goal__c = score.Is_Score_Between_Goal__c;
                    athScore.Points_Based_on_Rank__c = score.Points_Based_on_Rank__c;
                    athScore.Total_Points__c = score.Total_Points__c;
                    
					
                    athScore.RankNumber = this.getRankNumber(RankNumber);

                    //? takes the Score Submission and make it into a string
                    let ScoreString = `${score.Score_1st__c} ${score.First_Label__c}`;
                    //! needs to be done here
                    if (score.Second_Label__c) {
                        ScoreString += ` ${score.Score_2nd__c} ${score.Second_Label__c}`;
                    } 
                    if (score.RX_Weight_Male__c) {
                        ScoreString += ` @ ${score.Weight_Used__c} lbs`;
                    };
                    athScore.ScoreString = ScoreString;

                    workoutScores.push(athScore);
                }
            });
			sortArray(workoutScores, 'Rank');
			// workoutScores.sort((a,b) => (a.Rank > b.Rank) ? 1 : ((b.Rank > a.Rank) ? -1 : 0))
            rowData.allResults = workoutScores;
            currentData.push(rowData);
        });
		this.allWorkoutResults = currentData;
		// console.log('this.allWorkoutResults: ', this.allWorkoutResults);
	}

	buildAllChallengeEntries(incomingChallenges, incomingEntries) {
		if (!incomingChallenges || !incomingEntries) return;
		let currentData = [];
        incomingChallenges.forEach(challenge => {
            // let rowData = challenge;
			let rowData = {};
			rowData.Active__c = challenge.Active__c;
			rowData.Days_in_Month__c = challenge.Days_in_Month__c;
			rowData.Id = challenge.Id;
			rowData.Movement_1__c = challenge.Movement_1__c;
			rowData.Movement_2__c = challenge.Movement_2__c;
			rowData.Name = challenge.Name;
			rowData.Start_Date__c = challenge.Start_Date__c;
			rowData.Subtitle__c = challenge.Subtitle__c;
			rowData.Total_Challenge_Count__c = challenge.Total_Challenge_Count__c;
			
			// console.log('rowData: ', rowData);
            let challengeEntries = [];
			incomingEntries.forEach((entry) => {
                let athEntry = {};
                if (challenge.Id === entry.Challenge__c) {
					athEntry.Athlete__c = entry.Athlete__c;
					athEntry.AthleteName = entry.Athlete__r.Name;
					athEntry.Challenge__c = entry.Challenge__c;
					athEntry.WorkoutName = entry.Challenge__r.Name;
					athEntry.Checkbox_Points__c = entry.Checkbox_Points__c;
					athEntry.Daily_Checkbox__c = entry.Daily_Checkbox__c;
					athEntry.Entry_Total__c = entry.Entry_Total__c;
					athEntry.Id = entry.Id;
					athEntry.Movement_1__c = entry.Movement_1__c;
					
					challengeEntries.push(athEntry);
                }
            });
			currentData.push(rowData);
        });
		this.allChallengeEntries = currentData;
	}

	getRankNumber(incomingRank) {
        let RankNumber = incomingRank;
        let lastDigit = RankNumber % 10;
        let lastTwoDigits = RankNumber % 100;
        if(lastTwoDigits == 11 || lastTwoDigits == 12 || lastTwoDigits == 13 ) {
            lastDigit = 0;
        }
        switch (lastDigit) {
            case 1:
                RankNumber += 'st';
                break;
            case 2:
                RankNumber += 'nd';
                break;
            case 3:
                RankNumber += 'rd';
                break;
            default:
                RankNumber += 'th';
                break;
        }
        return RankNumber;
    }

	handleError(error) {
		console.log(error);
	}

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
    nav_score = imageResource + '/score.png';

	scrollToTop() {
		document.body.scrollTop = document.documentElement.scrollTop = 0;
	}

    handleLeaderboardClick() {
        this.showLeaderboardPage = true;
        this.showSubmitPage = false;
        this.showWorkoutPage = false;
        this.showMonthlyPage = false;
        this.headerTitle = '';
		this.headerTitle = 'Leaderboard';
		this.scrollToTop();
    }

    handleSubmitClick() {
        this.showLeaderboardPage = false;
        this.showSubmitPage = true;
        this.showWorkoutPage = false;
        this.showMonthlyPage = false;
        this.headerTitle = '';
		this.headerTitle = 'Submit Vault';
		this.scrollToTop();
	}

    handleWorkoutClick() {
        this.showLeaderboardPage = false;
        this.showSubmitPage = false;
        this.showWorkoutPage = true;
        this.showMonthlyPage = false;
        this.headerTitle = '';
		this.headerTitle = 'Workouts';
		this.scrollToTop();
	}

    handleMonthlyClick(){
        this.showLeaderboardPage = false;
        this.showSubmitPage = false;
        this.showWorkoutPage = false;
        this.showMonthlyPage = true;
        this.headerTitle = '';
		this.headerTitle = 'Challenge';
		this.scrollToTop();
	}
}