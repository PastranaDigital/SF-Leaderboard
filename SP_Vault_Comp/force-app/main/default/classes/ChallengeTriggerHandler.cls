public without sharing class ChallengeTriggerHandler extends TriggerHandler {

	List<Challenge__c> newList;
	
	public ChallengeTriggerHandler() {
		//? Casting the SObject
		this.newList = (List<Challenge__c>)Trigger.new;
	}

	protected override void beforeInsert() {
		System.debug('In the handler BEFORE insert');
	}
	
	protected override void afterInsert() {
		System.debug('In the handler AFTER insert');
		ChallengeToggleActive toggle = new ChallengeToggleActive(this.newList);
	}
	
	protected override void afterUpdate() {
		System.debug('In the handler AFTER update');
		ChallengeToggleActive toggle = new ChallengeToggleActive(this.newList);
	}

}