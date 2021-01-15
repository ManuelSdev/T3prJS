


import { teamList} from './teams.js' 
import {shuffle} from './utils.js'
import Classification from './classes/Classification.js'


const teams=pickTeams(teamList,64)
const configTeams =
    {
        matchesWon:0,
        matchesDrawn:0,
        matchesLost:0,
        goalsScored:0,
        goalsConceded:0
    }




//Método que recibe un array de equipos y un número de equipos a seleccionar
//Los equipos del array recibido se mezclan y la cantidad seleccionada de es copiada y devuelta en el array "picked"
//C
function pickTeams(teamList,number){
    const shuffled = shuffle(teamList)
    const picked=[]
    for(let i=0; i<number; i++){
        picked.push(shuffled[i])
    }
    return picked
}

//Método que añade a cada equipo los parámetros de configuración  definidos en "const configTeam"
function setupTeams(teams){
    teams.forEach(team =>{
        team=Object.assign(team, configTeams)
    })
}


setupTeams(teams)
console.table(teams, ['code', 'name'])
//console.log(teamList)

const pintado=[
    '-------             -------',
    '       | --------- |',
    '-------'
]
function pintar(array){
    array.forEach(elemento =>{
        console.log(elemento)
    })
}
pintar(pintado)

const classificationStage =new Classification (teams);
//classificationStage.print()