const actions = {
    
}

module.exports = performAction = (action, state) => {
    if(actions[action] === undefined) throw Error(`requested ${action} action doesn't exist`);

    actions[action](state);
}