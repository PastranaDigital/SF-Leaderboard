public without sharing class LeaderboardController {
    @AuraEnabled
	public static ViewModel getViewModel() {
		InboundViewModel iModel = new InboundViewModel();
		ViewModel vm = new ViewModel();
		vm.inboundModel = iModel;
		vm.outboundModel = new OutboundViewModel();
		return vm;
	}

	@AuraEnabled
    public static Challenge_Entry__c createChallengeSubmission(Challenge_Entry__c score) {
		if (score != null) insert score;
        return score;
    }

	@AuraEnabled
    public static Score_Submission__c createScore(Score_Submission__c score) {
        Score_Submission__c[] allScoreSubs = [
            SELECT Id, Name, Athlete_Name__c, Vault_Workout__c, Notes__c, Score_1st__c, Score_2nd__c, Weight_Used__c
            FROM Score_Submission__c
            WHERE Athlete_Name__c = :score.Athlete_Name__c 
            AND Vault_Workout__c = :score.Vault_Workout__c
            // LIMIT 1
        ];
        System.debug('score: ' + score);
        if (allScoreSubs.size() > 0) {
            allScoreSubs[0].Score_1st__c = score.Score_1st__c;
            allScoreSubs[0].Score_2nd__c = score.Score_2nd__c;
            allScoreSubs[0].Weight_Used__c = score.Weight_Used__c;
            System.debug('allScoreSubs(updated): ' + allScoreSubs);
            update allScoreSubs;
        } else {
            System.debug('allScoreSubs: ' + allScoreSubs);
            insert score;
        }
        return score;
    }

	public class ViewModel {
		@AuraEnabled
		public InboundViewModel inboundModel;
		
		@AuraEnabled
		public OutboundViewModel outboundModel;
	}

	//? data going into the database
	public class InboundViewModel {
		@AuraEnabled
		public String score;

		@AuraEnabled
		public List<Id> athletes;
	}

	//? data coming out of the database
	public class OutboundViewModel {
		//! Pages Using: Workouts
		@AuraEnabled
		public List<Vault_Workout__c> allWorkouts;
		
		//! Pages Using: Submit & Workouts
		@AuraEnabled
		public Vault_Workout__c currentWorkout;
		
		//! Pages Using: Leaderboard, Submit Score & Challenge
		@AuraEnabled
		public List<Athlete__c> allAthleteInfo;

		//! Pages Using: Leaderboard
		@AuraEnabled
		public List<Score_Submission__c> allScoreSubmissions;

		//! Pages Using: Leaderboard
		@AuraEnabled
		public List<Challenge__c> allChallenges;

		@AuraEnabled
		public Challenge__c currentChallenge;

		@AuraEnabled
		public List<Challenge_Entry__c> allChallengeEntries;

		public OutboundViewModel() {
			this.allWorkouts = getAllWorkouts();
			this.currentWorkout = getCurrentWorkout(this.allWorkouts);
			this.allAthleteInfo = getAllAthleteInfo();
			this.allScoreSubmissions = getAllScoreSubmissions();
			this.allChallenges = getAllChallenges();
			this.currentChallenge = getCurrentChallenge(this.allChallenges);
			this.allChallengeEntries = getAllChallengeEntries();
		}
	}

	// ------------------------------------------------------------------------------------------------------------------ //
	//? Functions used to populate the OutboundViewModel class
	@AuraEnabled
	public static Vault_Workout__c getCurrentWorkout(List<Vault_Workout__c> workouts) {
		Vault_Workout__c firstActive = new Vault_Workout__c();
		for (Vault_Workout__c wod : workouts) {
			if (wod.Active__c && firstActive.Id == null) {
				firstActive = wod;
			}
		}
		return firstActive;
	}

	@AuraEnabled
	public static List<Vault_Workout__c> getAllWorkouts() {
		return [
            SELECT Id, Name, Description__c, First_Label__c, Second_Label__c, Order__c, Goal__c, Image_File__c, RX_Weight_Male__c, URL__c, Workout_Date__c, Plain_Description__c, Active__c
            FROM Vault_Workout__c 
			WHERE Workout_Date__c > 2021-12-31
            ORDER BY Workout_Date__c ASC];
	}
	
	@AuraEnabled
	public static List<Athlete__c> getAllAthleteInfo() {
		return [
			SELECT Id, Age__c, Name, Challenge_Total__c, Challenges_Completed__c, Did_SP_Workout__c, Grand_Total__c, Grand_Total_Tie_Break__c, Is_RX__c, Location__c, Profile_Pic_URL__c, Total_Movement_1__c, Total_Movement_2__c, Total_Tie_Break_Points__c, Total_Points__c
			FROM Athlete__c 
			ORDER BY Grand_Total_Tie_Break__c DESC];
	}

	@AuraEnabled
	public static List<Score_Submission__c> getAllScoreSubmissions() {
		return [
            SELECT Id, Athlete_Name__c, Athlete_Name__r.Name, Vault_Workout__c, Vault_Workout__r.Name, Is_Score_Between_Goal__c, Points_Based_on_Rank__c, Total_Workout_Points__c, Vault_Workout__r.Order__c, Score_1st__c, Score_2nd__c, Weight_Used__c, Vault_Workout__r.First_Label__c, Vault_Workout__r.Second_Label__c, Vault_Workout__r.RX_Weight_Male__c
            FROM Score_Submission__c 
            ORDER BY Vault_Workout__r.Order__c ASC];
			//? In this order so it will show on athlete scores in order
	}

	@AuraEnabled
    public static List<Challenge__c> getAllChallenges() {
        return [
			SELECT Id, Name, Active__c, Movement_1__c, Movement_2__c, Subtitle__c, Total_Challenge_Count__c, Days_in_Month__c, Start_Date__c 
			FROM Challenge__c 
			ORDER BY Start_Date__c ASC];
    }

	@AuraEnabled
	public static Challenge__c getCurrentChallenge(List<Challenge__c> challenges) {
		Challenge__c firstActive = new Challenge__c();
		for (Challenge__c challenge : challenges) {
			if (challenge.Active__c && firstActive.Id == null) {
				firstActive = challenge;
			}
		}
		return firstActive;
	}

	@AuraEnabled
    public static List<Challenge_Entry__c> getAllChallengeEntries() {
        return [
			SELECT Id, Name, Movement_1_Calc__c, Movement_2_Calc__c, Athlete__c, Athlete__r.Name, Challenge__c, Challenge__r.Name, Checkbox_Points__c, Daily_Checkbox__c, Entry_Total__c, CreatedDate, Adjusted_CreatedDate__c 
			FROM Challenge_Entry__c 
			ORDER BY Challenge__r.Start_Date__c ASC];
    }

	// SELECT Id, Challenge__c, Challenge__r.Name, Athlete__c, Athlete__r.Name, Points__c FROM Challenge_Completed__c


	//! Not used yet
	public virtual class FieldOptions {
		@AuraEnabled
		public String label;

		@AuraEnabled
		public String value;

		public FieldOptions(String label, String value) {
			this.label = label;
			this.value = value;
		}
	}

	public static List<SObject> reverseList(List<SObject> incomingList) {
		System.debug(incomingList);
		Map<Integer, SObject> mapName = new Map<Integer, SObject>();
		Integer i = 1;
		for (SObject obj : incomingList) {
			mapName.put(i, obj);
			i++;
		}
		List<SObject> listName = new List<SObject>();
		for (Integer j = incomingList.size(); j > 0; j--) {
			listName.add(mapName.get(j));
		}
		System.debug(listName);
		return listName;
	}
}