public without sharing class ChallengeEntryTriggerHandler extends TriggerHandler {

	List<Challenge_Entry__c> newList;
	
	public ChallengeEntryTriggerHandler() {
		//? Casting the SObject
		this.newList = (List<Challenge_Entry__c>)Trigger.new;
	}

	protected override void beforeInsert() {
		System.debug('In the handler BEFORE insert');
	}
	
	protected override void afterInsert() {
		System.debug('In the handler AFTER insert');
		ChallengeEntryChallengeCompleted checkTotal = new ChallengeEntryChallengeCompleted(this.newList);
		// ChallengeEntrySameDay sameDay = new ChallengeEntrySameDay(this.newList);
	}
	
	protected override void afterUpdate() {
		System.debug('In the handler AFTER update');
	}
}