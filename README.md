This is a NRR calacluator which helps us determine that how much overs we should restrict a certain team to be a certain postion or in how many overs we should chase the target and what will be the revised NRR 
I have made the algorihtm by majorliy using Binary search algorithm and finding the upper limit/upper bound meaning the max we can go so that we can reach the ceratin postion 


The core thinking and logic off code we know when the oppostion team is at desired postion we know that
the My team and Oppostion Team Both's NRR will be affected in that case whe nwe apply binary search
we get the difference of both in case of having NRR more than that of oppostion team nrr1-nrr2 > 0 
and as we get one answer we try to find the extreme/Upper bound of it so we move our s to mid + 1

When Oppostion is not at desired Postion holds two condtion 
-> Oppostion is also not at DesiredPostion-1: If this is true then we easily calauclte by finding the value
such that DesiredPostionTeamNRR<MyteamNRR<TeamatDesiredpostion-1'sNRR
->Oppostion is at Desiredpostion-1-> As we know the Oppostions NRR will work as lower bound for our range 
and when the match is agaisnt that team we know it will affect both's nrr and hence we apply the Opposite logic of nrr1-nrr2 < 0 if hold true that's our lowerbound 
