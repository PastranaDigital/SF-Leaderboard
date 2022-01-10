// Based on Brooks Johnson's interpretation of Kevin Ohara's Trigger Framework
// https://www.youtube.com/watch?v=ErOJWdvVpVE

public virtual with sharing class TriggerHandler {
    
	TriggerOperation context;

	public TriggerHandler() {
		this.context = Trigger.operationType;
		// System.debug('The context is ' + context);
	}

	public void run() {
		switch on this.context {
			when BEFORE_INSERT {
				beforeInsert();
			}
			when BEFORE_UPDATE {
				beforeUpdate();
			}
			when BEFORE_DELETE {
				beforeDelete();
			}
			when AFTER_INSERT {
				afterInsert();
			}
			when AFTER_UPDATE {
				afterUpdate();
			}
			when AFTER_DELETE {
				afterDelete();
			}
			when AFTER_UNDELETE {
				afterUndelete();
			}
		}
	}

	protected virtual void beforeInsert(){
		// System.debug('In Super Class beforeInsert');
	}
	protected virtual void beforeUpdate(){
		// System.debug('In Super Class beforeUpdate');
	}
	protected virtual void beforeDelete(){
		// System.debug('In Super Class beforeDelete');
	}
	protected virtual void afterInsert(){
		// System.debug('In Super Class afterInsert');
	}
	protected virtual void afterUpdate(){
		// System.debug('In Super Class afterUpdate');
	}
	protected virtual void afterDelete(){
		// System.debug('In Super Class afterDelete');
	}
	protected virtual void afterUndelete(){
		// System.debug('In Super Class afterUndelete');
	}

}
