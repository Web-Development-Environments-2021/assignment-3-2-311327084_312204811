const axios = require("axios");
const league_utils = require("./league_utils");
const team_utils = require("./team_utils");
const db_utils = require("./DButils");
const { select } = require("async");
const { decodeBase64 } = require("bcryptjs");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
// const TEAM_ID = "85";

async function getMatchIdsByTeam(team_id) {
    let match_ids_list = [];
    const team = await axios.get(`${api_domain}/fixtures/${team_id}`, {
        params: {
            include: "squad",
            api_token: process.env.api_token,
        },
    });
    team.data.data.squad.data.map((player) =>
        player_ids_list.push(player.player_id)
    );
    return player_ids_list;
}

async function getMatchesInfo(matches_ids_list) {
    let promises = [];
    matches_ids_list.map((id) =>
        promises.push(
            // get the match from local db
            db_utils.execQuery(`select * from dbo.matches where id='${id}'`)));
    let matches_info = await Promise.all(promises);
    return extractRelevantMatchData(matches_info);
}

function extractRelevantMatchData(matches_info) {
    // used for data comes from external API
    // return matches_info.map((match_info) => {
    //     const { league_id, season_id, stage_id, localteam_id, visitorteam_id } = match_info.data.data;
    //     const { date, time } = match_info.data.data.time.starting_at;
    //     return {
    //         league_id: league_id,
    //         season_id: season_id,
    //         stage_id: stage_id,
    //         localteam_id: localteam_id,
    //         visitorteam_id: visitorteam_id,
    //         date: date,
    //         time: time,
    //         //todo: add other things like match result
    //     };
    // });
    //used for matches that come from internal DB
    return matches_info.map((match_info) => {
        const { leagueName, seasonName, stageName, awayTeam, homeTeam, date, time, awayScore, homeScore, id, matchEventCalendarId, refereeName, stadium } = match_info[0];
        return {
            leagueName: leagueName,
            seasonName: seasonName,
            stageName: stageName,
            awayTeam: awayTeam,
            homeTeam: homeTeam,
            date: date,
            time: time,
            awayScore: awayScore,
            homeScore: homeScore,
            id: id,
            matchEventCalendarId: matchEventCalendarId,
            refereeName: refereeName,
            stadium: stadium
        };
    });
}

// async function getMatchesByTeam(team_id) {
//     let match_ids_list = await getMatchIdsByTeam(team_id);
//     let matches_info = await getMatchesInfo(match_ids_list);
//     return matches_info;
// }

// exports.getMatchesByTeam = getMatchesByTeam;
exports.getMatchesInfo = getMatchesInfo;
