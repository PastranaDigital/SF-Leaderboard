import { LightningElement, wire } from 'lwc';
import imageResource from '@salesforce/resourceUrl/twentytwoImages';
import workoutImages from '@salesforce/resourceUrl/SPCompImages';
import getTopResults from '@salesforce/apex/WorkoutLwcController.getTopResults';
import getActiveWorkouts from '@salesforce/apex/WorkoutLwcController.getActiveWorkouts';
import getAllWorkouts from '@salesforce/apex/WorkoutLwcController.getAllWorkouts';

export default class TwentytwoWorkout extends LightningElement {
    img_workout = imageResource + '/workout01.png';

	keyLogo = imageResource + '/Images/key_logo.png';
    buildDataComplete = false;

    data = [];
    //? https://github.com/PastranaDigital/lwc-udemy-course/blob/feature/dev3/force-app/main/default/lwc/accountListViewer/accountListViewer.js
    wireWorkoutList = []; // used for refreshApex

    scoreData;

    currentWorkout = [];

    accordionSection = '';
    thisWeeksWorkout;

    assignAccordionSection() {
        let tempData = this.data.filter((row) => row.Active__c == true);
        console.log(`temp data ${tempData[0].Order__c}`);
        this.thisWeeksWorkout = tempData[0].Order__c;
		this.accordionSection = this.data[this.thisWeeksWorkout-1].AccordionName;
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
                rowData.Active__c = row.Active__c;
                rowData.Goal__c = row.Goal__c;
                rowData.Image_File__c = workoutImages + '/Images/' + row.Image_File__c;
                rowData.RX_Weight_Male__c = row.RX_Weight_Male__c;
                rowData.URL__c = row.URL__c;
                rowData.Workout_Date__c = row.Workout_Date__c;
                // rowData.top3results = getTop3(row.Id); // didn't work
                
                
                currentData.push(rowData);
                // console.log(`rowData: ${rowData.Workout_Date__c}`);
                // console.log(`topScoreString: ${rowData.topScoreString}`);
            });
            this.data = currentData;
            this.currentWorkout = 
            // this.accordionSection = String(currentData[this.thisWeeksWorkout-1].AccordionName);
            // console.log(this.accordionSection);
            this.assignAccordionSection();
            console.log('successful workout list pull');
            // console.log(currentData[5].Plain_Description__c);
        } else if (result.error) {
            window.console.log(result.error);
        }
    }

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