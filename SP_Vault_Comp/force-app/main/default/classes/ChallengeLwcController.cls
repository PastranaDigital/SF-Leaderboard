public without sharing class ChallengeLwcController {
   	@AuraEnabled(cacheable=true)
    public static List<Athlete__c> getAllChallengeScores() {
        return [
            SELECT Id, Name, Challenge_Total__c, Total_Burpees__c, Total_KB_Swings__c 
            FROM Athlete__c 
            ORDER BY Challenge_Total__c DESC];
    }

	@AuraEnabled
    public static Challenge_Entry__c createChallengeSubmission(Challenge_Entry__c score) {
		if (score != null) insert score;
        return score;
    }
}
