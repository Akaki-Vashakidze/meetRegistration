
// let port = 'http://localhost:3500/'

// let port = 'https://regback-production.up.railway.app/'

let port = 'https://cute-teal-jackrabbit-wear.cyclic.app/'


export const environment = {
    registrationURL: port + 'registration/register',
    loginURL: port + 'login/login',
    resultsURL: port + 'results/results',
    namesURL: port + 'meetRegistration/names',
    actCodesURL: port + 'registration/actcodes',
    meetResultsURL: port + 'results/meetResults',
    eventResultsURL: port + 'results/eventResults',
    swimmerCardInfoURL: port + 'meetRegistration/swimmerCardInfo',
    registerSwimmersURL: port + 'meetRegistration/registerSwimmers',
    clubsURL: port + 'meetRegistration/clubs',
    compsURL: port + 'meetRegistration/newComps',
    doubleRegURL: port + 'meetRegistration/checkDoubleCompReg',
};
