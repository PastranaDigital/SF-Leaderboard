public with sharing class ResultsLwcController {
    @AuraEnabled(cacheable=true)
    public static List<Score_Submission__c> getAllScores() {
        return [
            SELECT Id, Vault_Workout__c, Vault_Workout__r.Name, Vault_Workout__r.Order__c, Is_Score_Between_Goal__c, Did_RX_or_RXplus__c
            FROM Score_Submission__c
            ORDER BY Vault_Workout__r.Order__c ASC];
    }
}
