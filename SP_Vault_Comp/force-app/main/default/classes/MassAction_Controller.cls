public virtual with sharing class MassAction_Controller {
    
	//? in the event this is used in a managed package and given a namespace inside of an org
	private static final String DEF_NAMESPACE = 'c';
	private static final String SEPERATOR = '\\.';
	
	public String selectedIds { get; private set; }
	
	public MassAction_Controller(ApexPages.StandardSetController cntrl) {
		this.selectedIds = JSON.serialize(
			new Map<Id, SObject> (cntrl.getSelected()).keySet()
		);
    }

	public String getNamespace() {
		String className = MassAction_Controller.class.toString();
		List<String> splitName = className.split(SEPERATOR);

		return (splitName.size() == 2) ? splitName[0] : DEF_NAMESPACE;
	}
}
