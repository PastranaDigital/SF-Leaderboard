import { LightningElement, wire } from 'lwc';
import imageResource from '@salesforce/resourceUrl/SPCompImages';
// import athleteResource from '@salesforce/resourceUrl/SPCompAthletes';
// import getAllAthletes from "@salesforce/apex/AthleteLwcController.getAllAthletes";
import getAllScores from "@salesforce/apex/ResultsLwcController.getAllScores";

export default class Results extends LightningElement {
    wiredScoreData = [];
    scoreData = [];
    keyLogo = imageResource + '/Images/key_logo.png';

    data;
    workoutSet =  new Set([]);
    workoutArray = [];
    totalResults = {};
    incomingScores;

    workout = {};

    error;
    getWorkoutDetails() {
        getAllScores()
            .then(result => {
                let currentData = [];
                result.forEach(row => {
                    let rowData = {};
                    rowData.Id = row.Id;
                    rowData.WorkoutOrder = row.Vault_Workout__r.Order__c;
                    rowData.WorkoutName = row.Vault_Workout__r.Name;
                    rowData.DidRX = row.Did_RX_or_RXplus__c;
                    rowData.HitGoal = row.Is_Score_Between_Goal__c;

                    currentData.push(rowData);
                });
                // console.log('currentData', currentData);
                this.scoreData = currentData;
                console.log('this.scoreData', this.scoreData);
                console.log(this.scoreData.length);
                console.log("Successful workoutsOrgByAthlete retrieval");


                this.incomingScores = this.scoreData;


                //! get unique workouts
                this.incomingScores.forEach(element => {
                    this.workoutSet.add(element.WorkoutName);
                });
                this.workoutArray = [...this.workoutSet];

                this.data = [];
                    
                //! place the workouts into workout objects
                let workoutOrder = 1;
                this.workoutArray.forEach(row => {
                    let tempWorkout = {
                        WorkoutOrder: '',
                        WorkoutName: '',
                        AllScoreSubmissions: []
                    };
                    tempWorkout.WorkoutOrder = workoutOrder;
                    tempWorkout.WorkoutName = row;
                    // this.data.push(tempWorkout);
                    workoutOrder++;
                    //! place the incoming scores into the specific workout objects
                    this.incomingScores.forEach(element => {
                        if(element.WorkoutName == row) {
                            let tempObj = {};
                            tempObj.ScoreId = element.Id;
                            tempObj.WorkoutName = element.WorkoutName;
                            tempObj.DidRX = element.DidRX;
                            if(element.HitGoal == 100) {
                                let value = 1;
                                tempObj.HitGoal = value;
                            } else {
                                let value = 0;
                                tempObj.HitGoal = value;
                            }

                            tempWorkout.AllScoreSubmissions.push(tempObj);
                        }
                    });
                    this.data.push(tempWorkout);
                });

                //! go through each workout object and calculate the details
                this.data.forEach(element => {
                    element.TotalSubmissions = element.AllScoreSubmissions.length;
                    //! count the RX values
                    element.RxCount = 0;
                    element.AllScoreSubmissions.forEach(row => {
                        element.RxCount = row.DidRX ? element.RxCount += 1 : element.RxCount;
                    });
                    //! calc the RX Percent
                    element.RxPercent = (element.RxCount / element.TotalSubmissions * 100);
                    element.RxPercent = element.RxPercent.toFixed(1);
                    //! make RxCalced String
                    element.RxCalced = ((element.RxPercent * 31.4) / 100) + ' 31.4';


                    //! count the Goal values
                    element.GoalCount = 0;
                    element.AllScoreSubmissions.forEach(row => {
                        element.GoalCount += row.HitGoal;
                    });
                    //! calc the Goal Percent
                    element.GoalPercent = (element.GoalCount / element.TotalSubmissions * 100);
                    element.GoalPercent = element.GoalPercent.toFixed(1);
                    //! make GoalCalced String
                    element.GoalCalced = ((element.GoalPercent * 31.4) / 100) + ' 31.4';
                });

                //! get the total values for totalResults
                this.totalResults.TotalSubmissions = 0;
                this.totalResults.RxCount = 0;
                this.totalResults.RxPercent = 0;
                // this.totalResults.RxCalced = ((45 * 31.4) / 100) + ' 31.4'; 
                this.totalResults.GoalCount = 0;
                this.totalResults.GoalPercent = 0;
                // this.totalResults.GoalCalced = ((70 * 31.4) / 100) + ' 31.4';
                this.data.forEach(workout => {
                    this.totalResults.TotalSubmissions += workout.TotalSubmissions;
                    this.totalResults.RxCount += workout.RxCount;
                    this.totalResults.GoalCount += workout.GoalCount;

                    //! calc the RX Percent
                    this.totalResults.RxPercent = (this.totalResults.RxCount / this.totalResults.TotalSubmissions * 100);
                    this.totalResults.RxPercent = this.totalResults.RxPercent.toFixed(1);
                    //! make RxCalced String
                    this.totalResults.RxCalced = ((this.totalResults.RxPercent * 31.4) / 100) + ' 31.4';
                    
                    //! calc the Goal Percent
                    this.totalResults.GoalPercent = (this.totalResults.GoalCount / this.totalResults.TotalSubmissions * 100);
                    this.totalResults.GoalPercent = this.totalResults.GoalPercent.toFixed(1);
                    //! make GoalCalced String
                    this.totalResults.GoalCalced = ((this.totalResults.GoalPercent * 31.4) / 100) + ' 31.4';
                });
                console.log('data', this.data);
                console.log('totalResults', this.totalResults);
                console.log('Completed building the data');
                this.buildDataComplete = true;
            })
            .catch(error => {
                this.error = error;
                console.log('Error: ', error);
            });
    }
    
    connectedCallback() {
        console.log('connected');
    }
    
    buildDataComplete = false;
    renderedCallback() {
        if(this.scoreData.length == 0 && !this.buildDataComplete) {
            this.getWorkoutDetails();
        }
        console.log('rendered');
        console.log(this.totalResults.GoalCalced);
    }
}