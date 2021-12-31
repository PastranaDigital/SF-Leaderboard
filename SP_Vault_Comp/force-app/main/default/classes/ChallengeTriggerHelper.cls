public without sharing class ChallengeTriggerHelper {
    public static void toggleIsActiveCheckbox(List<Challenge__c> challengeList) {
		
		// //? collect all the Ids for incoming challenge
		// List<Id> challengeIds = new List<Id>();
		// for (Challenge__c c : challengeList) {
		// 	challengeIds.add(c.Id);
		// }

		//? pull allChallengeEntries
		List<Challenge_Entry__c> allChallengeEntries = [
			SELECT Id, Is_Challenge_Active__c, Challenge__c
			FROM Challenge_Entry__c 
			ORDER BY Challenge__r.Start_Date__c ASC
		];

		//? loop through allChallengeEntries and check against 
		//!challengeIds 
		//? then set the Is_Challenge_Active__c to the correct value
		List<Challenge_Entry__c> updatedEntries = new List<Challenge_Entry__c>();
		for (Challenge_Entry__c entry : allChallengeEntries) {
			for (Challenge__c challenge : challengeList) {
				if ( entry.Challenge__c == challenge.Id ) {
					entry.Is_Challenge_Active__c = challenge.Active__c;
				// } else {
				// 	entry.Is_Challenge_Active__c = false;
				}
			}
			updatedEntries.add(entry);
		}

		//? updateEntries is inserted
		try {
			if (updatedEntries.size() > 0) update updatedEntries;
		} catch (DmlException e) {
			System.debug('The following exception has occurred: ' + e.getMessage());
		}
	}
}