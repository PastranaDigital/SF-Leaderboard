public without sharing class WorkoutLwcController {
    @AuraEnabled(cacheable=true)
    public static List<Vault_Workout__c> getAllWorkouts() {
        return [
            SELECT Id, Name, Description__c, First_Label__c, Second_Label__c, Order__c, Goal__c, Image_File__c, RX_Weight_Male__c, URL__c, Workout_Date__c, Plain_Description__c, Active__c
            FROM Vault_Workout__c 
            ORDER BY Workout_Date__c ASC];
    }

    @AuraEnabled(cacheable=true)
    public static List<Vault_Workout__c> getActiveWorkouts() {
        return [
            SELECT Id, Name, Description__c, First_Label__c, Second_Label__c, Order__c, Goal__c, Image_File__c, RX_Weight_Male__c, URL__c, Workout_Date__c, Plain_Description__c, Active__c
            FROM Vault_Workout__c 
            WHERE Active__c = true
            ORDER BY Workout_Date__c ASC];
    }

    @AuraEnabled(cacheable=true)
    public static List<Score_Submission__c> getTop3Results(Id workout) {
        return [
            SELECT Id, Athlete_Name__r.Name, Vault_Workout__c, Score_1st__c, Score_2nd__c, Weight_Used__c, Is_Score_Between_Goal__c, Points_Based_on_Rank__c, Total_Workout_Points__c
            FROM Score_Submission__c 
            WHERE Vault_Workout__c = :workout
            ORDER BY Total_Workout_Points__c DESC
            LIMIT 3];
    }

    @AuraEnabled(cacheable=true)
    public static List<Score_Submission__c> getTopResults() {
        return [
            SELECT Id, Athlete_Name__r.Name, Vault_Workout__c, Score_1st__c, Score_2nd__c, Weight_Used__c, Is_Score_Between_Goal__c, Points_Based_on_Rank__c, Total_Workout_Points__c
            FROM Score_Submission__c 
            ORDER BY Total_Workout_Points__c DESC];
    }

    //! this produced a array of objects that is different from normal wire
    @AuraEnabled(cacheable=true)
    public static List<workoutDisplayObject> getWorkoutsAndResults() {
        Vault_Workout__c[] allWorkouts = WorkoutLwcController.getAllWorkouts();
        Score_Submission__c[] allScoreSubmissions = [
            SELECT Id, Athlete_Name__r.Name, Vault_Workout__c, Score_1st__c, Score_2nd__c, Weight_Used__c, Is_Score_Between_Goal__c, Points_Based_on_Rank__c, Total_Workout_Points__c
            FROM Score_Submission__c 
            ORDER BY Total_Workout_Points__c DESC];
        System.debug(allWorkouts);

        workoutDisplayObject[] allWorkoutsAndResults = new List<workoutDisplayObject>();
        // for (Integer i = 0; i < allWorkouts.size(); i++) {
        for (Vault_Workout__c v : allWorkouts) {
            workoutDisplayObject newWAR = new workoutDisplayObject();
            newWAR.Id = v.Id;
            newWAR.Name = v.Name;
            newWAR.AccordionTitle = '#' + v.Order__c + ' ' + v.Name + ' - ' + v.Workout_Date__c;
            newWAR.PlainDescription = v.Plain_Description__c;
            newWAR.Description = v.Description__c;
            newWAR.FirstLabel = v.First_Label__c;
            newWAR.SecondLabel = v.Second_Label__c;
            newWAR.Order = v.Order__c;
            newWAR.Goal = v.Goal__c;
            newWAR.RXWeightMale = v.RX_Weight_Male__c;
            newWAR.URL = v.URL__c;
            newWAR.ImageFile = v.Image_File__c;
            newWAR.WorkoutDate = v.Workout_Date__c;

            Score_Submission__c[] top = new List<Score_Submission__c>();
            for (Score_Submission__c score : allScoreSubmissions) {
                Integer onlyTop3 = 1;
                if (v.Id == score.Vault_Workout__c && onlyTop3 < 4) {
                    Score_Submission__c ss = new Score_Submission__c(
                        Athlete_Name__c = score.Athlete_Name__c,
                        Vault_Workout__c = score.Vault_Workout__c,
                        Score_1st__c = score.Score_1st__c,
                        Score_2nd__c = score.Score_2nd__c,
                        Weight_Used__c = score.Weight_Used__c
                    );
                    top.add(ss);
                    onlyTop3++;
                }
            }
            newWAR.Top3Scores = top;


            allWorkoutsAndResults.add(newWAR);
        }

        System.debug(allWorkoutsAndResults[0]);
        return allWorkoutsAndResults;
    }
}

// topScoreString = '${rank}. ${athleteName}: ${Score_1st__c} ${First_Label__c}';
    

//     @wire(getAllWorkouts) workoutList(result) {
//         this.wireWorkoutList = result;
//         if (result.data) {
//             let currentData = [];
//             let rank = 1;
//             result.data.forEach((row) => {
//                 let rowData = {};
//                 rowData.Id = row.Id;
//                 rowData.Name = row.Name;
//                 rowData.AccordionTitle = `#${row.Order__c} ${row.Name} - ${row.Workout_Date__c}`;
//                 rowData.Plain_Description__c = row.Plain_Description__c;
//                 rowData.Description__c = row.Description__c;
//                 rowData.First_Label__c = row.First_Label__c;
//                 rowData.Second_Label__c = row.Second_Label__c;
//                 rowData.Order__c = row.Order__c;
//                 rowData.Goal__c = row.Goal__c;
//                 rowData.Image_File__c = imageResource + '/Images/' + row.Image_File__c;
//                 rowData.RX_Weight_Male__c = row.RX_Weight_Male__c;
//                 rowData.URL__c = row.URL__c;
//                 rowData.Workout_Date__c = row.Workout_Date__c;

//                 if (row.Second_Label__c) {
//                     this.topScoreString += ` ${Score_2nd__c} ${Second_Label__c}`;
//                 } 
//                 if (row.RX_Weight_Male__c) {
//                     this.topScoreString += ` @ ${Weight_Used__c} lbs`;
//                 };
//                 rowData.topScoreString = this.topScoreString;