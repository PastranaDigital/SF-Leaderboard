import { LightningElement } from 'lwc';
import imageResource from '@salesforce/resourceUrl/SPCompImages';

export default class ScoreSubmission extends LightningElement {
    workoutName = 'Chaos'; // workout.name
    workoutURL = 'https://spmembersonly.com/2021-vault-workouts/2021/01/04/chaos'; // workout.URL__c
    workoutDate = '7/5/2021'; // workout.Workout_Date__c
    workoutRecordId = 'a025e0000036GDBAA2'; // workout.Id
    workoutDescription = '10 min AMRAP (As Many Rounds and Reps as Possible in 10 Minutes)'; // workout.Description__c
    workoutGoal = 'Finish Round of 9-12’S (90-156 reps)'; // workout.Goal__c
    workoutRxWeight = '40'; // workout.RX_Weight_Male__c
    // workoutRxWeight = '';
    
    firstLabel = 'Rounds'; // workout.First_Label__c
    secondLabel = 'Reps'; // workout.Second_Label__c
    // secondLabel = '';

    keyLogo = imageResource + '/Images/key_logo.png';
}