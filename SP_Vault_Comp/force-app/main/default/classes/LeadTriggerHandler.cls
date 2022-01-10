public with sharing class LeadTriggerHandler extends TriggerHandler {
    
	List<Lead> newList;
	
	public LeadTriggerHandler() {
		//? Casting the SObject
		this.newList = (List<Lead>)Trigger.new;
	}

	protected override void beforeInsert() {
		System.debug('In the lead handler BEFORE insert');
		LeadHelloWorlder hello = new LeadHelloWorlder(this.newList);
	}

	protected override void afterInsert() {
		System.debug('In the lead handler AFTER insert');
	}

}
