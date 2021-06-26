import { LightningElement, wire } from 'lwc';
import imageResource from '@salesforce/resourceUrl/SPCompImages';
import athleteResource from '@salesforce/resourceUrl/SPCompAthletes';
import getAllAthletes from "@salesforce/apex/AthleteLwcController.getAllAthletes";
import getAllScoreSubmissions from "@salesforce/apex/AthleteLwcController.getAllScoreSubmissions";

export default class Leaderboard extends LightningElement {
    data =[];
    //? https://github.com/PastranaDigital/lwc-udemy-course/blob/feature/dev3/force-app/main/default/lwc/accountListViewer/accountListViewer.js
    wireAthleteList = []; // used for refreshApex

    athName;
        
    keyLogo = imageResource + '/Images/key_logo.png';
    // athletePic = athleteResource + '/Athletes/' + athlete + '.png';

    @wire(getAllAthletes) athList(result) {
        this.wireAthleteList = result;
        // console.log('result.data: ' + result.data);
        if (result.data) {
            let currentData = [];
            let rank = 1;
            result.data.forEach((row) => {
              let rowData = {};
              rowData.Rank = rank;
              rowData.Id = row.Id;
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

    handleAthleteClick(event) {
        this.athName = (event.target.id).split('-');
        // this.athName = event.target.innerHTML;
        // this.athName = this.athName.split('>');
        // console.log(`Click /${this.athName[1]}/`);
        console.log(this.athName[0]);
        let scoreDiv = this.template.querySelector('.athleteScore');
        console.log(scoreDiv);
        scoreDiv.removeClass('.hidden');
        console.log(scoreDiv);
        // this.template.querySelector('.athleteScore').removeClass('.hidden');
    }

    connectedCallback() {
        console.log('Target');
    }
}