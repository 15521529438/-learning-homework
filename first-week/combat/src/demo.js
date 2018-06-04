//定义类
(function($) {      

	  	class Father {
			  constructor(id, x, y) {
			  	this.num = 0;
			  	this.id  = id;
			  	this.c(x, 'up');
			  	this.c(y, 'down');
			  }

			  getEle(i) {
			  	return document.getElementById(i);
			  }

			  toWrite (num) {
				this.getEle(this.id).innerHTML = num;
			  }

			nums(n){
				return n === 'up' ? this.num +=1 : (this.num === 0 ? 0 : this.num -=1);
			}

			  c (i, state) {
			  	this.getEle(i).onclick = () => {
			  		this.toWrite(this.nums(state));
			  	}
			  }
		}

		class Childer extends Father {
			constructor(id,x,y) {
			    super(id,x,y); 
			  }
		}

	 $.fn.praise = function(x,y,z,x1,y1,z1) {   
			new Father(x,y,z);
			new Childer(x1,y1,z1);
	 }
			// new Father('f-num','f-up','f-down');
			// new Childer('c-num','c-up','c-down');
})(jQuery);  

