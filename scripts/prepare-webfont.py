"""Normalize the bundled legacy font's metadata for browser OTS validation.
Glyph outlines are preserved; unused vertical metrics are omitted.
"""
from pathlib import Path
import struct

root = Path(__file__).resolve().parents[1]
source = root / 'public/assets/fonts/Alibaba-PuHuiTi-Regular.ttf'
output = source.with_name('Alibaba-PuHuiTi-Regular-Web.ttf')
raw = source.read_bytes()
count = struct.unpack_from('>H', raw, 4)[0]
tables = {}
for i in range(count):
    tag, _, offset, length = struct.unpack_from('>4sIII', raw, 12 + i * 16)
    if tag in (b'vhea', b'vmtx', b'DSIG'):
        continue
    data = bytearray(raw[offset:offset + length])
    if tag == b'OS/2' and struct.unpack_from('>H', data)[0] < 4:
        flags = struct.unpack_from('>H', data, 62)[0] & ~0x0300
        struct.pack_into('>H', data, 62, flags)
    if tag == b'gasp':
        struct.pack_into('>H', data, 0, 1)
    if tag == b'head':
        struct.pack_into('>I', data, 8, 0)
    tables[tag] = data

def checksum(data):
    padded = data + bytes((-len(data)) % 4)
    return sum(struct.unpack('>' + 'I' * (len(padded) // 4), padded)) & 0xffffffff

count = len(tables)
power = count.bit_length() - 1
header = bytearray(struct.pack('>IHHHH', 0x10000, count, (1 << power) * 16, power, count * 16 - (1 << power) * 16))
payload = bytearray()
offset = 12 + count * 16
head_offset = None
for tag, data in sorted(tables.items()):
    header.extend(struct.pack('>4sIII', tag, checksum(data), offset, len(data)))
    if tag == b'head':
        head_offset = offset
    payload.extend(data)
    payload.extend(bytes((-len(data)) % 4))
    offset = 12 + count * 16 + len(payload)
result = header + payload
struct.pack_into('>I', result, head_offset + 8, (0xB1B0AFBA - checksum(result)) & 0xffffffff)
output.write_bytes(result)
print(output.name, len(result))
