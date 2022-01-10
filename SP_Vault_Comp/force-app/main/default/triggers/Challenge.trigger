trigger Challenge on Challenge__c (before insert, before update, before delete, after insert, after update, after delete, after undelete) {

	TriggerHandler handler = new ChallengeTriggerHandler();
	handler.run();
	
}