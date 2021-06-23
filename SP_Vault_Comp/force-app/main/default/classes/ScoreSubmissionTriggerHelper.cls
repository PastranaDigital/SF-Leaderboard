public with sharing class ScoreSubmissionTriggerHelper {
    public static void calculateRanking(List<Score_Submission__c> scoreList) {
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
        List<Score_Submission__c> updatedScores = new List<Score_Submission__c>(); 
        for (Score_Submission__c s : existingScoresForWorkout) {
            s.Points_Based_on_Rank__c = rankPoints;
            s.Total_Workout_Points__c = s.Is_Score_Between_Goal__c + s.Points_Based_on_Rank__c;
            updatedScores.add(s);
            rankPoints -= 10;
        }
        
        if (updatedScores.size() > 0) {
            update updatedScores;
        }
    }
}
