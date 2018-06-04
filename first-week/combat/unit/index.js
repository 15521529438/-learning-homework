num = 0;
window.nums = function(n){
	return n === 'up' ? num +=1 : (num === 0 ? 0 : num -=1);
}