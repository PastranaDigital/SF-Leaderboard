trigger ChallengeEntry on Challenge_Entry__c (before insert, before update, before delete, after insert, after update, after delete, after undelete) {

	TriggerHandler handler = new ChallengeEntryTriggerHandler();
	handler.run();
	
}