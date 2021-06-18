import { generateGoals } from '../utils.js'

export const LOCAL_TEAM = 0;
export const AWAY_TEAM = 1;

export default class PlayOff {
    constructor(teamsGroups = []) {
        this.teamsGroups = teamsGroups
        //Este array contiene un array por cada eliminatoria: octavos, cuartos, semifinal, etc
        //Cada eliminatoria/array contiene dos arrays: los equipos de un array no pueden enfrentarse a los del otro array salvo en la final (requisito)
        this.tablasEliminatorias = [];
        this.tablasResultados = []
        this.partidoBronce = []
        this.crearPrimeraTablaEliminatoria()
        this.resolverTablaEliminatoria(this.tablasEliminatorias[0])

        //this.createMatches(this.tablaOctavos)
    }

    getTablas() {
        return this.tablasEliminatorias;
    }

    getResultados() {
        return this.tablasResultados
    }

    //
    /**
     *    Este metodo recorre teamsGroup (= tercera ronda/array de summaries), donde están las tablas de grupo que
     * almacenan a los equipos/objetos que tienen en sus propiedades los resultados finales de la clasificación.
     * Cada array de la tercera ronda contiene a los equipos de la fase clasificatoria ordenados
     * Ahora recorremos la tabla seleccionando a los dos primeros equipos de cada grupo y repartiendolos 
     * alternativamente entre los dos arrays del array primeraTabla. Los equipos de un array solo pueden enfrentarse entre ellos y solo
     * se cruzarán con los del otro array en la final y el tercer y cuarto puesto, cumpliendo así este requisito de la práctica.
     * Esta primeraTabla corresponderá a los octavos de final.
     */
    crearPrimeraTablaEliminatoria() {
        const primeraTabla = [[], []];
        for (let i = 0; i < this.teamsGroups.length; i++) {

            if (i == 0 || i % 2 == 0) {
                primeraTabla[0].push(this.teamsGroups[i][0].name)
                primeraTabla[1].push(this.teamsGroups[i][1].name)
            } else {

                primeraTabla[0].push(this.teamsGroups[i][1].name)
                primeraTabla[1].push(this.teamsGroups[i][0].name)
            }
        }
        this.tablasEliminatorias.push(primeraTabla)
    }
    //Este método enfrenta a los equipos en mismo orden que aparecen en cada uno de los 2 
    //arrays que componen una tabla eliminatoria (octavos, cuartos, semifinal, etc)
    //Se enfrentaran 1ºvs2º, 3ºvs4, etc
    //El ganador de cada partido pasa al array equivalente de la siguiente tabla 
    //(ej: del array 0 de tablaOctavos al array 0 de cuarto) para que puedan volver a enfrentarse usando el mismo método
    /**
     * Este método recibe una tabla elmininatoría (la primera que recibe será la tabla de octavos de final) y almacena
     * los resultados de esa eliminatoria en una estructura de arrays igual a la de la propia tabla eliminatora
     * 
     * 
     * 
     */
    resolverTablaEliminatoria(tablaEliminatoria) {
        const resultadosTablaEliminatoriaActual = [[], []];
        const siguienteTablaEliminatoria = [[], []];
        tablaEliminatoria.forEach((group, groupNumber) => {
            let i = 0
            for (let team = 0; team < group.length; team = team + 2) {
                let nextTeam = team + 1;
                console.log(`GRUPO ${groupNumber} - partido ${i + 1}`)
                console.log(`equipo 1 ${group[team]} - equipo 2 ${group[nextTeam]}`)
                this.jugarPartido(siguienteTablaEliminatoria, resultadosTablaEliminatoriaActual, group[team], group[nextTeam], groupNumber)
                i++;
            }
            i = 0;
        })
        console.log('LONGITUD TABLA ', this.tablasEliminatorias.length)
        this.tablasEliminatorias.push(siguienteTablaEliminatoria)
        this.tablasResultados.push(resultadosTablaEliminatoriaActual)
        console.log('LONGITUD TABLA ', this.tablasEliminatorias.length)
        if (this.tablasEliminatorias.length == 4) {
            console.log('PRUEBA 1 ', this.tablasEliminatorias[3])

            //this.tablasEliminatorias[3][0].push(this.tablasEliminatorias[3][1][0])

            this.tablasEliminatorias[3][1].push(this.tablasEliminatorias[3][0][0])
            this.tablasEliminatorias[3][0].shift()
            this.tablasEliminatorias[3][0].push(this.partidoBronce[0])
            this.tablasEliminatorias[3][0].push(this.partidoBronce[1])
            console.log('PRUEBA 2 ', this.tablasEliminatorias[3])
        }
        while (this.tablasEliminatorias.length < 5) {
            this.resolverTablaEliminatoria(siguienteTablaEliminatoria)
        }




    }

    jugarPartido(siguienteTablaEliminatoria, resultadosTablaEliminatoriaActual, teamA, teamB, arrayNumberInTable) {

        const homeGoals = generateGoals()
        const awayGoals = generateGoals()
        //console.log('GRUPO   ', arrayNumberInTable)
        //console.log('CHECK   ', this.tablaCuartos[arrayNumberInTable])
        if (homeGoals == awayGoals) {
            this.jugarPartido(siguienteTablaEliminatoria, resultadosTablaEliminatoriaActual, teamA, teamB, arrayNumberInTable)
        } else if (homeGoals > awayGoals) {
            if (this.tablasEliminatorias.length == 3) {
                this.partidoBronce.push(teamB)
                console.log('GANA ', teamA)
                console.log('BRONCE ', teamB)
            }
            siguienteTablaEliminatoria[arrayNumberInTable].push(teamA)
            resultadosTablaEliminatoriaActual[arrayNumberInTable].push(homeGoals)
            resultadosTablaEliminatoriaActual[arrayNumberInTable].push(awayGoals)


        } else if (homeGoals < awayGoals) {
            if (this.tablasEliminatorias.length == 3) {
                this.partidoBronce.push(teamA)
                console.log('GANA ', teamB)
                console.log('BRONCE ', teamA)
            }
            siguienteTablaEliminatoria[arrayNumberInTable].push(teamB)
            resultadosTablaEliminatoriaActual[arrayNumberInTable].push(homeGoals)
            resultadosTablaEliminatoriaActual[arrayNumberInTable].push(awayGoals)
        }

    }

    ay() {
        this.tablasEliminatorias.forEach(eliminatoria => {
            this.resolverTablaEliminatoria(eliminatoria)
            console.log(eliminatoria)
        })
    }
}

