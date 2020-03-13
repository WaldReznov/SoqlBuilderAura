({
    createSoqlQueryHelper: function (component, event, helper) {
        helper.changeAttributes(component, event, helper);

        let sObject = component.get("v.sObject");
        let fields = component.get("v.fields");
        let conditions = component.get("v.conditions") === undefined ? '' : component.get("v.conditions");
        let limit = component.get("v.limit") === undefined ? '' : component.get("v.limit");
        let offset = component.get("v.offset") === undefined ? '' : component.get("v.offset");
        let orderBy = component.get("v.orderBy") === undefined ? '' : component.get("v.orderBy");
        let input = component.find('soqlQuery');
        let query = `SELECT ${fields} FROM ${sObject} ${conditions} ${orderBy} ${limit} ${offset}`;

        if (fields !== undefined && sObject !== undefined && fields !== '') input.set('v.value', query);
        else input.set('v.value', '');
    },
    changeAttributes: function (component, event, helper) {
        helper.changeAttribute(component, event, "sObject");
        helper.changeAttribute(component, event, "fields");
        helper.changeAttribute(component, event, "conditions");
        helper.changeAttribute(component, event, "limit");
        helper.changeAttribute(component, event, "offset");
        helper.changeAttribute(component, event, "orderBy");
    },
    changeAttribute: function (component, event, attribute) {
        if (event.getParam(attribute) !== undefined) {
            component.set("v." + attribute, event.getParam(attribute))
        }
    },
    createTableHelper: function (component, event, helper) {
        let action = component.get('c.getRecords');
        action.setParams({query: component.find('soqlQuery').get('v.value')});
        component.find('server').getDataController(
            action,
            response => {
                const size = 20;
                let data = JSON.parse(response.getReturnValue());

                let fields = helper.getColumns(component);
                let subData = helper.splitRecords(helper, data, size, fields);

                component.set('v.tableIndex', 0);
                component.set('v.columns', fields);
                component.set('v.data', subData);
                component.set('v.records', subData[0]);
            }
        );
    },
    getColumns: function (component) {
        return component.get('v.fields').split(' ').join('').split(',');
    },
    splitRecords: function (helper, data, size, fields) {
        let splitedRecords = [];
        let records = helper.getArrayRecords(data, fields);
        
        for (let i = 0; i < Math.ceil(records.length / size); i++)
            splitedRecords[i] = records.slice((i * size), (i * size) + size);
        
        return splitedRecords;
    },
    getArrayRecords : function(records, fields) {
        let changedRecords = [];
        for(let i = 0; i < records.length; i++) {
            let record = [];

            for(let j = 0; j < fields.length; j++){
                if(records[i][fields[j]] === undefined || records[i][fields[j]] === null) record.push('');
                else record.push(records[i][fields[j]]);
            }

            changedRecords.push(record);
        }
        return changedRecords;
    },
    sortRecords : function(component, event, helper) {
        let columns = component.get('v.columns');
        let apiName = event.target.dataset.apiname;
        let fieldNumber = columns.indexOf(apiName);
        let records = component.get('v.records');

        if(component.get('v.sortAsc') === true) {
            records = component.get('v.records').sort(function(rowA, rowB) {
                if(typeof rowA[fieldNumber] === 'string' && typeof rowB[fieldNumber] === 'string') {
                    return rowA[fieldNumber].toLowerCase() > rowB[fieldNumber].toLowerCase() ? -1 : 1;
                } else {
                    return rowA[fieldNumber] > rowB[fieldNumber] ? -1 : 1;
                }
            });
            component.set('v.sortAsc', false);
        } else if(component.get('v.sortAsc') === false){
            records = component.get('v.records').sort(function(rowA, rowB) {
                if(typeof rowA[fieldNumber] === 'string' && typeof rowB[fieldNumber] === 'string') {
                    return rowA[fieldNumber].toLowerCase() > rowB[fieldNumber].toLowerCase() ? 1 : -1;
                } else {
                    return rowA[fieldNumber] > rowB[fieldNumber] ? 1 : -1;
                }
            });
            component.set('v.sortAsc', true);
        }

        component.set('v.records', records);
    },
    paginationNextHelper: function (component, event, helper) {
        let data = component.get('v.data');
        let tableIndex = component.get('v.tableIndex');

        if (data.length - 1 !== tableIndex) {
            component.set('v.records', data[tableIndex + 1]);
            component.set('v.tableIndex', tableIndex + 1);
        }
    },
    paginationPreviewHelper: function (component, event, helper) {
        let data = component.get('v.data');
        let tableIndex = component.get('v.tableIndex');

        if (tableIndex !== 0) {
            component.set('v.tableIndex', tableIndex - 1);
            component.set('v.records', data[tableIndex - 1]);
        }
    }
})