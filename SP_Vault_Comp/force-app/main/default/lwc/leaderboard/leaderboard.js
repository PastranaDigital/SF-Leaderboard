import { LightningElement } from 'lwc';
import imageResource from '@salesforce/resourceUrl/SPCompImages';
import athleteResource from '@salesforce/resourceUrl/SPCompAthletes';

const athlete = 'Omar';
export default class Leaderboard extends LightningElement {
    keyLogo = imageResource + '/Images/key_logo.png';
    athletePic = athleteResource + '/Athletes/' + athlete + '.png';
}