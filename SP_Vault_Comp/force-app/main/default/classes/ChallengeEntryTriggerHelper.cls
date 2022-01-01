public without sharing class ChallengeEntryTriggerHelper {
    public static void createChallengeCompleted(List<Challenge_Entry__c> entriesList) {
		//todo a check to see if my Challenge Total points surpass the goal and then if so, create a complete challenge record worth 100 points. It should also

		//? collect specific the Ids for incoming entry's challenge
		Set<Id> athleteIds = new Set<Id>();
		for (Challenge_Entry__c entry : entriesList) {
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

    public static void checkForSameDay(List<Challenge_Entry__c> entriesList) {
		// // a check to see if I already have a checkbox of true for the day and if I do, mark the incoming value as false to avoid having more than one checkbox of true per day

		//! Ideal scenario:
		//! User logged a checkbox and later comes back to submit another and since they already logged a SP for the day, the checkbox is greyed out.

		//? collect specific Ids for incoming entry's challenge
		List<Id> challengeIds = new List<Id>();
		for (Challenge_Entry__c entry : entriesList) {
			challengeIds.add(entry.Challenge__c);
		}

		//? pull allChallengeEntries that match the incoming entry's challenge id
		List<Challenge_Entry__c> allChallengeEntries = [
			SELECT Id, Athlete__c, Challenge__c, Daily_Checkbox__c, CreatedDate
			FROM Challenge_Entry__c
			WHERE Challenge__c IN :challengeIds
			ORDER BY CreatedDate DESC
		];

		//? loop through allChallengeEntries and check against entriesList
		List<Challenge_Entry__c> updatedEntries = new List<Challenge_Entry__c>();
		// Id entryId;
		// if (allChallengeEntries != null) {
			for (Challenge_Entry__c entry : entriesList) {
				for (Challenge_Entry__c aCEntry : allChallengeEntries) {
					date todaysDate = date.today(); //! used for now since only I can edit records
					date convertedDate2 = aCEntry.CreatedDate.date();
					if ( todaysDate.isSameDay(convertedDate2) && aCEntry.Daily_Checkbox__c ) {
						entry.Daily_Checkbox__c = false;
						// Id entryId = entry.id;
						// updatedEntries.add(entryId);
						// updatedEntries.add(entry);
					}
				}
			}
			//? https://help.salesforce.com/s/articleView?id=000316303&type=1
			// Map<Id, Challenge_Entry__c> entryMap = new Map<Id, Challenge_Entry__c>();
			// entryMap.putall(updatedEntries);


			// //? updateEntries is inserted
			// try {
			// 	// if (updatedEntries.size() > 0) update updatedEntries;
			// 	if (entryMap.size() > 0) upsert entryMap.values();
			// } catch (DmlException e) {
			// 	System.debug('The following exception has occurred: ' + e.getMessage());
			// }
		// }
	}
}