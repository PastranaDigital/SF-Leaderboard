import { LightningElement, wire } from 'lwc';
import imageResource from '@salesforce/resourceUrl/twentytwoImages';
import athleteResource from '@salesforce/resourceUrl/SPCompAthletes';

import getAllAthletes from "@salesforce/apex/AthleteLwcController.getAllAthletes";

export default class TwentytwoLeaderboard extends LightningElement {
	// img_athlete = imageResource + '/default.png';

	data =[];
    wireAthleteList = []; // used for refreshApex

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
}