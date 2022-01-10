public with sharing class LeadHelloWorlder {
    List<Lead> newList;

	public LeadHelloWorlder(List<Lead> newList) {
		this.newList = newList;
		sayHelloWorld();
	}

	//? because it is a before trigger, we don't have to DML anything
	private void sayHelloWorld() {
		for (Lead l : newList) {
			l.FirstName = 'Hello';
			l.LastName = 'World';
		}
	}
}
