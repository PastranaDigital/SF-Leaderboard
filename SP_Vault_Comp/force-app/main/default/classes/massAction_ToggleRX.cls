public without sharing class massAction_ToggleRX {
    @AuraEnabled
    public static void toggleRX(List<Id> incomingIds) {
        
		// List<Id> incomingIdsList = new List<Id>();
		// for (String incId : incomingIds) {
		// 	Id i = Id.valueOf(incId);
		// 	incomingIdsList.add(i);
		// }

		List<Athlete__c> matchedAthletes = [
            SELECT Id, Is_RX__c
            FROM Athlete__c
            WHERE Id = :incomingIds
        ];

		System.debug('incomingIds: ' + incomingIds);
		System.debug('matchedAthletes: ' + matchedAthletes);

		List<Athlete__c> updatedAthletes = new List<Athlete__c>();
		for (Athlete__c athlete : matchedAthletes) {
			athlete.Is_RX__c = !athlete.Is_RX__c;
			updatedAthletes.add(athlete);
		}

		System.debug('updatedAthletes: ' + updatedAthletes);

		
		try {
			update updatedAthletes;
		} catch (DmlException e) {
			System.debug('The following exception has occurred: ' + e.getMessage());
		}
    }
}