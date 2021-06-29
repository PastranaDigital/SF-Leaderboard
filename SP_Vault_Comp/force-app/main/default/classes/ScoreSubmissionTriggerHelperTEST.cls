@isTest
private class ScoreSubmissionTriggerHelperTEST {
    /*   
    @isTest static void TestUpdateScores_TimeWorkout() {
        //! Test data setup
        List<Integer> scores1 = new List<Integer>{10, 10, 11, 15, 16, 16};
        List<Integer> scores2 = new List<Integer>{15, 15, 30, 0, 45, 45};
        
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
                Name = 'Athlete_' + i,
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
                Weight_Used__c = 40
            );
            scoreSub.add(score);
        }
        insert scoreSub;
        List<Score_Submission__c> subScores = [SELECT Id, Athlete_Name__c, Vault_Workout__c, Score_1st__c, Score_2nd__c, Weight_Used__c FROM Score_Submission__c
        ];
        System.debug('subScores: ' + subScores);
        
        
        // Perform test
        Test.startTest();
        
        
        Test.stopTest();
        // Verify 
        // Calculated_Points__c 
        // Calculated_Ranking_Points__c 
        // Is_Score_Between_Goal__c 
        // Points_Based_on_Rank__c 
        // Total_Workout_Points__c 
        // 
        // 
    }
    
    @isTest static void TestUpdateScores_RoundsWorkout() {
        //! Test data setup
        List<Integer> scores1 = new List<Integer>{4, 4, 5, 6, 7, 7};
        List<Integer> scores2 = new List<Integer>{15, 15, 20, 0, 5, 5};
        
        // Create a new Workout (Rounds Based)
        Vault_Workout__c workoutsToInsert = new Vault_Workout__c(
        	Name = 'Workout_Rounds',
        	Goal_Low_Value__c = 120, // 4 rounds
	        Goal_High_Value__c = 240, // 6 rounds
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
                Name = 'Athlete_' + i,
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
                Weight_Used__c = 95
            );
            scoreSub.add(score);
        }
        insert scoreSub;
        List<Score_Submission__c> subScores = [SELECT Id, Athlete_Name__c, Vault_Workout__c, Score_1st__c, Score_2nd__c, Weight_Used__c FROM Score_Submission__c
        ];
        System.debug('subScores: ' + subScores);
        
        
        // Perform test
        // Test.startTest();
        // Test.stopTest();
        
        
        // Verify 
        // Calculated_Points__c 
        // Calculated_Ranking_Points__c 
        // Is_Score_Between_Goal__c 
        // Points_Based_on_Rank__c 
        // Total_Workout_Points__c 
        // 
        // 
    }
    */
    @isTest static void TestUpdateScores_RepsWorkout() {
        //! Test data setup
        List<Integer> scores1 = new List<Integer>{100, 100, 110, 135, 156, 156};
        
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
        insert scoreSub; /*[0];
        insert scoreSub[1];
        insert scoreSub[2];
        insert scoreSub[3];
        insert scoreSub[4];
        insert scoreSub[5];*/
        
        
        List<Score_Submission__c> subScoresSmall = [
            SELECT Calculated_Ranking_Points__c, Points_Based_on_Rank__c
            FROM Score_Submission__c
            ORDER BY Name DESC];
        System.debug('subScoresSmall: ' + subScoresSmall);
        
        List<Score_Submission__c> subScores = [
            SELECT Id, Name, Athlete_Name__r.Name, Vault_Workout__r.Name, Score_1st__c, Score_2nd__c, Weight_Used__c, Calculated_Points__c, Calculated_Ranking_Points__c, Is_Score_Between_Goal__c, Points_Based_on_Rank__c, Total_Workout_Points__c
            FROM Score_Submission__c
            ORDER BY Name DESC];  // Flip the order because it is Reps workout and higher score wins
        // System.debug(subScores);
        
        
        // Perform test
        // Test.startTest();
        // Test.stopTest();
        
        
        // Verify Expected Values
        // 100, 100, 110, 135, 156, 156
        // 
        // Goal_Low_Value__c = 100, 
	    // Goal_High_Value__c = 150, 
        // Is_Dumbbell__c = FALSE,
        // Is_Goal_Time__c = FALSE,
        // Is_Only_Reps__c = TRUE,
        // Round_Value__c = 1,
        // RX_Weight_Male__c = 0,
            
        //List<Integer> calculatedPoints = new List<Integer>{100, 100, 110, 135, 156, 156};
        //List<Decimal> calculatedRankPoints = new List<Decimal>{100.05, 100.05, 110.05, 135.05, 156.05, 156.05};
        List<Integer> calculatedPoints = new List<Integer>{156, 156, 135, 110, 100, 100};
        List<Decimal> calculatedRankPoints = new List<Decimal>{156.05, 156.05, 135.05, 110.05, 100.05, 100.05};
        List<Integer> goalPoints = new List<Integer>{   0,   0, 100, 100, 100, 100};
        List<Integer> rankPoints = new List<Integer>{ 100, 100,  80,  70,  60,  60};
        List<Integer> totalPoints = new List<Integer>{100, 100, 180, 170, 160, 160};
            
        System.assertEquals(6, subScores.size());
        for (Integer i = 0; i < subScores.size(); i++) {
            System.assertEquals(calculatedPoints[i], subScores[i].Calculated_Points__c);
            System.assertEquals(calculatedRankPoints[i], subScores[i].Calculated_Ranking_Points__c);
            System.assertEquals(goalPoints[i], subScores[i].Is_Score_Between_Goal__c);
            System.assertEquals(rankPoints[i], subScores[i].Points_Based_on_Rank__c);
            System.assertEquals(totalPoints[i], subScores[i].Total_Workout_Points__c);
        }
        // System.assert(!result.isSuccess());
        // System.assert(result.getErrors().size() > 0);
        // System.assertEquals('Cannot delete account with related opportunities.', result.getErrors()[0].getMessage());
    }
    
}