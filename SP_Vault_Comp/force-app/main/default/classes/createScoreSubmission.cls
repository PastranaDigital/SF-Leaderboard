public without sharing class createScoreSubmission {
    @AuraEnabled
    public static Score_Submission__c createScore(Score_Submission__c score) {
        Score_Submission__c[] allScoreSubs = [
            SELECT Id, Name, Athlete_Name__c, Vault_Workout__c, Notes__c, Score_1st__c, Score_2nd__c, Weight_Used__c
            FROM Score_Submission__c
            WHERE Athlete_Name__c = :score.Athlete_Name__c 
            AND Vault_Workout__c = :score.Vault_Workout__c
            // LIMIT 1
        ];
        System.debug('score: ' + score);
        if (allScoreSubs.size() > 0) {
            allScoreSubs[0].Score_1st__c = score.Score_1st__c;
            allScoreSubs[0].Score_2nd__c = score.Score_2nd__c;
            allScoreSubs[0].Weight_Used__c = score.Weight_Used__c;
            System.debug('allScoreSubs(updated): ' + allScoreSubs);
            update allScoreSubs;
        } else {
            System.debug('allScoreSubs: ' + allScoreSubs);
            insert score;
        }


		//? Create a Challenge Entry for Vault
		List<Challenge__c> currentChallenge = [
			SELECT Id, Name, Active__c, Movement_1__c, Movement_2__c, Subtitle__c, Total_Challenge_Count__c, Days_in_Month__c, Start_Date__c 
			FROM Challenge__c 
			WHERE Active__c = true
			ORDER BY Start_Date__c ASC
			LIMIT 1
		];
		System.debug(currentChallenge);

		
		Challenge_Entry__c entry = new Challenge_Entry__c(
			Athlete__c = score.Athlete_Name__c,
			Challenge__c = currentChallenge[0].Id,
			Is_Challenge_Active__c = true,
			Daily_Checkbox__c = true
		);
		System.debug(entry);
			
		//? check to see if an entry already exists for today
		List<Challenge_Entry__c> todaysEntries = [
			SELECT Id, Athlete__c, Movement_1__c, Daily_Checkbox__c
			FROM Challenge_Entry__c
			WHERE Athlete__c = :score.Athlete_Name__c AND CreatedDate = TODAY AND Daily_Checkbox__c = true
		];

		Boolean alreadyAnEntryForToday = todaysEntries.size() > 0 ? true : false;

		//? exit without inserting entry
		if (alreadyAnEntryForToday) return score; 
		
		//? try to insert the entry
		try {
			insert entry;
		} catch (DmlException e) {
			System.debug('The following exception has occurred: ' + e.getMessage());
		}

        return score;
    }

    @AuraEnabled
    public static Score_Submission__c getSubmittedScore(Score_Submission__c score) {
        System.debug('getSubmittedScore: ' + score);
        return [
            SELECT Id, Name, Athlete_Name__c, Vault_Workout__c, Notes__c, Score_1st__c, Score_2nd__c, Weight_Used__c, CreatedBy.Name, Is_Score_Between_Goal__c, Total_Workout_Points__c, Points_Based_on_Rank__c 
            FROM Score_Submission__c 
            WHERE Athlete_Name__c = :score.Athlete_Name__c AND Vault_Workout__c = :score.Vault_Workout__c
            LIMIT 1];
    }
}