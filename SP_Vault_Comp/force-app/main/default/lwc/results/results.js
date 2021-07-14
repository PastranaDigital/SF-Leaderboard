import { LightningElement, wire } from 'lwc';
import imageResource from '@salesforce/resourceUrl/SPCompImages';
// import athleteResource from '@salesforce/resourceUrl/SPCompAthletes';
// import getAllAthletes from "@salesforce/apex/AthleteLwcController.getAllAthletes";
import getAllScores from "@salesforce/apex/ResultsLwcController.getAllScores";

export default class Leaderboard extends LightningElement {
    buildDataComplete = false;


    wiredScoreData = [];

    data =[];

    //? EXAMPLE
    totalResults = {
        TotalSubmissions: 20,
        RxCount: 9,
        RxPercent: 45,
        RxCalced: ((45 * 31.4) / 100) + ' 31.4', 
        GoalCount: 14,
        GoalPercent: 70,
        GoalCalced: ((70 * 31.4) / 100) + ' 31.4',
    };
    
    //? EXAMPLE
    data2 =[
        {
            WorkoutOrder: '1',                  //? Make on first pass
            WorkoutName: 'Prometheus',          //? Make on first pass

            AllScoreSubmissions: [              //? Make on second pass
                {
                    ScoreId: 'a1234',
                    WorkoutName: 'Example',
                    DidRx: 1,
                    HitGoal: 1,
                },
                {
                    ScoreId: 'a1234',
                    WorkoutName: 'Example',
                    DidRx: 1,
                    HitGoal: 1,
                },
                {
                    ScoreId: 'a1234',
                    WorkoutName: 'Example',
                    DidRx: 1,
                    HitGoal: 1,
                },
                {
                    ScoreId: 'a1234',
                    WorkoutName: 'Example',
                    DidRx: 1,
                    HitGoal: 1,
                },
            ],
            //? Make on third pass
            TotalSubmissions: 10,                   //! length of array with all workout scores
            RxCount: 5,                             //! Count of how many TRUE Rx values
            RxPercent: 50,                          //! RxCount / TotalSubmissions
            RxCalced: ((50 * 31.4) / 100) + ' 31.4',//! Calced while object being built 
            GoalCount: 8,                           //! Count of how many 100 In Goal values
            GoalPercent: 80,                        //! GoalCount / TotalSubmissions
            GoalCalced: ((80 * 31.4) / 100) + ' 31.4',
        },
        {
            WorkoutOrder: '2',
            WorkoutName: 'Workout',

            AllScoreSubmissions: [
                {
                    ScoreId: 'a1234',
                    WorkoutName: 'Example',
                    DidRx: true,
                    HitGoal: true,
                },
                {
                    ScoreId: 'a1234',
                    WorkoutName: 'Example',
                    DidRx: true,
                    HitGoal: false,
                },
                {
                    ScoreId: 'a1234',
                    WorkoutName: 'Example',
                    DidRx: true,
                    HitGoal: false,
                },
            ],
            TotalSubmissions: 10,                   //! length of array with all workout scores
            RxCount: 4,                             //! Count of how many TRUE Rx values
            RxPercent: 40,                          //! RxCount / TotalSubmissions
            RxCalced: ((40 * 31.4) / 100) + ' 31.4',//! Calced while object being built 
            GoalCount: 6,                           //! Count of how many 100 In Goal values
            GoalPercent: 60,                        //! GoalCount / TotalSubmissions
            GoalCalced: ((60 * 31.4) / 100) + ' 31.4',
        },
    ];
    wireAthleteList = []; // used for refreshApex

    keyLogo = imageResource + '/Images/key_logo.png';
    

    @wire(getAllScores) ScoreResultsByWorkout(result) {
        this.wiredScoreData = result;
        if (result.data) {
            let currentData = [];
            result.data.forEach((row) => {
                let rowData = {};
                
                
                // Id, Vault_Workout__c, Vault_Workout__r.Name, Vault_Workout__r.Order__c,Is_Score_Between_Goal__c, Did_RX_or_RXplus__c
                
                
                //? Basic information
                // rowData.Id = row.Id; // score submission Id
                rowData.WorkoutOrder = row.Vault_Workout__r.Order__c
                rowData.WorkoutName = row.Vault_Workout__r.Name;

                //? Calculations for Each Workout
                //! make a set of all the workouts logged




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
            this.scoreData = currentData;
            console.log("Successful workoutsOrgByAthlete retrieval");
        } else if (result.error) {
            window.console.log(result.error);
        }
    }


    

    buildData(incomingArray){
        console.log('Executing building of data');
        console.log(incomingArray);
        let currentData = [];
        incomingArray.forEach(row => {
            let rowData = row;
            let athWorkouts = [];
            this.scoreData.forEach((element) => {
                let athScore = {};
                if (row.Id == element.AthleteId) {
                    athScore.WorkoutName = element.WorkoutName;

                    athScore.Score_1st__c = element.Score_1st__c;
                    athScore.First_Label__c = element.First_Label__c;
                    athScore.Score_2nd__c = element.Score_2nd__c;
                    athScore.Second_Label__c = element.Second_Label__c;
                    athScore.Weight_Used__c = element.Weight_Used__c;
                    athScore.RX_Weight_Male__c = element.RX_Weight_Male__c;


                    //? takes the Score Submission and make it into a string
                    let ScoreString = `${element.Score_1st__c} ${element.First_Label__c}`;
                    //! needs to be done here
                    if (element.Second_Label__c) {
                        ScoreString += ` ${element.Score_2nd__c} ${element.Second_Label__c}`;
                    } 
                    if (element.RX_Weight_Male__c) {
                        ScoreString += ` @ ${element.Weight_Used__c} lbs`;
                    };
                    athScore.ScoreString = ScoreString;

                    
                    athScore.Is_Score_Between_Goal__c = element.Is_Score_Between_Goal__c;
                    athScore.Points_Based_on_Rank__c = element.Points_Based_on_Rank__c;
                    athScore.Total_Points__c = element.Total_Points__c;
                    athWorkouts.push(athScore);
                }
            });
            rowData.allWorkouts = athWorkouts;
            currentData.push(rowData);
        });
        console.log(currentData);
        this.data = currentData;
        console.log('Complete building the data');
        this.buildDataComplete = true;
    }

    // updatePieCharts() {
    //     console.log('update pie charts');
    //     let pieCharts = this.template.querySelectorAll('[data-percentage]');

    //     console.log(pieCharts);
    //     if (pieCharts) {
    //         for (let i = 0; i < pieCharts.length; i += 1) {
    //             console.log('inside for loop');
    //             let slice = pieCharts[i];
    //             let percentage = slice.getAttribute('data-percentage');
    //             console.log(slice.getAttribute('data-percentage'));
    //             let circumference = 31.4;
    //             let strokeDash = Math.round((percentage * circumference) / 100);
    //             let strokeDashArray = `${strokeDash} ${circumference}`;

    //             slice.setAttribute('stroke-dasharray', strokeDashArray);
    //         }
    //     }
    // }

    connectedCallback() {
        this.displayAthleteScore = false;
        console.log('connected');

        // this.updatePieCharts();        
    }

    renderedCallback() {
        if(this.scoreData && !this.buildDataComplete) {
            console.log(this.scoreData.length);
            console.log('Building Data');
            this.buildData(this.data);
        }
        console.log('rendered');
    }
}