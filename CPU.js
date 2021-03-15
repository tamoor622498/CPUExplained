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

    access (wr_address = 0b00, write_data = 0b00000000, write_enable = false, rda_address = 0b00, rdb_address = 0b00) {
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

    access (opcode = 0b00000000, A = 0b00000000, B = 0b00000000) {
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
        }
        this.zero = output["result"] === 0x00 ? 1 : 0;
        this.negative = ((output["result"]).toString(2))[7];
    }
}

class CPU {
    constructor() {
        this.regA = 0xFF;
        this.regB = 0xFF;
        this.Reg_File = new Register_File();
        console.log(this.Reg_File.x);
    }
}

let t = new ALU();

let A = 0b1;

console.log("A:   " + (A << 7).toString(2));

t.access(0b00111100);


