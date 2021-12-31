export function sortArray (incomingArray, value, descending=false) {
	let i = descending ? -1 : 1;
	incomingArray.sort((a,b) => (a[value] > b[value]) ? 1*i : ((b[value] > a[value]) ? -1*i : 0));
	// console.log('incomingArray: ', incomingArray);
}