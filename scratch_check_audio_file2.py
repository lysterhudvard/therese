import urllib.request
import os

url = "https://uhdzswnawlqpsaajsjpo.supabase.co/storage/v1/object/public/portfolio/audio/therese-jarvheden-intervju-rollen-nora-beck-utan-uppsat-kristofer-hivju-x8ch.m4a"
output = "test_audio2.m4a"

print("Downloading audio file...")
urllib.request.urlretrieve(url, output)

size = os.path.getsize(output)
print(f"File downloaded. Size: {size} bytes")

with open(output, "rb") as f:
    header = f.read(40)
    print(f"File header: {header}")

os.remove(output)
