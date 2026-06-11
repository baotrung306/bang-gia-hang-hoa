import os, csv, re, sys
import unicodedata as _ud
from datetime import datetime, timezone, timedelta
import urllib.request

SHEET_ID  = os.environ.get("SHEET_ID", "1y1DIj9RUiK6ANGSOc5j5t_9m9cIsBZNo")
SHEET_GID = os.environ.get("SHEET_GID", "0")
HTML_FILE = "index.html"
VN_TZ     = timezone(timedelta(hours=7))

CAT_EMOJI = {
    "nuoc uong":       "🥤 Nước uống",
    "sua":             "🥛 Sữa",
    "ca phe":          "☕ Cà phê",
    "mi bun":          "🍜 Mì & Bún",
    "mi & bun":        "🍜 Mì & Bún",
    "banh keo":        "🍪 Bánh kẹo",
    "gia vi":          "🌶️ Gia vị",
    "thuoc la":        "🚬 Thuốc lá",
    "do tho cung":     "🕯️ Đồ thờ cúng",
    "tho cung":        "🕯️ Đồ thờ cúng",
    "ve sinh ca nhan": "🧴 Vệ sinh cá nhân",
    "giay ve sinh":    "🧻 Giấy & Vệ sinh",
    "giay & ve sinh":  "🧻 Giấy & Vệ sinh",
    "do dung khac":    "🔧 Đồ dùng khác",
    "do dung":         "🔧 Đồ dùng khác",
}

def _nodiac(s):
    return "".join(
        c for c in _ud.normalize("NFD", s.lower())
        if _ud.category(c) != "Mn"
    )

def add_emoji(cat_raw):
    key = _nodiac(cat_raw.strip())
    for k, v in CAT_EMOJI.items():
        if key == _nodiac(k):
            return v
    return cat_raw.strip()

# ── 1. Tải CSV ────────────────────────────────────────────────────────────────
url = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=csv&gid={SHEET_GID}"
print(f"Dang tai du lieu tu: {url}")

try:
    with urllib.request.urlopen(url, timeout=30) as resp:
        raw = resp.read().decode("utf-8")
except Exception as e:
    print(f"Khong the tai Google Sheets: {e}")
    sys.exit(1)

rows = list(csv.reader(raw.splitlines()))
print(f"Tong so hang trong sheet: {len(rows)}")

# In ra 5 hàng đầu để debug
for i, r in enumerate(rows[:5]):
    print(f"  Hang {i}: {r}")

# ── 2. Tự tìm hàng tiêu đề ───────────────────────────────────────────────────
HEADER_KEYWORDS = ["name","price","ten","gia","chung loai","don gia",
                   "san pham","nhom","danh muc","ghi chu","cap nhat","updated"]

header_row_idx = None
for i, row in enumerate(rows):
    row_norm = [_nodiac(c.strip()) for c in row]
    if any(any(kw in cell for kw in HEADER_KEYWORDS) for cell in row_norm if cell):
        header_row_idx = i
        break

if header_row_idx is None:
    # fallback: hàng không trống đầu tiên
    for i, row in enumerate(rows):
        if any(c.strip() for c in row):
            header_row_idx = i
            break

if header_row_idx is None:
    print("Sheet trong rong.")
    sys.exit(1)

header_raw = rows[header_row_idx]
header     = [_nodiac(h.strip()) for h in header_raw]
data       = [r for r in rows[header_row_idx+1:] if any(c.strip() for c in r)]

print(f"Hang tieu de (hang {header_row_idx+1}): {header_raw}")
print(f"So hang du lieu: {len(data)}")

# ── 3. Xác định cột ──────────────────────────────────────────────────────────
def col(aliases):
    for name in aliases:
        key = _nodiac(name)
        for i, h in enumerate(header):
            if h and (key in h or h in key):
                return i
    return None

idx_name    = col(["name","ten","chung loai","san pham","chung loai sp"])
idx_price   = col(["price","gia","don gia","gia ban"])
idx_note    = col(["note","ghi chu","quy cach"])
idx_cat     = col(["cat","nhom","danh muc","nhom hang","category"])
idx_updated = col(["updated","cap nhat","ngay cap nhat"])

print(f"Vi tri cot: name={idx_name}, price={idx_price}, note={idx_note}, cat={idx_cat}, updated={idx_updated}")

if idx_name is None or idx_price is None:
    print("Khong tim thay cot ten san pham hoac gia.")
    print(f"Header doc duoc: {header_raw}")
    sys.exit(1)

# ── 4. Parse sản phẩm ────────────────────────────────────────────────────────
def get(row, idx, default=""):
    if idx is None: return default
    return row[idx].strip() if idx < len(row) else default

today_str = datetime.now(VN_TZ).strftime("%d/%m/%Y")
products  = []

for i, row in enumerate(data, start=1):
    name = get(row, idx_name)
    if not name:
        continue

    raw_price = re.sub(r"[^\d]", "", get(row, idx_price, "0"))
    try:
        price = int(raw_price)
    except ValueError:
        continue

    note    = get(row, idx_note)
    cat     = add_emoji(get(row, idx_cat))
    updated = get(row, idx_updated, today_str)

    def esc(s): return s.replace("\\", "\\\\").replace("'", "\\'")

    products.append({
        "id": i, "name": esc(name), "price": price,
        "note": esc(note), "cat": esc(cat), "updated": updated,
    })

print(f"Da parse {len(products)} san pham hop le.")

# ── 5. Tạo JS ────────────────────────────────────────────────────────────────
lines = [
    f"  {{id:{p['id']},name:'{p['name']}',price:{p['price']},"
    f"note:'{p['note']}',cat:'{p['cat']}',updated:'{p['updated']}'}}"
    for p in products
]
products_js = "const products = [\n" + ",\n".join(lines) + "\n];"

cats_seen = []
for p in products:
    c = p["cat"].replace("\\'", "'")
    if c and c not in cats_seen:
        cats_seen.append(c)

all_cats      = ["Tất cả"] + cats_seen
cats_js_items = ",".join(f'"{c}"' for c in all_cats)
cats_js       = f'const ALL_CATS=[{cats_js_items}];'

count_str   = f"{len(products)} sản phẩm"
updated_str = datetime.now(VN_TZ).strftime("%d/%m/%Y")

# ── 6. Cập nhật index.html ───────────────────────────────────────────────────
if not os.path.exists(HTML_FILE):
    print(f"Khong tim thay {HTML_FILE}")
    sys.exit(1)

with open(HTML_FILE, "r", encoding="utf-8") as f:
    html = f.read()

html, n1 = re.subn(r"const products\s*=\s*\[.*?\];", products_js, html, flags=re.DOTALL)
if n1 == 0:
    print("Khong tim thay 'const products = [...]' trong index.html")
    sys.exit(1)

html, _ = re.subn(r"const ALL_CATS\s*=\s*\[.*?\];", cats_js, html)
html    = re.sub(
    r'(<[^>]*id="pCount"[^>]*>)[^<]*(</)',
    rf'\g<1>{count_str} • Cập nhật {updated_str}\g<2>',
    html
)

with open(HTML_FILE, "w", encoding="utf-8") as f:
    f.write(html)

print(f"Da cap nhat index.html: {len(products)} san pham, {len(cats_seen)} nhom hang.")
