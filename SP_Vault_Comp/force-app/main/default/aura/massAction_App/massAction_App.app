<!-- Application to host all lightning out components -->
<aura:application extends="ltng:outApp" access="global">
	<aura:dependency resource="c:massAction_AthleteWrapper" />
	<aura:dependency resource="markup://force:navigateToList" type="EVENT" />
	<aura:dependency resource="markup://force:navigateToSObject" type="EVENT" />
	<aura:dependency resource="markup://force:showToast" type="EVENT" />
</aura:application>