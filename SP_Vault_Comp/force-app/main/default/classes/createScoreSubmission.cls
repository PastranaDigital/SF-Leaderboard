public without sharing class createScoreSubmission {
    @AuraEnabled
    public static Score_Submission__c createScore(Score_Submission__c score) {
        Score_Submission__c[] allScoreSubs = [
            SELECT Id, Name, Athlete_Name__c, Vault_Workout__c, Notes__c, Score_1st__c, Score_2nd__c, Weight_Used__c
            FROM Score_Submission__c
            WHERE Athlete_Name__c = :score.Athlete_Name__c 
            AND Vault_Workout__c = :score.Vault_Workout__c
            // LIMIT 1
        ];
        System.debug('score: ' + score);
        if (allScoreSubs.size() > 0) {
            allScoreSubs[0].Score_1st__c = score.Score_1st__c;
            allScoreSubs[0].Score_2nd__c = score.Score_2nd__c;
            allScoreSubs[0].Weight_Used__c = score.Weight_Used__c;
            System.debug('allScoreSubs(updated): ' + allScoreSubs);
            update allScoreSubs;
        } else {
            System.debug('allScoreSubs: ' + allScoreSubs);
            insert score;
        }
        return score;
    }

    @AuraEnabled
    public static Score_Submission__c getSubmittedScore(Score_Submission__c score) {
        System.debug('getSubmittedScore: ' + score);
        return [
            SELECT Id, Name, Athlete_Name__c, Vault_Workout__c, Notes__c, Score_1st__c, Score_2nd__c, Weight_Used__c, CreatedBy.Name, Is_Score_Between_Goal__c, Total_Workout_Points__c, Points_Based_on_Rank__c 
            FROM Score_Submission__c 
            WHERE Athlete_Name__c = :score.Athlete_Name__c AND Vault_Workout__c = :score.Vault_Workout__c
            LIMIT 1];
    }
}