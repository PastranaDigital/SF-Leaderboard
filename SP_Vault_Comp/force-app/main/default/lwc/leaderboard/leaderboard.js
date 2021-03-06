import { LightningElement, wire } from 'lwc';
import imageResource from '@salesforce/resourceUrl/SPCompImages';
import athleteResource from '@salesforce/resourceUrl/SPCompAthletes';
import getAllAthletes from "@salesforce/apex/AthleteLwcController.getAllAthletes";
import getAllScoreSubmissions from "@salesforce/apex/AthleteLwcController.getAllScoreSubmissions";

export default class Leaderboard extends LightningElement {
    displayAthleteScore; // Expand all onclick Boolean value
    buildDataComplete = false;



    //! Boolean tracked variable to indicate if modal is open or not default value is false as modal is closed when page is loaded 
    isModalOpen = false;
    athSpotlight = {};
    
    athId;
    athName;
    
    openModal(event) {
        // console.log(event.target.id);
        this.athId = (event.target.id).split('-');
        this.athId = this.athId[0];
        this.athName = event.target.innerHTML;
        this.athName = this.athName.split('>');
        this.athName = this.athName[1];
        
        if(this.scoreData && !this.buildDataComplete) {
            console.log(this.scoreData.length);
            console.log('Building Data');
            this.buildData(this.data);
        }

        // if (this.buildDataComplete) {
            this.data.forEach(element => {
                // console.log('checking: ', element.Id, this.athId);
                if (element.Id == this.athId) {
                    console.log(`element.Id: ${element.Id}`);
                    this.athSpotlight.Id = element.Id;
                    this.athSpotlight.Name = element.Name;
                    this.athSpotlight.Location = element.Location__c;
                    this.athSpotlight.Age = element.Age__c;
                    this.athSpotlight.Pic = element.Profile_Pic_URL__c;
                    this.athSpotlight.Rank = element.Rank;
                    this.athSpotlight.TotalPoints = element.Total_Points__c;
                    this.athSpotlight.allWorkouts = element.allWorkouts;
                    
                    this.athSpotlight.RankNumber = this.getRankNumber(this.athSpotlight.Rank);


                    // this.athSpotlight.Score_1st__c = element.Score_1st__c;
                    // this.athSpotlight.First_Label__c = element.First_Label__c;
                    // this.athSpotlight.Score_2nd__c = element.Score_2nd__c;
                    // this.athSpotlight.Second_Label__c = element.Second_Label__c;
                    // this.athSpotlight.Weight_Used__c = element.Weight_Used__c;
                    // this.athSpotlight.RX_Weight_Male__c = element.RX_Weight_Male__c;


                    // //? takes the Score Submission and make it into a string
                    // let ScoreString = `${element.Score_1st__c} ${element.First_Label__c}`;
                    // //! needs to be done here
                    // if (element.Second_Label__c) {
                    //     ScoreString += ` ${element.Score_2nd__c} ${element.Second_Label__c}`;
                    // } 
                    // if (element.RX_Weight_Male__c) {
                    //     ScoreString += ` @ ${element.Weight_Used__c} lbs`;
                    // };
                    // this.athSpotlight.ScoreString = ScoreString;

                    // console.log(`athSpotlight: ${this.athSpotlight.ScoreString}`);
                }
            });
        // }


        // console.log(`Clicked ${this.athName}`);
        // console.log(this.athId);
        // console.log(event.target.innerHTML);
        // to open modal set isModalOpen tarck value as true
        this.isModalOpen = true;
    }
    
    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;
    }
    
    submitDetails() {
        // to close modal set isModalOpen tarck value as false
        //Add your code to call apex method or do some processing
        this.isModalOpen = false;
    }
    //! ----------------------------------------------------------------


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


                    athScore.Is_Score_Between_Goal__c = element.Is_Score_Between_Goal__c;
                    athScore.Points_Based_on_Rank__c = element.Points_Based_on_Rank__c;
                    athScore.Total_Points__c = element.Total_Points__c;
                    
                    let RankNumber = ((105 - element.Points_Based_on_Rank__c) / 5);
        
                    athScore.RankNumber = this.getRankNumber(RankNumber);

                    //? takes the Score Submission and make it into a string
                    // let ScoreString = `[${athScore.RankNumber}]  ${element.Score_1st__c} ${element.First_Label__c}`;
                    let ScoreString = `${element.Score_1st__c} ${element.First_Label__c}`;
                    //! needs to be done here
                    if (element.Second_Label__c) {
                        ScoreString += ` ${element.Score_2nd__c} ${element.Second_Label__c}`;
                    } 
                    if (element.RX_Weight_Male__c) {
                        ScoreString += ` @ ${element.Weight_Used__c} lbs`;
                    };
                    athScore.ScoreString = ScoreString;

                    
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