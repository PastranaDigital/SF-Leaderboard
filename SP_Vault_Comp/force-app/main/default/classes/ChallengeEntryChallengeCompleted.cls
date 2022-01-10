public without sharing class ChallengeEntryChallengeCompleted {
    List<Challenge_Entry__c> newList;
    
	public ChallengeEntryChallengeCompleted(List<Challenge_Entry__c> newList) {
		this.newList = newList;
		completed();
	}

	private void completed() {
		//todo a check to see if my Challenge Total points surpass the goal and then if so, create a complete challenge record worth 100 points. It should also

		//? collect specific the Ids for incoming entry's challenge
		Set<Id> athleteIds = new Set<Id>();
		for (Challenge_Entry__c entry : newList) {
			athleteIds.add(entry.Athlete__c);
		}

		//? pull entriesAthletes that match the incoming entry's athlete id
		List<Athlete__c> entriesAthletes = [
			SELECT Id, Name, Challenge_Total__c 
			FROM Athlete__c 
			WHERE Id IN :athleteIds
			ORDER BY Grand_Total_Tie_Break__c DESC
		];

		Challenge__c currentChallenge = [
			SELECT Id, Name, Active__c, Total_Challenge_Count__c, Start_Date__c 
			FROM Challenge__c 
			WHERE Active__c = true
			ORDER BY Start_Date__c ASC LIMIT 1
		];

		List<Challenge_Completed__c> allCurrentChallengeCompleteds = [
			SELECT Id, Athlete__c, Challenge__c, Points__c
			FROM Challenge_Completed__c
			WHERE Challenge__c = :currentChallenge.Id
		];

		Set<Id> challengeCompletedAthleteIds = new Set<Id>();
		for (Challenge_Completed__c completed : allCurrentChallengeCompleteds) {
			challengeCompletedAthleteIds.add(completed.Athlete__c);
		}

		//? loop through entriesAthletes (unique list) and check if a Challenge_Completed__c record exists already
		// Set<Athlete__c> athletesToSkip = new Set<Athlete__c>();
		// for (Athlete__c athlete : entriesAthletes) {
			
		// 	//? check the list of allCurrentChallengeCompleteds if one is already made for athlete

			
			
		// 	for (Challenge_Completed__c completed : allCurrentChallengeCompleteds) {
		// 		if ( athlete.Id == completed.Athlete__c ) {
		// 			athletesToSkip.add(athlete);
		// 		}
		// 	}
		// }

		//? loop through entriesAthletes (unique list) and check if the new total will reach the Total_Challenge_Count__c
		List<Challenge_Completed__c> recordsToInsert = new List<Challenge_Completed__c>();
		for (Athlete__c athlete : entriesAthletes) {
			
			//? check the list of allCurrentChallengeCompleteds if one is already made for athlete

			if ( !challengeCompletedAthleteIds.contains(athlete.Id) ){
				System.debug('----------------------------------------------------------------------------------- @#$');
				//? create a new Challenge Completed Record
				Challenge_Completed__c newRecord = new Challenge_Completed__c(
					Athlete__c = athlete.Id,
					Challenge__c = currentChallenge.Id,
					Points__c = 100
				);
				recordsToInsert.add(newRecord);
			}

			// for (Challenge_Completed__c completed : allCurrentChallengeCompleteds) {
				// if ( athlete.Id != completed.Athlete__c ) {
				// 	System.debug('----------------------------------------------------------------------------------- @#$')
				// 	//? create a new Challenge Completed Record
				// 	Challenge_Completed__c newRecord = new Challenge_Completed__c(
				// 		Athlete__c = athlete.Id,
				// 		Challenge__c = currentChallenge.Id,
				// 		Points__c = 100
				// 	);
				// 	recordsToInsert.add(newRecord);
				// }
			// }
		}
		System.debug(recordsToInsert);

		//? updateEntries is inserted
		try {
			if (recordsToInsert.size() > 0) insert recordsToInsert;
		} catch (DmlException e) {
			System.debug('The following exception has occurred: ' + e.getMessage());
		}
	}
}
