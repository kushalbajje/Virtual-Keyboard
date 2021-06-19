var Buttons = /** @class */ (function () {
    function Buttons(val, pos) {
        this.value = val;
        this.position = pos;
    }
    return Buttons;
}());
var VirtualKeyboard = /** @class */ (function () {
    function VirtualKeyboard() {
        var _this = this;
        this.numberKeys = [];
        this.buttons = [];
        this.numberKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
        this.numberKeys.forEach(function (currentNumber, index) {
            _this.buttons[index] = new Buttons(currentNumber, index);
        });
    }
    VirtualKeyboard.prototype.createButtons = function () {
        var elm = document === null || document === void 0 ? void 0 : document.getElementById('numpad');
        elm.addEventListener('click', clickMe);
        console.log(elm);
        for (var i = 0; i < this.buttons.length; i++) {
            var newElement = document.createElement('div');
            var content = document.createElement('p');
            content.className = 'content';
            content.id = "" + this.buttons[i].position;
            content.innerHTML = "" + this.buttons[i].value;
            newElement.className = 'car col-3 btn m-1 text-center';
            newElement.appendChild(content);
            elm.appendChild(newElement);
        }
    };
    return VirtualKeyboard;
}());
function clickMe(event) {
    if (event.target.matches('p')) {
        document.getElementById('output').innerHTML = event.target.id;
        console.log(event.target.value);
    }
    console.log('************');
}
function renderKeyboard() {
}
var obj = new VirtualKeyboard();
obj.createButtons();
