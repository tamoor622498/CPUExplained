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
        switch (true) {//Switch statements compare this value with cases.
            case (opcode & 0b11110000) === 0b00000000 :
                console.log("AND");
                break;
            case ((opcode & 0b11110000) === 0b00010000) :
                console.log("OR");
                break;
        }
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

t.access(0b00011110);
