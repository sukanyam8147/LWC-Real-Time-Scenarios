import { LightningElement,wire,api} from 'lwc';
import fetchRecords from '@salesforce/apex/getAccount.getObjectData';
import {getFieldValue, updateRecord} from 'lightning/uiRecordApi'
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import updateobj from '@salesforce/apex/getAccount.updateObj'
import ACCOUNT_ID_FIELD from '@salesforce/schema/Opportunity.AccountId';
export default class UpdateAccount extends LightningElement {
    @api lookupObjectApiName
    @api lookupFieldApiName
     @api recordId
     @api objectApiName
     isLoading=false
    iconName='standard:account'
    searchPlaceholder='Search field here';
    selectedName
     records;
    blurTimeout;
    searchTerm
    selectedId
    boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
    @wire(fetchRecords, {searchfieldValue : '$searchTerm',objectName: '$lookupObjectApiName'})
    wiredRecords({ error, data }) {
        if (data) {
            this.error = undefined;
            this.records = data;
            //console.log('data'+JSON.stringify(data))
        } else if (error) {
            this.error = error;
            this.records = undefined;
        }
    }
    handleClick() {
        this.searchTerm = '';
        this.inputClass = 'slds-has-focus';
        this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus slds-is-open';
    }

    onBlur() {
        this.blurTimeout = setTimeout(() =>  {this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus'}, 300);
    }
    onSelect(event) {
        this.selectedId=event.currentTarget.dataset.id;
        this.selectedName = event.currentTarget.dataset.name;
        if(this.blurTimeout) {
            clearTimeout(this.blurTimeout);
        }
        this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
    }

    onChange(event) {
        this.searchTerm = event.target.value;
       
    }
   
        updateAccount(){
               
           updateobj({fdName:this.lookupFieldApiName,objName:this.objectApiName,recordId:this.recordId,fdValue:this.selectedId})
              /*console.log('selectedId'+this.selectedId)
               console.log('lookupFieldApiName'+this.lookupFieldApiName)
               let fields= {
                    Id: this.recordId,
                  AccountId:this.selectedId
                }
                const recordInput = {  fields };
                updateRecord(recordInput)*/
                .then(() =>{
                    this.showToast('Success', `${this.objectApiName} of ${this.lookupFieldApiName} field is updated successfully`, 'Success', 'dismissable');
                    this.pageRefresh();   
                })
                
                .catch(error =>{
                    this.showToast('Error updating or refreshing records', error.body.message, 'Error', 'dismissable');

                }).finally(()=>{
                    this.handleIsLoading(false);
                })
            }
            showToast(title, message, variant, mode) {
                const event = new ShowToastEvent({
                    title: title,
                    message: message,
                    variant: variant,
                    mode: mode
                });
                this.dispatchEvent(event);
            }        
            handleIsLoading(isLoading) {
                this.isLoading = isLoading;
            }
         
            pageRefresh() {
                setTimeout(() => {
                     eval("$A.get('e.force:refreshView').fire();");
                     this.selectedName=''
                }, 1000); 
             }
    }