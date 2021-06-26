import { LightningElement, wire } from 'lwc';
import imageResource from '@salesforce/resourceUrl/SPCompImages';
import getAllWorkouts from '@salesforce/apex/WorkoutLwcController.getAllWorkouts';
export default class WorkoutDisplay extends LightningElement {
    
    keyLogo = imageResource + '/Images/key_logo.png';
    
    data = [];
    //? https://github.com/PastranaDigital/lwc-udemy-course/blob/feature/dev3/force-app/main/default/lwc/accountListViewer/accountListViewer.js
    wireWorkoutList = []; // used for refreshApex
    
    //? Default Values
    workoutRecordId = 'a025e0000036GDBAA2'; // workout.Id
    workoutName = 'Chaos'; // workout.name
    workoutDescription = '10 min AMRAP'; // workout.Description__c
    workoutOrder = '1';
    workoutGoal = 'Finish Round of 9-12’S (90-156 reps)'; // workout.Goal__c
    workoutImage = '1_Chaos.jpg';
    workoutRxWeight = '40'; // workout.RX_Weight_Male__c
    workoutURL = 'https://spmembersonly.com/2021-vault-workouts/2021/01/04/chaos'; // workout.URL__c
    workoutDate = '7/5/2021'; // workout.Workout_Date__c

    @wire(getAllWorkouts) workoutList(result) {
        this.wireWorkoutList = result;
        if (result.data) {
            let currentData = [];
            result.data.forEach((row) => {
                let rowData = {};
                rowData.Id = row.Id;
                rowData.Name = row.Name;
                rowData.AccordionTitle = `#${row.Order__c} ${row.Name}`;
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
                currentData.push(rowData);
            });
            this.data = currentData;
            // console.log(currentData[0].Workout_Date__c);
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