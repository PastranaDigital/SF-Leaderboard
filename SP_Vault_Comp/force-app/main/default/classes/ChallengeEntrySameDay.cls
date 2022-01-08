public with sharing class ChallengeEntrySameDay {
    List<Challenge_Entry__c> newList;
    
	public ChallengeEntrySameDay(List<Challenge_Entry__c> newList) {
		this.newList = newList;
		sameDay();
	}

	private void sameDay() {
		// // a check to see if I already have a checkbox of true for the day and if I do, mark the incoming value as false to avoid having more than one checkbox of true per day

		//! Ideal scenario:
		//! User logged a checkbox and later comes back to submit another and since they already logged a SP for the day, the checkbox is greyed out.

		//? collect specific Ids for incoming entry's challenge
		List<Id> challengeIds = new List<Id>();
		for (Challenge_Entry__c entry : newList) {
			challengeIds.add(entry.Challenge__c);
		}

		//? pull allChallengeEntries that match the incoming entry's challenge id
		List<Challenge_Entry__c> allChallengeEntries = [
			SELECT Id, Athlete__c, Challenge__c, Daily_Checkbox__c, CreatedDate
			FROM Challenge_Entry__c
			WHERE Challenge__c IN :challengeIds
			ORDER BY CreatedDate DESC
		];

		//? loop through allChallengeEntries and check against newList
		List<Challenge_Entry__c> updatedEntries = new List<Challenge_Entry__c>();
		// Id entryId;
		// if (allChallengeEntries != null) {
			for (Challenge_Entry__c entry : newList) {
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
