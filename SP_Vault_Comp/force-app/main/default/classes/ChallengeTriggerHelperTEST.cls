@isTest
private class ChallengeTriggerHelperTEST {
    @isTest static void TestToggleOfChallenge() {
        
		
		
		
		//! NOT TESTING THE CORRECT THING
		//! NOT TESTING THE CORRECT THING
		//! NOT TESTING THE CORRECT THING
		//! NOT TESTING THE CORRECT THING
		//! NOT TESTING THE CORRECT THING
		//! NOT TESTING THE CORRECT THING
		//! NOT TESTING THE CORRECT THING
		//! NOT TESTING THE CORRECT THING
		//! NOT TESTING THE CORRECT THING
		//! NOT TESTING THE CORRECT THING
		//! NOT TESTING THE CORRECT THING
		//! NOT TESTING THE CORRECT THING
		
		
		
			
		
		
		//! Test data setup
        List<Integer> scores1 = new List<Integer>{50, 50, 100};
        List<Integer> scores2 = new List<Integer>{25, 75,  50};
		//? EXPECTED TOTALS						  75 125  150
        
        //! Create a new Challenge
        Challenge__c challengeToInsert = new Challenge__c(
        	Active__c = true,
			Name = 'February 2025',
        	Days_in_Month__c = 28,
	        Movement_1__c = 'Burpees',
	        Movement_2__c = 'Box Jump Overs',
            Start_Date__c = System.today().addMonths(1),
            Subtitle__c = 'Lots of Work',
            Total_Challenge_Count__c = 275
        );
        insert challengeToInsert;
        
        Challenge__c challenge = [
			SELECT Id, Name, Active__c, Total_Challenge_Count__c, Start_Date__c 
			FROM Challenge__c WHERE Name = 'February 2025' LIMIT 1
		];
        System.debug('challenge: ' + challenge);
        

        //! Create Athlete
		Athlete__c ath = new Athlete__c(
			Name = 'Athlete_Test',
			Age__c = 35,
			Location__c = 'Dallas, TX'
		);
        insert ath;

        List<Athlete__c> athlete = [
			SELECT Id, Name
			FROM Athlete__c 
			ORDER BY Age__c ASC
		];
        System.debug('athlete: ' + athlete);
        
        
        //! Create new Challenge Entries for Challenge for Athlete
        List<Challenge_Entry__c> challengeEntriesToInsert = new List<Challenge_Entry__c>();
		for (Integer i = 0; i < 3; i++) {
			Challenge_Entry__c entry = new Challenge_Entry__c(
				Athlete__c = athlete[0].Id,
				Challenge__c = challenge.Id,
				Daily_Checkbox__c = true,
				Movement_1__c = scores1[i],
				Movement_2__c = scores2[i]
			);
			challengeEntriesToInsert.add(entry);
		}
        insert challengeEntriesToInsert;

        List<Challenge_Entry__c> challengeEntries = [
            SELECT Id, Name, Challenge__r.Name, Checkbox_Points__c, Daily_Checkbox__c, Entry_Total__c 
			FROM Challenge_Entry__c 
			ORDER BY Entry_Total__c ASC
			];
        System.debug('challengeEntries: ' + challengeEntries);
        System.assertEquals(3, challengeEntries.size());
		
		//! Verify Expected Results
		// List<Integer> expectedNewAthleteChallengeTotals = new List<Integer>{225, 275, 300};
		// List<Integer> expectedNewAthleteChallengeCompleteds = new List<Integer>{0, 100, 100};
		
		List<Boolean> expectedChallengeActive = new List<Boolean>{true, false, false};

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
			
		for (Integer i = 0; i < challengeEntries.size(); i++) {
			System.assertEquals(expectedChallengeActive[i], challengeEntries[i].Daily_Checkbox__c);
			// System.assertEquals(expectedNewAthleteChallengeCompleteds[i], newAthleteTotals[i].Challenges_Completed__c);
			// System.assertEquals(1, newAthleteTotals[i].Did_SP_Workout__c);
		}





        
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