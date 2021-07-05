public without sharing class ScoreSubmissionTriggerHelper {
    public static void calculateRanking(List<Score_Submission__c> scoreList) {
        // get User info
        String usersName = UserInfo.getUserName();
        System.debug('Email address: ' + usersName);        
        
        List<Id> scoreListWorkoutIds = new List<Id>();
        Map<Id, Boolean> workoutIsGoalTimeMap = new Map<Id, Boolean>();
        for (Score_Submission__c s : scoreList) {
            scoreListWorkoutIds.add(s.Vault_Workout__c);
        }

        //! Doesn't handle BULK UPLOAD at this moment
        //? Pull all Workouts and put them in rank order
        String endQueryString; 
        if (scoreList[0].Is_Goal_Time__c) { 
            endQueryString = 'ASC'; //? Small to Larger if TIME (ASC)
        } else { 
            endQueryString = 'DESC'; //? Large to Smaller if NOT time (DESC)
        }

        String queryString = 'SELECT Calculated_Ranking_Points__c, Points_Based_on_Rank__c, Is_Goal_Time__c, Total_Workout_Points__c, Is_Score_Between_Goal__c FROM Score_Submission__c  WHERE Vault_Workout__r.Id In :scoreListWorkoutIds ORDER BY Calculated_Ranking_Points__c ';

        List<Score_Submission__c> existingScoresForWorkout = Database.query(queryString + endQueryString);

        Integer rankPoints = 100;
        Integer rankInterval = Integer.valueOf(System.Label.CompRankInterval);
        List<Score_Submission__c> updatedScores = new List<Score_Submission__c>(); 
        for (Score_Submission__c s : existingScoresForWorkout) {
            s.Points_Based_on_Rank__c = rankPoints;
            s.Total_Workout_Points__c = s.Is_Score_Between_Goal__c + s.Points_Based_on_Rank__c;
            updatedScores.add(s);
            rankPoints -= rankInterval;
        }
        System.debug('updatedScores' + updatedScores);
        for (Integer i=0; i < updatedScores.size(); i++) {
            if (i != 0) {
                if (updatedScores[i].Calculated_Ranking_Points__c == updatedScores[i-1].Calculated_Ranking_Points__c) {
                    updatedScores[i].Points_Based_on_Rank__c = updatedScores[i-1].Points_Based_on_Rank__c;
                    updatedScores[i].Total_Workout_Points__c = updatedScores[i].Is_Score_Between_Goal__c + updatedScores[i].Points_Based_on_Rank__c;
                }
            }
        }
		System.debug('updatedScores' + updatedScores);

        
        if (updatedScores.size() > 0) {
            update updatedScores;
        }
    }
}