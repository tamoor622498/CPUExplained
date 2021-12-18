// An interactive web cpu.


class CPU {
    constructor() {
        this.regA = 0xFF;
        this.regB = 0xFF;
        this.Reg_File = [0,0,0,0];
        //this.IM = new Instruction_Memory();
        this.PC = 0;
        this.carry = 0;
        this.neg = 0;
        this.zero = 0;
        this.over = 0;
    }

    Control_Logic(opcodes){
        let done = false;
        while (!done) {
            let opcode = opcodes[this.PC];
            let Rd = (opcode[0] & 0b00001100) >> 2;
            let Rr = (opcode[0] & 0b00000011);
            switch(opcode[0]) {
                case (opcode[0] == 0b00000000):
                    done = true;
                default:
                    done = true;
            }
        }
    }

    ALU(opcode, Rd, Rr){
        //Flags reset
        this.carry = 0;
        this.neg = 0;
        this.zero = 0;
        this.over = 0;

        let res;

        //Operation
        switch(opcode) {
            case ((opcode[0] & 0b11110000) == 0b00010000): //AND
                res = this.Reg_File[Rd] & this.Reg_File[Rr];
            case ((opcode[0] & 0b11110000) == 0b00100000): //OR
                res = this.Reg_File[Rd] | this.Reg_File[Rr];
            case ((opcode[0] & 0b11110000) == 0b00110000): //XOR
                res = this.Reg_File[Rd] ^ this.Reg_File[Rr];
            case ((opcode[0] & 0b11110000) == 0b01000000): //ADD
                res = this.Reg_File[Rd] + this.Reg_File[Rr];
            case ((opcode[0] & 0b11110000) == 0b01010000): //SUB
                res = this.Reg_File[Rd] - this.Reg_File[Rr];
            case ((opcode[0] & 0b11110011) == 0b01100000): //SL
                res = this.Reg_File[Rd] >> opcode[1];
            case ((opcode[0] & 0b11110011) == 0b01100001): //SR
                res = this.Reg_File[Rd] << opcode[1];
            case ((opcode[0] & 0b11110011) == 0b01100010): //NEG
                res = ~this.Reg_File[Rd];
        }

        if (res = 0) {
            this.zero = 1;
        }
        if (((res).toString(2)).length >= 8){
            this.neg = 1;
        }
        if (res > 255){
            this.over = 1;
        }

    }
}

function compiler(code) {
    let Full_Text = ((code).replaceAll(/,/g, " ")).toUpperCase(); // Gets textarea value and comma to space and all uppercase
    let lines = Full_Text.split(/\r?\n/); // Splits to array based on new line


    let words = [];
	let labels = [];
	let bad_alphabet = /[^a-z0-9,:_ ]/gi; // Anything not alphanumeric + comma + colon + space
	let comment_char = '%';
    for (let i = 0; i < lines.length; i++) {
		// Remove tabs
		lines[i] = lines[i].replaceAll(/\t/g, "");

		// Allow comments, and skip  that line
		if(lines[i][0] == comment_char){
			continue;
		}

		// Check for bad chars, log error, then return null
		var bad_chars = lines[i].match(bad_alphabet);
		if(bad_chars){
			throw new Error("Invalid character '" + bad_chars[0] + "' on line " + (i+1));
		}

		// Remove excess whitespace, then split args
        let args = lines[i].replaceAll(/\s+/g,' ').split(" ");

		// Skip empty lines
		if(args.length == 0 || args[0] === ""){
			continue;
		}

		// Check if valid label
		var colon = args[0].match(/:/g);
		if(colon){
			if(colon.length > 1){
				throw new Error("Invalid label \"" + args[0] + "\" on line " + (i+1));
			}

			// Get label
			var label = args[0].split(':', 1)[0]
			if(label === ""){
				throw new Error("Invalid empty label on line " + (i+1));
			}

			// Add label location
			labels[label] = words.length;

			continue;
		}

		// Add instruction to list
		words.push(args)
    }

    //console.clear();
	//console.log(labels);
    //console.log(words);

	// Parse instruction list
    let opcodes = [];
    for (let i = 0; i < words.length; i++) {
        let instruction = [];

		// Set high 4 bits of instruction
        switch (words[i][0]) {
            case "BRK":
                instruction[0] = 0b0000;
                break;
            case "AND":
                instruction[0] = 0b0001;
                break;
            case "OR":
                instruction[0] = 0b0010;
                break;
            case "XOR":
                instruction[0] = 0b0011;
                break;
            case "ADD":
                instruction[0] = 0b0100;
                break;
            case "SUB":
                instruction[0] = 0b0101;
                break;
            case "SL":
            case "SR":
            case "NEG":
            case "LD":
                instruction[0] = 0b0110;
                break;
            case "RD":
                instruction[0] = 0b0111;
                break;
            case "JMP":
                instruction[0] = 0b1000;
                break;
            case "JPF":
                instruction[0] = 0b1001;
                break;
            case "CALL":
                instruction[0] = 0b1010;
                break;
            case "RET":
                instruction[0] = 0b1010;
                break;
            case "PRT":
                instruction[0] = 0b1010;
                break;
            case "BRQ":
                instruction[0] = 0b1011;
                break;
            case "BRG":
                instruction[0] = 0b1100;
                break;
            case "BRL":
                instruction[0] = 0b1101;
                break;
            case "SAV":
                instruction[0] = 0b1110;
                break;
            case "NOP":
                instruction[0] = 0b1111;
                break;
            
            default:
                throw new Error('Error on ' + (i+1) + ": " + words[i]);
        }

		// Parse first register argument, if necessary
        instruction[0] = instruction[0] << 2;
        switch (words[i][0]) {
            case "BRK":
            case "JMP":
            case "JPF":
            case "CALL":
            case "RET":
            case "NOP":
				instruction[0] = instruction[0] | 0b11;
				break;
            case "AND":
            case "OR":
            case "XOR":
            case "ADD":
            case "SUB":
            case "SL":
            case "SR":
            case "NEG":
            case "LD":
            case "RD":
            case "PRT":
            case "BRQ":
            case "BRG":
            case "BRL":
            case "SAV":
				// Check if enough arguments are present
				if(words[i].length < 2){
	                throw new Error("Missing argument on line " + (i+1) + ": " + words[i]);
				}

				// Parse register
				let rd = words[i][1].match(/^R([0-3])$/);
				if(!rd){
					throw new Error("Invalid register '" + words[i][1] + "' on line" + (i+1) + ": " + words[i]);
				}

				// Set register bits
				instruction[0] = instruction[0] | parseInt(rd[1]);
				break;
            default:
                throw new Error('Error on line ' + (i+1) + ": " + words[i]);
        }

		// Parse second argument, if necessary
        instruction[0] = instruction[0] << 2;
        switch (words[i][0]) {
            case "BRK":
			case "NEG":
			case "JMP":
			case "JPF":
			case "CALL":
			case "RET":
			case "NOP":
				break;
			case "PRT":
				if(words[i].length < 3){
	                throw new Error("Missing argument on line " + (i+1) + ": " + words[i]);
				}
				instruction[0] = instruction[0] | 0b10;

				instruction[1] = words[i][2][0]; // Only take single character for type argument
				break;
			case "SL":
			case "SR":
			case "LD":
				if(words[i].length < 3){
	                throw new Error("Missing argument on line " + (i+1) + ": " + words[i]);
				}

				instruction[1] = parseInt(words[i][2]);
				break;
            case "AND":
            case "OR":
            case "XOR":
            case "ADD":
            case "SUB":
            case "RD":
            case "BRQ":
            case "BRG":
            case "BRL":
            case "SAV":
				// Check if enough arguments are present
				if(words[i].length < 3){
	                throw new Error("Missing argument on line" + (i+1) + ": " + words[i]);
				}

				// Parse register
				let rr = words[i][2].match(/^R([0-3])$/);
				if(!rr){
					throw new Error("Invalid register '" + words[i][2] + "' on line" + (i+1) + ": " + words[i]);
				}

				// Set register bits
				instruction[0] = instruction[0] | parseInt(rr[1]);
				break;
            default:
                throw new Error('Error on line ' + (i+1) + ": " + words[i]);
        }

        switch (words[i][0]) {
            case "JMP":
            case "CALL":
                if (words[i][1] === undefined) {
                    throw new Error('Error on line ' + (i+1) + ": " + words[i]);
                }

				if(labels[words[i][1]] === undefined){
					throw new Error('Label "' + words[i][1] + '" on line ' + (i+1) + " not found.");
				}

                instruction[1] = labels[words[i][1]];
                break;
			case "BRQ":
			case "BRG":
			case "BRL":
                if (words[i][3] === undefined) {
                    throw new Error('Error on line ' + (i+1) + ": " + words[i]);
                }

				if(labels[words[i][3]] === undefined){
					throw new Error('Label "' + words[i][3] + '" on line ' + (i+1) + " not found.");
				}

                instruction[1] = labels[words[i][3]];
                break;
        }

        //console.log(words[i][0] + " " + instruction[0].toString(2) + " " + instruction[1]);
        opcodes.push(instruction);
    }

    return opcodes;
}

document.getElementById("myBtn").onclick = function () {
    document.getElementById("textarea2").value = ""; //Textarea cleared
    let processor = new CPU();
    let code = document.getElementById("textarea").value;
    try {
        let text = compiler(code);
        console.log(text);
        let test = 0b1000000;
        console.log(((test).toString(2)).length);
    } catch (e) {
        document.getElementById("textarea2").value = e.message;
		//console.log(e.stack);
    }


    // for (let j = 0; j < text.length; j++) {
    //     // if (words[j] !== "") {
    //     document.getElementById("textarea2").value += "> " + text[j] + "\n";
    //     //}
    //
    // }


}
