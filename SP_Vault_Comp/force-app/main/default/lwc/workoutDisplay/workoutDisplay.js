import { LightningElement, wire } from 'lwc';
import imageResource from '@salesforce/resourceUrl/SPCompImages';
import getAllWorkouts from '@salesforce/apex/WorkoutLwcController.getAllWorkouts';
// import getTop3Results from '@salesforce/apex/WorkoutLwcController.getTop3Results';
import getTopResults from '@salesforce/apex/WorkoutLwcController.getTopResults';
// import getWorkoutsAndResults from '@salesforce/apex/WorkoutLwcController.getWorkoutsAndResults';
export default class WorkoutDisplay extends LightningElement {
    
    keyLogo = imageResource + '/Images/key_logo.png';
    buildDataComplete = false;

    data = [];
    //? https://github.com/PastranaDigital/lwc-udemy-course/blob/feature/dev3/force-app/main/default/lwc/accountListViewer/accountListViewer.js
    wireWorkoutList = []; // used for refreshApex

    scoreData;



    accordionSection = '';
    thisWeeksWorkout;

    assignAccordionSection() {
        let today = new Date();
        let mm = Number(today.getMonth() + 1); //January is 0!
        let dd = Number(today.getDate()); 
        let yyyy = today.getFullYear();
        // console.log(yyyy);
        // console.log(mm);
        // console.log(dd);
        
        today = yyyy*10000 + mm*100 + dd; // converts 2021/06/05 to 20210605
        //! goes back 6 days to set the "line" to pull the next workout only 
        dd < 4 ? today -= 100 : today -= 5; // accounts for end of month
        console.log('today', today);

        let flag = true;
        this.data.forEach(row => {
            let workoutFullDate = row.Workout_Date__c.split("-");
            let workoutDateNumber = Number(workoutFullDate[0])*10000 + Number(workoutFullDate[1])*100 + Number(workoutFullDate[2]);
            if (flag) {
                console.log('workoutDateNumber', workoutDateNumber);
                if (workoutDateNumber >= today) {
                    this.thisWeeksWorkout = row.Order__c;
                    console.log('this.thisWeeksWorkout', this.thisWeeksWorkout);
                    flag = false;
                }
            }
        });
        // if(!this.thisWeeksWorkout) this.thisWeeksWorkout = 4;
        // else this.thisWeeksWorkout = 1;
        
        this.accordionSection = this.data[this.thisWeeksWorkout-1].AccordionName;
        // console.log('this.accordionSection_____: ', this.accordionSection);
    }

    handleToggleSection(event) {
        console.log('this.accordionSection: ', this.accordionSection);
        if(this.accordionSection.length === 0){
            this.accordionSection ='';
        } else{
            this.assignAccordionSection();
            // this.accordionSection ='ABC';
        }
    }
    
    //? 1. Omar Pastrana: 120 reps
    // `${rank}. ${athleteName}: ${Score_1st__c} ${First_Label__c}`
    //? 1. Omar Pastrana: 120 reps @ 40 lbs
    // `${rank}. ${athleteName}: ${Score_1st__c} ${First_Label__c} @ ${Weight_Used__c} lbs`
    //? 1. Omar Pastrana: 2 Mins 30 Secs
    // `${rank}. ${athleteName}: ${Score_1st__c} ${First_Label__c} ${Score_2nd__c} ${Second_Label__c}`
    //? 1. Omar Pastrana: 2 Rounds 30 reps @ 40 lbs
    // `${rank}. ${athleteName}: ${Score_1st__c} ${First_Label__c} ${Score_2nd__c} ${Second_Label__c} @ ${Weight_Used__c} lbs`
    
    // topScoreString = `${rank}. ${athleteName}: ${Score_1st__c} ${First_Label__c}`;
    
    

    // @wire(getWorkoutsAndResults) workoutList(result) {
    //     //? data will be in workoutDisplayObject format
    //     this.wireWorkoutList = result;
    //     // console.log("result.data " + [...result.data]);
    //     console.log("result.data " + JSON.stringify(result.data));
    //     if (result.data) {
    //         let currentData = [];
    //         result.data.forEach((row) => {
    //             let rowData = row;
    //             //! can't wipe out the data from the row to rowData
                
    //             rowData.Image_File__c = imageResource + '/Images/' + row.ImageFile;
                
    //             //! needs to be done here
    //             if (row.SecondLabel) {
    //                 this.topScoreString += ' {rank.Score_2nd__c} {rank.Second_Label__c}';
    //             } 
    //             if (row.RXWeightMale) {
    //                 this.topScoreString += ' @ {rank.Weight_Used__c} lbs';
    //             };
    //             rowData.topScoreString = this.topScoreString;

    //             currentData.push(rowData);
    //             // console.log(`rowData: ${rowData.Workout_Date__c}`);
    //             // console.log(`topScoreString: ${rowData.topScoreString}`);
    //         });
    //         this.data = currentData;

    //         console.log(currentData[5].topScoreString);
    //         // console.log(currentData[5].Plain_Description__c);
    //     } else if (result.error) {
    //         window.console.log(result.error);
    //     }
    // }

    // getTop3(workoutId) {
    //     return getTop3Results(workoutId);
    // }

    @wire(getTopResults) topResults(result) {
        if (result.data) {
            let currentData = [];
            result.data.forEach((row) => {
                let rowData = row;



                currentData.push(rowData);
            });
            this.scoreData = currentData;
            console.log('successful top results pull');
        } else if (result.error) {
            window.console.log(result.error);
        }
    }


    @wire(getAllWorkouts) workoutList(result) {
        this.wireWorkoutList = result;
        if (result.data) {
            let currentData = [];
            result.data.forEach((row) => {
                let rowData = {};
                rowData.Id = row.Id;
                rowData.Name = row.Name;
                rowData.AccordionName = String(row.Order__c);
                rowData.AccordionTitle = `#${row.Order__c} ${row.Name} - ${row.Workout_Date__c}`;
                rowData.Plain_Description__c = row.Plain_Description__c;
                rowData.Description__c = row.Description__c;
                rowData.First_Label__c = row.First_Label__c;
                rowData.Second_Label__c = row.Second_Label__c;
                rowData.Order__c = row.Order__c;
                rowData.Goal__c = row.Goal__c;
                rowData.Image_File__c = imageResource + '/Images/' + row.Image_File__c;
                rowData.RX_Weight_Male__c = row.RX_Weight_Male__c;
                rowData.URL__c = row.URL__c;
                rowData.Workout_Date__c = row.Workout_Date__c;
                // rowData.top3results = getTop3(row.Id); // didn't work
                
                
                currentData.push(rowData);
                // console.log(`rowData: ${rowData.Workout_Date__c}`);
                // console.log(`topScoreString: ${rowData.topScoreString}`);
            });
            this.data = currentData;
            // this.accordionSection = String(currentData[this.thisWeeksWorkout-1].AccordionName);
            // console.log(this.accordionSection);
            this.assignAccordionSection();
            console.log('successful workout list pull');
            // console.log(currentData[5].Plain_Description__c);
        } else if (result.error) {
            window.console.log(result.error);
        }
    }

    // activeSectionMessage = '';
    
    // handleToggleSection(event) {
    //     this.activeSectionMessage =
    //         'Open section name:  ' + event.detail.openSections;
    // }

    buildData(incomingArray) {
        console.log('Executing building of data');
        // console.log('incomingArray: ' + incomingArray);
        let currentData = [];
        incomingArray.forEach(row => {
            let rowData = row; // row = workout
            let athWorkouts = [];
            let count = 1;
            this.scoreData.forEach((element) => { // element = score submission
                let athScore = {};
                // console.log('element.Vault_Workout__c ' + element.Vault_Workout__c);
                // console.log('row.Id ' + row.Id);
                
                if (row.Id == element.Vault_Workout__c && count < 11) {
                    
                    athScore.rank = count;
                    athScore.athleteName = element.Athlete_Name__r.Name;
                    athScore.Score_1st__c = element.Score_1st__c;
                    athScore.Score_2nd__c = element.Score_2nd__c;
                    athScore.Weight_Used__c = element.Weight_Used__c;
                    athScore.Is_Score_Between_Goal__c = element.Is_Score_Between_Goal__c;
                    athScore.Points_Based_on_Rank__c = element.Points_Based_on_Rank__c;
                    athScore.Total_Points__c = element.Total_Points__c;
                    
                    let topScoreString = `${element.Score_1st__c} ${row.First_Label__c}`;
                    //! needs to be done here
                    if (row.Second_Label__c) {
                        topScoreString += ` ${element.Score_2nd__c} ${row.Second_Label__c}`;
                    } 
                    if (row.RX_Weight_Male__c) {
                        topScoreString += ` @ ${element.Weight_Used__c} lbs`;
                    };
                    athScore.topScoreString = topScoreString;

                    
                    athWorkouts.push(athScore);
                    count++;
                }
            });
            rowData.top3results = athWorkouts;
            currentData.push(rowData);
        });
        console.log(currentData);
        this.data = currentData;
        console.log('Completed building the data');
        this.buildDataComplete = true;
    }


    connectedCallback() {
        // console.log(athList.data[0].Name);
    }

    renderedCallback() {
        if(this.scoreData.length > 0 && !this.buildDataComplete) {
            // console.log('this.scoreData.length ' + this.scoreData.length);
            console.log('Building Data');
            this.buildData(this.data);
        }
        // console.log('rendered');
    }
}