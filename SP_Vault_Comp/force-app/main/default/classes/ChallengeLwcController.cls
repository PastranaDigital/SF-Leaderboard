public without sharing class ChallengeLwcController {
   	@AuraEnabled(cacheable=true)
    public static List<Athlete__c> getAllChallengeScores() {
        return [
            SELECT Id, Name, Challenge_Total__c, Total_Movement_1__c, Total_Movement_2__c, Did_SP_Workout__c 
            FROM Athlete__c 
            ORDER BY Challenge_Total__c DESC];
    }
   	
	@AuraEnabled
    public static Challenge_Entry__c createChallengeSubmission(Challenge_Entry__c score) {
		if (score != null) insert score;
        return score;
    }

	//! Used for FRISCO Challenge
	@AuraEnabled(cacheable=true)
    public static List<Frisco_Athlete__c> getAllFriscoChallengeScores() {
        return [
            SELECT Id, Name, Challenge_Total__c, Total_Movement_1__c, Total_Movement_2__c 
            FROM Frisco_Athlete__c 
            ORDER BY Challenge_Total__c DESC];
    }

	@AuraEnabled(cacheable=true)
    public static List<Frisco_Athlete__c> getAllAthletesForOptions () {
        return [
            SELECT Id, Name, Profile_Pic_URL__c 
            FROM Frisco_Athlete__c 
            ORDER BY Name ASC];
    }

	@AuraEnabled
    public static FC_Entry__c createFriscoChallengeSubmission(FC_Entry__c score) {
		if (score != null) insert score;
        return score;
    }
}
