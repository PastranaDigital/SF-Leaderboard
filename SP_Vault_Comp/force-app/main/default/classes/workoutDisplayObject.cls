public without sharing class workoutDisplayObject {
    public Id Id;
    public String Name;
    public String AccordionTitle;
    public String PlainDescription;
    public String Description;
    public String FirstLabel;
    public String SecondLabel;
    public Decimal Order;
    public String Goal;
    public String ImageFile;
    public Decimal RXWeightMale;
    public String URL;
    public Date WorkoutDate;
    public String topScoreString;

    public List<Score_Submission__c> Top3Scores;

    
}

/*
workoutDisplayObject top3 = new workoutDisplayObject();
top3.Name = 'Workout 1';
top3.Order = 1;
top3.Goal = 'Goal 1';
List<Score_Submission__c> top = new List<Score_Submission__c>();
for (Integer i = 0; i < 3; i++) {
    Score_Submission__c ss = new Score_Submission__c(
        Athlete_Name__c = 'a005e000003p5GTAAY',
        Vault_Workout__c = 'a025e0000036fsMAAQ',
        Score_1st__c = 120 + i
    );
    top.add(ss);
}
top3.Top3Scores = top;
System.debug(top3);
*/