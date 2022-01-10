trigger ScoreSubmission on Score_Submission__c (before insert, before update, before delete, after insert, after update, after delete, after undelete) {

	TriggerHandler handler = new ScoreSubmissionTriggerHandler();
	handler.run();
	
}