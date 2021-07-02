import { LightningElement, wire } from 'lwc';
import imageResource from '@salesforce/resourceUrl/SPCompImages';
import getAllWorkouts from '@salesforce/apex/WorkoutLwcController.getAllWorkouts';
// import getWorkoutResults from '@salesforce/apex/WorkoutLwcController.getWorkoutResults';
export default class WorkoutDisplay extends LightningElement {
    
    keyLogo = imageResource + '/Images/key_logo.png';
    
    data = [];
    //? https://github.com/PastranaDigital/lwc-udemy-course/blob/feature/dev3/force-app/main/default/lwc/accountListViewer/accountListViewer.js
    wireWorkoutList = []; // used for refreshApex
    
    //? 1. Omar Pastrana: 120 reps
    // `${rank}. ${athleteName}: ${Score_1st__c} ${First_Label__c}`
    //? 1. Omar Pastrana: 120 reps @ 40 lbs
    // `${rank}. ${athleteName}: ${Score_1st__c} ${First_Label__c} @ ${Weight_Used__c} lbs`
    //? 1. Omar Pastrana: 2 Mins 30 Secs
    // `${rank}. ${athleteName}: ${Score_1st__c} ${First_Label__c} ${Score_2nd__c} ${Second_Label__c}`
    //? 1. Omar Pastrana: 2 Rounds 30 reps @ 40 lbs
    // `${rank}. ${athleteName}: ${Score_1st__c} ${First_Label__c} ${Score_2nd__c} ${Second_Label__c} @ ${Weight_Used__c} lbs`
    
    // topScoreString = `${rank}. ${athleteName}: ${Score_1st__c} ${First_Label__c}`;
    topScoreString = '${rank}. ${athleteName}: ${Score_1st__c} ${First_Label__c}';
    

    @wire(getAllWorkouts) workoutList(result) {
        this.wireWorkoutList = result;
        if (result.data) {
            let currentData = [];
            let rank = 1;
            result.data.forEach((row) => {
                let rowData = {};
                rowData.Id = row.Id;
                rowData.Name = row.Name;
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

                if (row.Second_Label__c) {
                    this.topScoreString += ` ${Score_2nd__c} ${Second_Label__c}`;
                } 
                if (row.RX_Weight_Male__c) {
                    this.topScoreString += ` @ ${Weight_Used__c} lbs`;
                };
                rowData.topScoreString = this.topScoreString;

                currentData.push(rowData);
                // console.log(`rowData: ${rowData.Workout_Date__c}`);
                // console.log(`topScoreString: ${rowData.topScoreString}`);
            });
            this.data = currentData;
            // console.log(currentData[5].Plain_Description__c);
        } else if (result.error) {
            window.console.log(result.error);
        }
    }

    activeSectionMessage = '';
    
    handleToggleSection(event) {
        this.activeSectionMessage =
            'Open section name:  ' + event.detail.openSections;
    }

    connectedCallback() {
        // console.log(athList.data[0].Name);
    }
}