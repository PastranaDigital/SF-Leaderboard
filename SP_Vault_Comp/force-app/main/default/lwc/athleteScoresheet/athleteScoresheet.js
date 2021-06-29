import { LightningElement, api } from 'lwc';

export default class Athlete_scoresheet extends LightningElement {
    @api displayAthleteScore;

    @api athScore;
    
    photoURL = 'https://brave-shark-9g6q3j-dev-ed.my.salesforce.com/sfc/p/5e000001Ottb/a/5e000000GnbG/wM6anjjTYC8vddNI_ij21c75Hv8E9G_NSRgR0oN5UmE';
}