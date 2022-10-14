public with sharing class getAccount {
    @AuraEnabled(cacheable=true)
    public static List<sObject> getObjectData(String searchfieldValue,String objectName) {
        String query;
            if(String.isNotBlank(searchfieldValue)){
                query= 'Select Id, Name from '+ objectName +' Where  Name Like  \'%' + searchfieldValue + '%\' LIMIT 10';
            }
            else {
                query= 'Select Id, Name  from '+ objectName +' Where ORDER BY CreatedDate DESC LIMIT  10';
            }
        List<sObject> objectList = database.query(query);
        return objectList;
    }
    @AuraEnabled
    public static string updateObj(String fdName,String objName,String recordId,String fdValue) {
     Schema.SObjectType t = Schema.getGlobalDescribe().get(objName);
     SObject sObjectUpdate = t.newSObject(recordId);
     sObjectUpdate.put(fdName, fdValue);
    Update sObjectUpdate;
    return sObjectUpdate.Id;
    }
  
}