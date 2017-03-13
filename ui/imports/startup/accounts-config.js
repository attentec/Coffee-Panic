import { Accounts } from 'meteor/accounts-base';
 
Accounts.config({
restrictCreationByEmailDomain: 'attentec.se'
});