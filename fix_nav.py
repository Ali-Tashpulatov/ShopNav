import glob

# HTML files that have the inline navbar-actions
inline_files = [
    "cart.html", "checkout.html", "cook.html", "onmyway.html", 
    "order-history.html", "order-success.html", "product.html", "stores.html"
]

for f in inline_files:
    with open(f, 'r') as file:
        content = file.read()
    content = content.replace(
        '<div class="navbar-actions"><a href="#">❤️</a><a href="#">👤</a></div>',
        '<div class="navbar-actions"><a href="#">❤️</a><a href="login.html" class="nav-cta">Get Started</a></div>'
    )
    with open(f, 'w') as file:
        file.write(content)

# HTML files that have the multi-line navbar-actions
multiline_files = ["index.html", "search.html"]

for f in multiline_files:
    with open(f, 'r') as file:
        content = file.read()
    content = content.replace(
        '<a href="#" title="Profile">👤</a>',
        '<a href="login.html" class="nav-cta">Get Started</a>'
    )
    with open(f, 'w') as file:
        file.write(content)

# Append to main.css
css_addition = """
/* ── Navbar CTA Button ────────────────────────── */
.nav-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1.25rem;
  min-height: 40px;
  background-color: var(--forest);
  color: #ffffff !important;
  font-size: 0.9rem;
  font-weight: 700;
  border-radius: 100px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.nav-cta:hover {
  background-color: var(--forest-l);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(45, 74, 47, 0.25);
  opacity: 1 !important;
}

@media (max-width: 480px) {
  .nav-cta {
    padding: 0.4rem 0.85rem;
    font-size: 0.8rem;
    min-height: 36px;
  }
  .navbar-actions {
    gap: 0.75rem;
  }
}
"""

with open('css/main.css', 'a') as file:
    file.write(css_addition)

print("Done")
