({
    doInit : function(component, event, helper) {
        helper.doInitHelper(component, event, helper);
    },
    addConditionFront : function(component, event, helper) {
        helper.addConditionHelper(component, event, helper);
    },
    removeConditionFront : function(component, event, helper) {
        helper.removeConditionHelper(component, event, helper);
    },
    getValueFromCondition : function(component, event, helper) {
        helper.getValueFromConditionHelper(component, event, helper);
        // console.log(component.find("fieldOp").length);
    }
});