public class AthleteLwcController {
    @AuraEnabled(cacheable=true)
    public static List<Athlete__c> getAllAthletes() {
        Id profileId = userinfo.getProfileId();
        String profileName = [Select Id,Name from Profile where Id=:profileId].Name;
        system.debug('ProfileName: '+profileName);

        List<Athlete__c> results = [
            SELECT Id, Name, Total_Points__c, Age__c, Location__c, Profile_Pic_URL__c 
            FROM Athlete__c 
            ORDER BY Total_Points__c DESC];

        System.debug(results);

        return results;
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Score_Submission__c> getAllScoreSubmissions() {
        return [
            SELECT Id, Athlete_Name__c, Score_1st__c, Score_2nd__c, Weight_Used__c, Workout_Order_Number__c, Total_Workout_Points__c
            FROM Score_Submission__c 
            ORDER BY Workout_Order_Number__c ASC];
    }
}
