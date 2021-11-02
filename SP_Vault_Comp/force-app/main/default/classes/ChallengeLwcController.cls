public without sharing class ChallengeLwcController {
   	@AuraEnabled(cacheable=true)
    public static List<Athlete__c> getAllChallengeScores() {
        return [
            SELECT Id, Name, Challenge_Total__c 
            FROM Athlete__c 
            ORDER BY Challenge_Total__c DESC];
    }

	@AuraEnabled
    public static Challenge_Entry__c createChallengeSubmission(Challenge_Entry__c score) {
        // Challenge_Entry__c[] allScoreSubs = [
        //     SELECT Id, Name, Athlete_Name__c, Vault_Workout__c, Notes__c, Score_1st__c, Score_2nd__c, Weight_Used__c
        //     FROM Challenge_Entry__c
        //     WHERE Athlete_Name__c = :score.Athlete_Name__c 
        //     AND Vault_Workout__c = :score.Vault_Workout__c
        //     // LIMIT 1
        // ];
        // System.debug('score: ' + score);
        // if (allScoreSubs.size() > 0) {
        //     allScoreSubs[0].Score_1st__c = score.Score_1st__c;
        //     allScoreSubs[0].Score_2nd__c = score.Score_2nd__c;
        //     allScoreSubs[0].Weight_Used__c = score.Weight_Used__c;
        //     System.debug('allScoreSubs(updated): ' + allScoreSubs);
        //     update allScoreSubs;
        // } else {
        //     System.debug('allScoreSubs: ' + allScoreSubs);
        //     insert score;
        // }
		if (score != null) insert score;
        return score;
    }
}
