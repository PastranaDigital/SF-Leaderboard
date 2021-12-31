trigger ChallengeTrigger on Challenge__c (after insert, after update) {
    if(RecursionBlock.flag){
            RecursionBlock.flag = false;

            if(Trigger.isAfter){
                if(Trigger.isInsert || Trigger.isUpdate){
                    ChallengeTriggerHelper.toggleIsActiveCheckbox(Trigger.new);
                }
            }
    }
}