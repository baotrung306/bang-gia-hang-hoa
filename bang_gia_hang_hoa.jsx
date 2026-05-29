import { useState, useMemo } from "react";

const products = [
  { id: 1, name: "Bò húc", price: 15000, note: "", updated: "28/05/2026" },
  { id: 2, name: "C2", price: 11000, note: "", updated: "28/05/2026" },
  { id: 3, name: "Sting đỏ", price: 11000, note: "", updated: "28/05/2026" },
  { id: 4, name: "Sting vàng", price: 11000, note: "", updated: "28/05/2026" },
  { id: 5, name: "Aqua", price: 6000, note: "500 ml", updated: "28/05/2026" },
  { id: 6, name: "Aqua", price: 10000, note: "1,5L", updated: "28/05/2026" },
  { id: 7, name: "Aqua", price: 30000, note: "5L", updated: "28/05/2026" },
  { id: 8, name: "Bánh mì ruốc", price: 6000, note: "", updated: "28/05/2026" },
  { id: 9, name: "Mì Kokomi", price: 5000, note: "90g", updated: "" },
  { id: 10, name: "Mì Kokomi", price: 4000, note: "65g", updated: "" },
  { id: 11, name: "Mì Omachi", price: 8000, note: "Gói", updated: "" },
  { id: 12, name: "Mì Hảo Hảo", price: 5000, note: "", updated: "" },
  { id: 13, name: "Mì Cung Đình", price: 11000, note: "Cốc", updated: "" },
  { id: 14, name: "Mì Modern", price: 11000, note: "Cốc", updated: "" },
  { id: 15, name: "Mì Omachi", price: 11000, note: "Cốc", updated: "" },
  { id: 16, name: "Mì Omachi", price: 15000, note: "Bát", updated: "" },
  { id: 17, name: "Mì Cung Đình", price: 15000, note: "Bát", updated: "" },
  { id: 18, name: "Mì Kool Bbq", price: 15000, note: "Bát", updated: "" },
  { id: 19, name: "Phở cung đình", price: 9000, note: "Gói bò", updated: "" },
  { id: 20, name: "Phở cung đình", price: 9000, note: "Gói gà", updated: "" },
  { id: 21, name: "Hủ tiếu cung đình", price: 9000, note: "Gói", updated: "" },
  { id: 22, name: "Mì Cung Đình", price: 8000, note: "Gói", updated: "" },
  { id: 23, name: "Tăng lực 247", price: 10000, note: "Lon", updated: "" },
  { id: 24, name: "Tăng lực 247", price: 10000, note: "Chai", updated: "" },
  { id: 25, name: "Nutri", price: 11000, note: "", updated: "" },
  { id: 26, name: "Chanh dây", price: 10000, note: "Lon", updated: "" },
  { id: 27, name: "Trà bí đao", price: 10000, note: "Lon", updated: "" },
  { id: 28, name: "Me đá", price: 10000, note: "", updated: "" },
  { id: 29, name: "Ice+", price: 10000, note: "", updated: "" },
  { id: 30, name: "Nước dừa", price: 10000, note: "Lon", updated: "" },
  { id: 31, name: "Bia Hà Nội", price: 14000, note: "", updated: "" },
  { id: 32, name: "Sữa chua", price: 6000, note: "", updated: "" },
  { id: 33, name: "Sữa TH", price: 11000, note: "", updated: "" },
  { id: 34, name: "Cà phê lon birdy", price: 11000, note: "", updated: "" },
  { id: 35, name: "Nước yến", price: 12000, note: "", updated: "" },
  { id: 36, name: "Nước rong biển", price: 10000, note: "", updated: "" },
  { id: 37, name: "Coca-cola", price: 10000, note: "Lon", updated: "" },
  { id: 38, name: "Sữa Fami", price: 6000, note: "", updated: "" },
  { id: 39, name: "Sữa izzi", price: 8000, note: "", updated: "" },
  { id: 40, name: "Trà búp non 365", price: 10000, note: "", updated: "" },
  { id: 41, name: "Trà xanh 0 độ", price: 11000, note: "", updated: "" },
  { id: 42, name: "Trà tea +", price: 10000, note: "", updated: "" },
  { id: 43, name: "Sữa Milo", price: 9000, note: "", updated: "" },
  { id: 44, name: "Bù nước bù khoáng Revive", price: 10000, note: "", updated: "" },
  { id: 45, name: "Revive chanh muối", price: 10000, note: "", updated: "" },
  { id: 46, name: "Coca-cola", price: 10000, note: "Chai 390ml", updated: "" },
  { id: 47, name: "Chanh muối", price: 10000, note: "", updated: "" },
  { id: 48, name: "Nước dừa", price: 10000, note: "Chai", updated: "" },
  { id: 49, name: "Number 1", price: 10000, note: "", updated: "" },
  { id: 50, name: "Trà latte", price: 10000, note: "", updated: "" },
  { id: 51, name: "Thạch dừa Joco", price: 10000, note: "", updated: "" },
  { id: 52, name: "Fuze tea", price: 10000, note: "", updated: "" },
  { id: 53, name: "Coca-cola", price: 18000, note: "1.5L", updated: "" },
  { id: 54, name: "Pepsi", price: 18000, note: "1.5L", updated: "" },
  { id: 55, name: "Sprite", price: 17000, note: "1.5L", updated: "" },
  { id: 56, name: "Bia Sài Gòn", price: 14000, note: "", updated: "" },
  { id: 57, name: "Bia 333", price: 15000, note: "", updated: "" },
  { id: 58, name: "Cà phê Highlands", price: 15000, note: "", updated: "" },
  { id: 59, name: "Trà Dr Thanh", price: 11000, note: "", updated: "" },
  { id: 60, name: "Coca-cola", price: 22000, note: "1.95L", updated: "" },
  { id: 61, name: "Fanta", price: 17000, note: "1.5L", updated: "" },
  { id: 62, name: "Mì chính", price: 75000, note: "1kg", updated: "" },
  { id: 63, name: "Mì chính", price: 40000, note: "454g", updated: "" },
  { id: 64, name: "Đường", price: 25000, note: "", updated: "" },
  { id: 65, name: "Đường phèn", price: 18000, note: "0.5kg", updated: "" },
  { id: 66, name: "Hạt nêm Chinsu", price: 90000, note: "1.8kg", updated: "" },
  { id: 67, name: "Hạt nêm Chinsu", price: 30000, note: "0.5kg", updated: "" },
  { id: 68, name: "Ngũ vị hương", price: 1000, note: "", updated: "" },
  { id: 69, name: "Bột chiên giòn", price: 8000, note: "", updated: "" },
  { id: 70, name: "Gia vị cá kho", price: 8000, note: "", updated: "" },
  { id: 71, name: "Gia vị thịt kho tàu", price: 8000, note: "", updated: "" },
  { id: 72, name: "Bột chiên xù", price: 8000, note: "", updated: "" },
  { id: 73, name: "Mì gạo", price: 15000, note: "", updated: "" },
  { id: 74, name: "Miến", price: 60000, note: "Túi 1kg", updated: "" },
  { id: 75, name: "Bánh đa tròn", price: 9000, note: "", updated: "" },
  { id: 76, name: "Sữa Ông Thọ", price: 20000, note: "Tuýp", updated: "" },
  { id: 77, name: "Cơm sấy", price: 25000, note: "150g", updated: "" },
  { id: 78, name: "Cơm sấy", price: 35000, note: "250g", updated: "" },
  { id: 79, name: "Bánh Chocopie", price: 27000, note: "6 gói", updated: "" },
  { id: 80, name: "Bánh custas", price: 11000, note: "2 gói", updated: "" },
  { id: 81, name: "Bánh mì bơ tỏi", price: 33000, note: "", updated: "" },
  { id: 82, name: "Bánh chả Minh Thắng", price: 15000, note: "", updated: "" },
  { id: 83, name: "Bánh dẻo cốm", price: 15000, note: "", updated: "" },
  { id: 84, name: "Kẹo cà phê Kopiko", price: 15000, note: "", updated: "" },
  { id: 85, name: "Kẹo dynamite", price: 17000, note: "112.5g", updated: "" },
  { id: 86, name: "Bánh cream o", price: 10000, note: "85g", updated: "" },
  { id: 87, name: "Kẹo gừng", price: 8000, note: "", updated: "" },
  { id: 88, name: "Bắp rang bơ Mỹ", price: 33000, note: "", updated: "" },
  { id: 89, name: "Bánh quy đũa", price: 33000, note: "", updated: "" },
  { id: 90, name: "Kẹo alpenliebe", price: 15000, note: "115.5g", updated: "" },
  { id: 91, name: "Xúc xích Ponnie", price: 10000, note: "95g", updated: "" },
  { id: 92, name: "Xúc xích Ponnie", price: 20000, note: "175g", updated: "" },
  { id: 93, name: "Cháo sườn non", price: 10000, note: "", updated: "" },
  { id: 94, name: "Miến dong", price: 25000, note: "250g", updated: "" },
  { id: 95, name: "Mì dim dim", price: 4000, note: "", updated: "" },
  { id: 96, name: "Lương Khô", price: 20000, note: "", updated: "" },
  { id: 97, name: "Cơm sấy", price: 10000, note: "Gói nhỏ 3 miếng", updated: "" },
  { id: 98, name: "Gia vị lẩu Thái", price: 11000, note: "", updated: "" },
  { id: 99, name: "Gia vị sườn xào chua ngọt", price: 11000, note: "", updated: "" },
];

const categories = {
  "🥤 Nước uống": ["Bò húc","C2","Sting đỏ","Sting vàng","Aqua","Tăng lực 247","Nutri","Chanh dây","Trà bí đao","Me đá","Ice+","Nước dừa","Bia Hà Nội","Cà phê lon birdy","Nước yến","Nước rong biển","Coca-cola","Trà búp non 365","Trà xanh 0 độ","Trà tea +","Bù nước bù khoáng Revive","Revive chanh muối","Chanh muối","Number 1","Trà latte","Thạch dừa Joco","Fuze tea","Pepsi","Sprite","Bia Sài Gòn","Bia 333","Cà phê Highlands","Trà Dr Thanh","Fanta"],
  "🥛 Sữa": ["Sữa chua","Sữa TH","Sữa Fami","Sữa izzi","Sữa Milo","Sữa Ông Thọ"],
  "🍜 Mì & Bún": ["Mì Kokomi","Mì Omachi","Mì Hảo Hảo","Mì Cung Đình","Mì Modern","Mì Kool Bbq","Phở cung đình","Hủ tiếu cung đình","Mì gạo","Miến","Bánh đa tròn","Mì chính","Mì dim dim","Miến dong"],
  "🍪 Bánh kẹo": ["Bánh mì ruốc","Bánh Chocopie","Bánh custas","Bánh mì bơ tỏi","Bánh chả Minh Thắng","Bánh dẻo cốm","Kẹo cà phê Kopiko","Kẹo dynamite","Bánh cream o","Kẹo gừng","Bắp rang bơ Mỹ","Bánh quy đũa","Kẹo alpenliebe","Xúc xích Ponnie","Cháo sườn non","Lương Khô"],
  "🌶️ Gia vị": ["Đường","Đường phèn","Hạt nêm Chinsu","Ngũ vị hương","Bột chiên giòn","Gia vị cá kho","Gia vị thịt kho tàu","Bột chiên xù","Cơm sấy","Gia vị lẩu Thái","Gia vị sườn xào chua ngọt"],
};

function getCategory(name) {
  for (const [cat, names] of Object.entries(categories)) {
    if (names.some(n => name.toLowerCase().includes(n.toLowerCase()) || n.toLowerCase().includes(name.toLowerCase()))) return cat;
  }
  return "📦 Khác";
}

function formatPrice(p) {
  return p.toLocaleString("vi-VN") + "đ";
}

const ACCENT = "#e63946";
const GOLD = "#f4a261";

export default function App() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [sortBy, setSortBy] = useState("default");

  const allCategories = ["Tất cả", ...Object.keys(categories), "📦 Khác"];

  const filtered = useMemo(() => {
    let list = products;
    if (search.trim()) {
      const q = search.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      list = list.filter(p => {
        const name = p.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return name.includes(q);
      });
    }
    if (activeCategory !== "Tất cả") {
      list = list.filter(p => getCategory(p.name) === activeCategory);
    }
    if (sortBy === "asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sortBy === "desc") list = [...list].sort((a, b) => b.price - a.price);
    else if (sortBy === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name, "vi"));
    return list;
  }, [search, activeCategory, sortBy]);

  const addToCart = (product) => {
    setCart(prev => {
      const key = `${product.id}-${product.note}`;
      const existing = prev.find(c => c.key === key);
      if (existing) return prev.map(c => c.key === key ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...product, key, qty: 1 }];
    });
  };

  const removeFromCart = (key) => setCart(prev => prev.filter(c => c.key !== key));
  const updateQty = (key, delta) => setCart(prev =>
    prev.map(c => c.key === key ? { ...c, qty: Math.max(0, c.qty + delta) } : c).filter(c => c.qty > 0)
  );

  const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);

  return (
    <div style={{ fontFamily: "'Be Vietnam Pro', 'Segoe UI', sans-serif", minHeight: "100vh", background: "#0f0f13", color: "#f0ece4" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #1a1a22; }
        ::-webkit-scrollbar-thumb { background: #e63946; border-radius: 3px; }
        .cat-btn { cursor: pointer; border: none; padding: 7px 16px; border-radius: 20px; font-size: 13px; font-weight: 500; white-space: nowrap; transition: all .2s; font-family: inherit; }
        .cat-btn:hover { transform: translateY(-1px); }
        .product-card { background: #1a1a22; border: 1px solid #2a2a36; border-radius: 14px; padding: 16px; transition: all .2s; cursor: default; }
        .product-card:hover { border-color: #e63946; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(230,57,70,.15); }
        .add-btn { cursor: pointer; border: none; border-radius: 8px; padding: 8px 14px; font-size: 13px; font-weight: 600; font-family: inherit; transition: all .2s; }
        .add-btn:hover { filter: brightness(1.15); transform: scale(1.05); }
        .qty-btn { cursor: pointer; border: none; border-radius: 6px; width: 28px; height: 28px; font-size: 16px; font-weight: 700; font-family: inherit; transition: all .15s; display: flex; align-items: center; justify-content: center; }
        input[type=text] { outline: none; }
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,.6); z-index: 40; backdrop-filter: blur(4px); }
        .cart-panel { position: fixed; right: 0; top: 0; bottom: 0; width: min(420px, 100vw); background: #14141c; border-left: 1px solid #2a2a36; z-index: 50; display: flex; flex-direction: column; animation: slideIn .25s ease; }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .sort-select { background: #1a1a22; border: 1px solid #2a2a36; color: #f0ece4; border-radius: 8px; padding: 8px 12px; font-size: 13px; font-family: inherit; cursor: pointer; outline: none; }
        .sort-select:hover { border-color: #e63946; }
        .badge { position: absolute; top: -6px; right: -6px; background: #e63946; color: white; border-radius: 50%; width: 20px; height: 20px; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
        .tag { display: inline-block; background: #252530; border-radius: 6px; padding: 2px 8px; font-size: 11px; color: #a09898; }
      `}</style>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1a0a0c 0%, #0f0f13 60%)", borderBottom: "1px solid #2a1518", padding: "20px 24px", position: "sticky", top: 0, zIndex: 30 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 6, height: 28, background: ACCENT, borderRadius: 3 }} />
              <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", color: "#fff" }}>
                Bảng Giá Hàng Hóa
              </h1>
            </div>
            <p style={{ fontSize: 12, color: "#666", marginTop: 2, marginLeft: 16 }}>
              {products.length} sản phẩm • Cập nhật 28/05/2026
            </p>
          </div>

          {/* Search */}
          <div style={{ flex: 1, maxWidth: 360, position: "relative" }}>
            <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: "#555" }}>🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm sản phẩm..."
              style={{ width: "100%", background: "#1a1a22", border: "1px solid #2a2a36", borderRadius: 10, padding: "10px 16px 10px 38px", color: "#f0ece4", fontSize: 14 }}
            />
          </div>

          {/* Cart button */}
          <button
            onClick={() => setShowCart(true)}
            style={{ position: "relative", background: ACCENT, border: "none", borderRadius: 10, padding: "10px 18px", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8 }}
          >
            🛒 Giỏ hàng
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 24px" }}>
        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
            {allCategories.map(cat => (
              <button
                key={cat}
                className="cat-btn"
                onClick={() => setActiveCategory(cat)}
                style={{
                  background: activeCategory === cat ? ACCENT : "#1a1a22",
                  color: activeCategory === cat ? "#fff" : "#a09898",
                  border: `1px solid ${activeCategory === cat ? ACCENT : "#2a2a36"}`,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="default">Mặc định</option>
            <option value="asc">Giá tăng dần</option>
            <option value="desc">Giá giảm dần</option>
            <option value="name">Tên A-Z</option>
          </select>
        </div>

        {/* Results count */}
        <p style={{ color: "#555", fontSize: 13, marginBottom: 16 }}>
          {filtered.length === 0 ? "Không tìm thấy sản phẩm nào." : `Hiển thị ${filtered.length} sản phẩm`}
        </p>

        {/* Product grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
          {filtered.map(p => (
            <div key={p.id + p.note} className="product-card">
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 9, color: "#555", marginBottom: 4, letterSpacing: "0.5px", textTransform: "uppercase" }}>
                    {getCategory(p.name)}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.4, color: "#f0ece4" }}>{p.name}</div>
                </div>
              </div>

              {p.note && <span className="tag" style={{ marginBottom: 10, display: "inline-block" }}>{p.note}</span>}

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                <div>
                  <span style={{ fontSize: 20, fontWeight: 800, color: GOLD }}>{formatPrice(p.price)}</span>
                </div>
                <button
                  className="add-btn"
                  onClick={() => addToCart(p)}
                  style={{ background: "rgba(230,57,70,.15)", color: ACCENT, border: `1px solid rgba(230,57,70,.3)` }}
                >
                  + Thêm
                </button>
              </div>

              {p.updated && (
                <div style={{ fontSize: 10, color: "#444", marginTop: 8 }}>🕐 {p.updated}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Cart panel */}
      {showCart && (
        <>
          <div className="overlay" onClick={() => setShowCart(false)} />
          <div className="cart-panel">
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #2a2a36", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontWeight: 800, fontSize: 18, color: "#fff" }}>🛒 Giỏ hàng ({cartCount})</h2>
              <button onClick={() => setShowCart(false)} style={{ background: "none", border: "none", color: "#888", fontSize: 22, cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", color: "#555", marginTop: 60 }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
                  <p>Giỏ hàng đang trống</p>
                </div>
              ) : cart.map(item => (
                <div key={item.key} style={{ background: "#1a1a22", borderRadius: 12, padding: 14, marginBottom: 10, border: "1px solid #2a2a36" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
                      {item.note && <span className="tag" style={{ marginTop: 4, display: "inline-block" }}>{item.note}</span>}
                    </div>
                    <button onClick={() => removeFromCart(item.key)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 16 }}>✕</button>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <button className="qty-btn" onClick={() => updateQty(item.key, -1)} style={{ background: "#252530", color: "#f0ece4" }}>−</button>
                      <span style={{ fontWeight: 700, fontSize: 16, minWidth: 24, textAlign: "center" }}>{item.qty}</span>
                      <button className="qty-btn" onClick={() => updateQty(item.key, 1)} style={{ background: ACCENT, color: "#fff" }}>+</button>
                    </div>
                    <span style={{ fontWeight: 700, color: GOLD }}>{formatPrice(item.price * item.qty)}</span>
                  </div>
                </div>
              ))}
            </div>

            {cart.length > 0 && (
              <div style={{ padding: "20px 24px", borderTop: "1px solid #2a2a36" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                  <span style={{ color: "#a09898" }}>Tổng cộng:</span>
                  <span style={{ fontSize: 22, fontWeight: 800, color: GOLD }}>{formatPrice(total)}</span>
                </div>
                <button
                  onClick={() => { setCart([]); setShowCart(false); }}
                  style={{ width: "100%", background: ACCENT, border: "none", borderRadius: 10, padding: 14, color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "inherit" }}
                >
                  Xác nhận đơn hàng
                </button>
                <button
                  onClick={() => setCart([])}
                  style={{ width: "100%", background: "none", border: "1px solid #2a2a36", borderRadius: 10, padding: 12, color: "#888", fontWeight: 500, fontSize: 13, cursor: "pointer", fontFamily: "inherit", marginTop: 8 }}
                >
                  Xóa giỏ hàng
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
