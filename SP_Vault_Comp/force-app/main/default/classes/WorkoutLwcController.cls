public without sharing class WorkoutLwcController {
    @AuraEnabled(cacheable=true)
    public static List<Vault_Workout__c> getAllWorkouts() {
        return [
            SELECT Id, Name, Description__c, First_Label__c, Second_Label__c, Order__c, Goal__c, Image_File__c, RX_Weight_Male__c, URL__c, Workout_Date__c, Plain_Description__c
            FROM Vault_Workout__c 
            ORDER BY Workout_Date__c ASC];
    }

    @AuraEnabled(cacheable=true)
    public static List<Score_Submission__c> getWorkoutResults() {
        return [
            SELECT Id, Athlete_Name__r.Name, Vault_Workout__r.Name, Is_Score_Between_Goal__c, Points_Based_on_Rank__c, Total_Workout_Points__c
            FROM Score_Submission__c 
            ORDER BY Total_Workout_Points__c DESC];
    }
}