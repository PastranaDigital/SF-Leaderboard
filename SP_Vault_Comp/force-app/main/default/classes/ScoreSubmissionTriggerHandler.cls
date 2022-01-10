public without sharing class ScoreSubmissionTriggerHandler extends TriggerHandler {

	List<Score_Submission__c> newList;
	
	public ScoreSubmissionTriggerHandler() {
		//? Casting the SObject
		this.newList = (List<Score_Submission__c>)Trigger.new;
	}

	protected override void beforeInsert() {
		System.debug('In the handler BEFORE insert');
	}
	

	
	protected override void afterInsert() {
		if (RecursionBlock.flag) {
			RecursionBlock.flag = false;
			System.debug('In the handler AFTER insert');
			// ScoreSubmissionCreateChallengeEntry entry = new ScoreSubmissionCreateChallengeEntry(this.newList);
			ScoreSubmissionCalculateRanking calc = new ScoreSubmissionCalculateRanking(this.newList);
		}
	}
	
	protected override void afterUpdate() {
		if (RecursionBlock.flag) {
			RecursionBlock.flag = false;
			System.debug('In the handler AFTER update');
			ScoreSubmissionCalculateRanking calc = new ScoreSubmissionCalculateRanking(this.newList);
		}
	}	
}