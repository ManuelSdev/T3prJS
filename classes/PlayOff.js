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

    /**
     *  Este método enfrenta a los equipos en mismo orden que aparecen en cada uno de los 2 arrays que componen una 
     *  tabla eliminatoria (octavos, cuartos, semifinal, etc) .Se enfrentaran 1ºvs2º, 3ºvs4, etc
     *  El método recibe una tabla elmininatoría (la primera que recibe será la tabla de octavos de final) y almacena
     * los resultados de esa eliminatoria en una estructura de arrays (resultadosTablaEliminatoriaActual)
     * igual a la de la propia tabla eliminatora . 
     * El ganador de cada partido pasa al array equivalente de la siguiente tabla eliminatoria (siguienteTablaEliminatoria)
     * ej: del array 0 de tabla de octavos al array 0 de tabla de cuartos) para que puedan volver a 
     * enfrentarse usando el mismo método de manera recursiva 
     */
    resolverTablaEliminatoria(tablaEliminatoria) {
        const resultadosTablaEliminatoriaActual = [[], []];
        const siguienteTablaEliminatoria = [[], []];
        tablaEliminatoria.forEach((group, groupNumber) => {
            let i = 0
            for (let team = 0; team < group.length; team = team + 2) {
                let nextTeam = team + 1;
                this.jugarPartido(siguienteTablaEliminatoria, resultadosTablaEliminatoriaActual, group[team], group[nextTeam], groupNumber)
                i++;
            }
            i = 0;
        })
        this.tablasEliminatorias.push(siguienteTablaEliminatoria)
        this.tablasResultados.push(resultadosTablaEliminatoriaActual)
        // Despues de la semifinal recuperamos a los equipos que han perdido y los cruzamos en un mismo array
        //para el tercer y cuarto puesto
        //Cruzamos a un mismo array los equipos que juegan la final
        //Así, seguimos manteniendo la estructura de una tabla eliminatoria cons dos array cuyos elementos son rivales
        //Y podemos seguir aplicando el método recursivamente para jugar el bronce y la final
        if (this.tablasEliminatorias.length == 4) {
            this.tablasEliminatorias[3][1].push(this.tablasEliminatorias[3][0][0])
            this.tablasEliminatorias[3][0].shift()
            this.tablasEliminatorias[3][0].push(this.partidoBronce[0])
            this.tablasEliminatorias[3][0].push(this.partidoBronce[1])
        }
        //Ejecuta el método recursivamente sobra la nueva eliminatoria generada 5 veces (la última juega la final)
        while (this.tablasEliminatorias.length < 5) {
            this.resolverTablaEliminatoria(siguienteTablaEliminatoria)
        }
    }

    //Recibe los dos arrays bidimensionales vacíos (siguienteTablaEliminatoria, resultadosTablaEliminatoriaActual)
    // generados en resolverTablaEliminatoria()
    //Recibe los dos primeros equipos de cada uno de los dos arrays que forman tabla eliminatoria actual que recibe el 
    //método resolverTablaEliminatoria()
    //arrayNumerInTable representa el indice de cada uno de los dos arrays que forman una tabla eliminatoria
    //El método genera los goles de cada equipo y guarda al ganador en la siguiente tabla eliminatoria
    //Tambien guarda los resultados de cada partido en una tabla de resultados con la misma estructura de arrays que 
    //las tablas eliminatorias
    jugarPartido(siguienteTablaEliminatoria, resultadosTablaEliminatoriaActual, teamA, teamB, arrayNumberInTable) {
        const homeGoals = generateGoals()
        const awayGoals = generateGoals()
        if (homeGoals == awayGoals) {
            this.jugarPartido(siguienteTablaEliminatoria, resultadosTablaEliminatoriaActual, teamA, teamB, arrayNumberInTable)
        } else if (homeGoals > awayGoals) {
            //Si es semifinal, guarda al perdedor en la tabla partidoBronce para cruzarlo despues con el otro perdedor de la semifinal
            if (this.tablasEliminatorias.length == 3) {
                this.partidoBronce.push(teamB)
            }
            siguienteTablaEliminatoria[arrayNumberInTable].push(teamA)
            resultadosTablaEliminatoriaActual[arrayNumberInTable].push(homeGoals)
            resultadosTablaEliminatoriaActual[arrayNumberInTable].push(awayGoals)
        } else if (homeGoals < awayGoals) {
            //Si es semifinal, guarda al perdedor en la tabla partidoBronce para cruzarlo despues con el otro perdedor de la semifinal
            if (this.tablasEliminatorias.length == 3) {
                this.partidoBronce.push(teamA)
            }
            siguienteTablaEliminatoria[arrayNumberInTable].push(teamB)
            resultadosTablaEliminatoriaActual[arrayNumberInTable].push(homeGoals)
            resultadosTablaEliminatoriaActual[arrayNumberInTable].push(awayGoals)
        }
    }
}

