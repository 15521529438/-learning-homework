// let xtag = require('x-tag');
import xtag from 'x-tag';
xtag.register('x-clock', {
    content:`<button type="button" class="btn btn-default btn-lg" aria-label="Left Align" id="f-up">
          <span class="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span>
        </button>`,
    lifecycle: {
        created: function() {
            this.num = 0;
            this.start();
        }
    },
    methods: {
        start: function() {
            this.nums();
            document.getElementById('f-num').innerHTML = this.num;
        },
        nums: function() {
           this.num += 1;
        },

        // start: function(){
        //   this.update();
        //   this.xtag.interval = setInterval(this.update.bind(this), 1000);
        // },
        // stop: function(){
        //   this.xtag.interval = clearInterval(this.xtag.interval);
        // },
        // update: function(){
        //   this.textContent = new Date().toLocaleTimeString();
        // }
    },
    events: {
        tap: function() {
            let self = this;
            _.throttle(function() {
                console.log(1101);
                self.start();
                $.ajax({
                    url: 'http://localhost/liksphp/mysql.php',
                    type: 'get',
                    dataType: 'json',
                    data: {
                        num: self.num
                    },
                    success: function(data) {
                        console.log(data)
                    },
                    error: function() {
                        console.log('提交失败')
                    }
                })
            }, 1000)
        }
    }
});

