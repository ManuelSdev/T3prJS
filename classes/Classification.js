export default class Classification{
    constructor(teams=[],){
        this.teams=teams
        
        this.teamsGroups=this.setTeamsGroups(teams)
        //this.roundsOfMatches=this.createMatchesTableStructure(this.teamsGroups[0])
        //this.tableOfMatches =this.addTeamsGroupToStructure(this.roundsOfMatches)
        this.tablesOfMatches=this.createAllGroupTables(this.teamsGroups)
        //this.createTableOfMatchesPerGroup(this.teamsGroups[0])

    }
    //Método que recibe el array con el total de equipos,lo divide en cuatro arrays (uno por grupo) y guarda cada
    //uno de lo
    //El array "teams" que pasa como parámetro al constructror ya tiene 
    setTeamsGroups(teams){
        const groups=[]
        for(let i=0; i<4; i++){
            //groups[i]=[]
            groups[i]=teams.slice(i*4,i*4+4)
  
        }
        return groups
    }

    //Método que crea la estructura de tabla del algoritmo todos vs todos
    //La tabla es un array que guarda las rondas/rounds
    //Cada ronda es una array que guarda dos partidos
    //Cada partido es un array que guarda los dos equipos que se enfrentan como 'a' y 'b'
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


    addTeamsGroupToStructure2(table, teamsGroup){
        let team=0
        let lastTeam=3
        let decreaseTeam=2
        table.forEach(round => {
            for(let i=0; i<round.length; i++){
                if(i==0){
                    round[i]=[team,lastTeam]
                    if(team<lastTeam-1){
                        team++
                    }else{
                        team=0
                    }
                }else{    
                    round[i]=[team,decreaseTeam]
                    decreaseTeam--
                    if(team<lastTeam-1){
                        team++
                    }else{
                        team=0
                    }
                }
            } 
        })
            return table
    }
    //Método que aplica el algoritmo todos vs todos
    //


    addTeamsGroupToStructure(table, teamsGroup){
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

    
    addTeamsGroupToStructure3(table, teamsGroup){
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

    createAllGroupTables(teamsGroups){
        const allTables=[]
        for(let group of teamsGroups){
            console.log(this.createTableOfMatchesPerGroup(group))
            allTables.push(this.createTableOfMatchesPerGroup(group))
        }
        
        return allTables
    }

    print(){
       // console.log(this.roundsOfMatches)
       console.log(this.tableOfMatches)
        console.log('holaaa')
    }
}

