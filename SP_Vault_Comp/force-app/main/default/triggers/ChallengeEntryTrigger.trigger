trigger ChallengeEntryTrigger on Challenge_Entry__c (before insert, before update, after insert, after update) {
    if(RecursionBlock.flag){
            RecursionBlock.flag = false;

            if(Trigger.isBefore){
                if(Trigger.isInsert || Trigger.isUpdate){
                    ChallengeEntryTriggerHelper.checkForSameDay(Trigger.new);
                }
            }

            // if(Trigger.isAfter){
            //     if(Trigger.isInsert || Trigger.isUpdate){
            //         ChallengeEntryTriggerHelper.createChallengeCompleted(Trigger.new);
            //     }
            // }
    }
}