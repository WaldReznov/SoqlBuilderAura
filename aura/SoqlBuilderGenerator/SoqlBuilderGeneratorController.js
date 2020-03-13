({
    doInit : function(component, event, helper) {
        helper.doInitHelper(component, event, helper);
    },
    changeSObjectFront : function(component, event, helper) {
        helper.changeSObjectHelper(component, event, helper);
    },
    createSOQL : function(component, event, helper) {
        helper.createQueryHelper(component, event, helper);
    },
    changeLimitFront : function(component, event, helper) {
        helper.changeLimitHelper(component, event, helper);
    },
    changeOffsetFront : function(component, event, helper) {
        helper.changeOffsetHelper(component, event, helper);
    },
    changeFieldsFront : function(component, event, helper) {
        helper.changeFieldsHelper(component, event, helper);
    }
})