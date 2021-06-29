public without sharing class createScoreSubmission {
    @AuraEnabled
    public static Score_Submission__c createScore(Score_Submission__c score) {
        System.debug('Score: ' + score);
        insert score;
        return score;
    }

    @AuraEnabled
    public static Score_Submission__c getSubmittedScore(Score_Submission__c score) {
        return [
            SELECT Id, Name, Athlete_Name__c, Vault_Workout__c, Notes__c, Score_1st__c, Score_2nd__c, Weight_Used__c, CreatedBy.Name, Is_Score_Between_Goal__c, Total_Workout_Points__c, Points_Based_on_Rank__c 
            FROM Score_Submission__c 
            ORDER BY CreatedDate DESC 
            LIMIT 1];
    }
}
