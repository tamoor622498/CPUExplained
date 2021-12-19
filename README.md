# CPUExplained
A basic 8-bit interactive CPU.


Introduction

In this project we created an emulated browser based CPU. The goal of the project was for the user to only need to enter an assembly program that would be compiled, run, and have it’s output displayed in the console with the number of cycles displayed. 
We first created an 8-bit RISC instruction set that would include logical, arithmetic, branching, console interaction, and memory access instructions. The 8-bit instruction set consists of assembly language instructions which handle the different operations of the CPUs. A front-end interface includes a programming space whose text is sent a compiler that translates the commands entered by the user to the 8-bit instructions executed by the CPU. We used the Harvard architecture model, with the instructions in a separate (isolated) memory space from the runtime-accessible memory. The principal functions are outlined in the flowchart in Figure 1. 

Figure 1. Flowchart of the Full Emulator

The CPU includes the ALU (arithmetic logical unit), register file, program counter, flags, instructions and data memory. 
Since this will function in the browser, we will use HTML, CSS, and JavaScript to emulate the CPU which will then be hosted on GitHub Pages for easy sharing. The logic of the program shall be implemented in the JavaScript code where each of the discrete components of the CPU will be defined. The visual aspects of the webpage will be written in a combination of HTML and CSS and shall update with the run of each new program.

Our results

	In order to get an approximate measure of performance, we wrote a program that incremented the equivalent of a 3-byte number until the total execution time was about 1 second. This was implemented by using memory for each byte, incrementing each as they reached 255. With this method, we found that our CPU ran at about 23 MHz, or 23 million instructions per second. Using the same method to get a range of potential clock rates, we found the lower end to be around 20MHz, and the higher end to be around 25MHz. The comparison between these clock ranges is shown in Figure 2.

Figure 2. Clock Rates of CPU’s

Conclusion

	The performance of our emulated CPU is comparable to that of the Intel i386 series, from the late 1980s. These CPUs ranged from 12MHz to 40MHz, at about 2-4 MIPS. Given this all runs in a browser, it’s much better than we had expected, though it is nowhere near the performance of modern processors. Any further development of this emulator would likely be in changing the instruction set, and potentially some modifications to the memory and register architecture.

Running the Emulated CPU

All of the files of code are hosted on GitHub. One of the reasons GitHub was chosen is because it easily stores and hosts your code. This means that all of the work is accessible through this link:
https://github.com/tamoor622498/CPUExplained. GitHub also runs and hosts the website for the Emulator through this link: https://tamoor622498.github.io/CPUExplained/. Once clicked, the user can either type their own code in the “Programming Area” or click one of the buttons for the example programs. After typing or selecting the code, the user would just click the run button and get the output.

References
[1] Y. Zhang and L. Bao, "The Design of an 8-Bit CISC CPU Based on FPGA," 2011 7th International Conference on Wireless Communications, Networking and Mobile Computing, 2011, pp. 1-4, doi: 10.1109/wicom.2011.6040633.
[2] S. SIMONAK and P. JAKUBCO, “Software based CPU emulation - aei.tuke.sk,” http://www.aei.tuke.sk/. [Online]. Available: http://www.aei.tuke.sk/papers/2008/4/08_Simonak.pdf. [Accessed: 15-Oct-2021]. 
[3] M. Isakov and M. Kinsy, “BRISC-V Emulator: A Standalone, Installation-Free, Browser-Based Teaching Tool,” https://arxiv.org/, 07-Dec-2018. [Online]. Available: https://arxiv.org/pdf/1812.04077.pdf. [Accessed: 19-Dec-2021]. 
