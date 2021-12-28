import { LightningElement, api } from 'lwc';

export default class TwentytwoLeaderboard extends LightningElement {
	@api incomingAthletes;
	@api incomingScores;
	
	displayAthleteScore; // Expand all onclick Boolean value
	buildDataComplete = false;

    //! Boolean tracked variable to indicate if modal is open or not default value is false as modal is closed when page is loaded 
    isModalOpen = false;
    athSpotlight = {};
    
    athId;
    athName;
    
    openModal(event) {
        // console.log('event.target.id = ', event.target.id);
        this.athId = (event.target.id).split('-');
        this.athId = this.athId[0];
        this.athName = event.target.innerHTML;
        this.athName = this.athName.split('>');
        this.athName = this.athName[1];
        
        if(this.scoreData && !this.buildDataComplete) {
            // console.log(this.scoreData.length);
            // console.log('Building Data');
            this.buildData(this.data);
        }

        // if (this.buildDataComplete) {
            this.data.forEach(element => {
                // console.log('checking: ', element.Id, this.athId);
                if (element.Id == this.athId) {
                    // console.log(`element.Id: ${element.Id}`);
                    this.athSpotlight.Id = element.Id;
                    this.athSpotlight.Name = element.Name;
                    this.athSpotlight.Location = element.Location__c;
                    this.athSpotlight.Age = element.Age__c;
                    this.athSpotlight.Pic = element.Profile_Pic_URL__c;
                    this.athSpotlight.Rank = element.Rank;
                    this.athSpotlight.TotalPoints = element.Total_Points__c;
                    this.athSpotlight.allWorkouts = element.allWorkouts;
                    
                    this.athSpotlight.RankNumber = this.getRankNumber(this.athSpotlight.Rank);

                    this.athSpotlight.ChallengeTotal = element.Challenges_Completed__c;
                    this.athSpotlight.SPWorkouts = element.Did_SP_Workout__c * 10;
                    this.athSpotlight.GrandTotal = element.Grand_Total__c;

                }
            });
        // }


        // console.log(`Clicked ${this.athName}`);
        // console.log(this.athId);
        // console.log(event.target.innerHTML);
        // to open modal set isModalOpen track value as true
        this.isModalOpen = true;
    }
    
    closeModal() {
        // to close modal set isModalOpen track value as false
        this.isModalOpen = false;
    }
    
    submitDetails() {
        // to close modal set isModalOpen track value as false
        //Add your code to call apex method or do some processing
        this.isModalOpen = false;
    }
    //! ----------------------------------------------------------------


    scoreData = [];
    data = [];

	assignData() {
		this.data = this.incomingAthletes;
		this.scoreData = this.incomingScores;
	}

	handleAthleteClick(event) {
        // console.log(this.displayAthleteScore);
        if (this.displayAthleteScore) {
            this.displayAthleteScore = false;
            this.template.querySelector('button').innerHTML = '&#9650;';
        } else {
            this.displayAthleteScore = true;
            this.template.querySelector('button').innerHTML = '&#9660;';
        }        
    }

    getRankNumber(incomingRank) {
        let RankNumber = incomingRank;

        let lastDigit = RankNumber % 10;

        let lastTwoDigits = RankNumber % 100;
        if(lastTwoDigits == 11 || lastTwoDigits == 12 || lastTwoDigits == 13 ) {
            lastDigit = 0;
        }

        switch (lastDigit) {
            case 1:
                RankNumber += 'st';
                break;
            case 2:
                RankNumber += 'nd';
                break;
            case 3:
                RankNumber += 'rd';
                break;
                                
            default:
                RankNumber += 'th';
                break;
        }
        return RankNumber;
    }

    buildData(incomingArray){
        console.log('Executing building of data');
        // console.log(incomingArray);
        let currentData = [];
        incomingArray.forEach(row => {
            let rowData = row;
            let athWorkouts = [];
            this.scoreData.forEach((element) => {
                let athScore = {};
                if (row.Id == element.AthleteId) {
					athScore.WorkoutName = element.WorkoutName;

                    athScore.Score_1st__c = element.Score_1st__c;
                    athScore.First_Label__c = element.First_Label__c;
                    athScore.Score_2nd__c = element.Score_2nd__c;
                    athScore.Second_Label__c = element.Second_Label__c;
                    athScore.Weight_Used__c = element.Weight_Used__c;
                    athScore.RX_Weight_Male__c = element.RX_Weight_Male__c;


                    athScore.Is_Score_Between_Goal__c = element.Is_Score_Between_Goal__c;
                    athScore.Points_Based_on_Rank__c = element.Points_Based_on_Rank__c;
                    athScore.Total_Points__c = element.Total_Points__c;
                    
                    let RankNumber = ((105 - element.Points_Based_on_Rank__c) / 5);
        
                    athScore.RankNumber = this.getRankNumber(RankNumber);

                    //? takes the Score Submission and make it into a string
                    // let ScoreString = `[${athScore.RankNumber}]  ${element.Score_1st__c} ${element.First_Label__c}`;
                    let ScoreString = `${element.Score_1st__c} ${element.First_Label__c}`;
                    //! needs to be done here
                    if (element.Second_Label__c) {
                        ScoreString += ` ${element.Score_2nd__c} ${element.Second_Label__c}`;
                    } 
                    if (element.RX_Weight_Male__c) {
                        ScoreString += ` @ ${element.Weight_Used__c} lbs`;
                    };
                    athScore.ScoreString = ScoreString;

                    
                    athWorkouts.push(athScore);
                }
            });
            rowData.allWorkouts = athWorkouts;
            currentData.push(rowData);
        });
        // console.log(currentData);
        this.data = currentData;
		console.log('this.data: ', this.data);
        // console.log('Complete building the data');
        this.buildDataComplete = true;
    }

    connectedCallback() {
        this.displayAthleteScore = false;
    }
	
    renderedCallback() {
		this.assignData();
		// console.log('incomingAthletes', this.incomingAthletes.currentWorkout.URL__c);
		// console.log('JSON', JSON.parse(JSON.stringify(this.incomingAthletes)));
        if(this.scoreData && !this.buildDataComplete) {
            // console.log(this.scoreData.length);
            // console.log('Building Data');
            this.buildData(this.data);
        }
        console.log('rendered');
    }
}