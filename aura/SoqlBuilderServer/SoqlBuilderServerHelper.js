({
    getDataHelper : function(component, event) {
        let action = event.getParam('arguments').action;
        let callback = event.getParam('arguments').callback;

        action.setCallback(this, $A.getCallback(function(response){
            let state = response.getState();
            
            if (state === 'SUCCESS') callback(response);
            else if (state === 'ERROR')  console.error('error');
        }));

        $A.enqueueAction(action);
    }
})