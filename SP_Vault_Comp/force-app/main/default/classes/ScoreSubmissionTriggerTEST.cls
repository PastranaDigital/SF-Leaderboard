@isTest
private class ScoreSubmissionTriggerTEST {
      
    // @isTest static void TestCreateEntryFromSubmission() {
	// 	//! Test data setup
    //     List<Integer> scores1 = new List<Integer>{10};
    //     List<Integer> scores2 = new List<Integer>{15};
    //     List<Integer> weights = new List<Integer>{30};
        
    //     //! Create a new Challenge
    //     Challenge__c challengeToInsert = new Challenge__c(
    //     	Active__c = true,
	// 		Name = 'February 2022',
    //     	Days_in_Month__c = 28,
	//         Movement_1__c = 'Burpees',
	//         Movement_2__c = 'Box Jump Overs',
    //         Start_Date__c = System.today().addMonths(1),
    //         Subtitle__c = 'Lots of Work',
    //         Total_Challenge_Count__c = 275
    //     );
    //     insert challengeToInsert;
        
	// 	// SELECT Id, Name, Active__c, Total_Challenge_Count__c, Start_Date__c 
	// 	// FROM Challenge__c WHERE Name = 'February 2022' LIMIT 1
    //     Challenge__c challenge = [
	// 		SELECT Id, Name, Active__c, Movement_1__c, Movement_2__c, Subtitle__c, Total_Challenge_Count__c, Days_in_Month__c, Start_Date__c 
	// 		FROM Challenge__c 
	// 		WHERE Active__c = true
	// 		ORDER BY Start_Date__c ASC
	// 		LIMIT 1
	// 	];
    //     System.debug('challenge: ' + challenge);
		
	// 	//! Create a new Workout (Time Based)
    //     Vault_Workout__c workoutsToInsert = new Vault_Workout__c(
    //     	Name = 'Workout_Time',
    //     	Goal_Low_Value__c = 600, // 10 mins
	//         Goal_High_Value__c = 900, // 15 mins
    //         Is_Dumbbell__c = TRUE,
    //         Is_Goal_Time__c = TRUE,
    //         Round_Value__c = 60,
    //         RX_Weight_Male__c = 40,
    //         First_Label__c = 'Mins',
    //         Second_Label__c = 'Secs',
    //         Order__c = 1,
    //         Workout_Date__c = System.today().addMonths(1)
    //     );
    //     insert workoutsToInsert;
        
    //     Vault_Workout__c workout = [SELECT Id, Name, Goal_Low_Value__c FROM Vault_Workout__c WHERE Name = 'Workout_Time' LIMIT 1];
    //     System.debug('workout: ' + workout);
        
        
    //     //! Create Athlete
    //     List<Athlete__c> athletesToInsert = new List<Athlete__c>();
    //     // for (Integer i = 0; i < scores1.size(); i++) {
    //         Athlete__c ath = new Athlete__c(
    //             Name = 'Athlete_' + 1,
    //             Age__c = 35,
    //             Location__c = 'Dallas, TX'
    //         );
    //         athletesToInsert.add(ath);
    //     // }
    //     insert athletesToInsert;
    //     Athlete__c athlete = [SELECT Id, Name, Age__c, Location__c FROM Athlete__c LIMIT 1];
    //     System.debug('athlete: ' + athlete);
        
        
    //     //! Create new Score Submissions for workout
    //     // List<Score_Submission__c> scoreSub = new List<Score_Submission__c>();
    //     // for (Integer i = 0; i < scores1.size(); i++) {
    //         Score_Submission__c score = new Score_Submission__c(
    //             Athlete_Name__c = athlete.Id,
    //             Vault_Workout__c = workout.Id,
    //             Score_1st__c = 10,
    //             Score_2nd__c = 15,
    //             Weight_Used__c = 30
    //         );
    //         // scoreSub.add(score);
    //     // }
    //     insert score;
    //     List<Score_Submission__c> subScore = [
    //         SELECT Id, Name, Athlete_Name__r.Name, Vault_Workout__r.Name, Score_1st__c, Score_2nd__c, Weight_Used__c, Calculated_Points__c, Calculated_Ranking_Points__c, Is_Score_Between_Goal__c, Points_Based_on_Rank__c, Total_Workout_Points__c
    //         FROM Score_Submission__c
    //         ORDER BY Name ASC];
    //     System.debug('subScore: ' + subScore);
		
		
		
	// 	List<Challenge_Entry__c> challengeEntries = [
	// 		SELECT Id, Athlete__r.Name, Daily_Checkbox__c 
	// 		FROM Challenge_Entry__c
	// 	];
	// 	System.debug('challengeEntries: ' + challengeEntries);
			

	// 	//! Assertions
	// 	System.assertEquals(scores1.size(), challengeEntries.size());
	// 	for (Challenge_Entry__c entry : challengeEntries) {
	// 		System.assert(entry.Daily_Checkbox__c);
	// 	}
	// }

	@isTest static void TestUpdateScores_TimeWorkout() {
		//! Test data setup
		List<Integer> scores1 = new List<Integer>{10, 10, 11, 15, 16, 16};
		List<Integer> scores2 = new List<Integer>{15, 15, 30,  0, 45, 45};
		List<Integer> weights = new List<Integer>{30, 40, 40, 30, 40, 40};
		
		// Create a new Workout (Time Based)
		Vault_Workout__c workoutsToInsert = new Vault_Workout__c(
			Name = 'Workout_Time',
			Goal_Low_Value__c = 600, // 10 mins
			Goal_High_Value__c = 900, // 15 mins
			Is_Dumbbell__c = TRUE,
			Is_Goal_Time__c = TRUE,
			Round_Value__c = 60,
			RX_Weight_Male__c = 40,
			First_Label__c = 'Mins',
			Second_Label__c = 'Secs',
			Order__c = 1,
			Workout_Date__c = System.today().addMonths(1)
		);
		insert workoutsToInsert;
		
		Vault_Workout__c workout = [SELECT Id, Name, Goal_Low_Value__c FROM Vault_Workout__c WHERE Name = 'Workout_Time' LIMIT 1];
		System.debug('workout: ' + workout);
		
		
		// Create Athletes
		List<Athlete__c> athletesToInsert = new List<Athlete__c>();
		for (Integer i = 0; i < scores1.size(); i++) {
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
		
		
		// Create new Score Submissions for workout
		List<Score_Submission__c> scoreSub = new List<Score_Submission__c>();
		for (Integer i = 0; i < scores1.size(); i++) {
			Score_Submission__c score = new Score_Submission__c(
				Athlete_Name__c = athletes[i].Id,
				Vault_Workout__c = workout.Id,
				Score_1st__c = scores1[i],
				Score_2nd__c = scores2[i],
				Weight_Used__c = weights[i]
			);
			scoreSub.add(score);
		}
		insert scoreSub;
		List<Score_Submission__c> subScores = [
			SELECT Id, Name, Athlete_Name__r.Name, Vault_Workout__r.Name, Score_1st__c, Score_2nd__c, Weight_Used__c, Calculated_Points__c, Calculated_Ranking_Points__c, Is_Score_Between_Goal__c, Points_Based_on_Rank__c, Total_Workout_Points__c
			FROM Score_Submission__c
			ORDER BY Name ASC];
		System.debug('subScores: ' + subScores);
		
		
		// Verify Expected Values
		// 
		// Goal_Low_Value__c = 600, // 10 mins
		// Goal_High_Value__c = 900, // 15 mins
		// Is_Dumbbell__c = TRUE,
		// Is_Goal_Time__c = TRUE,
		// Round_Value__c = 60,
		// RX_Weight_Male__c = 40,
		
		List<Integer> calculatedPoints = new List<Integer>{615, 615, 690, 900, 1005, 1005};
		List<Decimal> calculatedRankPoints = new List<Decimal>{683.333, 614.950, 689.950, 1000.000, 1004.950, 1004.950};
		List<Integer> goalPoints = new List<Integer>{ 100, 100, 100, 100,   0,   0};
		List<Integer> rankPoints = new List<Integer>{  95, 100,  90,  85,  80,  80};
		List<Integer> totalPoints = new List<Integer>{195, 200, 190, 185,  80,  80};
			
		System.assertEquals(scores1.size(), subScores.size());
		for (Integer i = 0; i < subScores.size(); i++) {
			System.assertEquals(calculatedPoints[i], subScores[i].Calculated_Points__c);
			System.assertEquals(calculatedRankPoints[i], subScores[i].Calculated_Ranking_Points__c);
			System.assertEquals(goalPoints[i], subScores[i].Is_Score_Between_Goal__c);
			System.assertEquals(rankPoints[i], subScores[i].Points_Based_on_Rank__c);
			System.assertEquals(totalPoints[i], subScores[i].Total_Workout_Points__c);
		}
	}

	
	@isTest static void TestUpdateScores_RoundsWorkout() {
		//! Test data setup
		List<Integer> scores1 = new List<Integer>{ 4,  4,  6,  6,  7,  7};
		List<Integer> scores2 = new List<Integer>{15, 15, 15,  0,  5,  5};
		List<Integer> weights = new List<Integer>{95, 95, 95, 75, 75, 75};
		
		// Create a new Workout (Rounds Based)
		Vault_Workout__c workoutsToInsert = new Vault_Workout__c(
			Name = 'Workout_Rounds',
			Goal_Low_Value__c = 120, // 4 rounds
			Goal_High_Value__c = 180, // 6 rounds
			Is_Dumbbell__c = FALSE,
			Is_Goal_Time__c = FALSE,
			Round_Value__c = 30,
			RX_Weight_Male__c = 95,
			First_Label__c = 'Rounds',
			Second_Label__c = 'Reps',
			Order__c = 1,
			Workout_Date__c = System.today().addMonths(2)
		);        
		insert workoutsToInsert;
		
		Vault_Workout__c workout = [SELECT Id, Name, Goal_Low_Value__c FROM Vault_Workout__c WHERE Name = 'Workout_Rounds' LIMIT 1];
		System.debug('workout: ' + workout);
		
		
		// Create Athletes
		List<Athlete__c> athletesToInsert = new List<Athlete__c>();
		for (Integer i = 0; i < scores1.size(); i++) {
			Athlete__c ath = new Athlete__c(
				Name = 'Athlete_' + i+1,
				Age__c = 35 + i,
				Location__c = 'Memphis, TN'
			);
			athletesToInsert.add(ath);
		}
		insert athletesToInsert;
		List<Athlete__c> athletes = [SELECT Id, Name, Age__c, Location__c FROM Athlete__c];
		System.debug('athletes: ' + athletes);
		
		
		// Create new Score Submissions for workout
		List<Score_Submission__c> scoreSub = new List<Score_Submission__c>();
		for (Integer i = 0; i < scores1.size(); i++) {
			Score_Submission__c score = new Score_Submission__c(
				Athlete_Name__c = athletes[i].Id,
				Vault_Workout__c = workout.Id,
				Score_1st__c = scores1[i],
				Score_2nd__c = scores2[i],
				Weight_Used__c = weights[i]
			);
			scoreSub.add(score);
		}
		insert scoreSub;
		List<Score_Submission__c> subScores = [
			SELECT Id, Athlete_Name__r.Name, Calculated_Points__c, Calculated_Ranking_Points__c, Is_Score_Between_Goal__c, Points_Based_on_Rank__c, Total_Workout_Points__c
			FROM Score_Submission__c
			ORDER BY Name ASC];
		System.debug('subScores: ' + subScores);
		
		
		// Verify Expected Values
		// 
		// Goal_Low_Value__c = 120, // 4 rounds
		// Goal_High_Value__c = 240, // 6 rounds
		// Is_Dumbbell__c = FALSE,
		// Is_Goal_Time__c = FALSE,
		// Round_Value__c = 30,
		// RX_Weight_Male__c = 95,
			
		List<Integer> calculatedPoints = new List<Integer>{135, 135, 195, 180, 215, 215};
		List<Decimal> calculatedRankPoints = new List<Decimal>{135.05, 135.05, 195.05, 162, 193.5, 193.5};
		List<Integer> goalPoints = new List<Integer>{ 100, 100, 100, 100,   0,   0};
		List<Integer> rankPoints = new List<Integer>{  80,  80, 100,  85,  95,  95};
		List<Integer> totalPoints = new List<Integer>{180, 180, 200, 185,  95,  95};
			
		System.assertEquals(scores1.size(), subScores.size());
		for (Integer i = 0; i < subScores.size(); i++) {
			System.assertEquals(calculatedPoints[i], subScores[i].Calculated_Points__c);
			System.assertEquals(calculatedRankPoints[i], subScores[i].Calculated_Ranking_Points__c);
			System.assertEquals(goalPoints[i], subScores[i].Is_Score_Between_Goal__c);
			System.assertEquals(rankPoints[i], subScores[i].Points_Based_on_Rank__c);
			System.assertEquals(totalPoints[i], subScores[i].Total_Workout_Points__c);
		}
	}
	
	@isTest static void TestUpdateScores_RepsWorkout() {
		//! Test data setup
		List<Integer> scores1 = new List<Integer>{ 90, 100, 110, 150, 150, 156};
		
		// Create a new Workout (Rounds Based - No Weight)
		Vault_Workout__c workoutsToInsert = new Vault_Workout__c(
			Name = 'Workout_Reps',
			Goal_Low_Value__c = 100, 
			Goal_High_Value__c = 150, 
			Is_Dumbbell__c = FALSE,
			Is_Goal_Time__c = FALSE,
			Is_Only_Reps__c = TRUE,
			Round_Value__c = 1,
			RX_Weight_Male__c = 0,
			First_Label__c = 'Reps',
			Second_Label__c = '',
			Order__c = 1,
			Workout_Date__c = System.today().addMonths(3)
		);
		insert workoutsToInsert;
		
		Vault_Workout__c workout = [SELECT Id, Name, Goal_Low_Value__c FROM Vault_Workout__c WHERE Name = 'Workout_Reps' LIMIT 1];
		System.debug('workout: ' + workout);
		
		
		// Create Athletes
		List<Athlete__c> athletesToInsert = new List<Athlete__c>();
		for (Integer i = 0; i < scores1.size(); i++) {
			Athlete__c ath = new Athlete__c(
				Name = 'Athlete_' + i+1,
				Age__c = 35 + i,
				Location__c = 'College Station, TX'
			);
			athletesToInsert.add(ath);
		}
		insert athletesToInsert;
		List<Athlete__c> athletes = [SELECT Id, Name, Age__c, Location__c FROM Athlete__c];
		System.debug('athletes: ' + athletes);
		
		
		// Create new Score Submissions for workout
		List<Score_Submission__c> scoreSub = new List<Score_Submission__c>();
		for (Integer i = 0; i < scores1.size(); i++) {
			Score_Submission__c score = new Score_Submission__c(
				Athlete_Name__c = athletes[i].Id,
				Vault_Workout__c = workout.Id,
				Score_1st__c = scores1[i]
			);
			scoreSub.add(score);
		}
		insert scoreSub;
		List<Score_Submission__c> subScores = [
			SELECT Id, Name, Athlete_Name__r.Name, Vault_Workout__r.Name, Score_1st__c, Score_2nd__c, Weight_Used__c, Calculated_Points__c, Calculated_Ranking_Points__c, Is_Score_Between_Goal__c, Points_Based_on_Rank__c, Total_Workout_Points__c
			FROM Score_Submission__c
			ORDER BY Name ASC];
		System.debug('subScores: ' + subScores);
		
		
		// Verify Expected Values
		// 
		// Goal_Low_Value__c = 100, 
		// Goal_High_Value__c = 150, 
		// Is_Dumbbell__c = FALSE,
		// Is_Goal_Time__c = FALSE,
		// Is_Only_Reps__c = TRUE,
		// Round_Value__c = 1,
		// RX_Weight_Male__c = 0,
			
		List<Integer> calculatedPoints = new List<Integer>{90, 100, 110, 150, 150, 156};
		List<Decimal> calculatedRankPoints = new List<Decimal>{90.05, 100.05, 110.05, 150.05, 150.05, 156.05};
		List<Integer> goalPoints = new List<Integer>{   0, 100, 100, 100, 100, 100};
		List<Integer> rankPoints = new List<Integer>{  75,  80,  85,  95,  95, 100};
		List<Integer> totalPoints = new List<Integer>{ 75, 180, 185, 195, 195, 200};
			
		System.assertEquals(scores1.size(), subScores.size());
		for (Integer i = 0; i < subScores.size(); i++) {
			System.assertEquals(calculatedPoints[i], subScores[i].Calculated_Points__c);
			System.assertEquals(calculatedRankPoints[i], subScores[i].Calculated_Ranking_Points__c);
			System.assertEquals(goalPoints[i], subScores[i].Is_Score_Between_Goal__c);
			System.assertEquals(rankPoints[i], subScores[i].Points_Based_on_Rank__c);
			System.assertEquals(totalPoints[i], subScores[i].Total_Workout_Points__c);
		}
	}

}