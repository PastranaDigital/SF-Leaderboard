trigger ScoreSubmissionTrigger on Score_Submission__c (after insert, after update) {
    if(RecursionBlock.flag){
            // System.debug(RecursionBlock.flag);
            RecursionBlock.flag = false;
            // System.debug(RecursionBlock.flag);
        
            if(Trigger.isAfter){
                if(Trigger.isInsert || Trigger.isUpdate){
                    ScoreSubmissionTriggerHelper.calculateRanking(Trigger.new);
                }
            }
    }
}