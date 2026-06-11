"""
sync_sheets.py
Đọc dữ liệu từ Google Sheets (public) → cập nhật mảng products[] trong index.html
Cấu trúc Google Sheets cần có các cột:
  name | price | note | cat | updated
  (hàng đầu tiên là tiêu đề, bỏ qua)
"""

import os, csv, re, sys
from datetime import datetime, timezone, timedelta
import urllib.request

# ── Cấu hình ────────────────────────────────────────────────────────────────
SHEET_ID  = os.environ.get("SHEET_ID", "1y1DIj9RUiK6ANGSOc5j5t_9m9cIsBZNo")
SHEET_GID = os.environ.get("SHEET_GID", "0")   # Tab đầu tiên
HTML_FILE = "index.html"

# Múi giờ Việt Nam (UTC+7)
VN_TZ = timezone(timedelta(hours=7))

# ── Bảng map tên danh mục → emoji ───────────────────────────────────────────
# Bạn chỉ cần gõ tên nhóm thường trong Google Sheets, script tự thêm emoji
# Có thể thêm dòng mới vào đây nếu muốn thêm nhóm hoặc đổi emoji
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

import unicodedata as _ud

def _nodiac(s):
    """Bỏ dấu tiếng Việt để so sánh linh hoạt."""
    return "".join(
        c for c in _ud.normalize("NFD", s.lower())
        if _ud.category(c) != "Mn"
    )

def add_emoji(cat_raw):
    """Tra bảng map (không phân biệt dấu/hoa thường), trả về tên có emoji.
    Nếu không tìm thấy → giữ nguyên tên gốc."""
    key = _nodiac(cat_raw.strip())
    for k, v in CAT_EMOJI.items():
        if key == _nodiac(k):
            return v
    return cat_raw.strip()

# ── 1. Tải CSV từ Google Sheets ─────────────────────────────────────────────
url = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=csv&gid={SHEET_GID}"
print(f"📥 Đang tải dữ liệu từ: {url}")

try:
    with urllib.request.urlopen(url, timeout=30) as resp:
        raw = resp.read().decode("utf-8")
except Exception as e:
    print(f"❌ Không thể tải Google Sheets: {e}")
    sys.exit(1)

rows = list(csv.reader(raw.splitlines()))
if len(rows) < 2:
    print("❌ Sheet không có dữ liệu.")
    sys.exit(1)

header = [h.strip().lower() for h in rows[0]]
data   = rows[1:]
print(f"✅ Đọc được {len(data)} dòng. Header: {header}")

# ── 2. Xác định vị trí các cột ──────────────────────────────────────────────
def col(name, aliases=None):
    """Tìm index cột theo tên, hỗ trợ tên tiếng Anh và tiếng Việt."""
    candidates = [name] + (aliases or [])
    for c in candidates:
        if c in header:
            return header.index(c)
    return None

idx_name    = col("name",    ["tên", "ten", "sản phẩm", "san pham"])
idx_price   = col("price",   ["giá", "gia", "đơn giá", "don gia"])
idx_note    = col("note",    ["ghi chú", "ghi chu", "quy cách", "quy cach"])
idx_cat     = col("cat",     ["danh mục", "danh muc", "nhóm", "nhom", "category"])
idx_updated = col("updated", ["ngày cập nhật", "ngay cap nhat", "cập nhật", "cap nhat"])

if idx_name is None or idx_price is None:
    print(f"❌ Không tìm thấy cột 'name' hoặc 'price'.")
    print(f"   Tên cột hiện tại: {header}")
    print("   Hãy đặt tên cột trong Google Sheets là: name, price, note, cat, updated")
    sys.exit(1)

print(f"   Cột: name={idx_name}, price={idx_price}, note={idx_note}, cat={idx_cat}, updated={idx_updated}")

# ── 3. Parse dữ liệu ─────────────────────────────────────────────────────────
def get(row, idx, default=""):
    if idx is None: return default
    return row[idx].strip() if idx < len(row) else default

today_str = datetime.now(VN_TZ).strftime("%d/%m/%Y")
products  = []

for i, row in enumerate(data, start=1):
    name = get(row, idx_name)
    if not name:
        continue  # Bỏ qua hàng trống

    # Làm sạch giá: bỏ dấu phẩy, chữ "đ", khoảng trắng
    raw_price = get(row, idx_price, "0")
    raw_price = re.sub(r"[^\d]", "", raw_price)
    try:
        price = int(raw_price)
    except ValueError:
        print(f"⚠️  Dòng {i}: giá không hợp lệ '{get(row, idx_price)}', bỏ qua.")
        continue

    note    = get(row, idx_note)
    cat     = add_emoji(get(row, idx_cat))   # tự thêm emoji từ bảng map
    updated = get(row, idx_updated, today_str)

    # Escape dấu nháy đơn để không vỡ JS
    def esc(s): return s.replace("\\", "\\\\").replace("'", "\\'")

    products.append({
        "id":      i,
        "name":    esc(name),
        "price":   price,
        "note":    esc(note),
        "cat":     esc(cat),
        "updated": updated,
    })

print(f"✅ Đã parse {len(products)} sản phẩm hợp lệ.")

# ── 4. Tạo chuỗi JS ──────────────────────────────────────────────────────────
lines = []
for p in products:
    lines.append(
        f"  {{id:{p['id']},name:'{p['name']}',price:{p['price']},"
        f"note:'{p['note']}',cat:'{p['cat']}',updated:'{p['updated']}'}}"
    )
products_js = "const products = [\n" + ",\n".join(lines) + "\n];"

# ── 5. Tạo danh sách ALL_CATS từ dữ liệu thực ───────────────────────────────
cats_seen = []
for p in products:
    c = p["cat"].replace("\\'", "'")   # unescape để so sánh
    if c and c not in cats_seen:
        cats_seen.append(c)

# Luôn có "Tất cả" đứng đầu
all_cats = ["Tất cả"] + cats_seen
cats_js_items = ",".join(f'"{c}"' for c in all_cats)
cats_js = f'const ALL_CATS=[{cats_js_items}];'

# ── 6. Cập nhật số sản phẩm và ngày trong header ─────────────────────────────
count_str   = f"{len(products)} sản phẩm"
updated_str = datetime.now(VN_TZ).strftime("%d/%m/%Y")

# ── 7. Đọc & cập nhật index.html ─────────────────────────────────────────────
if not os.path.exists(HTML_FILE):
    print(f"❌ Không tìm thấy {HTML_FILE}")
    sys.exit(1)

with open(HTML_FILE, "r", encoding="utf-8") as f:
    html = f.read()

# Thay mảng products
html, n1 = re.subn(
    r"const products\s*=\s*\[.*?\];",
    products_js,
    html,
    flags=re.DOTALL
)
if n1 == 0:
    print("❌ Không tìm thấy 'const products = [...]' trong index.html")
    sys.exit(1)

# Thay ALL_CATS
html, n2 = re.subn(
    r"const ALL_CATS\s*=\s*\[.*?\];",
    cats_js,
    html
)

# Cập nhật dòng hiển thị số sản phẩm + ngày (id="pCount")
html = re.sub(
    r'(<[^>]*id="pCount"[^>]*>)[^<]*(</)',
    rf'\g<1>{count_str} • Cập nhật {updated_str}\g<2>',
    html
)

with open(HTML_FILE, "w", encoding="utf-8") as f:
    f.write(html)

print(f"✅ Đã cập nhật index.html:")
print(f"   - {len(products)} sản phẩm")
print(f"   - {len(all_cats)-1} danh mục: {', '.join(cats_seen)}")
print(f"   - Ngày cập nhật: {updated_str}")
