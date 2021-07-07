import { LightningElement, api } from 'lwc';

export default class AthleteSpotlight extends LightningElement {
    @api displayAthleteScore;
    @api athScore;
}