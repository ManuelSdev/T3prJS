import {generateGoals} from '../utils.js'

export const LOCAL_TEAM=0;
export const AWAY_TEAM=1;
export default class Classification{
    constructor(teams=[],){
        this.teams=teams
        
        this.teamsGroups=this.setTeamsGroups(teams)
        //this.roundsOfMatches=this.createMatchesTableStructure(this.teamsGroups[0])
        //this.tableOfMatches =this.addTeamsGroupToStructure(this.roundsOfMatches)
        this.tablesOfGroups=[]
        this.tablesOfResults=[]
        this.groupsNames=['A', 'B','C','D','E','F','G', 'H']
        this.summaries=[ [], [], [] ]
        //this.createTableOfMatchesPerGroup(this.teamsGroups[0])

    }
    //Método que recibe el array con el total de equipos,lo divide en cuatro arrays (uno por grupo) y guarda cada
    //uno de lo
    //El array "teams" que pasa como parámetro al constructror ya tiene 
    setTeamsGroups(teams){
        const groups=[]
        for(let i=0; i<8; i++){
            //groups[i]=[]
            groups[i]=teams.slice(i*4,i*4+4)
  
        }
        return groups
    }

    //Método que crea la estructura de tabla del algoritmo todos vs todos
    //La tabla es un array que guarda las rondas/rounds
    //Cada ronda es una array que guarda dos partidos
    //Cada partido es un array que guarda los dos equipos que se enfrentan como 'a' y 'b'
    //Posteriormente, cada grupo de equipos será asignado a una tabla distinta

    createTableStructure(group){
        const numberOfRounds=group.length-1
        const matchesPerRound=group.length/2
        const table=[]
        for(let i=0; i<numberOfRounds; i++){
            const round=[]
            for(let j=0; j<matchesPerRound; j++){
                const match=['a','b']
                round.push(match)
            }
            table.push(round)
        }
        return table
    }



    //Método que aplica el algoritmo todos vs todos
    //


    addTeamsGroupToStructure1(table, teamsGroup){
        let localTeam=0     //Contador que aumenta 
        const indexOfLastTeam = teamsGroup.length-1
        let awayTeam= indexOfLastTeam-1
        table.forEach(round => {
            for(let i=0; i<round.length; i++){
                if(i==0){
                    round[i]=[localTeam,indexOfLastTeam]
                    if(localTeam<indexOfLastTeam-1){
                        localTeam++
                    }else{
                        localTeam=0
                    }
                }else{    
                    round[i]=[localTeam,awayTeam]
                    awayTeam--
                    if(localTeam<indexOfLastTeam-1){
                        localTeam++
                    }else{
                        localTeam=0
                    }
                }
            } 
        })
            return table
    }

    addTeamsGroupToStructure2(table, teamsGroup){
        let localTeam=0     //Contador que aumenta 
        const indexOfLastTeam = teamsGroup.length-1
        let awayTeam= indexOfLastTeam-1
        table.forEach(round => {
            for(let i=0; i<round.length; i++){
                if(i==0){
                    round[i]=[teamsGroup[localTeam].name,teamsGroup[indexOfLastTeam].name]
                    if(localTeam<indexOfLastTeam-1){
                        localTeam++
                    }else{
                        localTeam=0
                    }
                }else{    
                    round[i]=[teamsGroup[localTeam].name,teamsGroup[awayTeam].name]
                    awayTeam--
                    if(localTeam<indexOfLastTeam-1){
                        localTeam++
                    }else{
                        localTeam=0
                    }
                }
            } 
        })
            return table
    }

    
    addTeamsGroupToStructure(table, teamsGroup){
        let localTeam=0     //Contador que aumenta 
        const indexOfLastTeam = teamsGroup.length-1
        let awayTeam= indexOfLastTeam-1
        table.forEach(round => {
            for(let i=0; i<round.length; i++){
                if(i==0){
                    round[i]=[teamsGroup[localTeam],teamsGroup[indexOfLastTeam]]
                    if(localTeam<indexOfLastTeam-1){
                        localTeam++
                    }else{
                        localTeam=0
                    }
                }else{    
                    round[i]=[teamsGroup[localTeam],teamsGroup[awayTeam]]
                    awayTeam--
                    if(localTeam<indexOfLastTeam-1){
                        localTeam++
                    }else{
                        localTeam=0
                    }
                }
            } 
        })
            return table
    }

    createTableOfMatchesPerGroup(anyGroup){
        const tableStructure = this.createTableStructure(anyGroup)
        return this.addTeamsGroupToStructure(tableStructure, anyGroup)
        //console.log(tableStructure)
    }

    createTablesOfGroups(teamsGroups){
        const allTables=[]
        for(let group of teamsGroups){
           // console.log(this.createTableOfMatchesPerGroup(group))
            allTables.push(this.createTableOfMatchesPerGroup(group))
        }
        
        this.tablesOfGroups= allTables
    }

  
    start(){
        this.createTablesOfGroups(this.teamsGroups)
        //Este método será llamado desde index.js para controlar 
        this.launchRounds()
    }
    //Método que accede al último array (match) que contiene los nombres de los equipos que se enfrentan
    //Llama al método playMatch() pasando un match como parámetro en cada iteración final
    //El resultado se guarda en un array
    //También copia en cada iteración la estructura del array que se está recorriendo en un nuevo array
    //Se creará un duplicado de cada uno de los 8 elementos de tablesOfGroups y serán añadidos a tablesOfResult
    //tablesOfResult tendrá la misma estructura que tableOfGroups, pero sus arrays finales almacenan el
    //resultado de cada partido en lugar de los objetos/equipos que se enfrentan en esos partidos
    //Tener dos estructuras identicas, una con equipos y otra con resultados, permitirá que sean 
    //Recorridas en paralelo, usando los mismos índices, cuando necesitemos conocer el resultado
    //de un partido concreto
    //Joder, qué maravilla
    //+++++++++++++++Añade lo que hace al clonar

    launchRounds(){
        for(let i in this.tablesOfGroups){
            const groupTable=this.tablesOfGroups[i]
            //Este array 
            const groupTableClone=[]
            for(let round=0; round<3; round++){
                 const roundClone=[]
                for(let match=0; match<2; match++){
                    const matchResult=this.playMatch(groupTable[round][match])
                    //this.tablesOfResults[i][round][match]=this.playMatch(group[round][match])
                    //console.log(this.tablesOfResults[i][round][match])
                    //console.log(group[round][match])
                    roundClone.push(matchResult)
                }
                groupTableClone.push(roundClone)
                //En este punto, los objetos equipo de teamsGroups[i] contienen las estadististicas (estado)
                //en la ronda actual nº "round"
                //Copiamos los objetos/equipos de teamsGroups[i] en esta ronda y los guardamos
                //En el array oneTeamGroupStateAtRound
                const oneTeamGroupStateAtRound=[]
                this.teamsGroups[i].forEach(team =>{
                    let stateOfOneTeam={}
                    stateOfOneTeam=Object.assign(stateOfOneTeam, team)
                    /*
                    stateOfOneTeam.name=team.name
                    stateOfOneTeam.points=team.points
                    stateOfOneTeam.matchesWon=team.matchesWon
                    stateOfOneTeam.matchesDrawn=team.matchesDrawn
                    stateOfOneTeam.matchesLost=team.matchesLost
                    stateOfOneTeam.goalsScored=team.goalsScored
                    stateOfOneTeam.goalsConceded=team.goalsConceded
                    stateOfOneTeam.position=team.position
                    */
                    //Añadimos propiedad goalsDiff
                    stateOfOneTeam.goalsDiff=team.goalsDiff
                    oneTeamGroupStateAtRound.push(stateOfOneTeam)
                })
                //Guardamos el grupo de objetos/equipos y lo añadimos al resumumen de la ronda correspondiente
                if(round==2){
                   // console.log('----------------------------------------')
                   // console.log(oneTeamGroupStateAtRound)
                    this.updatePositionsTeam(oneTeamGroupStateAtRound)
                }
                this.summaries[round].push(oneTeamGroupStateAtRound)


            }
            this.tablesOfResults.push(groupTableClone)
        }

    }

    playMatch(match){
        const homeGoals=generateGoals()
        const awayGoals= generateGoals()
        this.updateTeamStatistics(match[LOCAL_TEAM], match[AWAY_TEAM], homeGoals, awayGoals)
        this.updateTeamStatistics(match[AWAY_TEAM], match[LOCAL_TEAM], awayGoals, homeGoals )
        return [homeGoals, awayGoals]
 
    }
    updateTeamStatistics(team, opponent, goalsScored, goalsConceded){
        team.goalsScored+=goalsScored
        team.goalsConceded+=goalsConceded
        team.goalsDiff=team.goalsScored-team.goalsConceded
        
        //this.setProp(team, opponent)
       // console.log(team.opponent)

        if(goalsScored > goalsConceded){
            team.points+=3
            Object.defineProperty(team, `${opponent.name}`,{
                value: 1,
                writable: true,
                enumerable: true,
                configurable: true
            })
            team.matchesWon++
        }else if (goalsScored == goalsConceded){
            team.points+=1
            Object.defineProperty(team, `${opponent.name}`,{
                value: 0,
                writable: true,
                enumerable: true,
                configurable: true
            })
            team.matchesDrawn++     
        }else if(goalsScored < goalsConceded){
            Object.defineProperty(team, `${opponent.name}`,{
                value: 2,
                writable: true,
                enumerable: true,
                configurable: true
            })
           team.matchesLost++
        }
        //console.log(team)
    }
    updatePositionsGroup(group){
        group.forEach(team=>{
            this.updatePositionsTeam(team)
        })
        for(let i in groups){
            for(let j in groups[i]){
               // console.log(groups[i][j])
            }

        }

    }

    checkEntries(teamA, teamB){
        console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
        console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
        
        Object.entries(teamA).forEach(entries=>{
           // console.log( teamB)
            if(entries[0]==teamB.name && entries[1]==1){
                console.log('CASO 1++++++++++++++++++++++++++++++++++++++++++++++++',entries[0], teamB.name)
                teamA.position=3
                teamB.position=2
                
            }else if(entries[0]==teamB.name && entries[1]==2){
                console.log('CASO 2++++++++++++++++++++++++++++++++++++++++++++++++',entries[0], teamB.name)
                teamA.position=2
                teamB.position=3
            }else if(entries[0]==teamB.name && entries[1]==0){
                if(teamA.goalsDiff > teamB.goalsDiff){
                    teamA.position=3
                    teamB.position=2
                }else{
                    teamA.position=2
                    teamB.position=3
                }
            }
        })

    }

    updatePositionsTeam(teams){
        //console.log(teams)
        const maxPoints = Math.max(teams[0].points, teams[1].points, teams[2].points, teams[3].points)
        //console.log(maxPoints)
        const teamsUnderMaxPoints=[]
        const teamsHaveMaxPoints=[]
        teams.forEach(team => {
            if(team.points<maxPoints){
                teamsUnderMaxPoints.push(team)
            }else if(team.points==maxPoints){
                teamsHaveMaxPoints.push(team)
            }
        })
        //console.log(teamsHaveMaxPoints)
        if(teamsHaveMaxPoints.length == 1){
            teamsHaveMaxPoints[0].position=3
            //console.log( teamsHaveMaxPoints[0].position)
        }else{
            this.checkEntries(teamsHaveMaxPoints[0],teamsHaveMaxPoints[1] )
            //console.log( teamsHaveMaxPoints[0].position)
            //console.log( teamsHaveMaxPoints[1].position)
        }
        
        /*
        else if(teamsHaveMaxPoints[0].teamsHaveMaxPoints[1].name == 1){
            teamsHaveMaxPoints[0].position=3
            teamsHaveMaxPoints[1].position=2
        }else if(teamsHaveMaxPoints[0].teamsHaveMaxPoints[1].name == 2){
            teamsHaveMaxPoints[0].position=2
            teamsHaveMaxPoints[1].position=3
        }else if(teamsHaveMaxPoints[0].teamsHaveMaxPoints[1].name == 0){
            if(teamsHaveMaxPoints[0].goalsDiff > teamsHaveMaxPoints[1].goalsDiff){
                teamsHaveMaxPoints[0].position=3
                teamsHaveMaxPoints[1].position=2
            }else{
                teamsHaveMaxPoints[0].position=2
                teamsHaveMaxPoints[1].position=3
            }
        }
        
        function otherPositions(otherTeams){
            if(otherTeams[0].points == otherTeams[1].points == otherTeams[2].points){
                cons
                const maxPoints = Math.max(otherTeams[0].points, otherTeams[1].points, otherTeams[2].points)
                const teamsUnderMaxPoints=[]
                const teamsHaveMaxPoints=[]
                teams.forEach(team => {
                    if(team.points<maxPoints){
                        teamsUnderMaxPoints.push(team)
                    }else if(team.points<maxPoints){
                        teamsHaveMaxPoints.push(team)
                    }
                })
            }
        }
        */

    }

    
    updateTeamStatistics2(teamName, goalsScored, goalsConceded){

        this.findObjectTeamByName(teamName).goalsScored+=goalsScored
        this.findObjectTeamByName(teamName).goalsConceded+=goalsConceded
        if(goalsScored > goalsConceded){
            this.findObjectTeamByName(teamName).points+=3
            this.findObjectTeamByName(teamName).matchesWon++
        }else if (goalsScored == goalsConceded){
            this.findObjectTeamByName(teamName).points+=1
            this.findObjectTeamByName(teamName).matchesDrawn++     
        }else if(goalsScored < goalsConceded){
            this.findObjectTeamByName(teamName).matchesLost++
        }
    }

  

    findObjectTeamByName(name){
        let locatedTeam ={}
        this.teamsGroups.forEach(group =>{
            group.forEach(team =>{
                //console.log(team.name)
                if(team.name==name){
                    locatedTeam= team
                }
            })
        })
        //console.log('LOCATED', locatedTeam)
        return locatedTeam
    }
    
    print(){
       // console.log(this.roundsOfMatches)
       console.log(this.tableOfMatches)
        console.log('holaaa')
    }
}

