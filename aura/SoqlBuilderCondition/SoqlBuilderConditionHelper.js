({
	doInitHelper : function(component, event, helper) {
		component.set('v.inequalityConditions',[
			{label: "="},
			{label: "!="},
			{label: "<"},
			{label: "<="},
			{label: ">"},
			{label: "=>"}
		]);
	},
	getValueFromConditionHelper: function (component, event, helper) {
		let query = '';
		if ($A.util.isArray(component.find("fields"))) {
			let fields = helper.getValuesFields(component,"fields");
			let conditions = helper.getValuesFields(component, "inequalityConditions");
			let inputValues = helper.getValuesFields(component,"inputCondition");
			let isValid = false;

			for (let i = 0; i < fields.length; i++) {
				if (!helper.isEmptyOrSpaces(fields[i])) {
					if (isValid) query += ' AND ';

					query += `${fields[i]} ${conditions[i]} `;

					if (inputValues[i] === '') query += 'null';
					else if (helper.isBoolean(component.get('v.fields'), fields[i]) === true) query += inputValues[i];
					else query += '\'' + inputValues[i] + '\'';

					if (isValid === false) isValid = true;
				}
			}

			if (query !== '') query = 'WHERE ' + query;
		} else {
			let field = component.find("fields").get('v.value');
			let input = component.find("inputCondition").get('v.value');

			if (!helper.isEmptyOrSpaces(field)) {
				query += 'WHERE ' + field + ' ' + component.find("inequalityConditions").get('v.value') + ' ';

				if (input === '') query += 'null';
				else if (helper.isBoolean(component.get('v.fields'), field) === true) query += input;
				else query += '\'' + input + '\'';

			} else {
				query = '';
			}
		}

		helper.fireConditionEvent(query);
	},
    fireConditionEvent : function(conditions){
        let appEvent = $A.get("e.c:SoqlBuilderEvent");

        appEvent.setParams({
            "conditions": conditions
        });

        appEvent.fire();
    },
	isEmptyOrSpaces: function (query) {
		return query === null || query.match(/^ *$/) !== null;
	},
	getValuesFields : function(component, query) {
		let values = [];

		component.find(query).forEach(val => {
			values.push(val.get('v.value'));
		});

		return values;
	},
	isBoolean : function(fields, query) {
		let isValid = false;

		fields.forEach(function(item, i, arr) {
			if (arr[i].label === query && arr[i].type === "BOOLEAN") {
			    isValid = true;
			}
		});

		return isValid;
	},
	addConditionHelper : function(component, event, helper) {
		let components = component.get('v.countConditions');
		
		components.push(components.length + 1);
		component.set('v.countConditions', components);
	},
	removeConditionHelper : function(component, event, helper) {
		let components = component.get('v.countConditions');

		if (components.length !== 1) {
			components.splice(-1,1);
			component.set('v.countConditions', components);
		}
	}
});