'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//定义类
(function ($) {
	var Father = function () {
		function Father(id, x, y) {
			_classCallCheck(this, Father);

			this.num = 0;
			this.id = id;
			this.c(x, 'up');
			this.c(y, 'down');
		}

		_createClass(Father, [{
			key: 'getEle',
			value: function getEle(i) {
				return document.getElementById(i);
			}
		}, {
			key: 'toWrite',
			value: function toWrite(num) {
				this.getEle(this.id).innerHTML = num;
			}
		}, {
			key: 'nums',
			value: function nums(n) {
				return n === 'up' ? this.num += 1 : this.num === 0 ? 0 : this.num -= 1;
			}
		}, {
			key: 'c',
			value: function c(i, state) {
				var _this = this;

				this.getEle(i).onclick = function () {
					_this.toWrite(_this.nums(state));
				};
			}
		}]);

		return Father;
	}();

	var Childer = function (_Father) {
		_inherits(Childer, _Father);

		function Childer(id, x, y) {
			_classCallCheck(this, Childer);

			return _possibleConstructorReturn(this, (Childer.__proto__ || Object.getPrototypeOf(Childer)).call(this, id, x, y));
		}

		return Childer;
	}(Father);

	$.fn.praise = function (x, y, z, x1, y1, z1) {
		new Father(x, y, z);
		new Childer(x1, y1, z1);
	};
	// new Father('f-num','f-up','f-down');
	// new Childer('c-num','c-up','c-down');
})(jQuery);