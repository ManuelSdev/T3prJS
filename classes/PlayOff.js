import {generateGoals} from '../utils.js'

export const LOCAL_TEAM=0;
export const AWAY_TEAM=1;

export default class PlayOff{
    constructor(teamsGroups=[]){
        this.teamsGroups=teamsGroups
        this.tablaOctavos=[[], []]
        this.resultadosOctavos=[[], []] //Tendrá la misma estructura que la anterior pero, en lugar de los equipos, guarda sus goles
        this.tablaCuartos=[[],[]]
        this.arrangeClasificatedTeamsInTwoGroups(teamsGroups)
    }

    //Este metodo recorre la tercera ronda/array de summaries, donde están las tablas de grupo que
    // almacenan a los equipos/objetos que tienen en sus propiedades los resultados finales.
    //Cada array de la tercera ronda contiene a los equipos de la fase clasificatoria ordenados
    //Ahora recorremos la tabla seleccionando a los dos primeros equipos de cada grupo y repartiendolos 
    //alternativamente entre los dos arrays del array tablaOctavos
    //
    arrangeClasificatedTeamsInTwoGroups(lastSummaryRound){
        //console.log(lastSummaryRound)

        for(let i=0; i<lastSummaryRound.length; i++){
            
            if(i==0 || i%2==0){
                this.tablaOctavos[0].push(lastSummaryRound[i][0].name) 
                this.tablaOctavos[1].push(lastSummaryRound[i][1].name) 
            }else{

                this.tablaOctavos[0].push(lastSummaryRound[i][1].name) 
                this.tablaOctavos[1].push(lastSummaryRound[i][0].name) 
            }
        }
        console.log(this.tablaOctavos)
    }
    //Este método enfrenta a los equipos en mismo orden que aparecen en cada uno de los 2 
    //arrays que componen una tabla eliminatoria (octavos, cuartos, semifinal, etc)
    //Se enfrentaran 1ºvs2º, 3ºvs4, etc
    //El ganador de cada partido pasa al array equivalente de la siguiente tabla 
    //(ej: del array 0 de tablaOctavos al array 0 de cuarto) para que puedan volver a enfrentarse usando el mismo método
    createMatches(tabla){
        tabla.forEach(group=>{
            for(let team=0; team<group.length; team=team+2){
                let nextTeam=parseInt(i)+parseInt(1)
                this.playMatch(group[team], group(nextTeam))
            }
        })
 
    }

    playMatch(teamA, teamB){
        const homeGoals=generateGoals()
        const awayGoals= generateGoals()
        if(homeGoals==awayGoals){
            this.playMatch(teamA, teamB)
        }else if(homeGoals > awayGoals){
            
        }
        return [homeGoals, awayGoals]
 
    }

}




