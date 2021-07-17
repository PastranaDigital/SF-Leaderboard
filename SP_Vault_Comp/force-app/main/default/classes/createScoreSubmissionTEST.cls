@isTest
private class createScoreSubmissionTEST {
    @isTest static void createScore_single() {
        //! Test data setup
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
        
        
        // Create Athletes
        Athlete__c athletesToInsert = new Athlete__c(
            Name = 'Test Testerson',
            Age__c = 35,
            Location__c = 'Dallas, TX'
        );
        insert athletesToInsert;
        Athlete__c athlete = [SELECT Id, Name, Age__c, Location__c FROM Athlete__c LIMIT 1];
        
        
        // Create a First Score Submissions for workout
        Score_Submission__c scoreSub = new Score_Submission__c(
            Athlete_Name__c = athlete.Id,
            Vault_Workout__c = workout.Id,
            Score_1st__c = 10,
            Score_2nd__c = 20,
            Weight_Used__c = 40
        );
        System.debug('TEST scoreSub: ' + scoreSub);
        // insert scoreSub;
        
        
        // Perform test
        Test.startTest();
        createScoreSubmission.createScore(scoreSub);
        Test.stopTest();


        // Validate Expected Results
        List<Score_Submission__c> subScores = [
            SELECT Id, Name, Athlete_Name__r.Name, Vault_Workout__r.Name, Score_1st__c, Score_2nd__c, Weight_Used__c, Calculated_Points__c, Calculated_Ranking_Points__c, Is_Score_Between_Goal__c, Points_Based_on_Rank__c, Total_Workout_Points__c
            FROM Score_Submission__c
            ORDER BY Name ASC];
        System.debug('subScores: ' + subScores);

        System.assertEquals(1, subScores.size());
        System.assertEquals(10, subScores[0].Score_1st__c);
        System.assertEquals(40, subScores[0].Weight_Used__c);
        System.assertEquals(100, subScores[0].Points_Based_on_Rank__c);
    }


    @isTest static void createScore_double_update() {
        //! Test data setup
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
        
        
        // Create Athletes
        Athlete__c athletesToInsert = new Athlete__c(
            Name = 'Test Testerson',
            Age__c = 35,
            Location__c = 'Dallas, TX'
        );
        insert athletesToInsert;
        Athlete__c athlete = [SELECT Id, Name, Age__c, Location__c FROM Athlete__c LIMIT 1];
        
        // Create a First Score Submissions for workout
        Score_Submission__c scoreSub1 = new Score_Submission__c(
            Athlete_Name__c = athlete.Id,
            Vault_Workout__c = workout.Id,
            Score_1st__c = 10,
            Score_2nd__c = 20,
            Weight_Used__c = 40
        );
        insert scoreSub1;
        
        // Create a Second Score Submissions for workout
        Score_Submission__c scoreSub2 = new Score_Submission__c(
            Athlete_Name__c = athlete.Id,
            Vault_Workout__c = workout.Id,
            Score_1st__c = 11,
            Score_2nd__c = 21,
            Weight_Used__c = 41
        );
        System.debug('TEST scoreSub2: ' + scoreSub2);
        // insert scoreSub;
        
        
        // Perform test
        Test.startTest();
        createScoreSubmission.createScore(scoreSub2);
        Test.stopTest();


        // Validate Expected Results
        List<Score_Submission__c> subScores = [
            SELECT Id, Name, Athlete_Name__r.Name, Vault_Workout__r.Name, Score_1st__c, Score_2nd__c, Weight_Used__c, Calculated_Points__c, Calculated_Ranking_Points__c, Is_Score_Between_Goal__c, Points_Based_on_Rank__c, Total_Workout_Points__c
            FROM Score_Submission__c
            ORDER BY Name ASC];
        System.debug('TEST subScores: ' + subScores);

        System.assertEquals(1, subScores.size());
        System.assertEquals(11, subScores[0].Score_1st__c);
        System.assertEquals(41, subScores[0].Weight_Used__c);
        System.assertEquals(100, subScores[0].Points_Based_on_Rank__c);
    }

    @isTest static void createScoreMany_getLastSubmitted() {
        //! Test data setup
        List<Integer> scores1 = new List<Integer>{10, 10, 11, 15, 16, 21};
        List<Integer> scores2 = new List<Integer>{15, 15, 30,  0, 45, 31};
        List<Integer> weights = new List<Integer>{30, 40, 40, 30, 40, 41};
        
        // Create a new Workout (Time Based)
        Vault_Workout__c workoutsToInsert = new Vault_Workout__c(
        	Name = 'Workout_Time',
        	Goal_Low_Value__c = 600, // 10 mins
	        Goal_High_Value__c = 900, // 15 mins
            Is_Dumbbell__c = TRUE,
            Is_Goal_Time__c = FALSE,
            Round_Value__c = 50,
            RX_Weight_Male__c = 40,
            First_Label__c = 'Rounds',
            Second_Label__c = 'Reps',
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
        Score_Submission__c lastScoreSub = new Score_Submission__c();
        for (Integer i = 0; i < scores1.size(); i++) {
            Score_Submission__c score = new Score_Submission__c(
                Athlete_Name__c = athletes[i].Id,
                Vault_Workout__c = workout.Id,
                Score_1st__c = scores1[i],
                Score_2nd__c = scores2[i],
                Weight_Used__c = weights[i]
            );
            scoreSub.add(score);
            if (i == scores1.size()-1) {
                lastScoreSub = score;
            }
        }
        insert scoreSub;
        
        System.debug('TEST lastScoreSub: ' + lastScoreSub);


        // Perform test
        Test.startTest();
        createScoreSubmission.getSubmittedScore(lastScoreSub);
        Test.stopTest();


        // Validate Expected Results
        List<Score_Submission__c> subScores = [
            SELECT Id, Name, Athlete_Name__r.Name, Vault_Workout__r.Name, Score_1st__c, Score_2nd__c, Weight_Used__c, Calculated_Points__c, Calculated_Ranking_Points__c, Is_Score_Between_Goal__c, Points_Based_on_Rank__c, Total_Workout_Points__c
            FROM Score_Submission__c
            ORDER BY Name DESC]; // to get the last one
        System.debug('TEST subScores: ' + subScores);

        System.assertEquals(6, subScores.size());
        System.assertEquals(21, subScores[0].Score_1st__c);
        System.assertEquals(41, subScores[0].Weight_Used__c);
        System.assertEquals(100, subScores[0].Points_Based_on_Rank__c);
    }
}