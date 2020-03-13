({
    doInitHelper : function(component, event, helper) {
        component.set('v.inequalityConditions',[
            {label: "=", value: "="},
            {label: "!=", value: "!="},
            {label: "<", value: "<"},
            {label: "<=", value: "<="},
            {label: ">", value: ">"},
            {label: "=>", value: "=>"}
        ]);

        let action = component.get('c.getNamesSObject');

        component.find('server').getDataController(
            action,
            response => {
                let a = JSON.parse(response.getReturnValue());
                a.unshift({QualifiedApiName: undefined});
                component.set('v.data', a);
            }
        );
    },
    changeSObjectHelper : function(component, event, helper) {
        let action = component.get('c.getFields');
        action.setParams({sObjectName : component.find('sObjectId').get('v.value')});
        component.find('server').getDataController(
            action,
            response => {
                let fields = JSON.parse(response.getReturnValue());
                fields.unshift({type: undefined, label: undefined});

                component.set('v.showFields', true);
                component.set('v.fields', fields);

                $A.util.removeClass(component.find('block-fields'), 'slds-hide');
                $A.util.addClass(component.find('conditionsAndTable'), 'slds-hide');

                helper.clearFields(component, event, helper);
                helper.fireSObjectEvent(component, event, helper);
            }
        );
        component.set('v.countConditions', [1]);
    },
    changeFieldsHelper : function(component, event, helper) {
      if(component.find('fieldsSelect').get('v.value') !== ''){
          $A.util.removeClass(component.find('conditionsAndTable'), 'slds-hide');
      } else {
          $A.util.addClass(component.find('conditionsAndTable'), 'slds-hide');
      }

      helper.createQueryHelper(component, event, helper);
    },
    fireSObjectEvent : function(component, event, helper){
        let appEvent = $A.get("e.c:SoqlBuilderEvent");
        appEvent.setParams({
            "sObject" : component.find('sObjectId').get('v.value'),
            "fields" : '',
            "conditions" : '',
            "limit" : '',
            "offset" : '',
            "orderBy" : ''
        });
        appEvent.fire();
    },
    clearFields: function(component, event, helper) {
        component.find('fieldsSelect').set('v.value', '');
        component.find('limit').set('v.value', '');
        component.find('offset').set('v.value', '');
        component.find('orderBy')[0].set('v.value', '');
    },
    createQueryHelper : function(component, event, helper) {
        let sObject = component.find('sObjectId').get('v.value');
        let fields = component.find('fieldsSelect').get("v.value").split(';').join(', ');
        let limit = helper.getLimit(component, event, helper);
        let offset = helper.getOffset(component, event, helper);
        let orderBy = helper.getOrderByHelper(component.find('orderBy'));

        helper.fireQueryEvent(component, event, sObject, fields, limit, offset, orderBy);
    },
    getOrderByHelper : function(orderBy) {
        return (orderBy[0].get('v.value') !== '') ? `ORDER BY ${orderBy[0].get('v.value')} ${orderBy[1].get('v.value')} ${orderBy[2].get('v.value')}`
                                                  : '';
    },
    fireQueryEvent : function(component, event, sObject, fields, limit, offset, orderBy) {
        let appEvent = $A.get("e.c:SoqlBuilderEvent");

        appEvent.setParams({
            "sObject" : sObject,
            "fields" : fields,
            "limit" : limit,
            "offset" : offset,
            "orderBy" : orderBy
        });

        appEvent.fire();
    },
    getLimit : function(component, event, helper) {
        let limit = component.find('limit').get('v.value');

        return limit !== '' ? `LIMIT ${limit}` : '';
    },
    getOffset : function(component, event, helper) {
        let offset = component.find('offset').get('v.value');

        return offset !== '' ? `OFFSET ${offset}` : '';
    },
    changeLimitHelper : function(component, event, helper) {
        if(component.find('limit').get('v.value') > 50000) component.find('limit').set('v.value', 50000);
        else if(component.find('limit').get('v.value') < 0) component.find('limit').set('v.value', 0);

        helper.createQueryHelper(component, event, helper);
    },
    changeOffsetHelper : function(component, event, helper) {
        if(component.find('offset').get('v.value') > 2000) component.find('offset').set('v.value', 2000);
        else if(component.find('offset').get('v.value') < 0) component.find('offset').set('v.value', 0);

        helper.createQueryHelper(component, event, helper);
    }
})