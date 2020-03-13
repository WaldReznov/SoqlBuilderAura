public with sharing class SoqlBuilderController {
    private static Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();

    public class FieldWrapper{
        public String label{get;set;}
        public String type{get;set;}
    }

    @AuraEnabled
    public static String getNamesSObject() {
        return JSON.serialize([
                SELECT 
                        QualifiedApiName
                FROM 
                        EntityDefinition
                WHERE 
                        IsCustomSetting = false
                            AND 
                        IsRetrieveable = true
                            AND 
                        IsSearchable=true
                            AND 
                        IsEverUpdatable=true
                            AND 
                        IsQueryable=true
                ORDER BY 
                        QualifiedApiName
                LIMIT 
                        1000
        ]);
    }

    @AuraEnabled
    public static String getFields(String sObjectName) {
        Map<String, Schema.SObjectField> fieldMap = schemaMap.get(sObjectName).getDescribe().fields.getMap();
        List<FieldWrapper> fields = new List<FieldWrapper>();

        for (String fieldItem : fieldMap.keySet()) {
            FieldWrapper fieldInstance = new FieldWrapper();

            fieldInstance.label = String.valueOf(fieldMap.get(fieldItem));
            fieldInstance.type = String.valueOf(fieldMap.get(fieldItem).getDescribe().getType());
            
            fields.add(fieldInstance);
        }

        return JSON.serialize(fields);
    }

    @AuraEnabled
    public static String getRecords(String query) {
        return JSON.serializePretty(Database.query(query));
    }
}