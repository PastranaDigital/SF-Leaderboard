import { LightningElement, wire } from 'lwc';
import imageResource from '@salesforce/resourceUrl/twentytwoImages';
import getTopResults from '@salesforce/apex/WorkoutLwcController.getTopResults';

export default class TwentytwoWorkout extends LightningElement {
    img_workout = imageResource + '/workout01.png';

	scoreData;

	// @wire(getTopResults) topResults(result) {
    //     if (result.data) {
    //         let currentData = [];
    //         result.data.forEach((row) => {
    //             let rowData = row;


				
        

	// 			let athWorkouts = [];
	// 			let count = 1;
	// 			this.scoreData.forEach((element) => { // element = score submission
	// 				let athScore = {};
	// 				// console.log('element.Vault_Workout__c ' + element.Vault_Workout__c);
	// 				// console.log('row.Id ' + row.Id);
					
	// 				if (row.Id == element.Vault_Workout__c && count < 11) {
						
	// 					athScore.rank = count;
	// 					athScore.athleteName = element.Athlete_Name__r.Name;
	// 					athScore.Score_1st__c = element.Score_1st__c;
	// 					athScore.Score_2nd__c = element.Score_2nd__c;
	// 					athScore.Weight_Used__c = element.Weight_Used__c;
	// 					athScore.Is_Score_Between_Goal__c = element.Is_Score_Between_Goal__c;
	// 					athScore.Points_Based_on_Rank__c = element.Points_Based_on_Rank__c;
	// 					athScore.Total_Points__c = element.Total_Points__c;
						
	// 					let topScoreString = `${element.Score_1st__c} ${row.First_Label__c}`;
	// 					//! needs to be done here
	// 					if (row.Second_Label__c) {
	// 						topScoreString += ` ${element.Score_2nd__c} ${row.Second_Label__c}`;
	// 					} 
	// 					if (row.RX_Weight_Male__c) {
	// 						topScoreString += ` @ ${element.Weight_Used__c} lbs`;
	// 					};
	// 					athScore.topScoreString = topScoreString;

						
	// 					athWorkouts.push(athScore);
	// 					count++;
	// 				}
	// 			});
	// 			rowData.top3results = athWorkouts;
	// 			currentData.push(rowData);
	// 		});
    //         this.scoreData = currentData;
	// 	} else if (result.error) {
	// 		window.console.log(result.error);
	// 	}
	// }
}