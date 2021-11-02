import { LightningElement, wire } from 'lwc';
// import { createRecord } from "lightning/uiRecordApi";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createScore from '@salesforce/apex/createScoreSubmission.createScore';
import getSubmittedScore from '@salesforce/apex/createScoreSubmission.getSubmittedScore';
import imageResource from '@salesforce/resourceUrl/SPCompImages';
import athleteResource from '@salesforce/resourceUrl/SPCompAthletes';
import getActiveWorkouts from '@salesforce/apex/WorkoutLwcController.getActiveWorkouts';
import getAllAthletesForOptions from "@salesforce/apex/AthleteLwcController.getAllAthletesForOptions";
// import { refreshApex } from "@salesforce/apex";

export default class MonthlyChallenge extends LightningElement {
	// both should begin as FALSE values
    scoreSubmitted = false;
    errorSubmitting = false;
    buttonErrorMessage = '';
    checkRequiredFieldsBoolean = [];

    comboboxValue = '';
    wireAthleteList = [];
    optionsAthleteList = [];
    recordId;
    scoreSubmittedAthlete = [];
    scoreSubmittedAthleteImage = {
        Image: '/leaderboard/webruntime/org-asset/c5107c6f53/resource/0815e000000jEeR/Athletes/Graham.png',
        Name: 'Test Testerson'
    };

    newRecord = {
        Athlete_Name__c: '',
        Vault_Workout__c: '',
        Score_1st__c: '',
        Score_2nd__c: '',
        Weight_Used__c: '',
        Notes__c: ''
    };

    @wire(getAllAthletesForOptions) athleteList(result) {
        this.wireAthleteList = result;
        if(result.data) {
            let endResult = [];
            let fullAthlete = [];
            result.data.forEach((row) => {
                let rowData = {};
                rowData.label = row.Name;
                rowData.value = row.Id;
                endResult.push(rowData);
                rowData.Profile_Pic_URL__c = athleteResource + '/Athletes/' + row.Profile_Pic_URL__c;
                fullAthlete.push(rowData);
            });
            this.optionsAthleteList = endResult;
            this.scoreSubmittedAthlete = fullAthlete;
            // console.log(this.optionsAthleteList);
        }
    }

    get options() {
        return this.optionsAthleteList;
        // return [
        //     { label: 'New', value: 'new' },
        //     { label: 'In Progress', value: 'inProgress' },
        //     { label: 'Finished', value: 'finished' },
        // ];
    }
    
    keyLogo = imageResource + '/Images/key_logo.png';
    
    data = [];
    //? https://github.com/PastranaDigital/lwc-udemy-course/blob/feature/dev3/force-app/main/default/lwc/accountListViewer/accountListViewer.js
    wireWorkoutList = []; // used for refreshApex
    
    currentWorkout = [];

    //? Default Values
    workoutRecordId = ''; // 'a025e0000036GDBAA2'; // workout.Id
    workoutName = ''; // 'Test Workout'; // workout.name
    workoutDescription = ''; // '10 min AMRAP'; // workout.Description__c
    firstLabel = ''; // 'Reps'; // workout.First_Label__c
    secondLabel = ''; // ''; // workout.Second_Label__c
    workoutOrder = ''; // '1';
    workoutGoal = ''; // 'Finish Round of 9-12’S (90-156 reps)'; // workout.Goal__c
    workoutImage = ''; // '1_Chaos.jpg';
    workoutRxWeight = ''; // '40'; // workout.RX_Weight_Male__c
    workoutURL = ''; // 'https://spmembersonly.com/2021-vault-workouts/2021/01/04/chaos'; // workout.URL__c
    workoutDate = ''; // '7/5/2021'; // workout.Workout_Date__c

    @wire(getActiveWorkouts) workoutList(result) {
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
        
        this.workoutRecordId = this.data[0].Id;
        this.workoutName = this.data[0].Name;
        this.workoutDescription = this.data[0].Description__c;
        this.firstLabel = this.data[0].First_Label__c;
        this.secondLabel = this.data[0].Second_Label__c;
        this.workoutOrder = this.data[0].Order__c;
        this.workoutGoal = this.data[0].Goal__c;
        this.workoutImage = this.data[0].Image_File__c;
        this.workoutRxWeight = this.data[0].RX_Weight_Male__c;
        this.workoutURL = this.data[0].URL__c;
        this.workoutDate = this.data[0].Workout_Date__c;

        this.workoutDescriptionForTemplate = this.workoutDescription;
        
        // console.log(`Today's Workout: ${this.currentWorkout[0].Name}`);
        // if (this.currentWorkout[0]) {
        //     this.workoutRecordId = this.currentWorkout[0].Id;
        //     this.workoutName = this.currentWorkout[0].Name;
        //     this.workoutDescription = this.currentWorkout[0].Description__c;
        //     this.firstLabel = this.currentWorkout[0].First_Label__c;
        //     this.secondLabel = this.currentWorkout[0].Second_Label__c;
        //     this.workoutOrder = this.currentWorkout[0].Order__c;
        //     this.workoutGoal = this.currentWorkout[0].Goal__c;
        //     this.workoutImage = this.currentWorkout[0].Image_File__c;
        //     this.workoutRxWeight = this.currentWorkout[0].RX_Weight_Male__c;
        //     this.workoutURL = this.currentWorkout[0].URL__c;
        //     this.workoutDate = this.currentWorkout[0].Workout_Date__c;

        //     this.template.querySelector('slot').innerHTML = this.workoutDescription;
        // }
    }

    handleAthleteChange(event) {
        this.comboboxValue = event.detail.value;
        this.newRecord.Athlete_Name__c = event.detail.value;
        console.log(this.newRecord.Athlete_Name__c);
        this.newRecord.Vault_Workout__c = this.workoutRecordId;
        console.log(this.newRecord.Vault_Workout__c);
    }

    handleScore1Change(event) {
        this.newRecord.Score_1st__c = event.detail.value;
        console.log(this.newRecord.Score_1st__c);
    }

    handleScore2Change(event) {
        this.newRecord.Score_2nd__c = event.detail.value;
        console.log(this.newRecord.Score_2nd__c);
    }

    handleWeightUsedChange(event) {
        this.newRecord.Weight_Used__c = event.detail.value;
        console.log(this.newRecord.Weight_Used__c);
    }

    handleNotesChange(event) {
        this.newRecord.Notes__c = event.detail.value;
        console.log(this.newRecord.Notes__c);
    }


    createScoreSubmission() {
        const fields = this.newRecord;
        const recordInput = {
          apiName: "Score_Submission__c",
          fields
        };
        // createRecord returns a promise
        createRecord(recordInput)
            // .then(score => {
            //     this.recordId = score.id;
            //     console.log("Score Submission has been created : ", this.recordId);
            //     this.scoreSubmitted = true;
            //     this.dispatchEvent(
            //         new ShowToastEvent({
            //             title: 'Success',
            //             message: 'Score Submission Entered',
            //             variant: 'success',
            //         }),
            //     );
            // })
            // .catch(error => {
            //     this.dispatchEvent(
            //         new ShowToastEvent({
            //             title: 'Error Submitting Score',
            //             message: error.body.message,
            //             variant: 'error',
            //         }),
            //     );
            // });
          .then((response) => {
            console.log("Score Submission has been created : ", response.id);
            this.recordId = response.id;
            this.scoreSubmitted = true;
          })
          .catch((error) => {
            this.errorSubmitting = true;
            console.log("Error in creating score submission : ", error.body.message);
          });
        // if(!this.recordId) {
        //     this.errorSubmitting = true;
        // }
      }

    createScoreApex() {
        createScore({ score : this.newRecord })
            .then(result => {
                this.message = result;
                this.error = undefined;
                this.scoreSubmitted = true;                
                // console.log(JSON.stringify(result));
                console.log("result", this.message);
            })
            .catch(error => {
                this.message = undefined;
                this.error = error;
                this.errorSubmitting = true;
                // this.dispatchEvent(
                //     new ShowToastEvent({
                //         title: 'Error Submitting Score',
                //         message: error.body.message,
                //         variant: 'error',
                //     }),
                // );
                console.log("error", JSON.stringify(this.error));
            });
    }

    getSubmittedScoreApex() {
        getSubmittedScore({ score : this.newRecord }) // only pulls last result
            .then(result => {
                this.message = result;
                console.log("getSubmittedScore result:", this.message);

                this.newRecord.Is_Score_Between_Goal__c = result.Is_Score_Between_Goal__c;
                this.newRecord.Points_Based_on_Rank__c = result.Points_Based_on_Rank__c;
                this.newRecord.Total_Workout_Points__c = result.Total_Workout_Points__c;
            })
            .catch(error => {
                this.error = error;
                // this.errorSubmitting = true;
                console.log("error", JSON.stringify(this.error));
            });
    }

    handleSubmitRecord() {
        this.checkRequiredFieldsBoolean[0] = Boolean(this.newRecord.Athlete_Name__c);
        this.checkRequiredFieldsBoolean[1] = Boolean(this.newRecord.Score_1st__c);
        if (this.secondLabel) {
            this.checkRequiredFieldsBoolean[2] = Boolean(this.newRecord.Score_2nd__c);
        } else {
            this.checkRequiredFieldsBoolean[2] = true;
        }
        if (this.workoutRxWeight) {
            this.checkRequiredFieldsBoolean[3] = Boolean(this.newRecord.Weight_Used__c);
        } else {
            this.checkRequiredFieldsBoolean[3] = true;
        }
        
        console.log(this.checkRequiredFieldsBoolean);
        
        if (!this.checkRequiredFieldsBoolean.includes(false)) {
            // console.log(this.scoreSubmittedAthlete);
            this.createScoreApex();
            
            // setTimeout(() => {this.getSubmittedScoreApex(); }, 1000);
            this.getSubmittedScoreApex();
            // while (!this.newRecord.Is_Score_Between_Goal__c) {
            for (let index = 0; index < 5; index++) {
                if (!this.newRecord.Is_Score_Between_Goal__c) {
                    this.getSubmittedScoreApex();
                }
            }
            console.log('this.newRecord.Is_Score_Between_Goal__c: ' + this.newRecord.Is_Score_Between_Goal__c);
            
            this.scoreSubmittedAthlete.forEach(element => {
                if (element.value == this.newRecord.Athlete_Name__c) {
                    this.scoreSubmittedAthleteImage.Image = element.Profile_Pic_URL__c;
                    // console.log(this.scoreSubmittedAthleteImage.Image);
                    this.scoreSubmittedAthleteImage.Name = element.label;
                    this.newRecord.Is_Score_Between_Goal__c = this.newRecord.Is_Score_Between_Goal__c;
                    this.newRecord.Points_Based_on_Rank__c = this.newRecord.Points_Based_on_Rank__c;
                    this.newRecord.Total_Workout_Points__c = this.newRecord.Total_Workout_Points__c;
                }
            });
            // refreshApex(this.workoutList);
            // this.createScoreSubmission();
        } else {
            this.buttonErrorMessage = 'Please complete required fields';
            console.log('Please complete required fields');
        }        
    }

    
    connectedCallback() {
        // console.log(athList.data[0].Name);
    }
    renderedCallback() {
        this.template.querySelector('slot').innerHTML = this.workoutDescriptionForTemplate;
    }
}