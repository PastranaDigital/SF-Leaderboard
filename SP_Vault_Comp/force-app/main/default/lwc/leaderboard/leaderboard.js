import { LightningElement, wire } from 'lwc';
import imageResource from '@salesforce/resourceUrl/SPCompImages';
import athleteResource from '@salesforce/resourceUrl/SPCompAthletes';
import getAllAthletes from "@salesforce/apex/AthleteLwcController.getAllAthletes";
import getAllScoreSubmissions from "@salesforce/apex/AthleteLwcController.getAllScoreSubmissions";

export default class Leaderboard extends LightningElement {
    displayAthleteScore; // Expand all onclick Boolean value
    buildDataComplete = false;

    //? Example
    // workoutsOrganizedByAthlete = [
    //     {
    //         Id: 'AthleteId1',
    //         Name: 'Omar Pastrana',
    //         Rank: 1,
    //         Profile_Pic_URL__c: 'https://brave-shark-9g6q3j-dev-ed.livepreview.salesforce-communities.com/leaderboard/webruntime/org-asset/c5107c6f53/resource/0815e000000jEeR/Athletes/Omar.png',
    //         Total_Points__c: 570,
    //         allWorkouts: [
    //             {
    //                 WorkoutName: 'Chaos',
    //                 Is_Score_Between_Goal__c: 100,
    //                 Points_Based_on_Rank__c: 100,
    //                 Total_Points__c: 200
    //             },
    //             {
    //                 WorkoutName: 'Kronos',
    //                 Is_Score_Between_Goal__c: 100,
    //                 Points_Based_on_Rank__c: 90,
    //                 Total_Points__c: 190
    //             },
    //             {
    //                 WorkoutName: 'Apollo',
    //                 Is_Score_Between_Goal__c: 0,
    //                 Points_Based_on_Rank__c: 100,
    //                 Total_Points__c: 100
    //             },
    //             {
    //                 WorkoutName: 'Athena',
    //                 Is_Score_Between_Goal__c: 0,
    //                 Points_Based_on_Rank__c: 80,
    //                 Total_Points__c: 80
    //             }
    //         ]
    //     },
    //     {
    //         Id: 'AthleteId2',
    //         Name: 'Omar Pastrana',
    //         Rank: 2,
    //         Profile_Pic_URL__c: 'https://brave-shark-9g6q3j-dev-ed.livepreview.salesforce-communities.com/leaderboard/webruntime/org-asset/c5107c6f53/resource/0815e000000jEeR/Athletes/Omar.png',
    //         Total_Points__c: 440,
    //         allWorkouts: [
    //             {
    //                 WorkoutName: 'Chaos',
    //                 Is_Score_Between_Goal__c: 100,
    //                 Points_Based_on_Rank__c: 100,
    //                 Total_Points__c: 200
    //             },
    //             {
    //                 WorkoutName: 'Kronos',
    //                 Is_Score_Between_Goal__c: 0,
    //                 Points_Based_on_Rank__c: 90,
    //                 Total_Points__c: 90
    //             },
    //             {
    //                 WorkoutName: 'Apollo',
    //                 Is_Score_Between_Goal__c: 100,
    //                 Points_Based_on_Rank__c: 50,
    //                 Total_Points__c: 150
    //             }
    //         ]
    //     }
    // ];

    wiredScoreData = [];
    // scoreData = [];

    //? https://github.com/PastranaDigital/lwc-udemy-course/blob/feature/dev3/force-app/main/default/lwc/accountListViewer/accountListViewer.js
    data =[];
    wireAthleteList = []; // used for refreshApex

    keyLogo = imageResource + '/Images/key_logo.png';
    
    // @wire(getAllScoreSubmissions) scoreData;
    @wire(getAllScoreSubmissions) workoutsOrgByAthlete(result) {
        this.wiredScoreData = result;
        if (result.data) {
            let currentData = [];
            result.data.forEach((row) => {
              let rowData = {};
              rowData.Id = row.Id; // score submission Id
              rowData.AthleteId = row.Athlete_Name__c;
              rowData.AthleteName = row.Athlete_Name__r.Name;
              rowData.WorkoutName = row.Vault_Workout__r.Name;
              rowData.Is_Score_Between_Goal__c = row.Is_Score_Between_Goal__c;
              rowData.Points_Based_on_Rank__c = row.Points_Based_on_Rank__c;
              rowData.Total_Points__c = row.Total_Workout_Points__c;
              currentData.push(rowData);
            });
            this.scoreData = currentData;
            console.log("Successful workoutsOrgByAthlete retrieval");
        } else if (result.error) {
            window.console.log(result.error);
        }
    }


    @wire(getAllAthletes) athList(result) {
        this.wireAthleteList = result;
        // console.log('scoreData: ' + this.scoreData.data);
        if (result.data) {
            let currentData = [];
            let rank = 1;
            result.data.forEach((row) => {
              let rowData = {};
              rowData.Rank = rank;
              rowData.Id = row.Id; // Athlete Id
              rowData.Name = row.Name;
              rowData.Total_Points__c = row.Total_Points__c;
              rowData.Age__c = row.Age__c;
              rowData.Location__c = row.Location__c;
              rowData.Profile_Pic_URL__c = athleteResource + '/Athletes/' + row.Profile_Pic_URL__c;
            
            
            //   let athWorkouts = [];
            //   this.scoreData.forEach((element) => {
            //     let athScore = {};
            //     if (row.Id == element.AthleteId) {
            //         athScore.WorkoutName = element.WorkoutName;
            //         athScore.Is_Score_Between_Goal__c = element.Is_Score_Between_Goal__c;
            //         athScore.Points_Based_on_Rank__c = element.Points_Based_on_Rank__c;
            //         athScore.Total_Points__c = element.Total_Workout_Points__c;
            //     }
            //     athWorkouts.push(athScore);
            //   });
            //   rowData.allWorkouts = athWorkouts;


              currentData.push(rowData);
              rank++;
            });
            this.data = currentData;
            // console.log(currentData[0].Name);
            // console.log(this.data[0].Rank);
            console.log("Successful data retrieval");
        } else if (result.error) {
            window.console.log(result.error);
        }
    }


    handleAthleteClick(event) {
        // console.log(this.displayAthleteScore);
        if (this.displayAthleteScore) {
            this.displayAthleteScore = false;
            this.template.querySelector('button').innerHTML = '&#9650;';
        } else {
            this.displayAthleteScore = true;
            this.template.querySelector('button').innerHTML = '&#9660;';
        }

        // console.log(this.workoutsOrganizedByAthlete[0].allWorkouts[0]);

        //? https://unicode-table.com/en/25BC/
        // this.displayAthleteScore === true ? false : true;
        // console.log(this.displayAthleteScore);


        // this.athName = (event.target.id).split('-');
        // this.athName = event.target.innerHTML;
        // this.athName = this.athName.split('>');
        // console.log(`Click /${this.athName[1]}/`);
        // console.log(this.athName[0]);
        // let scoreDiv = this.template.querySelector('.athleteScore');
        // console.log(scoreDiv);
        // scoreDiv.removeClass('.hidden');
        // console.log(scoreDiv);
        // this.template.querySelector('.athleteScore').removeClass('.hidden');
        
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

    connectedCallback() {
        this.displayAthleteScore = false;
        console.log('connected');
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