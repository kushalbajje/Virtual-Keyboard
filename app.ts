interface IButton {
    id: number;
    row: number;
    text: string;
}

class Button {
    id: number;
    row: number;
    text: string;

    constructor(id: number, row: number, text: string) {
        this.id = id;
        this.row = row;
        this.text = text;
    }
}

class VirtualKeyboard {

    public alphabetKeys: Array<number> = [];
    public buttons: IButton[] = [];
    public keyboardKeys: Array<number> = [];
    public numberKeys: Array<number> = [];
    public specialCharacters: Array<number> = [];

    // html elements to modify html content
    public keyboardLayout: HTMLElement = null;
    public firstRowLayout: HTMLElement = null;
    public secondRowLayout: HTMLElement = null;
    public thirdRowLayout: HTMLElement = null;
    public fourthRowLayout: HTMLElement = null;
    public fifthRowLayout: HTMLElement = null;

    public rightFunctionalKeys: HTMLElement = null;
    public leftFunctionalKeys: HTMLElement = null;

    public isCapsLockOn: boolean;
    public isShiftOn: boolean;

    // members to access each row of keys
    public firstRowKeys: Array<number> = [];
    public secondRowKeys: Array<number> = [];
    public thirdRowKeys: Array<number> = [];
    public fourthRowKeys: Array<number> = [];
    public fifthRowKeys: Array<number> = [];

    // constants for function keys
    private backSpace: number = 500;
    private tab: number = 501;
    private capsLock: number = 502;
    private enter: number = 503;
    private shift: number = 504;
    private spacebar: number = 505;


    private primaryToSecondaryAsciiMap = {
        '96': '126',
        '49': '33',
        '50': '64',
        '51': '35',
        '52': '36',
        '53': '37',
        '54': '94',
        '55': '38',
        '56': '42',
        '57': '40',
        '48': '41',
        '45': '95',
        '61': '43',
        '91': '123',
        '93': '125',
        '92': '124',
        '59': '58',
        '39': '34',
        '44': '60',
        '46': '62',
        '47': '63',
    }

    /**
     * ascii values for special chars
     * !	33	exclamation mark
     * "	34	quotation mark
     * #	35	number sign
     * $	36	dollar sign
     * %	37	percent sign
     * &	38	ampersand
     * '	39	apostrophe
     * (	40	left parenthesis
     * )	41	right parenthesis
     * *	42	asterisk
     * +	43	plus sign
     * ,	44	comma
     * -	45	hyphen
     * .	46	period
     * /	47	slash
     * :	58	colon
     * ;	59	semicolon
     * <	60	less-than
     * =	61	equals-to
     * >	62	greater-than
     * ?	63	question mark
     * @	64	at sign
     * [	91	left square bracket
     * \	92	backslash
     * ]	93	right square bracket
     * ^	94	caret
     * _	95	underscore
     * `	96	grave accent
     */

    constructor() {

        this.isCapsLockOn = false;
        this.isShiftOn = false;
        this.specialCharacters = [126, 33, 64, 35, 36, 37, 94, 38, 42, 40, 41, 95, 43];
        this.keyboardLayout = document?.getElementById('keyboard');
        this.firstRowLayout = document?.getElementById('first-row');
        this.secondRowLayout = document?.getElementById('second-row');
        this.thirdRowLayout = document?.getElementById('third-row');
        this.fourthRowLayout = document?.getElementById('fourth-row');
        this.fifthRowLayout = document?.getElementById('fifth-row');

        this.keyboardLayout.addEventListener('click', this.clickKeyboard.bind(this));
    }

    private generateMetadataForAlphabets() {
        for (let i = 97; i < 123; i++) {
            this.alphabetKeys.push(i);
        }
    }


    private generateMetadataForFirstRow() {
        // ASCII value for numbers range from 49 to 60
        this.numberKeys.push(96);
        for (let i = 49; i < 58; i++) {
            this.numberKeys.push(i);
        }
        this.numberKeys.push(48);
        this.numberKeys.push(45);
        this.numberKeys.push(61);
        this.numberKeys.push(500);
        this.firstRowKeys = this.numberKeys;
    }

    private generateMetadataForSecondRow() {
        this.secondRowKeys.push(501);
        for (let i = 0; i < 10; i++) {
            this.secondRowKeys.push(this.alphabetKeys[i]);
        }
        this.secondRowKeys.push(91);
        this.secondRowKeys.push(93);
        this.secondRowKeys.push(92);
    }

    private generateMetadataForThirdRow() {
        this.thirdRowKeys.push(502);
        for (let i = 10; i < 19; i++) {
            this.thirdRowKeys.push(this.alphabetKeys[i]);
        }
        this.thirdRowKeys.push(59);
        this.thirdRowKeys.push(39);
        this.thirdRowKeys.push(503);
    }

    private generateMetadataForFourthRow() {
        this.fourthRowKeys.push(504);
        for (let i = 19; i < 26; i++) {
            this.fourthRowKeys.push(this.alphabetKeys[i]);
        }
        this.fourthRowKeys.push(44);
        this.fourthRowKeys.push(46);
        this.fourthRowKeys.push(47);
        this.fourthRowKeys.push(504);
    }

    private generateMetadataForEachRow() {
        this.generateMetadataForAlphabets();
        this.generateMetadataForFirstRow();
        this.generateMetadataForSecondRow();
        this.generateMetadataForThirdRow();
        this.generateMetadataForFourthRow();
    }

    private createButtons() {

        this.initializeButtonsForEachRow(this.firstRowKeys, 1);
        this.initializeButtonsForEachRow(this.secondRowKeys, 2);
        this.initializeButtonsForEachRow(this.thirdRowKeys, 3);
        this.initializeButtonsForEachRow(this.fourthRowKeys, 4);

        this.buttons.push(new Button(this.spacebar, 5, String.fromCharCode(this.spacebar)));
    }
    private initializeButtonsForEachRow(currentRow: number[], rowIndex: number) {
        return currentRow.forEach((rowItem: number) => {
            this.buttons.push(new Button(rowItem, rowIndex, String.fromCharCode(rowItem)));
        })
    }

    private createKeyboard() {
        for (let i = 0; i < this.buttons.length; i++) {
            const key = document.createElement('div');
            const primaryKeyContent = document.createElement('span');
            key.id = `${this.buttons[i].id}`;
            primaryKeyContent.id = `${this.buttons[i].id}`;
            if (this.buttons[i].row == 1) {
                if (this.buttons[i].id === this.backSpace) {
                    key.className = 'keyLayout2 primaryKeyStyle car btn mx-1 d-grid';
                    primaryKeyContent.innerHTML = `Backspace`;
                } else {
                    key.className = 'keyLayout1 primaryKeyStyle car btn mx-1 d-grid';
                    primaryKeyContent.innerHTML = this.buttons[i].text;
                }
                key.append(primaryKeyContent);
                this.firstRowLayout.appendChild(key);
                this.keyboardLayout.appendChild(this.firstRowLayout);
            } else if (this.buttons[i].row == 2) {

                if (this.buttons[i].id === this.tab) {
                    key.className = 'keyLayout2 primaryKeyStyle car btn mx-1 text-center';
                    primaryKeyContent.innerHTML = `Tab`;
                } else {
                    key.className = 'keyLayout1 primaryKeyStyle car btn mx-1 text-center';
                    primaryKeyContent.innerHTML = this.buttons[i].text;
                }
                key.append(primaryKeyContent)
                this.secondRowLayout.appendChild(key);
                this.keyboardLayout.appendChild(this.secondRowLayout);
            } else if (this.buttons[i].row == 3) {

                if (this.buttons[i].id === this.capsLock || this.buttons[i].id === this.enter) {
                    key.className = 'keyLayout3 primaryKeyStyle car btn mx-1 text-center not-selected';
                    this.buttons[i].id === this.capsLock ? primaryKeyContent.innerHTML = `Caps Lock` : undefined;
                    this.buttons[i].id === this.enter ? primaryKeyContent.innerHTML = `Enter` : undefined;
                } else {
                    key.className = 'keyLayout1 primaryKeyStyle car btn mx-1 text-center';
                    primaryKeyContent.innerHTML = this.buttons[i].text;
                }
                key.append(primaryKeyContent)
                this.thirdRowLayout.appendChild(key);
                this.keyboardLayout.appendChild(this.thirdRowLayout);
            } else if (this.buttons[i].row == 4) {

                if (this.buttons[i].id === this.shift) {
                    key.className = 'keyLayout4 primaryKeyStyle car btn mx-1 text-center not-selected';
                    primaryKeyContent.innerHTML = `Shift`;
                } else {
                    key.className = 'keyLayout1 primaryKeyStyle car btn mx-1 text-center';
                    primaryKeyContent.innerHTML = this.buttons[i].text;
                }
                key.append(primaryKeyContent)
                this.fourthRowLayout.appendChild(key);
                this.keyboardLayout.appendChild(this.fourthRowLayout);
            } else if (this.buttons[i].row == 5) {

                key.className = 'keyLayout1 primaryKeyStyle car btn mx-auto w-50';
                primaryKeyContent.id = `${this.spacebar}`;
                primaryKeyContent.innerHTML = `Space`;
                key.append(primaryKeyContent)
                this.fifthRowLayout.appendChild(key);
                this.keyboardLayout.appendChild(this.fifthRowLayout);
            }
        }
    }

    private updateKeyboard(key: string) {
        switch (key) {
            case `${this.shift}`:
                this.isShiftOn = !this.isShiftOn;
                break;
            case `${this.capsLock}`: this.isCapsLockOn = !this.isCapsLockOn;
                break;
            default: break;
        }

        if (this.isCapsLockOn && !this.isShiftOn) {
            let capsLockKey = document.getElementById(`${this.capsLock}`);
            capsLockKey.className = 'keyLayout3 primaryKeyStyle car btn mx-1 text-center selected';
            this.toUpperCase();
        } else if (!this.isCapsLockOn && !this.isShiftOn) {
            let capsLockKey = document.getElementById(`${this.capsLock}`);
            capsLockKey.className = 'keyLayout3 primaryKeyStyle car btn mx-1 text-center not-selected';
            this.toLowerCase();
        } else if (this.isShiftOn && !this.isCapsLockOn) {
            this.toUpperCase();
        } else if (this.isCapsLockOn && this.isShiftOn) {
            this.toLowerCase();
        }

        if (this.isShiftOn) {
            // If shift is ON then updating the keys to show special characters 
            for (let i = 0; i < this.buttons.length; i++) {

                if (this.primaryToSecondaryAsciiMap[this.buttons[i].id]) {
                    let primaryKeyContent = document.getElementById(`${this.buttons[i].id}`);
                    primaryKeyContent.innerHTML = `${String.fromCharCode(Number(this.primaryToSecondaryAsciiMap[this.buttons[i].id]))}`;
                    primaryKeyContent.classList.add('primaryKeyStyle');
                }
            }
        } else if (!this.isShiftOn) {
            // If shift is OFF then updating the keys to normal keys (primary keys) 
            for (let i = 0; i < this.buttons.length; i++) {

                if (this.primaryToSecondaryAsciiMap[this.buttons[i].id]) {
                    let primaryKeyContent = document.getElementById(`${this.buttons[i].id}`);
                    primaryKeyContent.innerHTML = `${String.fromCharCode(this.buttons[i].id)}`;
                    primaryKeyContent.classList.add('primaryKeyStyle');
                }
            }

        }

        // This block shuffels the alphabet in the keyboard when an alphabet is pressed
        if (this.isAlphabetKeys(Number(key))) {
            this.shuffle(this.alphabetKeys);
        }
        
        for (let i = 97, j = 0; i < 123; i++, j++) {
            let characterKey = document.getElementById(`${i}`);
            characterKey.innerHTML = `${String.fromCharCode(this.alphabetKeys[j])}`;
            characterKey.classList.add('primaryKeyStyle');
        }

    }

    private clickKeyboard(event) {

        if (event && event.target) {
            const textArea = document.getElementById('output');
            if (this.isShiftOn && event.target.id != this.shift) {
                this.isShiftOn = !this.isShiftOn;
                this.toLowerCase();
            }

            if (
                // TODO: can rewrite it with string.classNames.contains()
                !(event.target.id == 'second-row' ||
                    event.target.id == 'first-row' ||
                    event.target.id == 'third-row' ||
                    event.target.id == 'fourth-row' ||
                    event.target.id == 'fifth-row' ||
                    event.target.id == '' ||
                    event.target.id == this.shift ||
                    event.target.id == 'keyboard' ||
                    event.target.id == this.capsLock)
            ) {
                if (event.target.id == this.spacebar) {
                    textArea.textContent += " ";
                } else if (event.target.id == this.backSpace) {
                    textArea.textContent = textArea.textContent.slice(0, textArea.textContent.length - 1);
                } else if (event.target.id == this.enter) {
                    textArea.innerHTML += "\n";
                } else if (event.target.id == this.tab) {
                    textArea.innerHTML += "    ";
                } else {
                    textArea.textContent += event.target.textContent;
                }
            }

            this.updateKeyboard(event.target.id);
        }
    }

    private shuffle(a: number[]) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        this.alphabetKeys = a;
    }

    private toUpperCase(): void {
        this.alphabetKeys = this.alphabetKeys.map((currentKey) => { return String.fromCharCode(currentKey).toUpperCase().charCodeAt(0) });
    }

    private toLowerCase(): void {
        this.alphabetKeys = this.alphabetKeys.map((currentKey) => { return String.fromCharCode(currentKey).toLowerCase().charCodeAt(0) });
    }

    private isAlphabetKeys(e: number): boolean {

        for (let i = 0; i < this.alphabetKeys.length; i++) {
            if (this.alphabetKeys[i] == e) {

                return true;
            }
        }

        return false;
    }

    public renderKeyBoard() {
        this.generateMetadataForEachRow();
        this.createButtons();
        this.createKeyboard();
    }
}

(() => {
    const sampleKeyboard = new VirtualKeyboard();
    sampleKeyboard.renderKeyBoard();
})();




