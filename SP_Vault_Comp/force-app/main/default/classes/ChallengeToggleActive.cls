public without sharing class ChallengeToggleActive {
    List<Challenge__c> newList;
    
	public ChallengeToggleActive(List<Challenge__c> newList) {
		this.newList = newList;
		toggle();
	}

	private void toggle() {
		//? pull allChallengeEntries
		List<Challenge_Entry__c> allChallengeEntries = [
			SELECT Id, Is_Challenge_Active__c, Challenge__c
			FROM Challenge_Entry__c 
			ORDER BY Challenge__r.Start_Date__c ASC
		];

		//? loop through allChallengeEntries and check against newList then set the Is_Challenge_Active__c to the correct value
		List<Challenge_Entry__c> updatedEntries = new List<Challenge_Entry__c>();
		for (Challenge_Entry__c entry : allChallengeEntries) {
			for (Challenge__c challenge : newList) {
				if ( entry.Challenge__c == challenge.Id ) {
					entry.Is_Challenge_Active__c = challenge.Active__c;
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
