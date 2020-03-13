({
    createSoqlQuery : function (component, event, helper) {
        helper.createSoqlQueryHelper(component, event, helper);
    },
    createTable : function(component, event, helper) {
        helper.createTableHelper(component, event, helper);
    },
    paginationPreview : function(component, event, helper) {
        helper.paginationPreviewHelper(component, event, helper);
    },
    paginationNext : function(component, event, helper) {
        helper.paginationNextHelper(component, event, helper);
    },
    sortTable : function(component, event, helper) {
        helper.sortRecords(component, event, helper);
    }
})