import { teamList } from './teams.js'
import { shuffle } from './utils.js'
import Classification from './classes/Classification.js'
import PlayOff from './classes/PlayOff.js'

const teams = pickTeams(teamList, 64)
const configTeams =
{
    points: 0,
    matchesWon: 0,
    matchesDrawn: 0,
    matchesLost: 0,
    goalsScored: 0,
    goalsConceded: 0,
    position: 0
}

//Método que recibe un array de equipos y un número de equipos a seleccionar
//Los equipos del array recibido se mezclan y la cantidad seleccionada de es copiada y devuelta en el array "picked"
function pickTeams(teamList, number) {
    const shuffled = shuffle(teamList)
    const picked = []
    for (let i = 0; i < number; i++) {
        picked.push(shuffled[i])
    }
    return picked
}

//Método que añade a cada equipo los parámetros de configuración  definidos en "const configTeam"
function setupTeams(teams) {
    teams.forEach(team => {
        team = Object.assign(team, configTeams)
    })
}

setupTeams(teams)
//console.table(teams, ['code', 'name'])
const classificationStage = new Classification(teams);
classificationStage.start()
const groups = classificationStage.teamsGroups
const groupsNames = classificationStage.groupsNames
const tablesOfGroups = classificationStage.tablesOfGroups
const tablesOfResults = classificationStage.tablesOfResults

//tablesOfGroups contiene 8 arrays con las 8 tablas , una por grupo
//Cada tabla de grupo contiene 3 rondas
//Cada ronda contiene 2 partidos
//Cada partido contiene 2 objetos equipo
const printGroupsInfo = function () {
    console.log('Grupos y equipos \n================')
    for (let i in groups) {
        console.log(`Grupo ${groupsNames[i]} \n---------------`)
        groups[i].forEach(team => {
            console.log(team.name)
        })
        console.log('')
        //Cada elemento de tablesOfGroups es una tabla de grupo que contiene 3 rondas
        //Este bucle recorre las 3 rondas
        for (let j in tablesOfGroups[i]) {
            let roundNumber = parseInt(j) + parseInt(1)
            console.log(`Jornada ${(roundNumber)} \n---------------`)
            //Este recorre los 2 partidos que contiene cada ronda
            //En cada iteración tomamos los 2 equipos que se enfrentan para imprimirlos juntos
            for (let k in tablesOfGroups[i][j]) {
                const hometeam = tablesOfGroups[i][j][k][0].name
                const awayTeam = tablesOfGroups[i][j][k][1].name
                console.log(`${hometeam} VS ${awayTeam}`)
            }
            console.log('')
        }
    }
}
//TODO: empieza mundial
const startClassification = function () {
    //Cada tabla de grupo tiene 3 rondas/arrays
    for (let e = 0; e < 3; e++) {
        let roundNumber = parseInt(e) + parseInt(1)
        //Recorremos groupsNames que contiene 8 letras equipo para obtener la que corresponde a cada grupo
        //El mismo indice nos permite recorrer cada una las 8 tablas de grupo que componen tablesOfGroups
        for (let i in groups) {
            console.log(`Grupo ${groupsNames[i]} - Jornada ${roundNumber}`)
            console.log('-------------------')
            //Además de recorrer tablesOfGroups, recorremos a la vez tablesOfResults, que 
            //tiene la misma estructura  pero guarda los goles de cada equipo en lugar de los propios objetos/equipos
            //Cada elemento de tablesOfGroups/tablesOfResults es una tabla de grupo que contiene 3 rondas
            //Este bucle recorre los 2 partidos de la ronda e de la tabla de grupos i y de la tabla de resultados i
            //En cada iteración, tomamos los 2 equipos que se enfrentan para imprimirlos juntos
            for (let j in tablesOfGroups[i][e]) {
                const hometeam = tablesOfGroups[i][e][j][0].name
                const awayTeam = tablesOfGroups[i][e][j][1].name
                const homeGoals = tablesOfResults[i][e][j][0]
                const awayGoals = tablesOfResults[i][e][j][1]
                console.log(`${hometeam} ${homeGoals} - ${awayGoals} ${awayTeam}`)
            }
            //En cada jornada/ronda imprimimos el resumen de la ronda actual e del grupo actual i
            const sortedTeams = classificationStage.summaries[e][i].sort(function (a, b) {
                return b.position - a.position || b.points - a.points || b.goalsDiff - a.goalsDiff
            })
            console.table(sortedTeams, ['name', 'points', 'goalsScored', 'goalsConceded', 'goalsDiff', 'position'])
            console.log('')
        }
    }
}

const extraerYpintarDatosDePlayOff = function () {
    const tablasEliminatorias = playOffsStage.getTablas();
    const tablasResultados = playOffsStage.getResultados()
    console.log('==================================================\n====== COMIENZO DE LA FASE DE ELIMINATORIAS ======\n================================================== ')
    for (let e = 0; e < tablasEliminatorias.length - 1; e++) {
        if (e == 0) {
            console.log('\n===== OCTAVOS DE FINAL =====')
        }
        if (e == 1) {
            console.log('\n===== CUARTOS DE FINAL =====')
        }
        if (e == 2) {
            console.log('\n===== SEMIFINALES =====')
        }
        if (e == 3) {
            console.log('\n===== TERCER Y CUARTO PUESTO =====')
        }
        for (let i = 0; i < tablasEliminatorias[e].length; i++) {
            if (e == 3 && i == 1) {
                console.log('\n===== FINAL =====')
            }
            //Los arrays tablasEliminatorias y tablasResultados tienen la misma estructura y su orden
            //se corresponde a los  partidos y a los goles de cada equpipo
            //Recorremos ambos arrays a la vez, usando los mismos índices, para extraer y pintar los datos
            for (let a = 0; a < tablasEliminatorias[e][i].length; a = a + 2) {
                const hometeam = tablasEliminatorias[e][i][a]
                const awayTeam = tablasEliminatorias[e][i][a + 1]
                const homeGoals = tablasResultados[e][i][a]
                const awayGoals = tablasResultados[e][i][a + 1]
                console.log(`${hometeam} ${homeGoals} - ${awayGoals} ${awayTeam} => ${homeGoals > awayGoals ? hometeam : awayTeam}`)
                if (e == 3 && i == 1) {
                    console.log('\n================================')
                    console.log(`${homeGoals > awayGoals ? hometeam : awayTeam} campeón del mundo!!!`)
                    console.log('================================')
                }
            }
        }
    }
}


printGroupsInfo()
startClassification()
const playOffsStage = new PlayOff(classificationStage.summaries[2]);
extraerYpintarDatosDePlayOff()



