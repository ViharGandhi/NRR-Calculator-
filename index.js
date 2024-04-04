const prompt = require("prompt-sync")();
//The PointsTable of the match
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
//Getting Inputs of the match
const YourTeam = prompt("Enter Your Team name: ");
const OppostionTeam = prompt("Enter Oppostion Team name: ");
const demoteaminfo1= PointsTableMap.get(YourTeam)
const demoteaminfo2=PointsTableMap.get(OppostionTeam)
if(!demoteaminfo1 || !demoteaminfo2)
{
  console.log(`Invalid team(s) name`)
  return
}

let Overs = parseFloat(prompt("Enter how many overs match: "));
if(isNaN(Overs))
{
  console.log(`Invalid Input`)
  return;
}
let DesiredPostion = parseInt(
  prompt("Enter the desired position your team wants: ")

);
if(DesiredPostion < 1)
{
  console.log(`Invalid Postion`)
  return;
}
if(isNaN(DesiredPostion))
{
  console.log(`Invalid Input`)
  return;
}
const TossResult = prompt("Enter Toss Result (Batting/Bowling): ");
if (TossResult === "Batting") {
  const RunScored =
    parseInt(prompt("Enter the Runs Scored by your team: ")) - 1;
    if(isNaN(RunScored))
    {
      console.log(`Invalid`)
      return
    }
    //We retrive the information of the teams
  let teaminfo1 = PointsTableMap.get(YourTeam);
  let teaminfo2 = PointsTableMap.get(OppostionTeam);
  let team;

  let reqnrr;
  //This condtion is for checking the postion which 1 above the desired it works as the minimum if the range 
  if (DesiredPostion - 1 > 0) {
    for (const [key, value] of PointsTableMap) {
      if (value.position === DesiredPostion - 1) {
        reqnrr = value.nrr;
        team = key
      }
    }
  }
  //Here we check is the Opponent team same as that of the Desired Postion
  if (teaminfo2.position !== DesiredPostion) {
    for (const [key, value] of PointsTableMap) {
      if (value.position === DesiredPostion) {
        teaminfo2 = PointsTableMap.get(key);
      }
    }
    if(DesiredPostion >= teaminfo1.position)
    {
      console.log(`You are already higher than the desired postion `)
      return;
    }
    let Lowerval;
    if(team===OppostionTeam)
    {
      //By this we get the information of the team which will act as the lower constrain of our range
      let teaminfo3 = PointsTableMap.get(team)
      
      Lowerval = findingUpperlimit2(teaminfo1,teaminfo3,RunScored,Overs)
    }else{
      //Here if there is no Lower constrain meaning for desired postion like 1 we keep values as 1
      if(isNaN(reqnrr))
      {
        Lowerval = 1
      }else{
        Lowerval = Math.ceil(
          findinglowerlimit(teaminfo1, reqnrr, RunScored, Overs)
        );
      }
     
    }
     /*
     The below code we bascially retrive data and add the Runscored/Runchased
     for the bowling we convert it into the 1/6th part of it by getting the decimal value and dividing it by 6

     */
      let team1forrun = teaminfo1.forRuns + RunScored + 1;
      let tmp =
        ((teaminfo1.forOvers - Math.floor(teaminfo1.forOvers)).toFixed(1) * 10) / 6;
    
      let team1forovers = Math.floor(teaminfo1.forOvers) + tmp + Overs;
      let team1againstrun = teaminfo1.againstRuns;
      tmp =
        ((teaminfo1.againstOvers - Math.floor(teaminfo1.againstOvers)).toFixed(1) *
          10) /
        6;
      let team1againstover = Math.floor(teaminfo1.againstOvers) + tmp + Overs;
      /*
      For finding the upper limit we use Binary search s = 0 and e = RunScored we check NRR with mid as parameter 
      and adjust start and end accordingly and find the upper bound 
      */
      let s = 0;
      let e  = RunScored;
      let Higherval;
      while(s<=e)
      {
        let mid = Math.floor((s+e)/2);
        if(findUpperlimit2(mid,team1forrun,team1forovers,team1againstrun,team1againstover,teaminfo2.nrr))
        {
            Higherval = mid;
            s = mid+1;
        }else{
            e = mid-1;
        }
      }
      let uppperlimit = CalaculateNrrWhileRestricting(
        team1forrun,
        team1forovers,
        team1againstrun + Lowerval,
        team1againstover
      );
      let lowerlimit = CalaculateNrrWhileRestricting(
        team1forrun,
        team1forovers,
        team1againstrun + Higherval,
        team1againstover
      );
      console.log(
        `If ${YourTeam} score ${
          RunScored + 1
        } runs in ${Overs} overs, ${YourTeam} need to restrict ${OppostionTeam} between ${Lowerval} to ${Higherval} runs in ${Overs}.`
      );
      console.log(
        `Revised NRR of ${YourTeam} will be between ${lowerlimit.toFixed(
          3
        )} to ${uppperlimit.toFixed(3)}.`
      );

  } else {
    //This is section is for finding when opponent team is at Desired Postion
    //Other logic remains same
    let Lowerval;
    if(isNaN(reqnrr))
    {
      Lowerval = 1
    }else{
      Lowerval = Math.ceil(
        findinglowerlimit(teaminfo1, reqnrr, RunScored, Overs)
      );
    }
    
    let Higherval = findingUpperlimit(teaminfo1, teaminfo2, RunScored, Overs);
    let Team1forrun = teaminfo1.forRuns + RunScored + 1;
    let tmp =
      ((teaminfo1.forOvers - Math.floor(teaminfo1.forOvers)).toFixed(1) * 10) /
      6;

    let Team1Forover = Math.floor(teaminfo1.forOvers) + tmp + Overs;
    let Team1againstrun = teaminfo1.againstRuns;
    tmp =
      ((teaminfo1.againstOvers - Math.floor(teaminfo1.againstOvers)).toFixed(
        1
      ) *
        10) /
      6;
    let Team1againstover = Math.floor(teaminfo1.againstOvers) + tmp + Overs;
    let uppperlimit = CalaculateNrrWhileRestricting(
      Team1forrun,
      Team1Forover,
      Team1againstrun + Lowerval,
      Team1againstover
    );
    let lowerlimit = CalaculateNrrWhileRestricting(
      Team1forrun,
      Team1Forover,
      Team1againstrun + Higherval,
      Team1againstover
    );
    console.log(
      `If ${YourTeam} score ${
        RunScored + 1
      } runs in ${Overs} overs, ${YourTeam} need to restrict ${OppostionTeam} between ${Lowerval} to ${Higherval} runs in ${Overs}.`
    );
    console.log(
      `Revised NRR of ${YourTeam} will be between ${lowerlimit.toFixed(
        3
      )} to ${uppperlimit.toFixed(3)}.`
    );
  }
}else if(TossResult==="Bowling")
{
  
  //Similary everthing is doen for bowling 
  /*
   In bowling we again use binary search but first we get the initeger over and then we try  to calculate for each ball 
   in desire to find the upper bound or lowerbound
  */
    const RunsToChase = parseInt(prompt("Enter the Runs to chase: "));
    if(isNaN(RunsToChase))
    {
      console.log(`Invalid`)
    }
    let teaminfo1 = PointsTableMap.get(YourTeam);
    if(DesiredPostion >= teaminfo1.position)
  {
    console.log(`You are already higher than the desired postion `)
    return;
  }
    let teaminfo2 =  PointsTableMap.get(OppostionTeam);
    let team
    let reqnrr;
    if(DesiredPostion-1 > 0)
    {
        for(const[key,value] of PointsTableMap)
        {
          if(value.position===DesiredPostion-1)
          {
            team = key;
            reqnrr = value.nrr;
          }
        }
    }
    if(teaminfo2.position!==DesiredPostion)
    {
      for(const[key,value] of PointsTableMap)
      {
        if(value.position===DesiredPostion)
        {
          teaminfo2 = PointsTableMap.get(key)
        }
      }
      let highervalue;

      if(team===OppostionTeam)
      {
        let teaminfo3 = PointsTableMap.get(team);
        highervalue = UpperLimitcChaseInOvers(teaminfo1,teaminfo3,RunsToChase,Overs)
      }else{
        if(isNaN(reqnrr))
        {
          highervalue = 0.1
        }else{
          highervalue = UpperlimitChaseIn(teaminfo1,RunsToChase,reqnrr)
        }
        
      }
      let team1forrun = teaminfo1.forRuns + RunsToChase;
      let team1forover = teaminfo1.forOvers;
      let tmp =
      ((teaminfo1.forOvers - Math.floor(teaminfo1.forOvers)).toFixed(1) * 10) / 6;
      let modifiedteam1forover =  Math.floor(teaminfo1.forOvers) + tmp;
      let team1againstrun = teaminfo1.againstRuns+RunsToChase-1;
      tmp =
        ((teaminfo1.againstOvers - Math.floor(teaminfo1.againstOvers)).toFixed(1) *
          10) /
        6;
      let team1againstover = Math.floor(teaminfo1.againstOvers) + tmp + Overs;
      let lowervalue = LowerlimitChaseIn(teaminfo1,RunsToChase,Overs,teaminfo2.nrr)
      let upperlimitnrr = CalaculateNrrWhileOvers(team1forrun,team1forover+highervalue,team1againstrun,team1againstover)
      let lowerlimitnrr = CalaculateNrrWhileOvers(team1forrun,modifiedteam1forover+lowervalue,team1againstrun,team1againstover);
      console.log(` ${YourTeam} need to chase ${RunsToChase} between ${highervalue} and ${lowervalue} Overs.`)
      console.log(`Revised NRR for ${YourTeam} will be between ${lowerlimitnrr.toFixed(3)} to ${upperlimitnrr.toFixed(3)}.`)
    }else{
      let team1forrun = teaminfo1.forRuns + RunsToChase;
      let team1forover = teaminfo1.forOvers;
      let team1againstrun = teaminfo1.againstRuns+RunsToChase-1;
      tmp =
        ((teaminfo1.againstOvers - Math.floor(teaminfo1.againstOvers)).toFixed(1) *
          10) /
        6;
       
      let team1againstover = Math.floor(teaminfo1.againstOvers) + tmp + Overs;
      let highervalue;
      if(isNaN(reqnrr))
      {
        highervalue = 0.1
      }else{
        highervalue  = UpperlimitChaseIn(teaminfo1,RunsToChase,reqnrr)
      }
       
      let lowervalue = LowerlimitchaseinOvers(teaminfo1,teaminfo2,RunsToChase,Overs)
      let upperlimitnrr = CalaculateNrrWhileOvers(team1forrun,team1forover+highervalue,team1againstrun,team1againstover)
      let lowerlimitnrr = CalaculateNrrWhileOvers(team1forrun,team1forover+lowervalue,team1againstrun,team1againstover);
      console.log(` ${YourTeam} need to chase ${RunsToChase} between ${highervalue} and ${lowervalue} Overs.`)
      console.log(`Revised NRR for ${YourTeam} will be between ${lowerlimitnrr.toFixed(3)} to ${upperlimitnrr.toFixed(3)}.`)

    }
}else{
  console.log(`Invalid`)
}
/*
 Below all the function play a mjor role calaulating all NRR and everthing 
 So somefunction are appliying binary searched in desire to find lowe bound or upper bound
 Some function get the differecne of NRR of 2 teams it is verry important for determing if our NRR1 > NRR2
 Some are calaulation NRR in particular set of changes 

*/
function UpperLimitcChaseInOvers(teaminfo1,teaminfo2,RuntoChase,Overs)
{
  let team1forrun = teaminfo1.forRuns+RuntoChase
  
  let tmp =
    ((teaminfo1.forOvers - Math.floor(teaminfo1.forOvers)).toFixed(1) * 10) / 6;
  let team1forovers = Math.floor(teaminfo1.forOvers) + tmp;
  let team1againstrun = teaminfo1.againstRuns+RuntoChase-1;
  tmp =
    ((teaminfo1.againstOvers - Math.floor(teaminfo1.againstOvers)).toFixed(1) *
      10) /
    6;
   
  let team1againstover = Math.floor(teaminfo1.againstOvers) + tmp + Overs;
  let team2forrun = teaminfo2.forRuns+RuntoChase-1
   tmp =
    ((teaminfo2.forOvers - Math.floor(teaminfo2.forOvers)).toFixed(1) * 10) / 6;
  let team2forovers = Math.floor(teaminfo2.forOvers) + tmp + Overs;
  let team2againstrun = teaminfo2.againstRuns+RuntoChase;
  tmp =
    ((teaminfo2.againstOvers - Math.floor(teaminfo2.againstOvers)).toFixed(1) *
      10) /
    6;
   
  let team2againstover = Math.floor(teaminfo2.againstOvers) + tmp ;
  
  let s = 0;
  let e = Overs;
  let ans;
  while(s<=e)
  {
    let mid = Math.floor((s+e)/2);
    let val = CalaulateNrrWhileOvers2(mid,team1forrun,team1forovers,team1againstrun,team1againstover,team2forrun,team2forovers,team2againstrun,team2againstover)
    if(val<0){
      ans = mid;
      e = mid-1
    }else{
      s = mid+1
    }
  }
  // console.log(`Team2againstoveris ${team2againstover}`)
  if(ans==Overs)
  {
      return ans;
  }
   tmp = ans-1;
  let tmp2 = ans-1;
  let cnt = 1;
  let val = CalacNrrOver(tmp,team1forrun,team1forovers,team1againstrun,team1againstover,team2forrun,team2forovers,team2againstrun,team2againstover)
  if(val  < 0) return tmp;
  while(cnt<6)
  {
    tmp = tmp2+(cnt/6)
    
    val = CalacNrrOver(tmp,team1forrun,team1forovers,team1againstrun,team1againstover,team2forrun,team2forovers,team2againstrun,team2againstover)
    if(val < 0)
    {
      ans = tmp2+(cnt/10)
      return ans;
    }
    cnt++;
  }
  return ans;


}
function CalacNrrOver(tmp,team1forrun,team1forovers,team1againstrun,team1againstover,team2forrun,team2forovers,team2againstrun,team2againstover)
{


  team1forovers+=tmp
   let mid =
  ((team1forovers - Math.floor(team1forovers)).toFixed(1) * 10) / 6;
  team1forovers = Math.floor(team1forovers) + mid;
   mid =
  ((team2againstover - Math.floor(team2againstover)).toFixed(1) * 10) / 6;
  team2againstover = Math.floor(team2againstover) + mid;
  let nrr1 = (team1forrun/team1forovers)-(team1againstrun/team1againstover);
  let nrr2 = (team2forrun/team2forovers)-(team2againstrun/team2againstover);
  return nrr1-nrr2;
}
function LowerlimitchaseinOvers(teaminfo1,teaminfo2,RuntoChase,Overs)
{
  let team1forrun = teaminfo1.forRuns+RuntoChase
  
  let tmp =
    ((teaminfo1.forOvers - Math.floor(teaminfo1.forOvers)).toFixed(1) * 10) / 6;
  let team1forovers = Math.floor(teaminfo1.forOvers) + tmp;
  let team1againstrun = teaminfo1.againstRuns+RuntoChase-1;
  tmp =
    ((teaminfo1.againstOvers - Math.floor(teaminfo1.againstOvers)).toFixed(1) *
      10) /
    6;
   
  let team1againstover = Math.floor(teaminfo1.againstOvers) + tmp + Overs;
  let team2forrun = teaminfo2.forRuns+RuntoChase-1
   tmp =
    ((teaminfo2.forOvers - Math.floor(teaminfo2.forOvers)).toFixed(1) * 10) / 6;
  let team2forovers = Math.floor(teaminfo2.forOvers) + tmp + Overs;
  let team2againstrun = teaminfo2.againstRuns+RuntoChase;
  tmp =
    ((teaminfo2.againstOvers - Math.floor(teaminfo2.againstOvers)).toFixed(1) *
      10) /
    6;
   
  let team2againstover = Math.floor(teaminfo2.againstOvers) + tmp ;
  
  let s = 0;
  let e = Overs;
  let ans;
  while(s<=e)
  {
    let mid = Math.floor((s+e)/2);
    let val = CalaulateNrrWhileOvers2(mid,team1forrun,team1forovers,team1againstrun,team1againstover,team2forrun,team2forovers,team2againstrun,team2againstover)
    if(val>0){
      ans = mid;
      s = mid+1;
    }else{
      e = mid-1;
    }
  }
  if(ans==Overs)
  {
      return ans;

  }
  tmp  = ans;
  let tmp2 = ans;
  let cnt = 0;
  while(cnt<=6)
  {
    tmp = tmp2+(cnt/6);
    if(CalaulateNrrWhileOvers3(tmp,team1forrun,team1forovers,team1againstrun,team1againstover,team2forrun,team2forovers,team2againstrun,team2againstover)  > 0)
    {
      ans = ans + (cnt/10)
    }
    cnt++;
  }
  return ans;
 
}
function CalaulateNrrWhileOvers3(mid,team1forrun,team1forovers,team1againstrun,team1againstover,team2forrun,team2forovers,team2againstrun,team2againstover)
{
  team1forovers+=mid;
  team2againstover+=mid;
  let tmp =
  ((team1forovers - Math.floor(team1forovers)).toFixed(1) * 10) / 6;
  team1forovers = Math.floor(team1forovers) + tmp;
  tmp = ((team2againstover - Math.floor(team2againstover)).toFixed(1) * 10) / 6;
  team2againstover = Math.floor(team2againstover) + tmp;
  let nrr1 = (team1forrun/team1forovers)-(team1againstrun/team1againstover);
  let nrr2 = (team2forrun/team2forovers)-(team2againstrun/team2againstover);
  return nrr1-nrr2;
}
function CalaulateNrrWhileOvers2(mid,team1forrun,team1forovers,team1againstrun,team1againstover,team2forrun,team2forovers,team2againstrun,team2againstover)
{

  team1forovers+=mid;
  team2againstover+=mid;
  let nrr1 = (team1forrun/team1forovers)-(team1againstrun/team1againstover);
  let nrr2 = (team2forrun/team2forovers)-(team2againstrun/team2againstover);
  return nrr1-nrr2;
}
function CalaculateNrrWhileOvers(team1forrun,team1forover,team1againstrun,team1againstover)
{
  let tmp =
  ((team1forover - Math.floor(team1forover)).toFixed(1) * 10) / 6;
  team1forover = Math.floor(team1forover) + tmp;
  let made = team1forrun/team1forover
  let against = team1againstrun/team1againstover
  return made-against

}
function LowerlimitChaseIn(teaminfo1,RuntoChase,Overs,nrr)
{
  let team1forrun = teaminfo1.forRuns + RuntoChase;
  let tmp =
    ((teaminfo1.forOvers - Math.floor(teaminfo1.forOvers)).toFixed(1) * 10) / 6;
  let team1forovers = Math.floor(teaminfo1.forOvers) + tmp;
  let team1againstrun = teaminfo1.againstRuns+RuntoChase-1;
  tmp =
    ((teaminfo1.againstOvers - Math.floor(teaminfo1.againstOvers)).toFixed(1) *
      10) /
    6;
   
  let team1againstover = Math.floor(teaminfo1.againstOvers) + tmp + Overs;
  let s = 0;
  let e = Overs;
  let ans;
  while(s<=e)
  {
    let mid = Math.floor((s+e)/2)
    if(CalaculateNrrWhileChasein(mid,team1forrun,team1forovers,team1againstrun,team1againstover) > nrr)
    {
      ans = mid;
      s = mid+1;
    }else{
      e = mid-1;
    }
  }
  if(ans==Overs)
  {
    return ans;
  }
  tmp = ans;
  let tmp2 = ans;
  let cnt = 0;
  while(cnt<=6)
  {
     tmp = tmp2+(cnt/10);
      if(CalaculateNrrWhileChasein2(tmp,team1forrun,team1forovers,team1againstrun,team1againstover) > nrr)
      {
        
        ans = tmp
      }
      cnt++;
  }

  return ans;

}
function UpperlimitChaseIn(teaminfo1,RuntoChase,reqnrr)
{
  let team1forrun = teaminfo1.forRuns + RuntoChase;
  let tmp =
    ((teaminfo1.forOvers - Math.floor(teaminfo1.forOvers)).toFixed(1) * 10) / 6;
  let team1forovers = Math.floor(teaminfo1.forOvers) + tmp;
  let team1againstrun = teaminfo1.againstRuns+RuntoChase-1;
  tmp =
    ((teaminfo1.againstOvers - Math.floor(teaminfo1.againstOvers)).toFixed(1) *
      10) /
    6;
   
  let team1againstover = Math.floor(teaminfo1.againstOvers) + tmp + Overs;

  let against = team1againstrun/team1againstover
  let ans = Math.floor((team1forrun/(reqnrr+against))-team1forovers)
  tmp = ans;
  let tmp2 = ans
  let cnt = 0;
  while(cnt<=6)
  {
     tmp = tmp2+(cnt/6);
      if(CalaculateNrrWhileChasein(tmp,team1forrun,team1forovers,team1againstrun,team1againstover) < reqnrr)
      {
        ans = ans+(cnt/10)
        break;
      }
      cnt++;
  }
  return ans;

  
}
function CalaculateNrrWhileChasein2(tmp,team1forrun,team1forovers,team1againstrun,team1againstover)
{
  
  team1forovers+=tmp;
   mid =
  ((team1forovers - Math.floor(team1forovers)).toFixed(1) * 10) / 6;
 team1forovers = Math.floor(team1forovers) + mid;
  
  let made = team1forrun/team1forovers;
  let against = team1againstrun/team1againstover
  return made-against
}
function CalaculateNrrWhileChasein(tmp,team1forrun,team1forovers,team1againstrun,team1againstover)
{
  team1forovers+=tmp;
  let made = team1forrun/team1forovers;
  let against = team1againstrun/team1againstover
  return made-against
}
function findUpperlimit2(mid, Team1forrun, Team1forover, Team1againstrun, Team1againstover, Team2nrr) {
    let nrr = Team1forrun / Team1forover - (Team1againstrun + mid) / Team1againstover;
    return nrr > Team2nrr;
}
function CalaculateNrrWhileRestricting(
  Team1forrun,
  Team1forover,
  Team1againstrun,
  Team1againstover
) {
  let made = Team1forrun / Team1forover;
  let against = Team1againstrun / Team1againstover;
  return made - against;
}
function findingUpperlimit(teaminfo1, teaminfo2, RunScored, Overs) {
  let team1forrun = teaminfo1.forRuns + RunScored + 1;
  let tmp =
    ((teaminfo1.forOvers - Math.floor(teaminfo1.forOvers)).toFixed(1) * 10) / 6;

  let team1forovers = Math.floor(teaminfo1.forOvers) + tmp + Overs;
  let team1againstrun = teaminfo1.againstRuns;
  tmp =
    ((teaminfo1.againstOvers - Math.floor(teaminfo1.againstOvers)).toFixed(1) *
      10) /
    6;
  let team1againstover = Math.floor(teaminfo1.againstOvers) + tmp + Overs;

  let team2forrun = teaminfo2.forRuns;
  tmp =
    ((teaminfo2.forOvers - Math.floor(teaminfo2.forOvers)).toFixed(1) * 10) / 6;
  let team2forovers = Math.floor(teaminfo2.forOvers) + tmp + Overs;
  let team2againstrun = teaminfo2.againstRuns + RunScored + 1;
  tmp =
    ((teaminfo2.againstOvers - Math.floor(teaminfo2.againstOvers)).toFixed(1) *
      10) /
    6;
  let team2againstover = Math.floor(teaminfo2.againstOvers) + tmp + Overs;
  let s = 0;
  let e = RunScored;
  let ans;
  while (s <= e) {
    let mid = Math.floor((s + e) / 2);
    let val = Comaprenrr(
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
      ans = mid;
      s = mid + 1;
    } else {
      e = mid - 1;
    }
  }
  return ans;
}
function findingUpperlimit2(teaminfo1, teaminfo2, RunScored, Overs) {
  let team1forrun = teaminfo1.forRuns + RunScored + 1;
  let tmp =
    ((teaminfo1.forOvers - Math.floor(teaminfo1.forOvers)).toFixed(1) * 10) / 6;

  let team1forovers = Math.floor(teaminfo1.forOvers) + tmp + Overs;
  let team1againstrun = teaminfo1.againstRuns;
  tmp =
    ((teaminfo1.againstOvers - Math.floor(teaminfo1.againstOvers)).toFixed(1) *
      10) /
    6;
  let team1againstover = Math.floor(teaminfo1.againstOvers) + tmp + Overs;

  let team2forrun = teaminfo2.forRuns;
  tmp =
    ((teaminfo2.forOvers - Math.floor(teaminfo2.forOvers)).toFixed(1) * 10) / 6;
  let team2forovers = Math.floor(teaminfo2.forOvers) + tmp + Overs;
  let team2againstrun = teaminfo2.againstRuns + RunScored + 1;
  tmp =
    ((teaminfo2.againstOvers - Math.floor(teaminfo2.againstOvers)).toFixed(1) *
      10) /
    6;
  let team2againstover = Math.floor(teaminfo2.againstOvers) + tmp + Overs;
  let s = 0;
  let e = RunScored;
  let ans;
  while (s <= e) {
    let mid = Math.floor((s + e) / 2);
    let val = Comaprenrr(
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
    if (val < 0) {
      
      ans = mid;
      e = mid-1
    } else {
      s = mid+1
    }
  }
  return ans;
}
function Comaprenrr(
  mid,
  Team1forrun,
  Team1forover,
  Team1againstrun,
  Team1againstover,
  Team2forrun,
  Team2forover,
  Team2againstrun,
  Team2againstover
) {
  const nrr1 =
    (Team1forrun / Team1forover) - ((Team1againstrun + mid) / Team1againstover);
  const nrr2 =
    ((Team2forrun + mid) / Team2forover) - (Team2againstrun / Team2againstover);
  return nrr1 - nrr2;
}
function findinglowerlimit(teaminfo1, reqnrr, RunScored, Overs) {
  let team1forrun = teaminfo1.forRuns + RunScored + 1;
  let tmp =
    ((teaminfo1.forOvers - Math.floor(teaminfo1.forOvers)).toFixed(1) * 10) / 6;

  let team1forover = Math.floor(teaminfo1.forOvers) + tmp + Overs;
  let team1againstrun = teaminfo1.againstRuns;
  tmp =
    ((teaminfo1.againstOvers - Math.floor(teaminfo1.againstOvers)).toFixed(1) *
      10) /
    6;
  let team1againstover = Math.floor(teaminfo1.againstOvers) + tmp + Overs;
  reqnrr = reqnrr - 0.001;
  let made = team1forrun / team1forover;
  let ans = (made - reqnrr) * team1againstover - team1againstrun;
  return ans;
}
/*
The core thinking and logic off code we know when the oppostion team is at desired postion we know that
the My team and Oppostion Team Both's NRR will be affected in that case whe nwe apply binary search
we get the difference of both in case of having NRR more than that of oppostion team nrr1-nrr2 > 0 
and as we get one answer we try to find the extreme/Upper bound of it so we move our s to mid + 1

When Oppostion is not at desired Postion holds two condtion 
-> Oppostion is also not at DesiredPostion-1: If this is true then we easily calauclte by finding the value
such that DesiredPostionTeamNRR<MyteamNRR<TeamatDesiredpostion-1'sNRR
->Oppostion is at Desiredpostion-1-> As we know the Oppostions NRR will work as lower bound for our range 
and when the match is agaisnt that team we know it will affect both's nrr and hence we apply the Opposite logic of nrr1-nrr2 < 0 if hold true that's our lowerbound 

*/
