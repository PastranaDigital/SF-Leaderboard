public with sharing class ScoreSubmissionTriggerHandler extends TriggerHandler {

	List<Score_Submission__c> newList;
	
	public ScoreSubmissionTriggerHandler() {
		//? Casting the SObject
		this.newList = (List<Score_Submission__c>)Trigger.new;
	}

	protected override void beforeInsert() {
		System.debug('In the handler BEFORE insert');
	}
	
	protected override void afterInsert() {
		System.debug('In the handler AFTER insert');
		ScoreSubmissionCalculateRanking calc = new ScoreSubmissionCalculateRanking(this.newList);
	}

}