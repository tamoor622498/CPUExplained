// Tamoor H
// An interactive web cpu.

//Keeps the CPU registers, facilitates read and write.
class Register_File {
    constructor() {
        this.reg0 = 0x00; //Internal registers
        this.reg1 = 0x00;
        this.reg2 = 0x00;
        this.reg3 = 0x00;
    }

    access(wr_address = 0b00, write_data = 0b00000000, write_enable = false, rda_address = 0b00, rdb_address = 0b00) {
        if (write_enable) {
            switch (wr_address) { //If write_enable is true, data is written is to reg based on wr_address
                case 0b00:
                    this.reg0 = write_data;
                    break;
                case 0b01:
                    this.reg1 = write_data;
                    break;
                case 0b10:
                    this.reg2 = write_data;
                    break;
                case 0b11:
                    this.reg3 = write_data;
                    break;
                default:
                    console.log("INVALID REGISTER ADDRESS");
            }
        }

        let toReturn = {}; //Object with data.

        switch (rda_address) { //Adds reg rda data to JSON
            case 0b00:
                toReturn["A"] = this.reg0;
                break;
            case 0b01:
                toReturn["A"] = this.reg1;
                break;
            case 0b10:
                toReturn["A"] = this.reg2;
                break;
            case 0b11:
                toReturn["A"] = this.reg3;
                break;
            default:
                console.log("INVALID RDA ADDRESS");
        }

        switch (rdb_address) { //Adds reg rdb data to JSON
            case 0b00:
                toReturn["B"] = this.reg0;
                break;
            case 0b01:
                toReturn["B"] = this.reg1;
                break;
            case 0b10:
                toReturn["B"] = this.reg2;
                break;
            case 0b11:
                toReturn["B"] = this.reg3;
                break;
            default:
                console.log("INVALID RDB ADDRESS");
        }

        return toReturn;
    }
}

//Arithmetic operations.
class ALU {
    constructor() {
        this.carry = 0;
        this.zero = 0;
        this.negative = 0;
    }

    access(opcode = 0b00000000, A = 0b00000000, B = 0b00000000) {
        let output = {};
        let msb = 0;
        let As = 0;
        let Bs = 0;
        let R = 0;
        let Rs = 0;
        switch (true) {//Switch statements compare this value with cases.
            //AND Instruction
            case (opcode & 0b11110000) === 0b00000000 : //Important part of opcode gotten from bit masking.
                output["result"] = A & B;
                break;
            //OR Instruction
            case (opcode & 0b11110000) === 0b00010000 :
                output["result"] = A | B;
                break;
            //XOR Instruction
            case (opcode & 0b11110000) === 0b00100000 :
                output["result"] = A ^ B;
                break;
            //NEG Instruction
            case (opcode & 0b11110011) === 0b00110000 :
                output["result"] = (~A + 1) & 0xFF;
                break;
            //ADD Instruction
            case (opcode & 0b11110000) === 0b01000000 :
                R = (A + B) & 0xFF;
                As = A.toString(2);//Convert to string
                Bs = B.toString(2);
                Rs = R.toString(2);
                this.carry = (parseInt(As[7]) & parseInt(Bs[7])) | (parseInt(As[7]) & -parseInt(Rs[7])) | (parseInt(Bs[7]) & -parseInt(Rs[7]));//Carry equation from AVR Instruction Set
                output["result"] = R;
                break;
            //ADD with carry Instruction
            case (opcode & 0b11110000) === 0b01010000 :
                R = (A + B + this.carry) & 0xFF;
                As = A.toString(2);//Convert to string
                Bs = B.toString(2);
                Rs = R.toString(2);
                this.carry = (parseInt(As[7]) & parseInt(Bs[7])) | (parseInt(As[7]) & -parseInt(Rs[7])) | (parseInt(Bs[7]) & -parseInt(Rs[7]));//Carry equation from AVR Instruction Set
                output["result"] = R;
                break;
            //SUB Instruction
            case (opcode & 0b11110000) === 0b01100000 :
                R = (A - B) & 0xFF;
                As = A.toString(2);//Convert to string
                Bs = B.toString(2);
                Rs = R.toString(2);
                this.carry = (-parseInt(As[7]) & parseInt(Bs[7])) | (parseInt(Bs[7]) & parseInt(Rs[7])) | (parseInt(Rs[7]) & -parseInt(As[7]));//Carry equation from AVR Instruction Set
                output["result"] = R;
                break;
            //SUB with carry Instruction
            case (opcode & 0b11110000) === 0b01110000 :
                R = (A - B - this.carry) & 0xFF;
                As = A.toString(2);//Convert to string
                Bs = B.toString(2);
                Rs = R.toString(2);
                this.carry = (-parseInt(As[7]) & parseInt(Bs[7])) | (parseInt(Bs[7]) & parseInt(Rs[7])) | (parseInt(Rs[7]) & -parseInt(As[7]));//Carry equation from AVR Instruction Set
                output["result"] = R;
                break;
            //Logical Shift Left Instruction
            case (opcode & 0b11110011) === 0b10000000 :
                this.carry = (A & 0x80) >> 7;
                output["result"] = (A << 1) & 0xFF;
                break;
            //Arithmetic Shift Right Instruction
            case (opcode & 0b11110011) === 0b10000001 :
                msb = A & 0x80; //Saves the Most Significant Bit.
                output["result"] = (A >> 1) | msb; //Shifts A right and inserts the saved MSB.
                break;
            //Rotate Left through carry Instruction
            case (opcode & 0b11110011) === 0b10000010 :
                msb = (A & 0x80) >> 7; //Saves the Most Significant Bit.
                output["result"] = (((A << 1) | this.carry) & 0xFF) | msb; //Shifts A right and inserts the saved MSB.
                this.carry = msb;
                break;
            //Rotate Right through carry Instruction
            case (opcode & 0b11110011) === 0b10000011 :
                output["result"] = (((A >> 1) | this.carry << 7) & 0xFF); //Shifts A right and inserts the saved MSB.
                this.carry = (A & 0b00000001);
                break;
            default :
                console.log("INVALID OPCODE");
        }
        this.zero = output["result"] === 0x00 ? 1 : 0;
        this.negative = ((output["result"]).toString(2))[7];

        return output;
    }

}

//Facilitates branching instructions and Instruction Memory Increment.
class Program_Counter {
    constructor() {
        this.Counter = 0x00;
        this.Return_Address = 0x00;
    }

    access(INC = 0, JMP = 0, CALL = 0, RET = 0, address = 0b00000000) {
        if (INC) {
            this.Counter = this.Counter + 1; //Need greater than 255 guard?
        } else if (JMP) {
            this.Counter = address;
        } else if (CALL) { // Call then address to jump then the return address
            this.Return_Address = this.Counter + 1;
            this.Counter = address;
        } else if (RET) {
            this.Counter = this.Return_Address;
        }

        return this.Counter;
    }

}

//Holds program being executed.
class Instruction_Memory {
    constructor() {
        this.memory = [];
        for (let i = 0; i < 256; i++) {
            this.memory.push(0xFF);
        }
    }

    access(index = 0) {
        if ((index >= 0) && (index <= 255)) {
            return this.memory[index];
        } else {
            console.log("INVALID INDEX")
        }
    }
}


class CPU {
    constructor() {
        this.regA = 0xFF;
        this.regB = 0xFF;
        this.Reg_File = new Register_File();
        this.IM = new Instruction_Memory();
    }
}

function compiler(CPU, code) {
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
	console.log(labels);
    console.log(words);

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

        console.log(words[i][0] + " " + instruction[0].toString(2) + " " + instruction[1]);
    }

    return words;
}

document.getElementById("myBtn").onclick = function () {
    document.getElementById("textarea2").value = ""; //Textarea cleared
    let processor = new CPU();
    let code = document.getElementById("textarea").value;
    try {
        let text = compiler(processor, code);
    } catch (e) {
        document.getElementById("textarea2").value = e.message;
		console.log(e.stack);
    }


    // for (let j = 0; j < text.length; j++) {
    //     // if (words[j] !== "") {
    //     document.getElementById("textarea2").value += "> " + text[j] + "\n";
    //     //}
    //
    // }


}
