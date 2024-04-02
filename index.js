const prompt = require("prompt-sync")();

// Points Table Map
const PointsTableMap = new Map([
  [
    "Chennai Super Kings",
    {
      position: 1,
      matches: 7,
      won: 5,
      lost: 2,
      nrr: 0.771,
      forRuns: 1130,
      forOvers: 133.1,
      againstRuns: 1071,
      againstOvers: 138.5,
      points: 10,
    },
  ],
  [
    "Royal Challengers Bangalore",
    {
      position: 2,
      matches: 7,
      won: 4,
      lost: 3,
      nrr: 0.597,
      forRuns: 1217,
      forOvers: 140,
      againstRuns: 1066,
      againstOvers: 131.4,
      points: 8,
    },
  ],
  [
    "Delhi Capitals",
    {
      position: 3,
      matches: 7,
      won: 4,
      lost: 3,
      nrr: 0.319,
      forRuns: 1085,
      forOvers: 126,
      againstRuns: 1136,
      againstOvers: 137,
      points: 8,
    },
  ],
  [
    "Rajasthan Royals",
    {
      position: 4,
      matches: 7,
      won: 3,
      lost: 4,
      nrr: 0.331,
      forRuns: 1066,
      forOvers: 128.2,
      againstRuns: 1094,
      againstOvers: 137.1,
      points: 6,
    },
  ],
  [
    "Mumbai Indians",
    {
      position: 5,
      matches: 8,
      won: 2,
      lost: 6,
      nrr: -1.75,
      forRuns: 1003,
      forOvers: 155.2,
      againstRuns: 1134,
      againstOvers: 138.1,
      points: 4,
    },
  ],
]);
// Get user input
const YourTeam = prompt("Enter Your Team name: ");
const OppostionTeam = prompt("Enter Oppostion Team name: ");
let Overs;
let DesiredPostion;
try {
  Overs = parseFloat(prompt("Enter how many overs match: "));
  DesiredPostion = parseInt(
    prompt("Enter the desired position your team wants: ")
  );

  if (isNaN(Overs) || isNaN(DesiredPostion)) {
    console.log("Invalid Input");
    return;
  }
} catch (e) {
  console.log(e.message); // Output the error message
}

const TossResult = prompt("Enter Toss Result (Batting/Bowling): ");

if (TossResult === "Batting") {
  const RunScored =
    parseInt(prompt("Enter the Runs Scored by your team: ")) - 1;
  //Getting TeamInfo To see if it is already abvoe the desired postion or not
  const teaminfo = PointsTableMap.get(YourTeam);
  if (!teaminfo) {
    console.log("Invalid team name(s) entered.");
    return;
  }
  if (teaminfo.position <= DesiredPostion) {
    console.log(`You are alerady above  the desired postion`);
    return;
  }
  let Points = teaminfo.points + 2;
  RestrictIn(YourTeam, OppostionTeam, Overs, RunScored, DesiredPostion, Points);
} else if (TossResult === "Bowling") {
  const RunsToChase = parseInt(prompt("Enter the Runs to chase: "));
  if (isNaN(RunsToChase)) {
    console.log("Invalid Input");
    return;
  }
  const teaminfo = PointsTableMap.get(YourTeam);
  if (!teaminfo) {
    console.log("Invalid team name(s) entered.");
    return;
  }
  if (teaminfo.position <= DesiredPostion) {
    console.log(`You are alerady above  the desired postion`);
    return;
  }
  let Points = teaminfo.points + 2;
  ChaseIn(YourTeam, OppostionTeam, Overs, RunsToChase, DesiredPostion, Points);
} else {
  console.log("Invalid");
  return;
}
function ChaseIn(
  YourTeam,
  OppostionTeam,
  Overs,
  RunsToChase,
  DesiredPostion,
  Points
) {
  let teaminfo1 = PointsTableMap.get(YourTeam);

  let teaminfo2 = PointsTableMap.get(OppostionTeam);
  if (Points > teaminfo2.points) {
    console.log(`You Just have to win the match to be at ${DesiredPostion}`);
    return;
  }
  let nrr;
  if (teaminfo2.position !== DesiredPostion) {
    for (const [key, value] of PointsTableMap) {
      if (value.position === DesiredPostion) {
        teaminfo2 = PointsTableMap.get(key);
      }
    }
  }
  if (DesiredPostion - 1 > 0) {
    for (const [key, value] of PointsTableMap) {
      if (value.position === DesiredPostion - 1) {
        nrr = value.nrr;
      }
    }
  }
  let team1forrun = teaminfo1.forRuns + RunsToChase;
  let tmp1 = (teaminfo1.forOvers-Math.floor(teaminfo1.forOvers)) 
  let team1forover = Math.floor(teaminfo1.forOvers)+tmp1;
  let team1againstrun = teaminfo1.againstRuns + RunsToChase - 1;
  let tmp2 = (teaminfo1.againstOvers-Math.floor(teaminfo1.againstOvers))
  let team1againstover = teaminfo1.againstOvers + tmp2 + Overs;
  let Upperlimit = Calacforoverrage(
    team1forrun,
    team1forover,
    team1againstrun,
    team1againstover,
    nrr-0.001
  );
  let Lowerlimit = Calacforoverrage(
    team1forrun,
    team1forover,
    team1againstrun,
    team1againstover,
    teaminfo2.nrr+0.001
  );
  let lowerlimitnrr = Calacnrrforover( 
    team1forrun,
    team1forover,
    team1againstrun,
    team1againstover,
    Lowerlimit)
  let upperlimitnrr = Calacnrrforover( 
    team1forrun,
    team1forover,
    team1againstrun,
    team1againstover,
    Upperlimit)
    console.log(`${YourTeam}needs to chase ${RunsToChase} between ${Upperlimit.toFixed(1)} and ${Lowerlimit.toFixed(1)} Overs.`)
    console.log(`Revised NRR for ${YourTeam} will be between ${lowerlimitnrr.toFixed(3)} to ${upperlimitnrr.toFixed(3)}.`)
  
}

function Calacforoverrage(
  team1forrun,
  team1forover,
  team1againstrun,
  team1againstover,
  nrr
) {
  let against = team1againstrun / team1againstover;
  nrr = against+nrr;
  let ans = (team1forrun / nrr) - team1forover;
  return ans;
}
function Calacnrrforover( 
  team1forrun,
  team1forover,
  team1againstrun,
  team1againstover,
  ans)
{
  team1forover+=ans;
  let made = team1forrun/team1forover;
  let against = team1againstrun/team1againstover;
  return made-against;
}
function RestrictIn(
  YourTeam,
  OppostionTeam,
  Overs,
  RunScored,
  DesiredPostion,
  Points
) {
  let teaminfo1 = PointsTableMap.get(YourTeam);

  let teaminfo2 = PointsTableMap.get(OppostionTeam);
  if (Points > teaminfo2.points) {
    console.log(`You Just have to win the match to be at ${DesiredPostion}`);
    return;
  }
  let nrr;
  if (teaminfo2.position !== DesiredPostion) {
    for (const [key, value] of PointsTableMap) {
      if (value.position === DesiredPostion) {
        teaminfo2 = PointsTableMap.get(key);
      }
    }
  }
  if (DesiredPostion - 1 > 0) {
    for (const [key, value] of PointsTableMap) {
      if (value.position === DesiredPostion - 1) {
        nrr = value.nrr;
      }
    }
  }
  let team1forrun = teaminfo1.forRuns + RunScored;
  let tmp1 = (teaminfo1.forOvers-Math.floor(teaminfo1.forOvers))
  
  let team1forover = Math.floor(teaminfo1.forOvers)+tmp1+ Overs;
  let team1againstrun = teaminfo1.againstRuns;
  let tmp2 = (teaminfo1.againstOvers-Math.floor(teaminfo1.againstOvers))
  let team1agaisntover = teaminfo1.againstOvers + tmp2 + Overs;
  let upperlimit =
    Calacrange(
      team1forrun,
      team1forover,
      team1againstrun,
      team1agaisntover,
      nrr
    ) + 1;
  let lowerlimit =
    Calacrange(
      team1forrun,
      team1forover,
      team1againstrun,
      team1agaisntover,
      teaminfo2.nrr
    ) - 1;
  let lowerlimitnrr = CalacNrr(
    team1forrun,
    team1forover,
    team1againstrun,
    team1agaisntover,
    lowerlimit
  );
  let upperlimitnrr = CalacNrr(
    team1forrun,
    team1forover,
    team1againstrun,
    team1agaisntover,
    upperlimit
  );
  console.log(
    `If ${YourTeam} score ${
      RunScored + 1
    } runs in ${Overs} overs, ${YourTeam} need to restrict ${OppostionTeam} between ${upperlimit} to ${lowerlimit} runs in ${Overs} Overs.`
  );
  console.log(
    `Revised NRR of Rajasthan Royals will be between ${lowerlimitnrr.toFixed(
      3
    )} to ${upperlimitnrr.toFixed(3)}.`
  );
}
function CalacNrr(
  team1forrun,
  team1forover,
  team1againstrun,
  team1agaisntover,
  limit
) {
  team1againstrun += limit;
  let made = team1forrun / team1forover;
  let against = team1againstrun / team1agaisntover;
  return made - against;
}
function Calacrange(
  team1forrun,
  team1forover,
  team1againstrun,
  team1agaisntover,
  nrr
) {
  let made = team1forrun / team1forover;
  let ans = (made - nrr) * team1agaisntover - team1againstrun;
  return Math.floor(ans);
}
