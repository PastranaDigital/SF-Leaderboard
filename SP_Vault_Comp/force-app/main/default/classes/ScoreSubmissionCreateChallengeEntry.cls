public with sharing class ScoreSubmissionCreateChallengeEntry {
    List<Score_Submission__c> newList;
    
	public ScoreSubmissionCreateChallengeEntry(List<Score_Submission__c> newList) {
		this.newList = newList;
		create();
	}

	private void create() {
		//! FOR TESTING ONLY
		// List<Score_Submission__c> newList = [
		// 	SELECT Id, Athlete_Name__c
		// 	FROM Score_Submission__c
		// 	WHERE Athlete_Name__r.Name = 'Andy Test'
		// 	LIMIT 1
		// ];

		System.debug('newList' + newList);

		List<Challenge__c> currentChallenge = [
			SELECT Id, Name, Active__c, Movement_1__c, Movement_2__c, Subtitle__c, Total_Challenge_Count__c, Days_in_Month__c, Start_Date__c 
			FROM Challenge__c 
			WHERE Active__c = true
			ORDER BY Start_Date__c ASC
			LIMIT 1
		];
		System.debug(currentChallenge);

		List<Challenge_Entry__c> challengeEntriesToInsert = new List<Challenge_Entry__c>();
        for (Score_Submission__c s : newList) {
            Challenge_Entry__c entry = new Challenge_Entry__c(
				Athlete__c = s.Athlete_Name__c,
				Challenge__c = currentChallenge[0].Id,
				Is_Challenge_Active__c = true,
				Daily_Checkbox__c = true
			);
			challengeEntriesToInsert.add(entry);
        }
		System.debug(challengeEntriesToInsert);
		System.assertEquals(1, challengeEntriesToInsert.size());

		// if (challengeEntriesToInsert.size() > 0) {
		// 	insert challengeEntriesToInsert;
		// }



		try {
			if (challengeEntriesToInsert.size() > 0) insert challengeEntriesToInsert;
		} catch (DmlException e) {
			System.debug('The following exception has occurred: ' + e.getMessage());
		}

		// calculateRanking(newList);
	}
}
