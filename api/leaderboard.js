// TODO: Produce ordered list of top 5 scores using a database
module.exports = function(production) {
    return production ? getLeaderboardResults()
        : JSON.stringify([
        {
            name: "bill",
            score: 15
        },
        {
            name: "bob",
            score: 14
        },
        {
            name: "ben",
            score: 13
        },
        {
            name: "bobby",
            score: 12
        },
        {
            name: "bourne",
            score: 11
        }
    ]);
};

function getLeaderboardResults() {
    return "{ error: \"Production not implemented\"}";
}