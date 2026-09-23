"""Run after replacing the PDF: python3 tools/render_presentation.py.
Authoring dependencies: Poppler (pdfinfo, pdftoppm), Pillow, pypdf.
The published website remains static and needs none of these tools.
"""
from pathlib import Path
import hashlib
import json
import subprocess
import tempfile
from PIL import Image
from pypdf import PdfReader

root = Path(__file__).resolve().parents[1]
pdf = root / 'assets/presentation/presentation.pdf'
out = pdf.parent / 'slides'
out.mkdir(exist_ok=True)
reader = PdfReader(pdf)
with tempfile.TemporaryDirectory() as temporary:
    subprocess.run(['pdftoppm', '-jpeg', '-jpegopt', 'quality=85,optimize=y',
                    '-scale-to', '1600', str(pdf), str(Path(temporary) / 'slide')], check=True)
    rendered = sorted(Path(temporary).glob('slide-*.jpg'), key=lambda p: int(p.stem.split('-')[-1]))
    assert len(rendered) == len(reader.pages), 'Rendered page count does not match the PDF'
    for i, path in enumerate(rendered, 1):
        (out / f'slide-{i:02d}.jpg').write_bytes(path.read_bytes())
files = [out / f'slide-{i:02d}.jpg' for i in range(1, len(reader.pages) + 1)]
slides = []
for i, path in enumerate(files):
    with Image.open(path) as image:
        width, height = image.size
    text = reader.pages[i].extract_text() or ''
    title = next((line.strip() for line in text.splitlines() if line.strip()), f'Слайд {i + 1}')
    slides.append({'image': path.name, 'width': width, 'height': height, 'title': title})
manifest = {'source': '../presentation.pdf', 'sourceSha256': hashlib.sha256(pdf.read_bytes()).hexdigest(), 'slides': slides}
(out / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
print(f'{len(slides)} slides prepared in {out}')
