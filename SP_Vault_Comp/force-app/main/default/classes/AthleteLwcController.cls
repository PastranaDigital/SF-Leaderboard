public without sharing class AthleteLwcController {
    @AuraEnabled(cacheable=true)
    public static List<Athlete__c> getAllAthletes() {
        Id profileId = userinfo.getProfileId();
        String profileName = [Select Id,Name from Profile where Id=:profileId].Name;
        system.debug('ProfileName: '+profileName);

        List<Athlete__c> results = [
            SELECT Id, Name, Total_Points__c, Age__c, Location__c, Profile_Pic_URL__c, Total_Tie_Break_Points__c, Challenge_Total__c, Did_SP_Workout__c
            FROM Athlete__c 
            ORDER BY Total_Tie_Break_Points__c DESC];

        System.debug(results);

        return results;
    }

    @AuraEnabled(cacheable=true)
    public static List<Athlete__c> getAllAthletesForOptions() {
        return [
            SELECT Id, Name, Profile_Pic_URL__c 
            FROM Athlete__c 
            ORDER BY Name ASC];
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Score_Submission__c> getAllScoreSubmissions() {
        Score_Submission__c[] allScores = [
            SELECT Id, Athlete_Name__c, Athlete_Name__r.Name, Vault_Workout__r.Name, Is_Score_Between_Goal__c, Points_Based_on_Rank__c, Total_Workout_Points__c, Vault_Workout__r.Order__c, Score_1st__c, Score_2nd__c, Weight_Used__c, Vault_Workout__r.First_Label__c, Vault_Workout__r.Second_Label__c, Vault_Workout__r.RX_Weight_Male__c
            FROM Score_Submission__c 
            ORDER BY Vault_Workout__r.Order__c ASC];
        System.debug(allScores[0]);
        return allScores;
    }
}