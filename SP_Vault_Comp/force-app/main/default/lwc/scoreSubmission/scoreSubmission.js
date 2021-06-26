import { LightningElement, wire } from 'lwc';
import imageResource from '@salesforce/resourceUrl/SPCompImages';
import getAllWorkouts from '@salesforce/apex/WorkoutLwcController.getAllWorkouts';
export default class ScoreSubmission extends LightningElement {
    
    keyLogo = imageResource + '/Images/key_logo.png';
    
    data = [];
    //? https://github.com/PastranaDigital/lwc-udemy-course/blob/feature/dev3/force-app/main/default/lwc/accountListViewer/accountListViewer.js
    wireWorkoutList = []; // used for refreshApex
    
    currentWorkout = [];

    //? Default Values
    workoutRecordId = 'a025e0000036GDBAA2'; // workout.Id
    workoutName = 'Chaos'; // workout.name
    workoutDescription = '10 min AMRAP'; // workout.Description__c
    firstLabel = 'Reps'; // workout.First_Label__c
    secondLabel = ''; // workout.Second_Label__c
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

        let today = new Date();
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        //! goes back 6 days to set the "line" to pull the next workout only 
        let dd = String(today.getDate() - 6).padStart(2, '0'); 
        let yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;
        let todaysMonth = Number(mm);
        let todaysDate = Number(dd);
        // console.log(today);
        // console.log(todaysMonth);
        // console.log(todaysDate);

        let tempData = [];
        let flag = true;
        this.data.forEach(row => {
            let workoutFullDate = row.Workout_Date__c.split("-");
            // console.log(`workoutFullDate: ${Number(workoutFullDate[1])} & ${Number(workoutFullDate[2])}`);
            if (Number(workoutFullDate[1]) === todaysMonth && flag) {
                if (Number(workoutFullDate[2]) >= todaysDate) {
                    // console.log('INSIDE');
                    let rowData = {};
                    rowData.Id = row.Id;
                    rowData.Name = row.Name;
                    rowData.Description__c = row.Description__c;
                    rowData.First_Label__c = row.First_Label__c;
                    rowData.Second_Label__c = row.Second_Label__c;
                    rowData.Order__c = row.Order__c;
                    rowData.Goal__c = row.Goal__c;
                    rowData.Image_File__c = imageResource + '/Images/' + row.Image_File__c;
                    rowData.RX_Weight_Male__c = row.RX_Weight_Male__c;
                    rowData.URL__c = row.URL__c;
                    rowData.Workout_Date__c = row.Workout_Date__c;
                    tempData.push(rowData);
                    flag = false;
                }
            }
        });
        this.currentWorkout = tempData;
        // console.log(`Today's Workout: ${this.currentWorkout[0].Name}`);
        if (this.currentWorkout[0]) {
            this.workoutRecordId = this.currentWorkout[0].Id;
            this.workoutName = this.currentWorkout[0].Name;
            this.workoutDescription = this.currentWorkout[0].Description__c;
            this.firstLabel = this.currentWorkout[0].First_Label__c;
            this.secondLabel = this.currentWorkout[0].Second_Label__c;
            this.workoutOrder = this.currentWorkout[0].Order__c;
            this.workoutGoal = this.currentWorkout[0].Goal__c;
            this.workoutImage = this.currentWorkout[0].Image_File__c;
            this.workoutRxWeight = this.currentWorkout[0].RX_Weight_Male__c;
            this.workoutURL = this.currentWorkout[0].URL__c;
            this.workoutDate = this.currentWorkout[0].Workout_Date__c;

            this.template.querySelector('slot').innerHTML = this.workoutDescription;
        }
    }

    
    connectedCallback() {
        // console.log(athList.data[0].Name);
    }
}