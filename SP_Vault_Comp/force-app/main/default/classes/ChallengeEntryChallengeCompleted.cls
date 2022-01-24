public without sharing class ChallengeEntryChallengeCompleted {
    List<Challenge_Entry__c> triggerList;
    
	public ChallengeEntryChallengeCompleted(List<Challenge_Entry__c> triggerList) {
		this.triggerList = triggerList;
		completed();
	}

	private void completed() {
		//todo a check to see if my Challenge Total points surpass the goal and then if so, create a complete challenge record worth 100 points. It should also

		//? collect specific the Ids for incoming entry's challenge
		Set<Id> athleteIds = new Set<Id>();
		for (Challenge_Entry__c entry : triggerList) {
			athleteIds.add(entry.Athlete__c);
		}

		System.debug('athleteIds: ' + athleteIds);
		
		//? pull current challenge to check against
		Challenge__c currentChallenge = [
			SELECT Id, Name, Active__c, Total_Challenge_Count__c, Start_Date__c 
			FROM Challenge__c 
			WHERE Active__c = true
			ORDER BY Start_Date__c ASC LIMIT 1
		];
		System.debug('currentChallenge.Id: ' + currentChallenge.Id);
			
		Decimal totalChallengeCount = currentChallenge.Total_Challenge_Count__c;

		//? pull entriesAthletes that match the incoming entry's athlete id 
		// // and are greater than or equal to totalChallengeCount NOT Calculated yet
		// // AND Challenge_Total__c >= :totalChallengeCount
		List<Athlete__c> entriesAthletes = [
			SELECT Id, Name, Challenge_Total__c 
			FROM Athlete__c 
			WHERE Id IN :athleteIds
		];
		System.debug('Athletes: ' + entriesAthletes.size());


		//? pull all current challenge entry records to get UPDATED Total_Challenge_Count__c for athletes
		List<Challenge_Entry__c> allCurrentChallengeEntries = [
			SELECT Id, Athlete__c, Challenge__c, Movement_1__c, Movement_2__c
			FROM Challenge_Entry__c
			WHERE Challenge__c = :currentChallenge.Id
			AND Athlete__c IN :athleteIds
		];
		System.debug('allCurrentChallengeEntries: ' + allCurrentChallengeEntries);
		System.debug('allCurrentChallengeEntries (size): ' + allCurrentChallengeEntries.size());


		//? collect specific the Ids for qualified athletes
		Map<Id, Decimal> athleteTotalsMap = new Map<Id, Decimal>();
		//? add values to the Map
		for (Challenge_Entry__c entry : allCurrentChallengeEntries) {
			Decimal total = 0;
			if (athleteTotalsMap.containsKey(entry.Athlete__c)) {
				System.debug('entry.Movement_1__c: ' + entry.Movement_1__c);
				// System.debug('entry.Athlete__c: ' + entry.Athlete__c);
				if (entry.Movement_1__c == null && entry.Movement_2__c == null) {
					total = athleteTotalsMap.get(entry.Athlete__c);
				} else if (entry.Movement_1__c == null) {
					total = entry.Movement_2__c + athleteTotalsMap.get(entry.Athlete__c);
				} else if (entry.Movement_2__c == null) {
					total = entry.Movement_1__c + athleteTotalsMap.get(entry.Athlete__c);
				} else {
					total = entry.Movement_1__c + entry.Movement_2__c + athleteTotalsMap.get(entry.Athlete__c);
				}
				athleteTotalsMap.put(entry.Athlete__c, total);
			} else {
				if (entry.Movement_1__c == null && entry.Movement_2__c == null) {
					athleteTotalsMap.put(entry.Athlete__c, 0);
				} else if (entry.Movement_1__c == null) {
					athleteTotalsMap.put(entry.Athlete__c, (entry.Movement_2__c));
				} else if (entry.Movement_2__c == null) {
					athleteTotalsMap.put(entry.Athlete__c, (entry.Movement_1__c));
				} else {
					athleteTotalsMap.put(entry.Athlete__c, (entry.Movement_1__c + entry.Movement_2__c));
				}
			}
			System.debug('Map: ' + athleteTotalsMap.values());
		}
		System.debug('Map: ' + athleteTotalsMap.values());
		System.debug('Map: ' + athleteTotalsMap);

		// //? iterate over the Map and check the totals
		Set<Id> athleteIdsThatCompletedChallenge = new Set<Id>();
		for (Id key : athleteTotalsMap.keySet()) {
			if (athleteTotalsMap.get(key) >= totalChallengeCount) {
				athleteIdsThatCompletedChallenge.add(key);
			}
		}

		//? pull all current challenge completed records to later check if there exists one for the athlete
		List<Challenge_Completed__c> allCurrentChallengeCompleteds = [
			SELECT Id, Athlete__c, Challenge__c, Points__c
			FROM Challenge_Completed__c
			WHERE Challenge__c = :currentChallenge.Id
		];

		//? makes a set of Ids to use for comparison against incoming athlete Ids
		Set<Id> existingChallengeCompletedAthleteIds = new Set<Id>();
		for (Challenge_Completed__c completed : allCurrentChallengeCompleteds) {
			existingChallengeCompletedAthleteIds.add(completed.Athlete__c);
		}

		//? Compare athleteIdsThatCompletedChallenge (Set<Id>) and existingChallengeCompletedAthleteIds (Set<Id>) to see Ids without a Current Challenge_Completed__c record already
		Set<Id> athleteIdsToCreateRecordsFor = new Set<Id>();
		athleteIdsToCreateRecordsFor = InAButNotInB(athleteIdsThatCompletedChallenge, existingChallengeCompletedAthleteIds);
		

		//? create Challenge_Completed__c for these Ids
		List<Challenge_Completed__c> recordsToInsert = new List<Challenge_Completed__c>();
		for (Id athleteId : athleteIdsToCreateRecordsFor) {
			//? create a new Challenge Completed Record
			Challenge_Completed__c newRecord = new Challenge_Completed__c(
				Athlete__c = athleteId,
				Challenge__c = currentChallenge.Id,
				Points__c = 100
			);
			recordsToInsert.add(newRecord);
		}
		System.debug('recordsToInsert: ' + recordsToInsert);

		try {
			if (recordsToInsert.size() > 0) insert recordsToInsert;
		} catch (DmlException e) {
			System.debug('The following exception has occurred: ' + e.getMessage());
		}
	}

	// //? https://medium.com/@alvaro.saburido/set-theory-for-arrays-in-es6-eb2f20a61848
	// private Set<Integer> intersectionOfTwoSets(Set<Integer> set1, Set<Integer> set2){
	// 	//? setA = {1, 2, 5, 7, 8} & setB = {2, 4, 8, 9, 10}
	// 	//? returns {2, 8}
		
	// 	//! for testing
	// 	// List<Integer> list1 = new List<Integer>{2, 3, 6, 7, 9, 11};
	// 	// List<Integer> list2 = new List<Integer>{4, 6, 8, 9, 12, 9, 12, 14};
	// 	// Set<Integer> set1 = new Set<Integer>();
	// 	// set1.addAll(list1);
	// 	// Set<Integer> set2 = new Set<Integer>();
	// 	// set2.addAll(list2);

	// 	Set<Integer> intersection = new Set<Integer>();
	// 	for(Integer val : set2) {
	// 		if (set1.contains(val)) intersection.add(val);
	// 	}
	// 	System.debug('intersection: ' + intersection);
	// 	return intersection;
    // }

	private Set<Id> InAButNotInB(Set<Id> setA, Set<Id> setB){
        Set<Id> setUnion = new Set<Id>();
        setUnion.addAll(setA);
        setUnion.addAll(setB);
        setUnion.removeAll(setB);
        return setUnion;
    }

    // private List<User> combineLists(List<User> listA, List<User> listB){
    //     Set<User> setUnion = new Set<User>();
    //     setUnion.addAll(listA);
    //     setUnion.addAll(listB);
        
    //     List<User> listUnion = new List<User>();
    //     listUnion.addAll(setUnion);
    //     listUnion.sort();

    //     return listUnion;
    // }

}

