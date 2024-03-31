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
   DesiredPostion = parseInt(prompt("Enter the desired position your team wants: "));

  if (isNaN(Overs) || isNaN(DesiredPostion)) {
    console.log("Invalid Input")
    return;
  }
 

  // Your further code logic here
  
} catch (e) {
  console.log(e.message); // Output the error message
}

const TossResult = prompt("Enter Toss Result (Batting/Bowling): ");

if (TossResult === "Batting") {
  const RunScored = parseInt(prompt("Enter the Runs Scored by your team: "));
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
  let points = teaminfo.points+2;
  RestrictIn(YourTeam, OppostionTeam, DesiredPostion, RunScored, Overs,points);
} else if(TossResult=== "Bowling") {
  const RunsToChase = parseInt(prompt("Enter the Runs to chase: "));
  const teaminfo = PointsTableMap.get(YourTeam);
  if (!teaminfo) {
    console.log("Invalid team name(s) entered.");
    return;
  }
  if (teaminfo.position <= DesiredPostion) {
    console.log(`You are alerady above  the desired postion`);
    return;
  }
  let points = teaminfo.points+2;
  ChaseIn(YourTeam, OppostionTeam, DesiredPostion, RunsToChase, Overs,points);
}else{
  console.log("Invalid")
  return;
}

function ChaseIn(YourTeam, OppostionTeam, DesiredPostion, RunsToChase, Overs,points) {
  //Getting Team Info of both the team
  let teamInfo1 = PointsTableMap.get(YourTeam);
  let teamInfo2 = PointsTableMap.get(OppostionTeam);
  if (!teamInfo1 || !teamInfo2) {
    console.log("Invalid team name(s) entered.");
    return;
  }
  //Checking if the Opponent team is as desired postion or not 
  if (teamInfo2.position != DesiredPostion) {
    for (const [key, value] of PointsTableMap) {
      if (value.position === DesiredPostion) {
        
        //Finding the team at desired postion
        teamInfo2 = PointsTableMap.get(key);
        if(teamInfo2.points < points)
        {
          console.log(`You just need to win this match to be at ${DesiredPostion}`)
          return;
        }
        const team1forrun = teamInfo1.forRuns + RunsToChase;
        const team1forovers = teamInfo1.forOvers;
        const team1againstrun = teamInfo1.againstRuns + RunsToChase - 1;
        const team1againstover = teamInfo1.againstOvers + Overs;
        //Appling Binary Search for the case when Opponent team is not at desired postion
        let s = 0;
        let e = Overs;
        let ans;
        while (s <= e) {
          let mid = Math.floor((s + e) / 2);

          let val = calculatover(
            mid,
            team1forrun,
            team1forovers,
            team1againstrun,
            team1againstover,
            teamInfo2.nrr
          );

          if (val > 0) {
            ans = mid;
            s = mid + 1;
          } else {
            e = mid - 1;
          }
        }
        //With above getting the upper limit of the overs in integer form

        //Checking if on each bowl of the over if it is possible to chase or not 
        let tmp = ans;
        let cnt = 1;
        while (cnt <= 6) {
          tmp += 0.1;
          if (
            calculatover(
              tmp,
              team1forrun,
              team1forovers,
              team1againstrun,
              team1againstover,
              teamInfo2.nrr
            ) > 0
          ) {
            ans = tmp;
          }
          cnt++;
        }
        if(ans)
        {

        
        ans = parseFloat(ans);
        if (ans - Math.floor(ans) === 0.6) {
          console.log(`${YourTeam} needs to chase ${RunsToChase} between 0 to ${ans.toFixed(1)} Overs`)
          let nrr0 = nrrover(0,team1forrun,team1forovers,team1againstrun,team1againstover);
          let nrr1 = nrrover(ans,team1forrun,team1forovers,team1againstrun,team1againstover);
          console.log(`${YourTeam} revised runrate will be from ${nrr1.toFixed(3)} to ${nrr0.toFixed(3)}`);
        } else {
          
          console.log(`${YourTeam} needs to chase ${RunsToChase} between 0 to ${ans.toFixed(1)} Overs`)
          let nrr0 = nrrover(0,team1forrun,team1forovers,team1againstrun,team1againstover);
          let nrr1 = nrrover(ans,team1forrun,team1forovers,team1againstrun,team1againstover);
          console.log(`${YourTeam} revised runrate will be from ${nrr1.toFixed(3)} to ${nrr0.toFixed(3)}`);

        }
      }else{
        console.log(`Currently Your team cannot reach the desired postion`)
      }
      }
    }
  }else{
    if(teamInfo2.points < points)
    {
      console.log(`You just need to win this match to be at ${DesiredPostion}`)
      return;
    }
   //This is when the opponent team is at desired postion
    const team1forrun = teamInfo1.forRuns + RunsToChase;
    const team1forovers = teamInfo1.forOvers;
    const team1againstrun = teamInfo1.againstRuns+RunsToChase-1;
    const team1againstover = teamInfo1.againstOvers + Overs;
    const team2forrun = teamInfo2.forRuns+RunsToChase-1;
    const team2forovers = teamInfo2.forOvers + Overs;
    const team2againstrun = teamInfo2.againstRuns + RunsToChase;
    const team2againstover = teamInfo2.againstOvers;
    let  s = 0;
    let e = Overs;
    let ans;
    //We again find the upper limit for the same meaning the max Integer over in which the team can chase down the score
    while(s<=e)
    {
      let mid = Math.floor((s+e)/2);
      let val = CalacOver(mid,team1forrun,team1forovers,team1againstrun,team1againstover,team2forrun,team2forovers,team2againstrun,team2againstover);
      if(val > 0)
      {
        ans = mid;
        s = mid+1;
      }else{
        e = mid-1;
      }
    }
    if(!ans) 
    {
      console.log(`Your Team Currently cannot reach the desired postion`)
      return;
    }
    if(ans==Overs)
    {
      console.log(`${YourTeam} needs to chase ${RunsToChase} between 0 to ${ans.toFixed(1)} Overs`)
      let nrr0 = nrrover(0,team1forrun,team1forovers,team1againstrun,team1againstover);
      let nrr1 = nrrover(ans,team1forrun,team1forovers,team1againstrun,team1againstover);
      console.log(`${YourTeam} revised runrate will be from ${nrr1.toFixed(3)} to ${nrr0.toFixed(3)}`);
      return;
    }
    //Similary checking for each bowl in that over
    let tmp = ans;
    let cnt = 1;
    while (cnt <= 6) {
      tmp += 0.1;
      if (
       CalacOver(tmp,team1forrun,team1forovers,team1againstrun,team1againstover,team2forrun,team2forovers,team2againstrun,team2againstover)>0) {
        ans = tmp;
      }
      cnt++;
    }
    
    if (ans.toFixed(1) - Math.floor(ans) === 0.6) {
      console.log(`${YourTeam} needs to chase ${RunsToChase} between 0 to ${ans.toFixed(1)} Overs`)
      let nrr0 = nrrover(0,team1forrun,team1forovers,team1againstrun,team1againstover);
      let nrr1 = nrrover(ans,team1forrun,team1forovers,team1againstrun,team1againstover);
      console.log(`${YourTeam} revised runrate will be from ${nrr1.toFixed(3)} to ${nrr0.toFixed(3)}`);
    } else {
      console.log(`${YourTeam} needs to chase ${RunsToChase} between 0 to ${ans.toFixed(1)} Overs`)
      let nrr0 = nrrover(0,team1forrun,team1forovers,team1againstrun,team1againstover);
      let nrr1 = nrrover(ans,team1forrun,team1forovers,team1againstrun,team1againstover);
      console.log(`${YourTeam} revised runrate will be from ${nrr1.toFixed(3)} to ${nrr0.toFixed(3)} to `);
    }
  }
}
// nrrover() function calacluates the revised nrr of the team
function nrrover(ans,team1run,team1over,team1againstun,team1againstover)
{
  team1over+=ans;
  // In here we check if the decimal exceeds 0.6 then we increment the over ex:146.7 will be revised as 147.1
  let decimalPart = team1over - Math.floor(team1over);
if (decimalPart > 0.6) {
  team1over= Math.floor(team1over) + 1 + (team1over - Math.floor(team1over) - 0.6);
}
  let ForRatio = team1run/team1over;
  let AgainstRatio = team1againstun/team1againstover;
  return ForRatio-AgainstRatio;
}
//This function gets used when opponent is at desired postion we comaprre both the teams nrr where YourTeam-AgainstTeam if greater then 0 meaning we already have greater NRR  then opponent team
function CalacOver(mid,team1run,team1over,team1againstun,team1againstover,team2run,team2over,team2againstun,team2againstover)
{
    team1over+=mid;
let decimalPart = team1over - Math.floor(team1over);
if (decimalPart > 0.6) {
  team1over= Math.floor(team1over) + 1 + (team1over - Math.floor(team1over) - 0.6);
}
    team2againstover+=mid;
    let decimalPart2 = team2againstover - Math.floor(team2againstover);
if (decimalPart2 > 0.6) {
  team2againstover= Math.floor(team2againstover) + 1 + (team2againstover - Math.floor(team2againstover) - 0.6);
}
    let Team1for= team1run/team1over;
    let Team1Against = team1againstun/team1againstover;
    let Team2for = team2run/team2over;
    let Team2Against = team2againstun/team2againstover;
    let nrr1 = Team1for-Team1Against;
    let nrr2 = Team2for-Team2Against;
    return nrr1-nrr2;
}
// This fucntion is when opponent is not at desried postion we get the desires postion team's nrr and then comapre our NRR with that NRR
function calculatover(mid, team1run,team1over,team1againstun,team1againstover, Team2nrr) {
  team1over += mid;
let decimalPart = team1over- Math.floor(team1over);
if (decimalPart > 0.6) {
  team1over= Math.floor(team1over) + 1 + (team1over - Math.floor(team1over) - 0.6);
}

// Keep only one decimal place without rounding
team1over = Math.floor(team1over * 10) / 10;
  let Team1for = team1run/ team1over;
  let Team1against = team1againstun / team1againstover;
  let nrr = Team1for - Team1against;
  return nrr -  Team2nrr;
}

function RestrictIn(YourTeam, OppostionTeam, DesiredPostion, RunScored, Overs,points) {
  //Getting team info
  let teamInfo1 = PointsTableMap.get(YourTeam);
  let teamInfo2 = PointsTableMap.get(OppostionTeam);
  if (!teamInfo1 || !teamInfo2) {
    console.log("Invalid team name(s) entered.");
    return;
  }
  if (teamInfo2.position != DesiredPostion) {
    //Finding the opponent at desired postion
    for (const [key, value] of PointsTableMap) {
      if (value.position === DesiredPostion) {
        teamInfo2 = PointsTableMap.get(key);
        if(teamInfo2.points < points)
        {
          console.log(`You just have to win this match to be at ${DesiredPostion} postion`)
          return;
        }
        const team1forrun = teamInfo1.forRuns + RunScored;
        const team1forovers = teamInfo1.forOvers + Overs;
        const team1againstrun = teamInfo1.againstRuns;
        const team1againstover = teamInfo1.againstOvers + Overs;
        const a = team1forrun / team1forovers;
        const ans = Math.floor(
          (a - teamInfo2.nrr) * team1againstover - team1againstrun
        );
        //Appling binary search to find the upper limit of runs which if conceded is okay
        let s = 0;
        let e = RunScored;
        let ans2;
        while (s <= e) {
          let mid = Math.floor((s + e) / 2);
          if (
            calaclautenrr2(
              mid,
              team1forrun,
              team1forovers,
              team1againstrun,
              team1againstover,
              teamInfo2.nrr
            )
          ) {
            ans2 = mid;
            s = mid+1;
          } else {
            e = mid-1;
          }
        }
        
        if (ans < 0) {
          console.log(
            `It is not Possible for your time to climb to ${DesiredPostion} at moment`
          );
          return;
        }
        const nrrupper = calaclautenrr3(
          team1forrun,
          team1forovers,
          team1againstrun + 0,
          team1againstover
        );
        const nrrlower = calaclautenrr3(
          team1forrun,
          team1forovers,
          team1againstrun + ans2,
          team1againstover
        );
       
        console.log(
          `They need to restrist ${OppostionTeam} from 0 to ${ans2} in ${Overs} overs to get at ${DesiredPostion}`
        );
        console.log(
          `Your Revised netrunrate will be from ${nrrlower.toFixed(3)} to ${nrrupper.toFixed(3)}`
        );
        return;
      }
    }
  }

  if (!teamInfo1 || !teamInfo2) {
    console.log("Invalid team name(s) entered.");
    return;
  }
  if (teamInfo1.position <= DesiredPostion) {
    console.log("You are already above or on the desired position");
  } else {
    if(teamInfo2.points < points)
        {
          console.log(`You just have to win this match to be at ${DesiredPostion} postion`)
          return;
        }
    //When Our opponent is at desired postion 
    const team1forrun = teamInfo1.forRuns + RunScored;
    const team1forovers = teamInfo1.forOvers + Overs;
    const team1againstrun = teamInfo1.againstRuns;
    const team1againstover = teamInfo1.againstOvers + Overs;
    const team2forrun = teamInfo2.forRuns;
    const team2forovers = teamInfo2.forOvers + Overs;
    const team2againstrun = teamInfo2.againstRuns + RunScored;
    const team2againstover = teamInfo2.againstOvers + Overs;
    let s = 0;
    let e = RunScored;
    let ans2;
    //We try to find the upper limit of the runs which when conceded we get more NRR then our opponent 
    while (s <= e) {
      let mid = Math.floor((s + e) / 2);
      let val = calaclautenrr(
        mid,
        team1forrun,
        team1forovers,
        team1againstrun,
        team1againstover,
        team2forrun,
        team2forovers,
        team2againstrun,
        team2againstover
      );
      if (val > 0) {
        ans2 = mid;
        s = mid + 1;
      } else {
        e = mid - 1;
      }
    }
    if (ans2) {
      const nrrupper = calaclautenrr3(
        team1forrun,
        team1forovers,
        team1againstrun + 0,
        team1againstover
      );
      const nrrlower = calaclautenrr3(
        team1forrun,
        team1forovers,
        team1againstrun + ans2,
        team1againstover
      );
      console.log(
        `They need to restrist ${OppostionTeam} from 0 to ${ans2} in ${Overs} overs to get at ${DesiredPostion}`
      );
      console.log(
        `Your Revised netrunrate will be from${nrrlower.toFixed(3)} to ${nrrupper.toFixed(3)}`
      );
      return;
    } else {
      console.log(
        `It is currently not possible for your team to reach ${DesiredPostion} postion`
      );
      return;
    }
  }
}
/*
Below are the function which are used for comaprring and calaclating NRR 
*/
function calaclautenrr3(Team1forrun, Team1forover, Team1againstrun, Team1againstover) {
  let made = Team1forrun / Team1forover;
  let against = Team1againstrun / Team1againstover;
  return made - against;
}
function calaclautenrr(mid, Team1forrun, Team1forover, Team1againstrun, Team1againstover, Team2forrun, Team2forover, Team2againstrun, Team2againstover) {
  const nrr1 = Team1forrun / Team1forover - (Team1againstrun + mid) / Team1againstover;
  const nrr2 = (Team2forrun+ mid) / Team2forover - Team2againstrun / Team2againstover;
  return nrr1 - nrr2;
}
function calaclautenrr2(mid, Team1forrun, Team1forover, Team1againstrun, Team1againstover, Team2nrr) {
  let nrr = Team1forrun / Team1forover - (Team1againstrun + mid) / Team1againstover;
  return nrr > Team2nrr;
}
