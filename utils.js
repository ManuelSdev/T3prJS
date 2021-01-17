
//Método que mezcla elementos de un array
export const shuffle= function(array){
	var i = array.length;
	while (i)
	{
		var j = Math.floor(Math.random() * i);
		var t = array[--i];
		array[i] = array[j];
		array[j] = t;
	}
	return array;
}

//Método que genera goles aleatorios
export const generateGoals = function(){
    return Math.round(Math.random() * 10);
}