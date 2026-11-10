# Program Simulator Rangkaian Digital: Half Adder dan Full Adder

def gerbang_and(a, b):
    return a & b

def gerbang_or(a, b):
    return a | b

def gerbang_xor(a, b):
    return a ^ b

def half_adder(a, b):
    # Sum = A XOR B, Carry = A AND B
    s = gerbang_xor(a, b)
    c = gerbang_and(a, b)
    return s, c

def full_adder(a, b, cin):
    # Full Adder tersusun dari 2 Half Adder + 1 Gerbang OR
    s1, c1 = half_adder(a, b)
    sum_out, c2 = half_adder(s1, cin)
    carry_out = gerbang_or(c1, c2)
    return sum_out, carry_out

print("=== SIMULASI FULL ADDER (RANGKAIAN PENJUMLAH 1-BIT) ===")
print("A | B | Cin | Sum | Carry_Out")
print("-" * 30)

# Menampilkan Tabel Kebenaran (Truth Table)
for a in [0, 1]:
    for b in [0, 1]:
        for cin in [0, 1]:
            s, cout = full_adder(a, b, cin)
            print(f"{a} | {b} |  {cin}  |  {s}  |     {cout}")