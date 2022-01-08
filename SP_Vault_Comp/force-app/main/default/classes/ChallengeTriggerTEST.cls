@isTest
private class ChallengeTriggerTEST {
    @isTest static void TestToggleOfChallenge() {
        //! Test data setup
        List<Integer> scores1 = new List<Integer>{10, 15, 45};
        List<Integer> scores2 = new List<Integer>{15, 25, 45, 60, 30};
		

		//! Create Athletes
        List<Athlete__c> athletesToInsert = new List<Athlete__c>();
        for (Integer i = 0; i < scores2.size(); i++) {
            Athlete__c ath = new Athlete__c(
                Name = 'Athlete_' + i+1,
                Age__c = 35 + i,
                Location__c = 'Dallas, TX'
            );
            athletesToInsert.add(ath);
        }
        insert athletesToInsert;
        List<Athlete__c> athletes = [SELECT Id, Name, Age__c, Location__c FROM Athlete__c];
        System.debug('athletes: ' + athletes);


		//? 2 Challenges exist
		//? 1st challenge is active
		//! Create a new Challenge 1 ----------------------------------------------------------
        Challenge__c challengeToInsert1 = new Challenge__c(
        	Active__c = false,
			Name = 'February 2022',
        	Days_in_Month__c = 28,
	        Movement_1__c = 'Burpees',
            Start_Date__c = System.today().addMonths(1),
            Subtitle__c = 'Lots of Work',
            Total_Challenge_Count__c = 500
        );
        insert challengeToInsert1;
        
        Challenge__c challenge1 = [
			SELECT Id, Name, Active__c, Total_Challenge_Count__c, Start_Date__c 
			FROM Challenge__c WHERE Name = 'February 2022' LIMIT 1
		];
        System.debug('challenge1: ' + challenge1);


		//! Create new Challenge Entries for Challenge 1 for Athletes
		System.debug('Create new Challenge Entries for Challenge 1 for Athletes');
        List<Challenge_Entry__c> challengeEntriesToInsert1 = new List<Challenge_Entry__c>();
		for (Integer i = 0; i < scores1.size(); i++) {
			Challenge_Entry__c entry = new Challenge_Entry__c(
				Athlete__c = athletes[i].Id,
				Challenge__c = challenge1.Id,
				Daily_Checkbox__c = true,
				Movement_1__c = scores1[i]
			);
			challengeEntriesToInsert1.add(entry);
		}
        insert challengeEntriesToInsert1;

        List<Challenge_Entry__c> challengeEntriesFor1 = [
            SELECT Id, Name, Challenge__r.Name, Checkbox_Points__c, Daily_Checkbox__c, Entry_Total__c, Is_Challenge_Active__c 
			FROM Challenge_Entry__c 
			WHERE Challenge__r.Name = 'February 2022'
			ORDER BY Entry_Total__c ASC
			];
        System.debug('challengeEntriesFor1: ' + challengeEntriesFor1);
        System.assertEquals(scores1.size(), challengeEntriesFor1.size());


		//! Create a new Challenge 2 ----------------------------------------------------------
        Challenge__c challengeToInsert2 = new Challenge__c(
        	Active__c = false,
			Name = 'March 2022',
        	Days_in_Month__c = 31,
	        Movement_1__c = 'Box Jump Overs',
            Start_Date__c = System.today().addMonths(2),
            Subtitle__c = 'Lots of Work',
            Total_Challenge_Count__c = 500
        );
        insert challengeToInsert2;
        
        Challenge__c challenge2 = [
			SELECT Id, Name, Active__c, Total_Challenge_Count__c, Start_Date__c 
			FROM Challenge__c WHERE Name = 'March 2022' LIMIT 1
		];
        System.debug('challenge2: ' + challenge2);
        

        //! Create new Challenge Entries for Challenge 2 for Athletes
        System.debug('Create new Challenge Entries for Challenge 2 for Athletes');
        List<Challenge_Entry__c> challengeEntriesToInsert2 = new List<Challenge_Entry__c>();
		for (Integer i = 0; i < scores2.size(); i++) {
			Challenge_Entry__c entry = new Challenge_Entry__c(
				Athlete__c = athletes[i].Id,
				Challenge__c = challenge2.Id,
				Daily_Checkbox__c = true,
				Movement_1__c = scores2[i]
			);
			challengeEntriesToInsert2.add(entry);
		}
        insert challengeEntriesToInsert2;

        List<Challenge_Entry__c> challengeEntriesFor2 = [
            SELECT Id, Name, Challenge__r.Name, Checkbox_Points__c, Daily_Checkbox__c, Entry_Total__c, Is_Challenge_Active__c 
			FROM Challenge_Entry__c 
			WHERE Challenge__r.Name = 'March 2022'
			ORDER BY Entry_Total__c ASC
			];
        System.debug('challengeEntriesFor2: ' + challengeEntriesFor2);
        System.assertEquals(scores2.size(), challengeEntriesFor2.size());
		



		//! Verify Expected Results ----------------------------------------------------------
		//? Switch on 1st Challenge
		System.debug('Switch on 1st Challenge');
		challenge1.Active__c = true;
		update challenge1;
		//? 3 challenge entries are active
		List<Challenge_Entry__c> entryCheck1 = [
            SELECT Id, Name, Is_Challenge_Active__c 
			FROM Challenge_Entry__c 
			WHERE Is_Challenge_Active__c = true
			ORDER BY Entry_Total__c ASC
		];
		System.debug(entryCheck1);
		System.assertEquals(3, entryCheck1.size());
		

		//? Switch off 1st Challenge
		System.debug('Switch off 1st Challenge');
		challenge1.Active__c = false;
		update challenge1;
		//? No challenge entries are active
		List<Challenge_Entry__c> entryCheck2 = [
            SELECT Id, Name, Is_Challenge_Active__c 
			FROM Challenge_Entry__c 
			WHERE Is_Challenge_Active__c = true
			ORDER BY Entry_Total__c ASC
		];
		System.debug(entryCheck2);
		System.assertEquals(0, entryCheck2.size());


		//? Switch on 2nd Challenge
		System.debug('Switch on 2nd Challenge');
		challenge2.Active__c = true;
		update challenge2;
		//? 5 challenge entries are active
		List<Challenge_Entry__c> entryCheck3 = [
            SELECT Id, Name, Is_Challenge_Active__c 
			FROM Challenge_Entry__c 
			WHERE Is_Challenge_Active__c = true
			ORDER BY Entry_Total__c ASC
		];
		System.debug(entryCheck3);
		System.assertEquals(5, entryCheck3.size());
		

		
	
		// List<Integer> expectedNewAthleteChallengeTotals = new List<Integer>{225, 275, 300};
		// List<Integer> expectedNewAthleteChallengeCompleteds = new List<Integer>{0, 100, 100};
		
		// List<Boolean> expectedChallengeActive = new List<Boolean>{true, false, false};

		// List<Challenge_Completed__c> challengeCompleteds = [
		// 	SELECT Id, Name, Challenge__c, Athlete__c, Points__c
		// 	FROM Challenge_Completed__c
		// ];
		// System.debug('challengeCompleteds: ' + challengeCompleteds);
        // System.assertEquals(2, challengeCompleteds.size());
		
		// List<Athlete__c> newAthleteTotals = [
		// 	SELECT Id, Age__c, Name, Challenge_Total__c, Challenges_Completed__c, Did_SP_Workout__c, Grand_Total__c, Grand_Total_Tie_Break__c, Is_RX__c, Location__c, Profile_Pic_URL__c, Total_Movement_1__c, Total_Movement_2__c, Total_Tie_Break_Points__c, Total_Points__c
		// 	FROM Athlete__c 
		// 	ORDER BY Age__c ASC
		// ];
		// System.debug('newAthleteTotals: ' + newAthleteTotals);
		// System.assertEquals(3, newAthleteTotals.size());
			
		// for (Integer i = 0; i < challengeEntries.size(); i++) {
		// 	System.assertEquals(expectedChallengeActive[i], challengeEntries[i].Daily_Checkbox__c);
		// 	// System.assertEquals(expectedNewAthleteChallengeCompleteds[i], newAthleteTotals[i].Challenges_Completed__c);
		// 	// System.assertEquals(1, newAthleteTotals[i].Did_SP_Workout__c);
		// }





        
        // Verify Expected Values
        // 
        // Goal_Low_Value__c = 600, // 10 mins
        // Goal_High_Value__c = 900, // 15 mins
        // Is_Dumbbell__c = TRUE,
        // Is_Goal_Time__c = TRUE,
        // Round_Value__c = 60,
        // RX_Weight_Male__c = 40,
        
        // List<Integer> calculatedPoints = new List<Integer>{615, 615, 690, 900, 1005, 1005};
        // List<Decimal> calculatedRankPoints = new List<Decimal>{683.333, 614.950, 689.950, 1000.000, 1004.950, 1004.950};
        // List<Integer> goalPoints = new List<Integer>{ 100, 100, 100, 100,   0,   0};
        // List<Integer> rankPoints = new List<Integer>{  95, 100,  90,  85,  80,  80};
        // List<Integer> totalPoints = new List<Integer>{195, 200, 190, 185,  80,  80};
            
        // System.assertEquals(scores1.size(), challengeEntries.size());
        // for (Integer i = 0; i < challengeEntries.size(); i++) {
        //     System.assertEquals(calculatedPoints[i], challengeEntries[i].Calculated_Points__c);
        //     System.assertEquals(calculatedRankPoints[i], challengeEntries[i].Calculated_Ranking_Points__c);
        //     System.assertEquals(goalPoints[i], challengeEntries[i].Is_Score_Between_Goal__c);
        //     System.assertEquals(rankPoints[i], challengeEntries[i].Points_Based_on_Rank__c);
        //     System.assertEquals(totalPoints[i], challengeEntries[i].Total_Workout_Points__c);
        // }
    }
}